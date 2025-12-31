import { fmtKm } from "@/app/utils/fmtKm";
import { getAthleteEmojiAndBackground } from "@/app/utils/athleteStyles";
import { ServerActivity } from "@/lib/server-api";
import { useEffect, useMemo, useState } from "react";
import Card from "../common/Card";
import css from "./LatestRunsCard.module.scss";

interface LatestRunsCardProps {
  activities: ServerActivity[];
  loading: boolean;
}

function timeAgoFromNow(dateStr: string, now: number): string {
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export default function LatestRunsCard({
  activities,
  loading,
}: LatestRunsCardProps) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
  }, []);

  const latestRuns = useMemo(() => {
    const runs = activities
      .filter((a) => a.sport_type === "Run")
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8)
      .map((a) => ({
        athleteName: a.athlete_name,
        km: a.distance / 1000,
        activityName: a.name,
        fetchedAt: a.date,
      }));

    return {
      runs,
      lastPoll: activities[0]?.date || null,
    };
  }, [activities]);

  return (
    <Card
      header={
        <>
          <div>
            <div className="bold">Latest runs</div>
            <div className="muted">
              {latestRuns?.lastPoll && now !== null
                ? `Last poll: ${timeAgoFromNow(latestRuns.lastPoll, now)}`
                : "Recent activity from the club feed"}
            </div>
          </div>
          <div className="badge">{latestRuns?.runs.length ?? 0} recent</div>
        </>
      }
      style={{ opacity: loading ? 0.7 : 1 }}
    >
      <div className={css.latestRunsGrid}>
        {latestRuns?.runs.map((run, idx) => (
          <div key={idx} className={css.latestRunItem}>
            <div
              className={css.latestRunIcon}
              style={{
                background: getAthleteEmojiAndBackground(run.athleteName)
                  .background,
              }}
            >
              {getAthleteEmojiAndBackground(run.athleteName).emoji}
            </div>
            <div className={css.latestRunInfo}>
              <div style={{ fontWeight: 600 }}>{run.athleteName}</div>
              <div className="muted" style={{ fontSize: 12 }}>
                {run.activityName}
              </div>
            </div>
            <div className={css.latestRunStats}>
              <div style={{ fontWeight: 600 }}>{fmtKm(run.km)} km</div>
              <div className="muted" style={{ fontSize: 12 }}>
                {now !== null ? timeAgoFromNow(run.fetchedAt, now) : ""}
              </div>
            </div>
          </div>
        ))}
        {!loading && (!latestRuns?.runs || latestRuns.runs.length === 0) && (
          <div className="muted" style={{ padding: "20px 0" }}>
            No recent runs
          </div>
        )}
      </div>
    </Card>
  );
}
