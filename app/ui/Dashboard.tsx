"use client";

import { useEffect, useMemo, useState } from "react";
import { useAtom } from "jotai";
import {
  timeFilterState,
  activitiesState,
  loadingState,
  errorState,
  athletesState,
} from "@/lib/state/atoms";
import { fetchActivities, fetchAthletes } from "@/lib/state/api";
import Header from "./Header";
import Filters from "./Filters";
import { Aggregation, AthleteStats } from "./types";
import ErrorCard from "./cards/ErrorCard";
import Footer from "./Footer";
import TopAthletesCard from "./cards/TopAthletesCard";
import ClubKmCard from "./cards/ClubKmCard";
import RunsPerAtheleteCard from "./cards/RunsPerAthleteCard";
import HighlightsCard from "./cards/HighlightsCard";
import LatestRunsCard from "./cards/LatestRunsCard";
import Divider from "./Divider";

export default function Dashboard() {
  // Jotai state
  const [timeFilter, setTimeFilter] = useAtom(timeFilterState);
  const [activities, setActivities] = useAtom(activitiesState);
  const [loading, setLoading] = useAtom(loadingState);
  const [err, setErr] = useAtom(errorState);
  const [athletes, setAthletes] = useAtom(athletesState);

  // Keep as local state (UI-only filters)
  const [aggregation, setAggregation] = useState<Aggregation>("daily");
  const [minRuns, setMinRuns] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr(null);

      try {
        const data = await fetchActivities(timeFilter);

        if (!cancelled) {
          setActivities(data);
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
  }, [timeFilter, setActivities, setLoading, setErr]);

  // Fetch athletes on mount
  useEffect(() => {
    let cancelled = false;

    async function loadAthletes() {
      try {
        const data = await fetchAthletes();
        if (!cancelled) {
          setAthletes(data);
        }
      } catch (e: any) {
        console.error('Failed to fetch athletes:', e);
        // Athletes are optional, so we don't set the main error state
      }
    }

    loadAthletes();

    return () => {
      cancelled = true;
    };
  }, [setAthletes]);

  // Process raw activities into structures needed by components
  const timeseries = useMemo(() => {
    return activities
      .filter((a) => a.sport_type === "Run")
      .map((a) => ({
        day: a.date.split("T")[0],
        athleteName: a.athlete_name,
        km: a.distance / 1000,
      }));
  }, [activities]);

  const stats = useMemo(() => {
    const runs = activities.filter((a) => a.sport_type === "Run");

    if (runs.length === 0) {
      return {
        overall: {
          totalRuns: 0,
          totalKm: 0,
          longest: null,
          shortest: null,
          mostRuns: null,
        },
        athletes: [],
        lastFetchedAt: null,
      };
    }

    // Group by athlete
    const athleteMap = new Map<string, Omit<AthleteStats, "athleteName">>();

    let longestRun = { athleteName: "", km: 0 };
    let shortestRun = { athleteName: "", km: Infinity };

    for (const run of runs) {
      const km = run.distance / 1000;
      const existing = athleteMap.get(run.athlete_name) || {
        runs: 0,
        totalKm: 0,
        longestKm: 0,
        shortestKm: Infinity,
      };

      existing.runs++;
      existing.totalKm += km;
      existing.longestKm = Math.max(existing.longestKm, km);
      existing.shortestKm = Math.min(existing.shortestKm, km);

      athleteMap.set(run.athlete_name, existing);

      if (km > longestRun.km) {
        longestRun = { athleteName: run.athlete_name, km };
      }
      if (km < shortestRun.km) {
        shortestRun = { athleteName: run.athlete_name, km };
      }
    }

    // Convert to array and sort by total km
    const athletes = Array.from(athleteMap.entries())
      .map(([athleteName, data]) => ({
        athleteName,
        runs: data.runs,
        totalKm: data.totalKm,
        longestKm: data.longestKm,
        shortestKm: data.shortestKm === Infinity ? 0 : data.shortestKm,
      }))
      .sort((a, b) => b.totalKm - a.totalKm);

    // Find athlete with most runs
    const mostRuns = athletes.reduce(
      (max, a) => (a.runs > max.runs ? a : max),
      { athleteName: "", runs: 0 }
    );

    return {
      overall: {
        totalRuns: runs.length,
        totalKm: runs.reduce((sum, r) => sum + r.distance / 1000, 0),
        longest: longestRun.km > 0 ? longestRun : null,
        shortest: shortestRun.km < Infinity ? shortestRun : null,
        mostRuns: mostRuns.runs > 0 ? mostRuns : null,
      },
      athletes,
      lastFetchedAt: runs[0]?.date || null,
    };
  }, [activities]);

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

  const [lastUpdatedText, setLastUpdatedText] = useState("No data yet");

  useEffect(() => {
    if (!stats?.lastFetchedAt) {
      setLastUpdatedText("No data yet");
    } else {
      setLastUpdatedText(`Last updated: ${new Date(stats.lastFetchedAt).toLocaleString()}`);
    }
  }, [stats?.lastFetchedAt]);

  return (
    <div className="container">
      <Header lastUpdatedText={lastUpdatedText} />
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
        <TopAthletesCard
          loading={loading}
          timeFilter={timeFilter}
          timeseries={timeseries}
          topAthletes={filteredAthletes}
          totalRuns={stats.overall.totalRuns}
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
        <RunsPerAtheleteCard
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
      <Footer />
    </div>
  );
}
