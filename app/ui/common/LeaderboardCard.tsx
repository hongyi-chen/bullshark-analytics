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
  streak?: number;
}

export type Column =
  | { type: "rank" }
  | { type: "athlete"; showEventChips?: boolean; showStatusChips?: boolean; showTeamChips?: boolean }
  | { type: "runs" }
  | { type: "distance" }
  | { type: "streak" };

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
  const label = event === "half" ? "Half Marathon" : "Full Marathon";
  return (
    <span
      className={clsx(
        css.eventChip,
        event === "half" ? css.eventChipHalf : css.eventChipFull
      )}
      title={label}
      aria-label={label}
    >
      <span aria-hidden="true">{event}</span>
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
    <span 
      className={clsx(css.statusChip, className)} 
      title={tooltip}
      aria-label={tooltip}
    >
      <span aria-hidden="true">{label}</span>
    </span>
  );
}

interface TeamChipProps {
  team: "bulls" | "sharks";
}

function TeamChip({ team }: TeamChipProps) {
  const label = team === "bulls" ? "Team Bulls" : "Team Sharks";
  return (
    <span
      className={clsx(
        css.teamChip,
        team === "bulls" ? css.teamChipBulls : css.teamChipSharks
      )}
      title={label}
      aria-label={label}
    >
      <span aria-hidden="true">{team}</span>
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

  // Build team map from athlete metadata
  const athleteTeamMap = useMemo(() => {
    const teamMap = new Map<string, "bulls" | "sharks">();
    const metadata = chipDataSources?.athleteMetadata || [];
    for (const athlete of metadata) {
      teamMap.set(athlete.name, athlete.team);
    }
    return teamMap;
  }, [chipDataSources?.athleteMetadata]);

  const renderHeaders = () => {
    return columns.map((col, idx) => {
      switch (col.type) {
        case "rank":
          return (
            <th key={idx} scope="col" style={{ width: 42 }}>
              <span className="sr-only">Rank</span>
              <span aria-hidden="true">#</span>
            </th>
          );
        case "athlete":
          return <th key={idx} scope="col">Athlete</th>;
        case "runs":
          return (
            <th key={idx} scope="col" style={TEXT_ALIGN_RIGHT}>
              Runs
            </th>
          );
        case "distance":
          return (
            <th key={idx} scope="col" style={TEXT_ALIGN_RIGHT}>
              <span className="sr-only">Distance in kilometers</span>
              <span aria-hidden="true">Km</span>
            </th>
          );
        case "streak":
          return (
            <th key={idx} scope="col" style={TEXT_ALIGN_RIGHT}>
              Streak
            </th>
          );
      }
    });
  };

  // Render athlete row cells
  const renderCells = (athlete: LeaderboardAthlete, idx: number) => {
    const status = getAthleteStatus(athlete.athleteName);
    const event = athleteEventMap.get(athlete.athleteName);
    const team = athleteTeamMap.get(athlete.athleteName);

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
                {col.showTeamChips && team && <TeamChip team={team} />}
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
        case "streak":
          const streakCount = athlete.streak ?? 0;
          return (
            <td key={colIdx} style={TEXT_ALIGN_RIGHT}>
              <span className={css.streakBadge} aria-label={`${streakCount} day streak`}>
                <span className={css.streakIcon} aria-hidden="true">🔥</span>
                {streakCount}
              </span>
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
        <table className={css.table} aria-label={`${title} leaderboard`}>
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
