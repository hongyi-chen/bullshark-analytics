"use client";

import { useAtom } from "jotai";
import { activeTabState, TabId } from "@/lib/state/atoms";
import DashboardView from "../dashboard/DashboardView";
import TeamsView from "../team/TeamsView";
import TrainingView from "../training/TrainingView";
import InjuryInsightsView from "../injury-insights/InjuryInsightsView";
import WeeklyWinnersView from "../weekly-winners/WeeklyWinnersView";

const TAB_COMPONENTS: Record<TabId, React.ComponentType> = {
  dashboard: DashboardView,
  teams: TeamsView,
  training: TrainingView,
  injury: InjuryInsightsView,
  "weekly-winners": WeeklyWinnersView,
};

export default function MainContent() {
  const [activeTab] = useAtom(activeTabState);
  const Component = TAB_COMPONENTS[activeTab];

  return (
    <main id="main-content">
      <div
        id={`tabpanel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        tabIndex={0}
      >
        <Component />
      </div>
    </main>
  );
}
