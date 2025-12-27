import { CSSProperties, useCallback, useEffect, useMemo, useState } from "react";
import Card from "./Card";
import { AthleteStats, TimeFilter, Timeseries } from "../types";
import clsx from "clsx";
import css from "./TopAthletesCard.module.scss";
import { fmtKm } from "@/app/utils/fmtKm";
import { useAtom } from "jotai";
import { athletesState } from "@/lib/state/atoms";

const TEXT_ALIGN_RIGHT: CSSProperties = { textAlign: "right" };

interface TopAthletesCardProps {
  loading: boolean;
  timeFilter: TimeFilter;
  timeseries: Timeseries[];
  topAthletes: AthleteStats[];
  totalRuns: number;
}

export default function TopAthletesCard({
  loading,
  timeFilter,
  timeseries,
  topAthletes,
  totalRuns,
}: TopAthletesCardProps) {
  const [athletes] = useAtom(athletesState);
  const [todayTimestamp, setTodayTimestamp] = useState<number | null>(null);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setTodayTimestamp(today.getTime());
  }, []);

  const athleteLastRunDate = useMemo(() => {
    const pts = timeseries;
    const lastRun = new Map<string, string>();
    for (const p of pts) {
      if (p.athleteName) {
        const existing = lastRun.get(p.athleteName);
        if (!existing || p.day > existing) {
          lastRun.set(p.athleteName, p.day);
        }
      }
    }
    return lastRun;
  }, [timeseries]);

  const athleteEventMap = useMemo(() => {
    const eventMap = new Map<string, "half" | "full">();
    for (const athlete of athletes) {
      eventMap.set(athlete.name, athlete.event);
    }
    return eventMap;
  }, [athletes]);

  const getAthleteStatus = useCallback(
    (athleteName: string): "today" | "recent" | "inactive" | null => {
      if (todayTimestamp === null) return null;
      const lastRun = athleteLastRunDate.get(athleteName);
      if (!lastRun) return null;

      const lastRunDate = new Date(lastRun);
      lastRunDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor(
        (todayTimestamp - lastRunDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 0) return "today";
      if (diffDays <= 3) return "recent";
      return "inactive";
    },
    [todayTimestamp, athleteLastRunDate]
  );

  return (
    <Card
      header={
        <>
          <div>
            <div className="bold">Top athletes</div>
            <div className="muted">By total distance (this {timeFilter})</div>
          </div>
          <div className="badge">Runs: {totalRuns}</div>
        </>
      }
      fixedTall={true}
    >
      <div className={clsx(css.tableScroll, css.tableScrollFixed, "flexFill")}>
        <table className={css.table}>
          <thead>
            <tr>
              <th style={{ width: 42 }}>#</th>
              <th>Athlete</th>
              <th style={TEXT_ALIGN_RIGHT}>Runs</th>
              <th style={TEXT_ALIGN_RIGHT}>Km</th>
            </tr>
          </thead>
          <tbody>
            {topAthletes.map((r, idx) => {
              const status = getAthleteStatus(r.athleteName);
              return (
                <tr key={`${r.athleteName}-${idx}`}>
                  <td className="muted">{idx + 1}</td>
                  <td>
                    <span className={css.athleteNameCell}>
                      {r.athleteName}
                      {(() => {
                        const event = athleteEventMap.get(r.athleteName);
                        if (!event) return null;
                        return (
                          <span
                            className={clsx(
                              css.eventChip,
                              event === "half" ? css.eventChipHalf : css.eventChipFull
                            )}
                            data-tooltip={event === "half" ? "Half Marathon" : "Full Marathon"}
                          >
                            {event}
                          </span>
                        )
                      })()}
                      {status === "today" && (
                        <span
                          className={clsx(css.statusChip, css.statusChipToday)}
                          data-tooltip="Ran today"
                        >
                          ran today
                        </span>
                      )}
                      {status === "recent" && (
                        <span
                          className={clsx(css.statusChip, css.statusChipRecent)}
                          data-tooltip="Last run within the past 3 days"
                        >
                          recent
                        </span>
                      )}
                      {status === "inactive" && (
                        <span
                          className={clsx(
                            css.statusChip,
                            css.statusChipInactive
                          )}
                          data-tooltip="No runs in the past 4+ days"
                        >
                          inactive
                        </span>
                      )}
                    </span>
                  </td>
                  <td style={TEXT_ALIGN_RIGHT}>{r.runs}</td>
                  <td style={TEXT_ALIGN_RIGHT}>{fmtKm(r.totalKm)}</td>
                </tr>
              );
            })}
            {!loading && topAthletes.length === 0 ? (
              <tr>
                <td colSpan={4} className="muted">
                  No data yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
