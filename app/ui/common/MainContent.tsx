"use client";

import dynamic from "next/dynamic";
import { useAtom } from "jotai";
import { activeTabState } from "@/lib/state/atoms";

const DashboardView = dynamic(() => import("../dashboard/DashboardView"), {
  loading: () => <ViewSkeleton />,
});
const TeamsView = dynamic(() => import("../team/TeamsView"), {
  loading: () => <ViewSkeleton />,
});
const TrainingView = dynamic(() => import("../training/TrainingView"), {
  loading: () => <ViewSkeleton />,
});
const InjuryInsightsView = dynamic(
  () => import("../injury-insights/InjuryInsightsView"),
  {
    loading: () => <ViewSkeleton />,
  }
);
const WeeklyWinnersView = dynamic(
  () => import("../weekly-winners/WeeklyWinnersView"),
  {
    loading: () => <ViewSkeleton />,
  }
);

function ViewSkeleton() {
  return (
    <div
      style={{
        minHeight: 400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--muted)",
      }}
      role="status"
      aria-label="Loading view"
    >
      <span>Loading...</span>
    </div>
  );
}

export default function MainContent() {
  const [activeTab] = useAtom(activeTabState);

  if (activeTab === "dashboard") return <DashboardView />;
  if (activeTab === "teams") return <TeamsView />;
  if (activeTab === "injury") return <InjuryInsightsView />;
  if (activeTab === "weekly-winners") return <WeeklyWinnersView />;
  return <TrainingView />;
}
