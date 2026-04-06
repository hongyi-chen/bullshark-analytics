"use client";

import { useAtom } from "jotai";
import { activeTabState } from "@/lib/state/atoms";
import DashboardView from "../dashboard/DashboardView";
import TeamsView from "../team/TeamsView";
import TrainingView from "../training/TrainingView";
import InjuryInsightsView from "../injury-insights/InjuryInsightsView";
import WeeklyWinnersView from "../weekly-winners/WeeklyWinnersView";

const TAB_VIEWS = {
  dashboard: DashboardView,
  teams: TeamsView,
  training: TrainingView,
  injury: InjuryInsightsView,
  'weekly-winners': WeeklyWinnersView,
} as const;

export default function MainContent() {
  const [activeTab] = useAtom(activeTabState);

  const ViewComponent = TAB_VIEWS[activeTab];

  return (
    <main
      id="main-content"
      role="tabpanel"
      aria-labelledby={`tab-${activeTab}`}
      tabIndex={-1}
    >
      <ViewComponent />
    </main>
  );
}
