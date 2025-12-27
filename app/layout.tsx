import type { Metadata } from 'next';
import './globals.css';
import JotaiProvider from '@/lib/providers/JotaiProvider';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

function getMetadataBase(): URL | undefined {
  const raw = process.env.APP_BASE_URL;
  if (!raw) return undefined;
  try {
    return new URL(raw);
  } catch {
    // Avoid crashing metadata generation if env is misconfigured.
    return undefined;
  }
}

const DESCRIPTION =
  'A lightweight Strava club dashboard that polls the club activities feed and serves a public leaderboard and charts.';

export const metadata: Metadata = {
  title: {
    default: 'Bullshark Analytics',
    template: '%s · Bullshark Analytics',
  },
  description: DESCRIPTION,
  applicationName: 'Bullshark Analytics',
  metadataBase: getMetadataBase(),
  openGraph: {
    title: 'Bullshark Analytics',
    description: DESCRIPTION,
    url: process.env.APP_BASE_URL,
    siteName: 'Bullshark Analytics',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <JotaiProvider>{children}</JotaiProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
