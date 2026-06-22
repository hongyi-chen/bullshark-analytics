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

  const renderContent = () => {
    switch (activeTab) {
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
  };

  return (
    <main
      id="tabpanel-main"
      role="tabpanel"
      aria-labelledby={`tab-${activeTab}`}
      tabIndex={0}
    >
      {renderContent()}
    </main>
  );
}
