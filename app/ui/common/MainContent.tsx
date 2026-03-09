"use client";

import dynamic from "next/dynamic";
import { useAtom } from "jotai";
import { activeTabState } from "@/lib/state/atoms";

const DashboardView = dynamic(() => import("../dashboard/DashboardView"));
const TeamsView = dynamic(() => import("../team/TeamsView"));
const TrainingView = dynamic(() => import("../training/TrainingView"));
const InjuryInsightsView = dynamic(() => import("../injury-insights/InjuryInsightsView"));
const WeeklyWinnersView = dynamic(() => import("../weekly-winners/WeeklyWinnersView"));

export default function MainContent() {
  const [activeTab] = useAtom(activeTabState);

  let content;
  if (activeTab === "dashboard") content = <DashboardView />;
  else if (activeTab === "teams") content = <TeamsView />;
  else if (activeTab === "injury") content = <InjuryInsightsView />;
  else if (activeTab === "weekly-winners") content = <WeeklyWinnersView />;
  else content = <TrainingView />;

  return (
    <main id="main-content" role="main">
      {content}
    </main>
  );
}
