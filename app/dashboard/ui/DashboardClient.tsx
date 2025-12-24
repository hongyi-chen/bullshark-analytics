'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAtom } from 'jotai';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { timeFilterState, activitiesState, loadingState, errorState } from '@/lib/state/atoms';
import { fetchActivities } from '@/lib/state/api';

type TimeseriesPoint = {
  day: string;
  athleteName: string;
  km: number;
};

type AthleteStats = {
  athleteName: string;
  runs: number;
  totalKm: number;
  longestKm: number;
  shortestKm: number;
};

type LatestRun = {
  athleteName: string;
  km: number;
  activityName: string;
  fetchedAt: string;
};

function fmtKm(km: number): string {
  if (!Number.isFinite(km)) return '0.00';
  return km.toFixed(2);
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

function formatSeconds(s: number): string {
  const secs = Math.max(0, Math.floor(s));
  const m = Math.floor(secs / 60);
  const r = secs % 60;
  return m > 0 ? `${m}m ${r}s` : `${r}s`;
}

// Fun emoji pool for athlete avatars
const ATHLETE_EMOJIS = [
  '🦈', '🐬', '🐳', '🦭', '🐙', '🦑', '🦀', '🦞', '🐠', '🐟',
  '🦋', '🐝', '🐢', '🦎', '🐍', '🦖', '🦕', '🐲', '🦩', '🦚',
  '🦜', '🦢', '🦉', '🐧', '🐼', '🐨', '🦁', '🐯', '🐻', '🦊',
  '🐺', '🦝', '🐵', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🦒',
  '🦬', '🐂', '🐃', '🦌', '🐎', '🦄', '🐕', '🐈', '🐓', '🦃',
];

// Background colors that pair well with emojis
const EMOJI_BACKGROUNDS = [
  'rgba(34, 197, 94, 0.15)',   // green
  'rgba(59, 130, 246, 0.15)',  // blue
  'rgba(168, 85, 247, 0.15)',  // purple
  'rgba(236, 72, 153, 0.15)',  // pink
  'rgba(249, 115, 22, 0.15)',  // orange
  'rgba(234, 179, 8, 0.15)',   // yellow
  'rgba(6, 182, 212, 0.15)',   // cyan
  'rgba(239, 68, 68, 0.15)',   // red
  'rgba(132, 204, 22, 0.15)',  // lime
  'rgba(99, 102, 241, 0.15)',  // indigo
];

// Simple hash function to get consistent index for a name
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function getAthleteEmoji(name: string): string {
  const hash = hashString(name);
  return ATHLETE_EMOJIS[hash % ATHLETE_EMOJIS.length];
}

function getAthleteEmojiBackground(name: string): string {
  const hash = hashString(name);
  return EMOJI_BACKGROUNDS[hash % EMOJI_BACKGROUNDS.length];
}

function ChartTooltip({ active, payload, label, metricLabel }: any) {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value ?? 0;
  return (
    <div
      style={{
        background: 'rgba(15, 22, 32, 0.95)',
        border: '1px solid rgba(231, 237, 246, 0.12)',
        borderRadius: 10,
        padding: '10px 10px',
      }}
    >
      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Label</div>
      <div style={{ fontSize: 13, marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>{metricLabel}</div>
        <div style={{ fontSize: 13 }}>{val}</div>
      </div>
    </div>
  );
}

export default function DashboardClient() {
  const [mounted, setMounted] = useState(false);

  // Jotai state
  const [timeFilter, setTimeFilter] = useAtom(timeFilterState);
  const [activities, setActivities] = useAtom(activitiesState);
  const [loading, setLoading] = useAtom(loadingState);
  const [err, setErr] = useAtom(errorState);

  // Keep as local state (UI-only filters)
  const [aggregation, setAggregation] = useState<'daily' | 'weekly'>('daily');
  const [minRuns, setMinRuns] = useState<number>(0);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Process raw activities into structures needed by components
  const timeseries = useMemo(() => {
    return activities
      .filter((a) => a.sport_type === 'Run')
      .map((a) => ({
        day: a.date.split('T')[0],
        athleteName: a.athlete_name,
        km: a.distance / 1000,
      }));
  }, [activities]);

  const stats = useMemo(() => {
    const runs = activities.filter((a) => a.sport_type === 'Run');

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
    const athleteMap = new Map<string, {
      runs: number;
      totalKm: number;
      longestKm: number;
      shortestKm: number;
    }>();

    let longestRun = { athleteName: '', km: 0 };
    let shortestRun = { athleteName: '', km: Infinity };

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
      { athleteName: '', runs: 0 }
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

  const latestRuns = useMemo(() => {
    const runs = activities
      .filter((a) => a.sport_type === 'Run')
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

  const chartData = useMemo(() => {
    const pts = timeseries;
    const byPeriod = new Map<string, number>();

    for (const p of pts) {
      let key = p.day;
      if (aggregation === 'weekly') {
        // Get the week start (Monday) for this date
        const date = new Date(p.day);
        const dayOfWeek = date.getDay();
        const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        const weekStart = new Date(date.setDate(diff));
        key = `Week of ${weekStart.toISOString().split('T')[0]}`;
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

  const topAthletes = useMemo(() => {
    return filteredAthletes;
  }, [filteredAthletes]);

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

  const getAthleteStatus = (athleteName: string): 'today' | 'recent' | 'inactive' | null => {
    const lastRun = athleteLastRunDate.get(athleteName);
    if (!lastRun) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastRunDate = new Date(lastRun);
    lastRunDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((today.getTime() - lastRunDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'today';
    if (diffDays <= 3) return 'recent';
    return 'inactive';
  };

  const runsBarData = useMemo(() => {
    return [...filteredAthletes]
      .sort((a, b) => b.runs - a.runs)
      .slice(0, 10)
      .map((a) => ({ athlete: a.athleteName, runs: a.runs }));
  }, [filteredAthletes]);

  const lastUpdatedText = useMemo(() => {
    if (!stats?.lastFetchedAt) return 'No data yet';
    return `Last updated: ${new Date(stats.lastFetchedAt).toLocaleString()}`;
  }, [stats]);

  const highlights = useMemo(() => {
    const athletes = filteredAthletes;
    const totalRuns = stats?.overall.totalRuns ?? 0;
    const totalKm = stats?.overall.totalKm ?? 0;

    // Average run distance
    const avgRunKm = totalRuns > 0 ? totalKm / totalRuns : 0;

    // Most dedicated: highest avg km per run (min 3 runs to qualify)
    const qualifiedAthletes = athletes.filter((a) => a.runs >= 3);
    const mostDedicated = qualifiedAthletes.length > 0
      ? qualifiedAthletes.reduce((best, a) => {
          const avgKm = a.totalKm / a.runs;
          const bestAvg = best.totalKm / best.runs;
          return avgKm > bestAvg ? a : best;
        })
      : null;

    // Busiest day from chart data
    const busiestDay = chartData.length > 0
      ? chartData.reduce((best, d) => (d.km > best.km ? d : best))
      : null;

    // Active athletes count
    const activeAthletes = athletes.length;

    return {
      avgRunKm,
      mostDedicated: mostDedicated
        ? { name: mostDedicated.athleteName, avgKm: mostDedicated.totalKm / mostDedicated.runs }
        : null,
      busiestDay,
      activeAthletes,
    };
  }, [filteredAthletes, chartData]);

  return (
    <div className="container">
      <header className="dashboardHeader">
        <div className="headerMain">
          <h1 className="h1">Bullshark Analytics 🦈</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <p className="headerSubtitle">{lastUpdatedText}</p>
          </div>
        </div>
        <div className="headerActions">
          <span className="badge">Public club dashboard</span>
        </div>
      </header>

      <div className="filtersCard">
        <div className="filterGroup">
          <span className="filterLabel">Time period</span>
          <div className="pillRow">
            <button
              className="pill"
              aria-pressed={timeFilter === 'week'}
              onClick={() => setTimeFilter('week')}
              type="button"
            >
              This Week
            </button>
            <button
              className="pill"
              aria-pressed={timeFilter === 'month'}
              onClick={() => setTimeFilter('month')}
              type="button"
            >
              This Month
            </button>
          </div>
        </div>

        <div className="filterDivider" />

        <div className="filterGroup">
          <span className="filterLabel">Chart view</span>
          <div className="pillRow">
            {(['daily', 'weekly'] as const).map((agg) => (
              <button
                key={agg}
                className="pill"
                aria-pressed={aggregation === agg}
                onClick={() => setAggregation(agg)}
                type="button"
              >
                {agg === 'daily' ? 'Daily' : 'Weekly'}
              </button>
            ))}
          </div>
        </div>

        <div className="filterDivider" />

        <div className="filterGroup">
          <span className="filterLabel">Min runs</span>
          <div className="pillRow">
            {[0, 3, 5, 10].map((m) => (
              <button
                key={m}
                className="pill"
                aria-pressed={minRuns === m}
                onClick={() => setMinRuns(m)}
                type="button"
              >
                {m === 0 ? 'All' : `${m}+`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ height: 16 }} />

      {err ? (
        <div className="card">
          <div className="cardHeader">
            <div style={{ fontWeight: 650 }}>Couldn’t load dashboard</div>
            <div className="muted">Check that the API endpoints are working.</div>
          </div>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: 'var(--muted)', fontSize: 12 }}>{err}</pre>
        </div>
      ) : null}

      <div className="row" style={{ opacity: loading ? 0.7 : 1 }}>
        <div className="card cardFixedTall">
          <div className="cardHeader">
            <div>
              <div style={{ fontWeight: 650 }}>Top athletes</div>
              <div className="muted">By total distance (this {timeFilter})</div>
            </div>
            <div className="badge">Runs: {stats?.overall.totalRuns ?? 0}</div>
          </div>

          <div className="tableScroll tableScrollFixed flexFill">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 42 }}>#</th>
                  <th>Athlete</th>
                  <th style={{ textAlign: 'right' }}>Runs</th>
                  <th style={{ textAlign: 'right' }}>Km</th>
                </tr>
              </thead>
              <tbody>
                {topAthletes.map((r, idx) => {
                  const status = getAthleteStatus(r.athleteName);
                  return (
                    <tr key={`${r.athleteName}-${idx}`}>
                      <td className="muted">{idx + 1}</td>
                      <td>
                        <span className="athleteNameCell">
                          {r.athleteName}
{status === 'today' && (
<span
                              className="statusChip statusChipToday"
                              data-tooltip="Ran today"
                            >
                              ran today
                            </span>
                          )}
                          {status === 'recent' && (
<span
                              className="statusChip statusChipRecent"
                              data-tooltip="Last run within the past 3 days"
                            >
                              recent
                            </span>
                          )}
                          {status === 'inactive' && (
<span
                              className="statusChip statusChipInactive"
                              data-tooltip="No runs in the past 4+ days"
                            >
                              inactive
                            </span>
                          )}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>{r.runs}</td>
                      <td style={{ textAlign: 'right' }}>{fmtKm(r.totalKm)}</td>
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
        </div>

        <div className="card cardFixedTall">
          <div className="cardHeader">
            <div>
              <div style={{ fontWeight: 650 }}>Club km per {aggregation === 'daily' ? 'day' : 'week'}</div>
              <div className="muted">Total distance {aggregation === 'daily' ? 'per day' : 'per week'} (this {timeFilter})</div>
            </div>
            <div className="badge">Total: {fmtKm(stats?.overall.totalKm ?? 0)} km</div>
          </div>

          <div style={{ width: '100%', height: '100%', minHeight: 0 }} className="flexFill">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 8, right: 18, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(231,237,246,0.08)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'rgba(231,237,246,0.7)' }} />
                  <YAxis tick={{ fontSize: 12, fill: 'rgba(231,237,246,0.7)' }} width={34} />
                  <Tooltip content={<ChartTooltip metricLabel="Club km" />} />
                  <Line type="monotone" dataKey="km" stroke="var(--accent)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </div>
      </div>

      <div style={{ height: 12 }} />

      <div className="row" style={{ opacity: loading ? 0.7 : 1 }}>
        <div className="card">
          <div className="cardHeader">
            <div>
              <div style={{ fontWeight: 650 }}>Runs per athlete</div>
              <div className="muted">Top 10 by run count (this {timeFilter})</div>
            </div>
          </div>

          <div style={{ width: '100%', height: 260, minHeight: 260 }}>
            {mounted ? (
              <ResponsiveContainer>
                <BarChart data={runsBarData} layout="vertical" margin={{ top: 8, right: 18, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(231,237,246,0.08)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12, fill: 'rgba(231,237,246,0.7)' }} />
                  <YAxis
                    type="category"
                    dataKey="athlete"
                    width={120}
                    tick={{ fontSize: 12, fill: 'rgba(231,237,246,0.7)' }}
                  />
                  <Tooltip content={<ChartTooltip metricLabel="Runs" />} />
                  <Bar dataKey="runs" fill="rgba(34, 197, 94, 0.45)" stroke="rgba(34, 197, 94, 0.85)" />
                </BarChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <div>
              <div style={{ fontWeight: 650 }}>Highlights</div>
              <div className="muted">Notable stats (this {timeFilter})</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, gridAutoRows: '1fr' }}>
            <div className="card highlightCard" style={{ padding: 12 }}>
              <div className="muted">Longest run</div>
              <div className="highlightValue">
                {stats?.overall.longest ? `${fmtKm(stats.overall.longest.km)} km` : '—'}
              </div>
              <div className="highlightAthlete">
                {stats?.overall.longest?.athleteName ?? ''}
              </div>
            </div>
            <div className="card highlightCard" style={{ padding: 12 }}>
              <div className="muted">Most dedicated</div>
              <div className="highlightValue">
                {highlights.mostDedicated ? `${fmtKm(highlights.mostDedicated.avgKm)} km/run` : '—'}
              </div>
              <div className="highlightAthlete">
                {highlights.mostDedicated?.name ?? ''}
              </div>
            </div>
            <div className="card highlightCard" style={{ padding: 12 }}>
              <div className="muted">Most runs</div>
              <div className="highlightValue">
                {stats?.overall.mostRuns ? `${stats.overall.mostRuns.runs} runs` : '—'}
              </div>
              <div className="highlightAthlete">
                {stats?.overall.mostRuns?.athleteName ?? ''}
              </div>
            </div>
            <div className="card highlightCard" style={{ padding: 12 }}>
              <div className="muted">Average run</div>
              <div className="highlightValue">
                {fmtKm(highlights.avgRunKm)} km
              </div>
              <div className="highlightAthlete">per run</div>
            </div>
            <div className="card highlightCard" style={{ padding: 12 }}>
              <div className="muted">Active athletes</div>
              <div className="highlightValue">
                {highlights.activeAthletes}
              </div>
              <div className="highlightAthlete">runners</div>
            </div>
            <div className="card highlightCard" style={{ padding: 12 }}>
              <div className="muted">Busiest day</div>
              <div className="highlightValue">
                {highlights.busiestDay ? `${fmtKm(highlights.busiestDay.km)} km` : '—'}
              </div>
              <div className="highlightAthlete">
                {highlights.busiestDay?.day ?? ''}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: 12 }} />

      <div className="card" style={{ opacity: loading ? 0.7 : 1 }}>
        <div className="cardHeader">
          <div>
            <div style={{ fontWeight: 650 }}>Latest runs</div>
            <div className="muted">
              {latestRuns?.lastPoll
                ? `Last poll: ${timeAgo(latestRuns.lastPoll)}`
                : 'Recent activity from the club feed'}
            </div>
          </div>
          <div className="badge">{latestRuns?.runs.length ?? 0} recent</div>
        </div>

        <div className="latestRunsGrid">
          {latestRuns?.runs.map((run, idx) => (
            <div key={idx} className="latestRunItem">
              <div
                className="latestRunIcon"
                style={{ background: getAthleteEmojiBackground(run.athleteName) }}
              >
                {getAthleteEmoji(run.athleteName)}
              </div>
              <div className="latestRunInfo">
                <div style={{ fontWeight: 600 }}>{run.athleteName}</div>
                <div className="muted" style={{ fontSize: 12 }}>{run.activityName}</div>
              </div>
              <div className="latestRunStats">
                <div style={{ fontWeight: 600 }}>{fmtKm(run.km)} km</div>
                <div className="muted" style={{ fontSize: 12 }}>{timeAgo(run.fetchedAt)}</div>
              </div>
            </div>
          ))}
          {!loading && (!latestRuns?.runs || latestRuns.runs.length === 0) && (
            <div className="muted" style={{ padding: '20px 0' }}>No recent runs</div>
          )}
        </div>
      </div>

      <footer className="footer">
        <div className="footerContent">
          <div className="footerBrand">
            <span style={{ fontSize: 18 }}>🦈</span>
            <span>Bullshark Analytics</span>
          </div>
          <div className="footerLinks">
            <span className="muted">Powered by Bullsharks Server</span>
            <span className="footerDivider">·</span>
            <a className="muted" href="https://warp.dev/careers" target="_blank" rel="noreferrer">
              warp.dev/careers
            </a>
            <span className="footerDivider">·</span>
            <span className="muted">© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
