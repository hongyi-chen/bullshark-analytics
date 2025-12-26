"use client";

import { useEffect, useMemo, useState } from "react";
import { useAtom } from "jotai";
import {
  teamStatsState,
  teamLoadingState,
  teamErrorState,
  teamChartModeState,
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
        bullsKm: point.weekly_team_kilometers,
        sharksKm: 0,
      });
    }

    for (const point of teamStats.sharks.weeklyKilometers) {
      const existing = combined.get(point.weekStart) ?? {
        bullsKm: 0,
        sharksKm: 0,
      };
      existing.sharksKm = point.weekly_team_kilometers;
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
        bullsKm: point.weekly_running_sum,
        sharksKm: 0,
      });
    }

    for (const point of teamStats.sharks.weeklyKilometers) {
      const existing = combined.get(point.weekStart) ?? {
        bullsKm: 0,
        sharksKm: 0,
      };
      existing.sharksKm = point.weekly_running_sum;
      combined.set(point.weekStart, existing);
    }

    return Array.from(combined.entries())
      .map(([weekStart, data]) => ({ weekStart, ...data }))
      .sort((a, b) => a.weekStart.localeCompare(b.weekStart));
  }, [teamStats]);

  const displayChartData = useMemo(() => {
    return chartMode === "weekly" ? chartData : runningTotalsData;
  }, [chartMode, chartData, runningTotalsData]);

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
      <Header lastUpdatedText={lastUpdatedText} />
      <Divider size={16} />

      <div className={css.card}>
        <div className={css.group}>
          <span className={css.label}>Chart Mode</span>
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
          chartData={displayChartData}
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
