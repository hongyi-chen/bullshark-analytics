"use client";

import { useAtom } from "jotai";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { activeTabState } from "@/lib/state/atoms";
import ErrorBoundary from "./ErrorBoundary";
import css from "./MainContent.module.scss";

const DashboardView = dynamic(() => import("../dashboard/DashboardView"), {
  loading: () => <ViewSkeleton />,
});

const TeamsView = dynamic(() => import("../team/TeamsView"), {
  loading: () => <ViewSkeleton />,
});

const TrainingView = dynamic(() => import("../training/TrainingView"), {
  loading: () => <ViewSkeleton />,
});

const InjuryInsightsView = dynamic(() => import("../injury-insights/InjuryInsightsView"), {
  loading: () => <ViewSkeleton />,
});

const WeeklyWinnersView = dynamic(() => import("../weekly-winners/WeeklyWinnersView"), {
  loading: () => <ViewSkeleton />,
});

function ViewSkeleton() {
  return (
    <div className={css.skeleton} aria-busy="true" aria-label="Loading view">
      <div className={css.skeletonCard} />
      <div className={css.skeletonCard} />
    </div>
  );
}

function getViewComponent(activeTab: string) {
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
}

export default function MainContent() {
  const [activeTab] = useAtom(activeTabState);

  return (
    <ErrorBoundary>
      <Suspense fallback={<ViewSkeleton />}>
        {getViewComponent(activeTab)}
      </Suspense>
    </ErrorBoundary>
  );
}
