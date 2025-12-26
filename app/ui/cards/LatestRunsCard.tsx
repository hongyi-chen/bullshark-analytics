import { fmtKm } from "@/app/utils/fmtKm";
import { getAthleteEmojiAndBackground } from "@/app/utils/getAthleteEmojiAndBackground";
import { timeAgo } from "@/app/utils/timeAgo";
import { ServerActivity } from "@/lib/server-api";
import { useMemo } from "react";
import Card from "./Card";
import css from "./LatestRunsCard.module.scss";

interface LatestRunsCardProps {
  activities: ServerActivity[];
  loading: boolean;
}

export default function LatestRunsCard({
  activities,
  loading,
}: LatestRunsCardProps) {
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
              {latestRuns?.lastPoll
                ? `Last poll: ${timeAgo(latestRuns.lastPoll)}`
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
                {timeAgo(run.fetchedAt)}
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
