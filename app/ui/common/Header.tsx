"use client";

import { useAtom } from "jotai";
import { useCallback, useRef, KeyboardEvent } from "react";
import { activeTabState, lastUpdatedTextState, TabId } from "@/lib/state/atoms";
import css from "./Header.module.scss";

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
  const tabRefs = useRef<Map<TabId, HTMLButtonElement | null>>(new Map());

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, currentTab: TabId) => {
      const currentIndex = TAB_IDS.indexOf(currentTab);
      let newIndex = currentIndex;

      switch (event.key) {
        case "ArrowLeft":
          newIndex = currentIndex === 0 ? TAB_IDS.length - 1 : currentIndex - 1;
          break;
        case "ArrowRight":
          newIndex = currentIndex === TAB_IDS.length - 1 ? 0 : currentIndex + 1;
          break;
        case "Home":
          newIndex = 0;
          break;
        case "End":
          newIndex = TAB_IDS.length - 1;
          break;
        default:
          return;
      }

      event.preventDefault();
      const newTab = TAB_IDS[newIndex];
      setActiveTab(newTab);
      tabRefs.current.get(newTab)?.focus();
    },
    [setActiveTab]
  );

  return (
    <header className={css.header}>
      <div className={css.main}>
        <h1 className={css.h1}>
          Bullshark Analytics <span aria-hidden="true">🦈</span>
        </h1>
        <div className={css.subtitleContainer}>
          <p className={css.subtitle}>{lastUpdatedText}</p>
        </div>
      </div>
      <nav className={css.actions} aria-label="Primary">
        <div className={css.navGroup} role="tablist" aria-label="Views">
          {TAB_IDS.map((tabId) => (
            <button
              key={tabId}
              ref={(el) => { tabRefs.current.set(tabId, el); }}
              id={`tab-${tabId}`}
              className={`${css.navPill} ${activeTab === tabId ? css.navPillActive : ""}`}
              onClick={() => setActiveTab(tabId)}
              onKeyDown={(e) => handleKeyDown(e, tabId)}
              role="tab"
              type="button"
              aria-selected={activeTab === tabId}
              aria-controls={`tabpanel-${tabId}`}
              tabIndex={activeTab === tabId ? 0 : -1}
            >
              {TAB_LABELS[tabId]}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}
