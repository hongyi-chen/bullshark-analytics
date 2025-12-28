"use client";

import { useEffect, useMemo, useState } from "react";
import { useAtom } from "jotai";
import {
  timeFilterState,
  loadingState,
  errorState,
  dashboardAggregationState,
  dashboardMinRunsState,
  lastUpdatedTextState,
} from "@/lib/state/atoms";
import { useActivities, useAthletes, useTimeseries, useActivityStats } from "@/lib/hooks";
import Filters from "./Filters";
import ErrorCard from "./cards/ErrorCard";
import LeaderboardCard from "./cards/LeaderboardCard";
import ClubKmCard from "./cards/ClubKmCard";
import RunsPerAthleteCard from "./cards/RunsPerAthleteCard";
import HighlightsCard from "./cards/HighlightsCard";
import LatestRunsCard from "./cards/LatestRunsCard";
import Divider from "./Divider";

export default function DashboardView() {
  // Global state
  const [timeFilter, setTimeFilter] = useAtom(timeFilterState);
  const [loading] = useAtom(loadingState);
  const [err] = useAtom(errorState);

  // Dashboard-specific state (now using atoms for persistence)
  const [aggregation, setAggregation] = useAtom(dashboardAggregationState);
  const [minRuns, setMinRuns] = useAtom(dashboardMinRunsState);

  // Data fetching hooks
  const activities = useActivities(timeFilter);
  const athletes = useAthletes();
  const timeseries = useTimeseries();
  const stats = useActivityStats();

  const chartData = useMemo(() => {
    const pts = timeseries;
    const byPeriod = new Map<string, number>();

    for (const p of pts) {
      let key = p.day;
      if (aggregation === "weekly") {
        // Get the week start (Monday) for this date
        const date = new Date(p.day);
        const dayOfWeek = date.getDay();
        const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        const weekStart = new Date(date.setDate(diff));
        key = `Week of ${weekStart.toISOString().split("T")[0]}`;
      }
      byPeriod.set(key, (byPeriod.get(key) ?? 0) + p.km);
    }

    return Array.from(byPeriod.entries())
      .map(([period, km]) => ({ day: period, km }))
      .sort((a, b) => (a.day < b.day ? -1 : a.day > b.day ? 1 : 0));
  }, [timeseries, aggregation]);

  const filteredAthletes = useMemo(() => {
    return (stats?.athletes ?? []).filter((a) => a.runs >= minRuns);
  }, [stats, minRuns]);

  const [, setLastUpdatedText] = useAtom(lastUpdatedTextState);

  useEffect(() => {
    if (!stats?.lastFetchedAt) {
      setLastUpdatedText("No data yet");
    } else {
      setLastUpdatedText(`Last updated: ${new Date(stats.lastFetchedAt).toLocaleString()}`);
    }
  }, [stats?.lastFetchedAt, setLastUpdatedText]);

  return (
    <>
      <Filters
        aggregation={aggregation}
        minRuns={minRuns}
        setAggregation={setAggregation}
        setMinRuns={setMinRuns}
        setTimeFilter={setTimeFilter}
        timeFilter={timeFilter}
      />
      <Divider size={16} />

      {err != null ? <ErrorCard errorMessage={err} /> : null}

      <div className="row" style={{ opacity: loading ? 0.7 : 1 }}>
        <LeaderboardCard
          title="Top athletes"
          subtitle={`By total distance (this ${timeFilter})`}
          badgeLabel="Runs"
          badgeValue={stats.overall.totalRuns}
          athletes={filteredAthletes}
          columns={[
            { type: "rank" },
            { type: "athlete", showEventChips: true, showStatusChips: true },
            { type: "runs" },
            { type: "distance" },
          ]}
          chipDataSources={{ timeseries, athleteMetadata: athletes }}
          loading={loading}
        />
        <ClubKmCard
          aggregation={aggregation}
          chartData={chartData}
          timeFilter={timeFilter}
          totalKm={stats?.overall.totalKm}
        />
      </div>

      <Divider size={12} />

      <div className="row" style={{ opacity: loading ? 0.7 : 1 }}>
        <RunsPerAthleteCard
          athletes={filteredAthletes}
          timeFilter={timeFilter}
        />
        <HighlightsCard
          athletes={filteredAthletes}
          chartData={chartData}
          stats={stats}
          timeFilter={timeFilter}
        />
      </div>

      <Divider size={12} />

      <LatestRunsCard activities={activities} loading={loading} />
    </>
  );
}
