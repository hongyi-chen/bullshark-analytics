import { CSSProperties, useMemo } from "react";
import Card from "../common/Card";
import { Athlete, Timeseries } from "../types";
import clsx from "clsx";
import css from "./LeaderboardCard.module.scss";
import { fmtKm } from "@/app/utils/fmtKm";
import { useAthleteStatus } from "../hooks/useAthleteStatus";

const TEXT_ALIGN_RIGHT: CSSProperties = { textAlign: "right" };

// === TYPE DEFINITIONS ===

export interface LeaderboardAthlete {
  athleteName: string;
  totalKm: number;
  runs?: number;
}

export type Column =
  | { type: "rank" }
  | { type: "athlete"; showEventChips?: boolean; showStatusChips?: boolean }
  | { type: "runs" }
  | { type: "distance" };

export interface ChipDataSources {
  timeseries?: Timeseries[];
  athleteMetadata?: Athlete[];
}

export interface LeaderboardCardProps {
  title: string;
  subtitle: string;
  badgeLabel: string;
  badgeValue: string | number;
  athletes: LeaderboardAthlete[];
  columns?: Column[];
  chipDataSources?: ChipDataSources;
  loading?: boolean;
  emptyMessage?: string;
}

// === CHIP SUBCOMPONENTS ===

interface EventChipProps {
  event: "half" | "full";
}

function EventChip({ event }: EventChipProps) {
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
  );
}

interface StatusChipProps {
  status: "today" | "recent" | "inactive";
}

function StatusChip({ status }: StatusChipProps) {
  const config = {
    today: {
      label: "ran today",
      tooltip: "Ran today",
      className: css.statusChipToday,
    },
    recent: {
      label: "recent",
      tooltip: "Last run within the past 3 days",
      className: css.statusChipRecent,
    },
    inactive: {
      label: "inactive",
      tooltip: "No runs in the past 4+ days",
      className: css.statusChipInactive,
    },
  };

  const { label, tooltip, className } = config[status];

  return (
    <span className={clsx(css.statusChip, className)} data-tooltip={tooltip}>
      {label}
    </span>
  );
}

// === MAIN COMPONENT ===

const DEFAULT_COLUMNS: Column[] = [
  { type: "rank" },
  { type: "athlete" },
  { type: "distance" },
];

export default function LeaderboardCard({
  title,
  subtitle,
  badgeLabel,
  badgeValue,
  athletes,
  columns = DEFAULT_COLUMNS,
  chipDataSources,
  loading = false,
  emptyMessage = "No data yet.",
}: LeaderboardCardProps) {
  const getAthleteStatus = useAthleteStatus(chipDataSources?.timeseries);

  // Build event map from athlete metadata
  const athleteEventMap = useMemo(() => {
    const eventMap = new Map<string, "half" | "full">();
    const metadata = chipDataSources?.athleteMetadata || [];
    for (const athlete of metadata) {
      eventMap.set(athlete.name, athlete.event);
    }
    return eventMap;
  }, [chipDataSources?.athleteMetadata]);

  // Render column headers
  const renderHeaders = () => {
    return columns.map((col, idx) => {
      switch (col.type) {
        case "rank":
          return (
            <th key={idx} style={{ width: 42 }}>
              #
            </th>
          );
        case "athlete":
          return <th key={idx}>Athlete</th>;
        case "runs":
          return (
            <th key={idx} style={TEXT_ALIGN_RIGHT}>
              Runs
            </th>
          );
        case "distance":
          return (
            <th key={idx} style={TEXT_ALIGN_RIGHT}>
              Km
            </th>
          );
      }
    });
  };

  // Render athlete row cells
  const renderCells = (athlete: LeaderboardAthlete, idx: number) => {
    const status = getAthleteStatus(athlete.athleteName);
    const event = athleteEventMap.get(athlete.athleteName);

    return columns.map((col, colIdx) => {
      switch (col.type) {
        case "rank":
          return (
            <td key={colIdx} className="muted">
              {idx + 1}
            </td>
          );

        case "athlete":
          return (
            <td key={colIdx}>
              <span className={css.athleteNameCell}>
                {athlete.athleteName}
                {col.showEventChips && event && <EventChip event={event} />}
                {col.showStatusChips && status && <StatusChip status={status} />}
              </span>
            </td>
          );

        case "runs":
          return (
            <td key={colIdx} style={TEXT_ALIGN_RIGHT}>
              {athlete.runs ?? 0}
            </td>
          );

        case "distance":
          return (
            <td key={colIdx} style={TEXT_ALIGN_RIGHT}>
              {fmtKm(athlete.totalKm)}
            </td>
          );
      }
    });
  };

  return (
    <Card
      header={
        <>
          <div>
            <div className="bold">{title}</div>
            <div className="muted">{subtitle}</div>
          </div>
          <div className="badge">
            {badgeLabel}: {badgeValue}
          </div>
        </>
      }
      fixedTall={true}
    >
      <div
        className={clsx(css.tableScroll, css.tableScrollFixed, "flexFill")}
        style={{ opacity: loading ? 0.7 : 1 }}
      >
        <table className={css.table}>
          <thead>
            <tr>{renderHeaders()}</tr>
          </thead>
          <tbody>
            {athletes.map((athlete, idx) => (
              <tr key={`${athlete.athleteName}-${idx}`}>
                {renderCells(athlete, idx)}
              </tr>
            ))}
            {!loading && athletes.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="muted">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
