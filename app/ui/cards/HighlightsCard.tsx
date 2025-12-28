import { fmtKm } from "@/app/utils/fmtKm";
import { AthleteStats, ActivityData } from "@/lib/types/dashboard";
import { ChartData, TimeFilter } from "../types";
import { useMemo } from "react";
import Card from "./Card";
import css from "./HighlightsCard.module.scss";

interface HighlightsCardProps {
  athletes: AthleteStats[];
  chartData: ChartData[];
  stats: ActivityData['stats'] | null;
  timeFilter: TimeFilter;
}

export default function HighlightsCard({
  athletes,
  chartData,
  stats,
  timeFilter,
}: HighlightsCardProps) {
  const highlights = useMemo(() => {
    const totalRuns = stats?.overall.totalRuns ?? 0;
    const totalKm = stats?.overall.totalKm ?? 0;

    // Average run distance
    const avgRunKm = totalRuns > 0 ? totalKm / totalRuns : 0;

    // Most dedicated: highest avg km per run (min 3 runs to qualify)
    const qualifiedAthletes = athletes.filter((a) => a.runs >= 3);
    const mostDedicated =
      qualifiedAthletes.length > 0
        ? qualifiedAthletes.reduce((best, a) => {
            const avgKm = a.totalKm / a.runs;
            const bestAvg = best.totalKm / best.runs;
            return avgKm > bestAvg ? a : best;
          })
        : null;

    // Busiest day from chart data
    const busiestDay =
      chartData.length > 0
        ? chartData.reduce((best, d) => (d.km > best.km ? d : best))
        : null;

    // Active athletes count
    const activeAthletes = athletes.length;

    return {
      avgRunKm,
      mostDedicated: mostDedicated
        ? {
            name: mostDedicated.athleteName,
            avgKm: mostDedicated.totalKm / mostDedicated.runs,
          }
        : null,
      busiestDay,
      activeAthletes,
    };
  }, [athletes, chartData]);

  return (
    <Card
      header={
        <div>
          <div className="bold">Highlights</div>
          <div className="muted">Notable stats (this {timeFilter})</div>
        </div>
      }
    >
      <div className={css.container}>
        <Card highlighted={true} style={{ padding: 12 }}>
          {" "}
          <div className="muted">Longest run</div>
          <div className={css.highlightValue}>
            {stats?.overall.longest
              ? `${fmtKm(stats.overall.longest.km)} km`
              : "—"}
          </div>
          <div className={css.highlightAthlete}>
            {stats?.overall.longest?.athleteName ?? ""}
          </div>
        </Card>
        <Card highlighted={true} style={{ padding: 12 }}>
          <div className="muted">Most dedicated</div>
          <div className={css.highlightValue}>
            {highlights.mostDedicated
              ? `${fmtKm(highlights.mostDedicated.avgKm)} km/run`
              : "—"}
          </div>
          <div className={css.highlightAthlete}>
            {highlights.mostDedicated?.name ?? ""}
          </div>
        </Card>
        <Card highlighted={true} style={{ padding: 12 }}>
          <div className="muted">Most runs</div>
          <div className={css.highlightValue}>
            {stats?.overall.mostRuns
              ? `${stats.overall.mostRuns.runs} runs`
              : "—"}
          </div>
          <div className={css.highlightAthlete}>
            {stats?.overall.mostRuns?.athleteName ?? ""}
          </div>
        </Card>
        <Card highlighted={true} style={{ padding: 12 }}>
          <div className="muted">Average run</div>
          <div className={css.highlightValue}>
            {fmtKm(highlights.avgRunKm)} km
          </div>
          <div className={css.highlightAthlete}>per run</div>
        </Card>
        <Card highlighted={true} style={{ padding: 12 }}>
          <div className="muted">Active athletes</div>
          <div className={css.highlightValue}>{highlights.activeAthletes}</div>
          <div className={css.highlightAthlete}>runners</div>
        </Card>
        <Card highlighted={true} style={{ padding: 12 }}>
          <div className="muted">Busiest day</div>
          <div className={css.highlightValue}>
            {highlights.busiestDay
              ? `${fmtKm(highlights.busiestDay.km)} km`
              : "—"}
          </div>
          <div className={css.highlightAthlete}>
            {highlights.busiestDay?.day ?? ""}
          </div>
        </Card>
      </div>
    </Card>
  );
}
