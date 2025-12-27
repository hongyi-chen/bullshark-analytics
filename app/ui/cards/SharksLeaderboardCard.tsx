import { CSSProperties } from "react";
import Card from "./Card";
import clsx from "clsx";
import css from "./SharksLeaderboardCard.module.scss";
import { fmtKm } from "@/app/utils/fmtKm";

const TEXT_ALIGN_RIGHT: CSSProperties = { textAlign: "right" };

interface Athlete {
  athleteName: string;
  totalKm: number;
}

interface SharksLeaderboardCardProps {
  athletes: Athlete[];
  totalKm: number;
}

export default function SharksLeaderboardCard({
  athletes,
  totalKm,
}: SharksLeaderboardCardProps) {
  return (
    <Card
      header={
        <>
          <div>
            <div className="bold">🦈 Sharks Leaderboard</div>
            <div className="muted">Top athletes by distance</div>
          </div>
          <div className="badge">Total: {fmtKm(totalKm)} km</div>
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
              <th style={TEXT_ALIGN_RIGHT}>Km</th>
            </tr>
          </thead>
          <tbody>
            {athletes.map((athlete, idx) => (
              <tr key={`${athlete.athleteName}-${idx}`}>
                <td className="muted">{idx + 1}</td>
                <td>{athlete.athleteName}</td>
                <td style={TEXT_ALIGN_RIGHT}>{fmtKm(athlete.totalKm)}</td>
              </tr>
            ))}
            {athletes.length === 0 && (
              <tr>
                <td colSpan={3} className="muted">
                  No data yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
