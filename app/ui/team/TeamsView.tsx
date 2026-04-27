"use client";

import { useEffect, useMemo, useCallback } from "react";
import { useAtom } from "jotai";
import {
  teamLoadingState,
  teamErrorState,
  teamChartModeState,
  teamViewModeState,
  timeFilterState,
  lastUpdatedTextState,
  TeamViewMode,
  TeamChartMode,
} from "@/lib/state/atoms";
import { useActivities, useAthletes, useTimeseries, useTeamStats, useActivityStats } from "@/lib/hooks";
import Divider from "@/app/ui/common/Divider";
import ErrorCard from "@/app/ui/common/ErrorCard";
import TeamPerformanceCard from "@/app/ui/team/TeamPerformanceCard";
import LeaderboardCard from "@/app/ui/common/LeaderboardCard";
import { fmtKm } from "@/app/utils/fmtKm";
import css from "@/app/ui/dashboard/Filters.module.scss";
import { AthleteBreakdownChartData, TeamWeeklyData } from "@/lib/types/dashboard";

type TeamDataExtractor = (point: TeamWeeklyData) => number;

function combineTeamData(
  bullsData: TeamWeeklyData[],
  sharksData: TeamWeeklyData[],
  extractor: TeamDataExtractor
) {
  const combined = new Map<string, { bullsKm: number; sharksKm: number }>();

  for (const point of bullsData) {
    combined.set(point.weekStart, { bullsKm: extractor(point), sharksKm: 0 });
  }

  for (const point of sharksData) {
    const existing = combined.get(point.weekStart) ?? { bullsKm: 0, sharksKm: 0 };
    existing.sharksKm = extractor(point);
    combined.set(point.weekStart, existing);
  }

  const sorted = Array.from(combined.entries())
    .map(([weekStart, data]) => ({ weekStart, ...data }))
    .sort((a, b) => a.weekStart.localeCompare(b.weekStart));

  if (sorted.length > 0) {
    const firstWeek = new Date(sorted[0].weekStart);
    firstWeek.setDate(firstWeek.getDate() - 7);
    sorted.unshift({
      weekStart: firstWeek.toISOString().split('T')[0],
      bullsKm: 0,
      sharksKm: 0,
    });
  }

  return sorted;
}

