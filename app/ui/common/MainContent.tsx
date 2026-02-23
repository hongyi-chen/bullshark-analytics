"use client";

import { lazy, Suspense } from "react";
import { useAtomValue } from "jotai";
import { activeTabState } from "@/lib/state/atoms";

const DashboardView = lazy(() => import("../dashboard/DashboardView"));
const TeamsView = lazy(() => import("../team/TeamsView"));
const TrainingView = lazy(() => import("../training/TrainingView"));
const InjuryInsightsView = lazy(() => import("../injury-insights/InjuryInsightsView"));
const WeeklyWinnersView = lazy(() => import("../weekly-winners/WeeklyWinnersView"));

function LoadingFallback() {
  return (
    <div className="loading-fallback" role="status" aria-live="polite">
      <span className="visually-hidden">Loading view...</span>
    </div>
  );
}

export default function MainContent() {
  const activeTab = useAtomValue(activeTabState);

  const renderView = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardView />;
      case "teams":
        return <TeamsView />;
      case "injury":
        return <InjuryInsightsView />;
      case "weekly-winners":
        return <WeeklyWinnersView />;
      default:
        return <TrainingView />;
    }
  };

  return (
    <main id="main-content" role="main" aria-label="Main content">
      <Suspense fallback={<LoadingFallback />}>
        {renderView()}
      </Suspense>
    </main>
  );
}
