'use client';

import { useEffect, useMemo, useState } from 'react';
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

type TimeseriesPoint = {
  day: string;
  athleteName: string;
  km: number;
};

type TimeseriesResponse = {
  ok: boolean;
  days: number;
  since: string;
  points: TimeseriesPoint[];
};

type AthleteStats = {
  athleteName: string;
  runs: number;
  totalKm: number;
  longestKm: number;
  shortestKm: number;
};

type ClubStatsResponse = {
  ok: boolean;
  days: number;
  since: string;
  lastFetchedAt: string | null;
  overall: {
    totalRuns: number;
    totalKm: number;
    longest: { athleteName: string; km: number } | null;
    shortest: { athleteName: string; km: number } | null;
    mostRuns: { athleteName: string; runs: number } | null;
  };
  athletes: AthleteStats[];
};

function fmtKm(km: number): string {
  if (!Number.isFinite(km)) return '0';
  return km >= 100 ? km.toFixed(0) : km.toFixed(1);
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
  const [days, setDays] = useState<number>(30);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string | null>(null);

  const [timeseries, setTimeseries] = useState<TimeseriesResponse | null>(null);
  const [stats, setStats] = useState<ClubStatsResponse | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr(null);

      try {
        const [tsRes, statsRes] = await Promise.all([
          fetch(`/api/club/timeseries?days=${days}`),
          fetch(`/api/club/stats?days=${days}`),
        ]);

        const ts = (await tsRes.json()) as TimeseriesResponse;
        const st = (await statsRes.json()) as ClubStatsResponse;

        if (!ts.ok) throw new Error('Failed to load timeseries');
        if (!st.ok) throw new Error('Failed to load club stats');

        if (!cancelled) {
          setTimeseries(ts);
          setStats(st);
        }
      } catch (e: any) {
        if (!cancelled) setErr(e?.message ?? String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [days]);

  const chartData = useMemo(() => {
    const pts = timeseries?.points ?? [];
    const byDay = new Map<string, number>();

    for (const p of pts) {
      byDay.set(p.day, (byDay.get(p.day) ?? 0) + p.km);
    }

    return Array.from(byDay.entries())
      .map(([day, km]) => ({ day, km }))
      .sort((a, b) => (a.day < b.day ? -1 : a.day > b.day ? 1 : 0));
  }, [timeseries]);

  const topAthletes = useMemo(() => {
    return (stats?.athletes ?? []).slice(0, 12);
  }, [stats]);

  const runsBarData = useMemo(() => {
    return (stats?.athletes ?? [])
      .slice(0, 10)
      .map((a) => ({ athlete: a.athleteName, runs: a.runs }))
      .reverse();
  }, [stats]);

  const lastUpdatedText = useMemo(() => {
    if (!stats?.lastFetchedAt) return 'No data yet';
    return `Last updated: ${new Date(stats.lastFetchedAt).toLocaleString()}`;
  }, [stats]);

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div>
          <h1 className="h1">Bullshark Analytics 🦈</h1>
          <div className="muted">{lastUpdatedText}</div>
        </div>
        <div className="badge">Public club dashboard</div>
      </div>

      <div style={{ height: 12 }} />

      <div className="pillRow" aria-label="Time range">
        {[7, 30, 90].map((d) => (
          <button
            key={d}
            className="pill"
            aria-pressed={days === d}
            onClick={() => setDays(d)}
            type="button"
          >
            Last {d} days
          </button>
        ))}
      </div>

      <div style={{ height: 12 }} />

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
        <div className="card">
          <div className="cardHeader">
            <div>
              <div style={{ fontWeight: 650 }}>Club km per day</div>
              <div className="muted">Total distance seen per day (last {days} days)</div>
            </div>
            <div className="badge">Total: {fmtKm(stats?.overall.totalKm ?? 0)} km</div>
          </div>

          <div style={{ width: '100%', height: 320, minHeight: 320 }}>
            {mounted ? (
              <ResponsiveContainer>
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 12 }}>
            <div className="card" style={{ padding: 12 }}>
              <div className="muted">Longest run</div>
              <div style={{ fontWeight: 650, marginTop: 6 }}>
                {stats?.overall.longest ? `${stats.overall.longest.athleteName} · ${fmtKm(stats.overall.longest.km)} km` : '—'}
              </div>
            </div>
            <div className="card" style={{ padding: 12 }}>
              <div className="muted">Shortest run</div>
              <div style={{ fontWeight: 650, marginTop: 6 }}>
                {stats?.overall.shortest ? `${stats.overall.shortest.athleteName} · ${fmtKm(stats.overall.shortest.km)} km` : '—'}
              </div>
            </div>
            <div className="card" style={{ padding: 12 }}>
              <div className="muted">Most runs</div>
              <div style={{ fontWeight: 650, marginTop: 6 }}>
                {stats?.overall.mostRuns ? `${stats.overall.mostRuns.athleteName} · ${stats.overall.mostRuns.runs} runs` : '—'}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <div>
              <div style={{ fontWeight: 650 }}>Top athletes</div>
              <div className="muted">By total distance (last {days} days)</div>
            </div>
            <div className="badge">Runs: {stats?.overall.totalRuns ?? 0}</div>
          </div>

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
              {topAthletes.map((r, idx) => (
                <tr key={`${r.athleteName}-${idx}`}>
                  <td className="muted">{idx + 1}</td>
                  <td>{r.athleteName}</td>
                  <td style={{ textAlign: 'right' }}>{r.runs}</td>
                  <td style={{ textAlign: 'right' }}>{fmtKm(r.totalKm)}</td>
                </tr>
              ))}
              {!loading && topAthletes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="muted">
                    No data yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>

          <div style={{ height: 12 }} />

          <div className="cardHeader" style={{ marginBottom: 6 }}>
            <div>
              <div style={{ fontWeight: 650 }}>Runs per athlete</div>
              <div className="muted">Top 10 by run count (last {days} days)</div>
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
      </div>

      <div style={{ height: 14 }} />

      <div className="muted">
        API:
        {' '}
        <a href={`/api/club/stats?days=${days}`}>/api/club/stats</a>
        {' · '}
        <a href={`/api/club/timeseries?days=${days}`}>/api/club/timeseries</a>
      </div>
    </div>
  );
}
