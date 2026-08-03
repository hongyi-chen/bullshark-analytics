"use client";

import { useAtom } from "jotai";
import { activeTabState } from "@/lib/state/atoms";
import DashboardView from "../dashboard/DashboardView";
import TeamsView from "../team/TeamsView";
import TrainingView from "../training/TrainingView";
import InjuryInsightsView from "../injury-insights/InjuryInsightsView";
import WeeklyWinnersView from "../weekly-winners/WeeklyWinnersView";

export default function MainContent() {
  const [activeTab] = useAtom(activeTabState);

  const getActiveTabId = () => {
    switch (activeTab) {
      case "dashboard": return "tab-dashboard";
      case "teams": return "tab-teams";
      case "training": return "tab-training";
      case "injury": return "tab-injury";
      case "weekly-winners": return "tab-weekly-winners";
      default: return "tab-training";
    }
  };

  const renderContent = () => {
    if (activeTab === "dashboard") return <DashboardView />;
    if (activeTab === "teams") return <TeamsView />;
    if (activeTab === "injury") return <InjuryInsightsView />;
    if (activeTab === "weekly-winners") return <WeeklyWinnersView />;
    return <TrainingView />;
  };

  return (
    <div
      id="main-content"
      role="tabpanel"
      aria-labelledby={getActiveTabId()}
    >
      {renderContent()}
    </div>
  );
}
