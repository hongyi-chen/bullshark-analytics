"use client";

import { useAtom } from "jotai";
import { useEffect, useRef } from "react";
import { activeTabState } from "@/lib/state/atoms";
import DashboardView from "../dashboard/DashboardView";
import TeamsView from "../team/TeamsView";
import TrainingView from "../training/TrainingView";
import InjuryInsightsView from "../injury-insights/InjuryInsightsView";
import WeeklyWinnersView from "../weekly-winners/WeeklyWinnersView";

const TAB_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  teams: 'Teams',
  training: 'Training Volume',
  injury: 'Injury Insights',
  'weekly-winners': 'Weekly Winners',
};

export default function MainContent() {
  const [activeTab] = useAtom(activeTabState);
  const mainRef = useRef<HTMLElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    mainRef.current?.focus();
  }, [activeTab]);

  const renderContent = () => {
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
  };

  return (
    <main 
      id="main-content" 
      ref={mainRef}
      tabIndex={-1}
      aria-label={TAB_TITLES[activeTab] || 'Main content'}
      style={{ outline: 'none' }}
    >
      {renderContent()}
    </main>
  );
}
