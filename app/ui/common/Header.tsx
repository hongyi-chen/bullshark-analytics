"use client";

import { useAtom } from "jotai";
import { useCallback, useRef, KeyboardEvent } from "react";
import { activeTabState, lastUpdatedTextState } from "@/lib/state/atoms";
import css from "./Header.module.scss";

type TabId = "dashboard" | "teams" | "training" | "injury" | "weekly-winners";

const TAB_IDS: TabId[] = ["dashboard", "teams", "training", "injury", "weekly-winners"];
const TAB_LABELS: Record<TabId, string> = {
  dashboard: "Dashboard",
  teams: "Teams",
  training: "Training Volume",
  injury: "Injury Insights (Beta)",
  "weekly-winners": "Weekly Winners",
};

export default function Header() {
  const [activeTab, setActiveTab] = useAtom(activeTabState);
  const [lastUpdatedText] = useAtom(lastUpdatedTextState);
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({
    dashboard: null,
    teams: null,
    training: null,
    injury: null,
    "weekly-winners": null,
  });

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      const currentIndex = TAB_IDS.indexOf(activeTab);
      let newIndex = currentIndex;

      switch (event.key) {
        case "ArrowRight":
          newIndex = (currentIndex + 1) % TAB_IDS.length;
          event.preventDefault();
          break;
        case "ArrowLeft":
          newIndex = (currentIndex - 1 + TAB_IDS.length) % TAB_IDS.length;
          event.preventDefault();
          break;
        case "Home":
          newIndex = 0;
          event.preventDefault();
          break;
        case "End":
          newIndex = TAB_IDS.length - 1;
          event.preventDefault();
          break;
        default:
          return;
      }

      const newTabId = TAB_IDS[newIndex];
      setActiveTab(newTabId);
      tabRefs.current[newTabId]?.focus();
    },
    [activeTab, setActiveTab]
  );

  return (
    <header className={css.header}>
      <div className={css.main}>
        <h1 className={css.h1}>Bullshark Analytics 🦈</h1>
        <div className={css.subtitleContainer}>
          <p className={css.subtitle} aria-live="polite">{lastUpdatedText}</p>
        </div>
      </div>
      <nav className={css.actions} aria-label="Main navigation">
        <div className={css.navGroup} role="tablist" aria-label="Dashboard views">
          {TAB_IDS.map((tabId) => {
            const isSelected = activeTab === tabId;
            return (
              <button
                key={tabId}
                ref={(el) => { tabRefs.current[tabId] = el; }}
                className={`${css.navPill} ${isSelected ? css.navPillActive : ""}`}
                onClick={() => setActiveTab(tabId)}
                onKeyDown={handleKeyDown}
                role="tab"
                type="button"
                id={`tab-${tabId}`}
                aria-selected={isSelected}
                aria-controls="main-content"
                tabIndex={isSelected ? 0 : -1}
              >
                {TAB_LABELS[tabId]}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
