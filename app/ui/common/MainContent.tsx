"use client";

import { useAtom } from "jotai";
import { activeTabState } from "@/lib/state/atoms";
import DashboardView from "../dashboard/DashboardView";
import TeamsView from "../team/TeamsView";
import TrainingView from "../training/TrainingView";
import InjuryInsightsView from "../injury-insights/InjuryInsightsView";
import WeeklyWinnersView from "../weekly-winners/WeeklyWinnersView";

type TabId = 'dashboard' | 'teams' | 'training' | 'injury' | 'weekly-winners';

interface TabPanelProps {
  id: TabId;
  activeTab: TabId;
  children: React.ReactNode;
}

function TabPanel({ id, activeTab, children }: TabPanelProps) {
  const isActive = activeTab === id;
  
  if (!isActive) return null;
  
  return (
    <main
      role="tabpanel"
      id={`tabpanel-${id}`}
      aria-labelledby={`tab-${id}`}
      tabIndex={0}
    >
      {children}
    </main>
  );
}

export default function MainContent() {
  const [activeTab] = useAtom(activeTabState);

  return (
    <>
      <TabPanel id="dashboard" activeTab={activeTab}>
        <DashboardView />
      </TabPanel>
      <TabPanel id="teams" activeTab={activeTab}>
        <TeamsView />
      </TabPanel>
      <TabPanel id="training" activeTab={activeTab}>
        <TrainingView />
      </TabPanel>
      <TabPanel id="injury" activeTab={activeTab}>
        <InjuryInsightsView />
      </TabPanel>
      <TabPanel id="weekly-winners" activeTab={activeTab}>
        <WeeklyWinnersView />
      </TabPanel>
    </>
  );
}
