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

  const content = (() => {
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
  })();

  return (
    <main
      id="main-content"
      role="tabpanel"
      aria-labelledby={`tab-${activeTab}`}
      tabIndex={-1}
    >
      {content}
    </main>
  );
}
