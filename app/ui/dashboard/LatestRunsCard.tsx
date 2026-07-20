import { fmtKm } from "@/app/utils/fmtKm";
import { getAthleteEmojiAndBackground } from "@/app/utils/athleteStyles";
import { timeAgo } from "@/app/utils/timeAgo";
import { ServerActivity } from "@/lib/server-api";
import { useEffect, useMemo, useState } from "react";
import Card from "../common/Card";
import css from "./LatestRunsCard.module.scss";

interface LatestRunsCardProps {
  activities: ServerActivity[];
  loading: boolean;
}

interface LatestRun {
  athleteName: string;
  km: number;
  activityName: string;
  fetchedAt: string;
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

  const athleteStyles = useMemo(() => {
    const styles = new Map<string, { emoji: string; background: string }>();
    latestRuns.runs.forEach((run) => {
      if (!styles.has(run.athleteName)) {
        styles.set(run.athleteName, getAthleteEmojiAndBackground(run.athleteName));
      }
    });
    return styles;
  }, [latestRuns.runs]);

  return (
    <Card
      header={
        <>
          <div>
            <div className="bold">Latest runs</div>
            <div className="muted">
              {latestRuns?.lastPoll && now !== null
                ? `Last poll: ${timeAgo(latestRuns.lastPoll, now)}`
                : "Recent activity from the club feed"}
            </div>
          </div>
          <div className="badge">{latestRuns?.runs.length ?? 0} recent</div>
        </>
      }
      style={{ opacity: loading ? 0.7 : 1 }}
    >
      <div className={css.latestRunsGrid} role="list" aria-label="Latest runs">
        {latestRuns?.runs.map((run, idx) => {
          const style = athleteStyles.get(run.athleteName);
          return (
            <article key={idx} className={css.latestRunItem} role="listitem">
              <div
                className={css.latestRunIcon}
                style={{ background: style?.background }}
                aria-hidden="true"
              >
                {style?.emoji}
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
                  {now !== null ? timeAgo(run.fetchedAt, now) : ""}
                </div>
              </div>
            </article>
          );
        })}
        {!loading && (!latestRuns?.runs || latestRuns.runs.length === 0) && (
          <div className="muted" style={{ padding: "20px 0" }} role="status">
            No recent runs
          </div>
        )}
      </div>
    </Card>
  );
}
