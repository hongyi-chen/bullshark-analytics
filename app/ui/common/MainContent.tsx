"use client";

import { useAtom } from "jotai";
import { activeTabState } from "@/lib/state/atoms";
import DashboardView from "../dashboard/DashboardView";
import TeamsView from "../team/TeamsView";
import TrainingView from "../training/TrainingView";
import InjuryInsightsView from "../injury-insights/InjuryInsightsView";
import WeeklyWinnersView from "../weekly-winners/WeeklyWinnersView";

type TabId = 'dashboard' | 'teams' | 'training' | 'injury' | 'weekly-winners';

const TAB_CONTENT: Record<TabId, { Component: React.ComponentType; label: string }> = {
  dashboard: { Component: DashboardView, label: 'Dashboard' },
  teams: { Component: TeamsView, label: 'Teams' },
  training: { Component: TrainingView, label: 'Training Volume' },
  injury: { Component: InjuryInsightsView, label: 'Injury Insights' },
  'weekly-winners': { Component: WeeklyWinnersView, label: 'Weekly Winners' },
};

export default function MainContent() {
  const [activeTab] = useAtom(activeTabState);
  const { Component, label } = TAB_CONTENT[activeTab];

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${activeTab}`}
      aria-labelledby={`tab-${activeTab}`}
      aria-label={`${label} panel`}
    >
      <Component />
    </div>
  );
}
