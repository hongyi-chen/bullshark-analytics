"use client";

import { useAtom } from "jotai";
import { activeTabState } from "@/lib/state/atoms";
import DashboardView from "../dashboard/DashboardView";
import TeamsView from "../team/TeamsView";
import TrainingView from "../training/TrainingView";
import InjuryInsightsView from "../injury-insights/InjuryInsightsView";
import WeeklyWinnersView from "../weekly-winners/WeeklyWinnersView";

type TabId = "dashboard" | "teams" | "training" | "injury" | "weekly-winners";

const TAB_LABELS: Record<TabId, string> = {
  dashboard: "Dashboard",
  teams: "Teams",
  training: "Training Volume",
  injury: "Injury Insights",
  "weekly-winners": "Weekly Winners",
};

function getViewComponent(tabId: TabId) {
  switch (tabId) {
    case "dashboard":
      return <DashboardView />;
    case "teams":
      return <TeamsView />;
    case "injury":
      return <InjuryInsightsView />;
    case "weekly-winners":
      return <WeeklyWinnersView />;
    case "training":
    default:
      return <TrainingView />;
  }
}

export default function MainContent() {
  const [activeTab] = useAtom(activeTabState);

  return (
    <main
      id="main-content"
      role="tabpanel"
      aria-labelledby={`tab-${activeTab}`}
      aria-label={TAB_LABELS[activeTab]}
      tabIndex={-1}
    >
      {getViewComponent(activeTab)}
    </main>
  );
}
