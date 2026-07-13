"use client";

import { useAtom } from "jotai";
import { activeTabState } from "@/lib/state/atoms";
import DashboardView from "../dashboard/DashboardView";
import TeamsView from "../team/TeamsView";
import TrainingView from "../training/TrainingView";
import InjuryInsightsView from "../injury-insights/InjuryInsightsView";
import WeeklyWinnersView from "../weekly-winners/WeeklyWinnersView";

type TabId = 'dashboard' | 'teams' | 'training' | 'injury' | 'weekly-winners';

const TAB_COMPONENTS: Record<TabId, React.ComponentType> = {
  dashboard: DashboardView,
  teams: TeamsView,
  training: TrainingView,
  injury: InjuryInsightsView,
  'weekly-winners': WeeklyWinnersView,
};

export default function MainContent() {
  const [activeTab] = useAtom(activeTabState);
  const ActiveComponent = TAB_COMPONENTS[activeTab];

  return (
    <main
      id={`tabpanel-${activeTab}`}
      role="tabpanel"
      aria-labelledby={`tab-${activeTab}`}
      tabIndex={0}
    >
      <ActiveComponent />
    </main>
  );
}