export default function TeamsView() {
  const [loading] = useAtom(teamLoadingState);
  const [err] = useAtom(teamErrorState);
  const [chartMode, setChartMode] = useAtom(teamChartModeState);
  const [viewMode, setViewMode] = useAtom(teamViewModeState);
  const [timeFilter] = useAtom(timeFilterState);

  useActivities(timeFilter);
  const athletes = useAthletes();
  const timeseries = useTimeseries();
  const teamStats = useTeamStats();
  const stats = useActivityStats();

  const chartData = useMemo(() => {
    if (!teamStats) return [];
    return combineTeamData(
      teamStats.bulls.weeklyKilometers,
      teamStats.sharks.weeklyKilometers,
      (point) => point.weeklyTeamKilometers
    );
  }, [teamStats]);

  const runningTotalsData = useMemo(() => {
    if (!teamStats) return [];
    return combineTeamData(
      teamStats.bulls.weeklyKilometers,
      teamStats.sharks.weeklyKilometers,
      (point) => point.weeklyRunningSum
    );
  }, [teamStats]);

  const bullsAthletes = useMemo(() => {
    if (!teamStats) return [];

    return Object.entries(teamStats.bulls.athleteKilometers)
      .map(([athleteName, totalKm]) => ({
        athleteName,
        totalKm,
      }))
      .sort((a, b) => b.totalKm - a.totalKm);
  }, [teamStats]);

  const sharksAthletes = useMemo(() => {
    if (!teamStats) return [];

    return Object.entries(teamStats.sharks.athleteKilometers)
      .map(([athleteName, totalKm]) => ({
        athleteName,
        totalKm,
      }))
      .sort((a, b) => b.totalKm - a.totalKm);
  }, [teamStats]);

  // Combined breakdown data for all teams and modes
  const breakdownData = useMemo(() => {
    if (!teamStats) {
      return {
        bullsWeekly: [],
        bullsRunning: [],
        sharksWeekly: [],
        sharksRunning: [],
      };
    }

    const processTeamBreakdown = (
      weeklyKilometers: Array<{
        weekStart: string;
        weeklyAthleteKilometers?: Record<string, number>;
      }>,
      athletes: Array<{ athleteName: string; totalKm: number }>,
      isRunningTotal: boolean
    ) => {
      const athleteOrder = athletes.map((a) => a.athleteName);
      const runningTotals: Record<string, number> = {};

      if (isRunningTotal) {
        athleteOrder.forEach((name) => (runningTotals[name] = 0));
      }

      const sorted = weeklyKilometers
        .map((week) => {
          const point: AthleteBreakdownChartData = { weekStart: week.weekStart };
          athleteOrder.forEach((name) => {
            const weeklyValue = week.weeklyAthleteKilometers?.[name] || 0;
            if (isRunningTotal) {
              runningTotals[name] += weeklyValue;
              point[name] = runningTotals[name];
            } else {
              point[name] = weeklyValue;
            }
          });
          return point;
        })
        .sort((a, b) => a.weekStart.localeCompare(b.weekStart));

      // Add a starting point at week 0 (one week before the first data point)
      if (sorted.length > 0) {
        const firstWeek = new Date(sorted[0].weekStart);
        firstWeek.setDate(firstWeek.getDate() - 7);
        const startPoint: AthleteBreakdownChartData = {
          weekStart: firstWeek.toISOString().split('T')[0],
        };
        athleteOrder.forEach((name) => {
          startPoint[name] = 0;
        });
        sorted.unshift(startPoint);
      }

      return sorted;
    };

    return {
      bullsWeekly: processTeamBreakdown(
        teamStats.bulls.weeklyKilometers,
        bullsAthletes,
        false
      ),
      bullsRunning: processTeamBreakdown(
        teamStats.bulls.weeklyKilometers,
        bullsAthletes,
        true
      ),
      sharksWeekly: processTeamBreakdown(
        teamStats.sharks.weeklyKilometers,
        sharksAthletes,
        false
      ),
      sharksRunning: processTeamBreakdown(
        teamStats.sharks.weeklyKilometers,
        sharksAthletes,
        true
      ),
    };
  }, [teamStats, bullsAthletes, sharksAthletes]);

  const {
    bullsWeekly: bullsBreakdownWeekly,
    bullsRunning: bullsBreakdownRunning,
    sharksWeekly: sharksBreakdownWeekly,
    sharksRunning: sharksBreakdownRunning,
  } = breakdownData;

  const displayChartData = useMemo(() => {
    if (viewMode === "bulls-breakdown") {
      return chartMode === "weekly" ? bullsBreakdownWeekly : bullsBreakdownRunning;
    } else if (viewMode === "sharks-breakdown") {
      return chartMode === "weekly"
        ? sharksBreakdownWeekly
        : sharksBreakdownRunning;
    }
    // comparison mode
    return chartMode === "weekly" ? chartData : runningTotalsData;
  }, [
    viewMode,
    chartMode,
    chartData,
    runningTotalsData,
    bullsBreakdownWeekly,
    bullsBreakdownRunning,
    sharksBreakdownWeekly,
    sharksBreakdownRunning,
  ]);

  const displayAthleteNames = useMemo(() => {
    if (viewMode === "bulls-breakdown") {
      return bullsAthletes.map((a) => a.athleteName);
    } else if (viewMode === "sharks-breakdown") {
      return sharksAthletes.map((a) => a.athleteName);
    }
    return undefined;
  }, [viewMode, bullsAthletes, sharksAthletes]);

  const displayTeam = useMemo(() => {
    if (viewMode === "bulls-breakdown") return "bulls";
    if (viewMode === "sharks-breakdown") return "sharks";
    return undefined;
  }, [viewMode]);

  const totalBullsKm = useMemo(() => {
    return bullsAthletes.reduce((sum, athlete) => sum + athlete.totalKm, 0);
  }, [bullsAthletes]);

  const totalSharksKm = useMemo(() => {
    return sharksAthletes.reduce((sum, athlete) => sum + athlete.totalKm, 0);
  }, [sharksAthletes]);

  const [, setLastUpdatedText] = useAtom(lastUpdatedTextState);

  useEffect(() => {
    if (!stats?.lastFetchedAt) {
      setLastUpdatedText("No data yet");
    } else {
      setLastUpdatedText(`Last updated: ${new Date(stats.lastFetchedAt).toLocaleString()}`);
    }
  }, [stats?.lastFetchedAt, setLastUpdatedText]);

  const handleViewModeChange = useCallback((mode: TeamViewMode) => {
    setViewMode(mode);
  }, [setViewMode]);

  const handleChartModeChange = useCallback((mode: TeamChartMode) => {
    setChartMode(mode);
  }, [setChartMode]);

  return (
    <>
      <div className={css.card} role="group" aria-label="Team view filters">
        <fieldset className={css.group} role="group" aria-labelledby="view-mode-label">
          <legend id="view-mode-label" className={css.label}>View</legend>
          <div className={css.pillRow} role="radiogroup" aria-label="View mode">
            <button
              className={css.pill}
              aria-pressed={viewMode === "comparison"}
              onClick={() => handleViewModeChange("comparison")}
              type="button"
            >
              Team Comparison
            </button>
            <button
              className={css.pill}
              aria-pressed={viewMode === "bulls-breakdown"}
              onClick={() => handleViewModeChange("bulls-breakdown")}
              type="button"
            >
              <span aria-hidden="true">🐂 </span>Bulls Breakdown
            </button>
            <button
              className={css.pill}
              aria-pressed={viewMode === "sharks-breakdown"}
              onClick={() => handleViewModeChange("sharks-breakdown")}
              type="button"
            >
              <span aria-hidden="true">🦈 </span>Sharks Breakdown
            </button>
          </div>
        </fieldset>

        <div className={css.divider} aria-hidden="true" />

        <fieldset className={css.group} role="group" aria-labelledby="metric-label">
          <legend id="metric-label" className={css.label}>Metric</legend>
          <div className={css.pillRow} role="radiogroup" aria-label="Metric">
            <button
              className={css.pill}
              aria-pressed={chartMode === "running"}
              onClick={() => handleChartModeChange("running")}
              type="button"
            >
              Running Total
            </button>
            <button
              className={css.pill}
              aria-pressed={chartMode === "weekly"}
              onClick={() => handleChartModeChange("weekly")}
              type="button"
            >
              Weekly Totals
            </button>
          </div>
        </fieldset>
      </div>

      <Divider size={16} />

      {err != null ? <ErrorCard errorMessage={err} /> : null}

      <div style={{ opacity: loading ? 0.7 : 1 }}>
        <TeamPerformanceCard
          viewMode={viewMode}
          chartData={displayChartData}
          athleteNames={displayAthleteNames}
          team={displayTeam}
          totalBullsKm={totalBullsKm}
          totalSharksKm={totalSharksKm}
        />
      </div>

      <Divider size={12} />

      <div className="rowEqual" style={{ opacity: loading ? 0.7 : 1 }}>
        <LeaderboardCard
          title="Bulls Leaderboard"
          subtitle="Top athletes by distance"
          badgeLabel="Total"
          badgeValue={`${fmtKm(totalBullsKm)} km`}
          chipDataSources={{ timeseries, athleteMetadata: athletes }}
          athletes={bullsAthletes}
          columns={[
            { type: "rank" },
            { type: "athlete", showTeamChips: true, showEventChips: true, showStatusChips: true },
            { type: "distance" },
          ]}
        />
        <LeaderboardCard
          title="Sharks Leaderboard"
          subtitle="Top athletes by distance"
          badgeLabel="Total"
          badgeValue={`${fmtKm(totalSharksKm)} km`}
          chipDataSources={{ timeseries, athleteMetadata: athletes }}
          athletes={sharksAthletes}
          columns={[
            { type: "rank" },
            { type: "athlete", showTeamChips: true, showEventChips: true, showStatusChips: true },
            { type: "distance" },
          ]}
        />
      </div>

      <Divider size={12} />
    </>
  );
}
