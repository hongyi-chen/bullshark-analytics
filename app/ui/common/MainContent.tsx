"use client";

import { useAtom } from "jotai";
import { activeTabState } from "@/lib/state/atoms";
import DashboardView from "../dashboard/DashboardView";
import TeamsView from "../team/TeamsView";
import TrainingView from "../training/TrainingView";
import InjuryInsightsView from "../injury-insights/InjuryInsightsView";
import WeeklyWinnersView from "../weekly-winners/WeeklyWinnersView";

type TabId = 'dashboard' | 'teams' | 'training' | 'injury' | 'weekly-winners';

const TAB_CONTENT: Record<TabId, { component: React.ComponentType; label: string }> = {
  dashboard: { component: DashboardView, label: 'Dashboard panel' },
  teams: { component: TeamsView, label: 'Teams panel' },
  training: { component: TrainingView, label: 'Training Volume panel' },
  injury: { component: InjuryInsightsView, label: 'Injury Insights panel' },
  'weekly-winners': { component: WeeklyWinnersView, label: 'Weekly Winners panel' },
};

export default function MainContent() {
  const [activeTab] = useAtom(activeTabState);

  const { component: ActiveComponent, label } = TAB_CONTENT[activeTab];

  return (
    <div
      role="tabpanel"
      id={`panel-${activeTab}`}
      aria-labelledby={`tab-${activeTab}`}
      aria-label={label}
      tabIndex={0}
    >
      <ActiveComponent />
    </div>
  );
}
