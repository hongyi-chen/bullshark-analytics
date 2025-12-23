import DashboardClient from './dashboard/ui/DashboardClient';

// Force dynamic rendering to ensure fresh data on each request
// since the dashboard displays real-time activity data
export const dynamic = 'force-dynamic';

export default function HomePage() {
  return <DashboardClient />;
}
