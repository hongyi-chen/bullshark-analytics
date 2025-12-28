"use client";

import { useAtom } from "jotai";
import { activeTabState } from "@/lib/state/atoms";
import DashboardView from "./DashboardView";
import TeamsView from "./TeamsView";
import TrainingView from "./TrainingView";

export default function MainContent() {
  const [activeTab] = useAtom(activeTabState);

  if (activeTab === "dashboard") return <DashboardView />;
  if (activeTab === "teams") return <TeamsView />;
  return <TrainingView />;
}
