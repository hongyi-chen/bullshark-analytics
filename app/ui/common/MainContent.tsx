"use client";

import { useAtom } from "jotai";
import { activeTabState } from "@/lib/state/atoms";
import DashboardView from "../dashboard/DashboardView";
import TeamsView from "../team/TeamsView";
import TrainingView from "../training/TrainingView";
import InjuryInsightsView from "../injury-insights/InjuryInsightsView";
import WeeklyWinnersView from "../weekly-winners/WeeklyWinnersView";

type TabId = 'dashboard' | 'teams' | 'training' | 'injury' | 'weekly-winners';

interface TabPanelConfig {
  id: TabId;
  panelId: string;
  tabId: string;
  label: string;
  Component: React.ComponentType;
}

const TAB_PANELS: TabPanelConfig[] = [
  { id: 'dashboard', panelId: 'tabpanel-dashboard', tabId: 'tab-dashboard', label: 'Dashboard', Component: DashboardView },
  { id: 'teams', panelId: 'tabpanel-teams', tabId: 'tab-teams', label: 'Teams', Component: TeamsView },
  { id: 'training', panelId: 'tabpanel-training', tabId: 'tab-training', label: 'Training Volume', Component: TrainingView },
  { id: 'injury', panelId: 'tabpanel-injury', tabId: 'tab-injury', label: 'Injury Insights', Component: InjuryInsightsView },
  { id: 'weekly-winners', panelId: 'tabpanel-weekly-winners', tabId: 'tab-weekly-winners', label: 'Weekly Winners', Component: WeeklyWinnersView },
];

export default function MainContent() {
  const [activeTab] = useAtom(activeTabState);

  return (
    <>
      {TAB_PANELS.map(({ id, panelId, tabId, label, Component }) => {
        const isActive = activeTab === id;
        return (
          <div
            key={id}
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId}
            aria-label={label}
            hidden={!isActive}
            tabIndex={isActive ? 0 : -1}
          >
            {isActive && <Component />}
          </div>
        );
      })}
    </>
  );
}
