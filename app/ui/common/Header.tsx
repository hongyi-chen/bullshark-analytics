"use client";

import { useAtom } from "jotai";
import { useCallback, KeyboardEvent } from "react";
import { activeTabState, lastUpdatedTextState, TabType } from "@/lib/state/atoms";
import css from "./Header.module.scss";

const TAB_ORDER: TabType[] = ["dashboard", "teams", "training", "injury", "weekly-winners"];

const TAB_LABELS: Record<TabType, string> = {
  dashboard: "Dashboard",
  teams: "Teams",
  training: "Training Volume",
  injury: "Injury Insights (Beta)",
  "weekly-winners": "Weekly Winners",
};

const TAB_PANEL_IDS: Record<TabType, string> = {
  dashboard: "tabpanel-dashboard",
  teams: "tabpanel-teams",
  training: "tabpanel-training",
  injury: "tabpanel-injury",
  "weekly-winners": "tabpanel-weekly-winners",
};

export default function Header() {
  const [activeTab, setActiveTab] = useAtom(activeTabState);
  const [lastUpdatedText] = useAtom(lastUpdatedTextState);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      const currentIndex = TAB_ORDER.indexOf(activeTab);
      let newIndex = currentIndex;

      switch (e.key) {
        case "ArrowRight":
          newIndex = (currentIndex + 1) % TAB_ORDER.length;
          break;
        case "ArrowLeft":
          newIndex = (currentIndex - 1 + TAB_ORDER.length) % TAB_ORDER.length;
          break;
        case "Home":
          newIndex = 0;
          break;
        case "End":
          newIndex = TAB_ORDER.length - 1;
          break;
        default:
          return;
      }

      e.preventDefault();
      setActiveTab(TAB_ORDER[newIndex]);
      const nextButton = document.getElementById(`tab-${TAB_ORDER[newIndex]}`);
      nextButton?.focus();
    },
    [activeTab, setActiveTab]
  );

  return (
    <header className={css.header}>
      <div className={css.main}>
        <h1 className={css.h1}>
          Bullshark Analytics <span aria-hidden="true">🦈</span>
        </h1>
        <div className={css.subtitleContainer}>
          <p className={css.subtitle} aria-live="polite">
            {lastUpdatedText}
          </p>
        </div>
      </div>
      <nav className={css.actions} aria-label="Primary">
        <div className={css.navGroup} role="tablist" aria-label="Views">
          {TAB_ORDER.map((tab) => (
            <button
              key={tab}
              id={`tab-${tab}`}
              className={`${css.navPill} ${activeTab === tab ? css.navPillActive : ""}`}
              aria-selected={activeTab === tab}
              aria-controls={TAB_PANEL_IDS[tab]}
              onClick={() => setActiveTab(tab)}
              onKeyDown={handleKeyDown}
              role="tab"
              type="button"
              tabIndex={activeTab === tab ? 0 : -1}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}
