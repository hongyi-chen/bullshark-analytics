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
  id: string;
  tabId: string;
  isActive: boolean;
  children: React.ReactNode;
}

function TabPanel({ id, tabId, isActive, children }: TabPanelProps) {
  return (
    <div
      id={id}
      role="tabpanel"
      aria-labelledby={tabId}
      hidden={!isActive}
      tabIndex={isActive ? 0 : -1}
    >
      {isActive && children}
    </div>
  );
}

export default function MainContent() {
  const [activeTab] = useAtom(activeTabState);

  return (
    <>
      <TabPanel id="panel-dashboard" tabId="tab-dashboard" isActive={activeTab === "dashboard"}>
        <DashboardView />
      </TabPanel>
      <TabPanel id="panel-teams" tabId="tab-teams" isActive={activeTab === "teams"}>
        <TeamsView />
      </TabPanel>
      <TabPanel id="panel-training" tabId="tab-training" isActive={activeTab === "training"}>
        <TrainingView />
      </TabPanel>
      <TabPanel id="panel-injury" tabId="tab-injury" isActive={activeTab === "injury"}>
        <InjuryInsightsView />
      </TabPanel>
      <TabPanel id="panel-weekly-winners" tabId="tab-weekly-winners" isActive={activeTab === "weekly-winners"}>
        <WeeklyWinnersView />
      </TabPanel>
    </>
  );
}
