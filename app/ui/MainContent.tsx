"use client";

import { useAtom } from "jotai";
import { activeTabState } from "@/lib/state/atoms";
import DashboardView from "./DashboardView";
import TeamsView from "./TeamsView";

export default function MainContent() {
  const [activeTab] = useAtom(activeTabState);
  return activeTab === "dashboard" ? <DashboardView /> : <TeamsView />;
}
