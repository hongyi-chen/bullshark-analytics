"use client";

import dynamic from "next/dynamic";
import { useAtom } from "jotai";
import { activeTabState } from "@/lib/state/atoms";
import ErrorBoundary from "./ErrorBoundary";

const DashboardView = dynamic(() => import("../dashboard/DashboardView"), {
  loading: () => <ViewLoadingFallback />,
});

const TeamsView = dynamic(() => import("../team/TeamsView"), {
  loading: () => <ViewLoadingFallback />,
});

const TrainingView = dynamic(() => import("../training/TrainingView"), {
  loading: () => <ViewLoadingFallback />,
});

const InjuryInsightsView = dynamic(() => import("../injury-insights/InjuryInsightsView"), {
  loading: () => <ViewLoadingFallback />,
});

const WeeklyWinnersView = dynamic(() => import("../weekly-winners/WeeklyWinnersView"), {
  loading: () => <ViewLoadingFallback />,
});

function ViewLoadingFallback() {
  return (
    <div 
      style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "200px",
        color: "var(--muted)",
      }}
      role="status"
      aria-label="Loading content"
    >
      Loading...
    </div>
  );
}

export default function MainContent() {
  const [activeTab] = useAtom(activeTabState);

  const renderActiveTab = () => {
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
    <ErrorBoundary>
      <div id={`tabpanel-${activeTab}`} role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
        {renderActiveTab()}
      </div>
    </ErrorBoundary>
  );
}
