"use client";

import { useAtom } from "jotai";
import { activeTabState } from "@/lib/state/atoms";
import DashboardView from "../dashboard/DashboardView";
import TeamsView from "../team/TeamsView";
import TrainingView from "../training/TrainingView";
import InjuryInsightsView from "../injury-insights/InjuryInsightsView";
import WeeklyWinnersView from "../weekly-winners/WeeklyWinnersView";

const TAB_CONTENT: Record<string, React.ComponentType> = {
  dashboard: DashboardView,
  teams: TeamsView,
  training: TrainingView,
  injury: InjuryInsightsView,
  'weekly-winners': WeeklyWinnersView,
};

export default function MainContent() {
  const [activeTab] = useAtom(activeTabState);
  const Content = TAB_CONTENT[activeTab] ?? TrainingView;

  return (
    <div
      id={`tabpanel-${activeTab}`}
      role="tabpanel"
      aria-labelledby={`tab-${activeTab}`}
      tabIndex={0}
    >
      <Content />
    </div>
  );
}
