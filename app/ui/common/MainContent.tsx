"use client";

import { useAtom } from "jotai";
import { activeTabState } from "@/lib/state/atoms";
import DashboardView from "../dashboard/DashboardView";
import TeamsView from "../team/TeamsView";
import TrainingView from "../training/TrainingView";
import InjuryInsightsView from "../injury-insights/InjuryInsightsView";
import WeeklyWinnersView from "../weekly-winners/WeeklyWinnersView";
import ErrorBoundary from "./ErrorBoundary";

function ViewContent({ activeTab }: { activeTab: string }) {
  if (activeTab === "dashboard") return <DashboardView />;
  if (activeTab === "teams") return <TeamsView />;
  if (activeTab === "injury") return <InjuryInsightsView />;
  if (activeTab === "weekly-winners") return <WeeklyWinnersView />;
  return <TrainingView />;
}

export default function MainContent() {
  const [activeTab] = useAtom(activeTabState);

  return (
    <ErrorBoundary key={activeTab}>
      <ViewContent activeTab={activeTab} />
    </ErrorBoundary>
  );
}
