import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Bullshark Analytics',
    template: '%s · Bullshark Analytics',
  },
  description: 'A lightweight Strava club dashboard that polls the club activities feed and serves a public leaderboard and charts.',
  applicationName: 'Bullshark Analytics',
  metadataBase: new URL('https://bullshark-analytics.vercel.app'),
  openGraph: {
    title: 'Bullshark Analytics',
    description:
      'A lightweight Strava club dashboard that polls the club activities feed and serves a public leaderboard and charts.',
    url: 'https://bullshark-analytics.vercel.app',
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
      <body>{children}</body>
    </html>
  );
}
