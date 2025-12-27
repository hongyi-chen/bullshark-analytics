"use client";

import { useEffect, useMemo, useState } from "react";
import { useAtom } from "jotai";
import {
  teamStatsState,
  teamLoadingState,
  teamErrorState,
  teamChartModeState,
  teamViewModeState,
} from "@/lib/state/atoms";
import { fetchTeamStats } from "@/lib/state/api";
import Header from "@/app/ui/Header";
import Footer from "@/app/ui/Footer";
import Divider from "@/app/ui/Divider";
import ErrorCard from "@/app/ui/cards/ErrorCard";
import TeamPerformanceCard from "@/app/ui/cards/TeamPerformanceCard";
import BullsLeaderboardCard from "@/app/ui/cards/BullsLeaderboardCard";
import SharksLeaderboardCard from "@/app/ui/cards/SharksLeaderboardCard";
import css from "@/app/ui/Filters.module.scss";

export const dynamic = "force-dynamic";

export default function TeamsPage() {
  const [teamStats, setTeamStats] = useAtom(teamStatsState);
  const [loading, setLoading] = useAtom(teamLoadingState);
  const [err, setErr] = useAtom(teamErrorState);
  const [chartMode, setChartMode] = useAtom(teamChartModeState);
  const [viewMode, setViewMode] = useAtom(teamViewModeState);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr(null);

      try {
        const data = await fetchTeamStats();

        if (!cancelled) {
          setTeamStats(data);
        }
      } catch (e: any) {
        if (!cancelled) {
          setErr(e?.message ?? String(e));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [setTeamStats, setLoading, setErr]);

  const chartData = useMemo(() => {
    if (!teamStats) return [];

    const combined = new Map<string, { bullsKm: number; sharksKm: number }>();

    for (const point of teamStats.bulls.weeklyKilometers) {
      combined.set(point.weekStart, {
        bullsKm: point.weeklyTeamKilometers,
        sharksKm: 0,
      });
    }

    for (const point of teamStats.sharks.weeklyKilometers) {
      const existing = combined.get(point.weekStart) ?? {
        bullsKm: 0,
        sharksKm: 0,
      };
      existing.sharksKm = point.weeklyTeamKilometers;
      combined.set(point.weekStart, existing);
    }

    return Array.from(combined.entries())
      .map(([weekStart, data]) => ({ weekStart, ...data }))
      .sort((a, b) => a.weekStart.localeCompare(b.weekStart));
  }, [teamStats]);

  const runningTotalsData = useMemo(() => {
    if (!teamStats) return [];

    const combined = new Map<string, { bullsKm: number; sharksKm: number }>();

    for (const point of teamStats.bulls.weeklyKilometers) {
      combined.set(point.weekStart, {
        bullsKm: point.weeklyRunningSum,
        sharksKm: 0,
      });
    }

    for (const point of teamStats.sharks.weeklyKilometers) {
      const existing = combined.get(point.weekStart) ?? {
        bullsKm: 0,
        sharksKm: 0,
      };
      existing.sharksKm = point.weeklyRunningSum;
      combined.set(point.weekStart, existing);
    }

    return Array.from(combined.entries())
      .map(([weekStart, data]) => ({ weekStart, ...data }))
      .sort((a, b) => a.weekStart.localeCompare(b.weekStart));
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

      return weeklyKilometers
        .map((week) => {
          const point: any = { weekStart: week.weekStart };
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

  const [lastUpdatedText, setLastUpdatedText] = useState("");

  useEffect(() => {
    setLastUpdatedText(`Last updated: ${new Date().toLocaleString()}`);
  }, []);

  return (
    <div className="container">
      <Header lastUpdatedText={lastUpdatedText} active="teams" />

      <div className={css.card}>
        <div className={css.group}>
          <span className={css.label}>View</span>
          <div className={css.pillRow}>
            <button
              className={css.pill}
              aria-pressed={viewMode === "comparison"}
              onClick={() => setViewMode("comparison")}
              type="button"
            >
              Team Comparison
            </button>
            <button
              className={css.pill}
              aria-pressed={viewMode === "bulls-breakdown"}
              onClick={() => setViewMode("bulls-breakdown")}
              type="button"
            >
              Bulls Breakdown
            </button>
            <button
              className={css.pill}
              aria-pressed={viewMode === "sharks-breakdown"}
              onClick={() => setViewMode("sharks-breakdown")}
              type="button"
            >
              Sharks Breakdown
            </button>
          </div>
        </div>

        <div className={css.divider} />

        <div className={css.group}>
          <span className={css.label}>Metric</span>
          <div className={css.pillRow}>
            <button
              className={css.pill}
              aria-pressed={chartMode === "running"}
              onClick={() => setChartMode("running")}
              type="button"
            >
              Running Total
            </button>
            <button
              className={css.pill}
              aria-pressed={chartMode === "weekly"}
              onClick={() => setChartMode("weekly")}
              type="button"
            >
              Weekly Totals
            </button>
          </div>
        </div>
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

      <div className="row" style={{ opacity: loading ? 0.7 : 1 }}>
        <BullsLeaderboardCard athletes={bullsAthletes} totalKm={totalBullsKm} />
        <SharksLeaderboardCard
          athletes={sharksAthletes}
          totalKm={totalSharksKm}
        />
      </div>

      <Divider size={12} />
      <Footer />
    </div>
  );
}
