"use client";

import { useCallback, useRef } from "react";
import { useAtom } from "jotai";
import { activeTabState, lastUpdatedTextState } from "@/lib/state/atoms";
import css from "./Header.module.scss";

type TabKey = "dashboard" | "teams" | "training" | "injury" | "weekly-winners";

const TAB_ORDER: TabKey[] = ["dashboard", "teams", "training", "injury", "weekly-winners"];

const TAB_LABELS: Record<TabKey, string> = {
  dashboard: "Dashboard",
  teams: "Teams",
  training: "Training Volume",
  injury: "Injury Insights (Beta)",
  "weekly-winners": "Weekly Winners",
};

export default function Header() {
  const [activeTab, setActiveTab] = useAtom(activeTabState);
  const [lastUpdatedText] = useAtom(lastUpdatedTextState);
  const tabRefs = useRef<Map<TabKey, HTMLButtonElement | null>>(new Map());

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, currentTab: TabKey) => {
      const currentIndex = TAB_ORDER.indexOf(currentTab);
      let nextIndex: number | null = null;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          nextIndex = (currentIndex + 1) % TAB_ORDER.length;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          nextIndex = (currentIndex - 1 + TAB_ORDER.length) % TAB_ORDER.length;
          break;
        case "Home":
          e.preventDefault();
          nextIndex = 0;
          break;
        case "End":
          e.preventDefault();
          nextIndex = TAB_ORDER.length - 1;
          break;
      }

      if (nextIndex !== null) {
        const nextTab = TAB_ORDER[nextIndex];
        setActiveTab(nextTab);
        tabRefs.current.get(nextTab)?.focus();
      }
    },
    [setActiveTab]
  );

  const setTabRef = useCallback((tab: TabKey, el: HTMLButtonElement | null) => {
    tabRefs.current.set(tab, el);
  }, []);

  return (
    <header className={css.header}>
      <div className={css.main}>
        <h1 className={css.h1}>Bullshark Analytics 🦈</h1>
        <div className={css.subtitleContainer}>
          <p className={css.subtitle}>{lastUpdatedText}</p>
        </div>
      </div>
      <nav className={css.actions} aria-label="Main navigation">
        <div className={css.navGroup} role="tablist" aria-label="Dashboard views">
          {TAB_ORDER.map((tab) => (
            <button
              key={tab}
              ref={(el) => setTabRef(tab, el)}
              id={`tab-${tab}`}
              className={`${css.navPill} ${activeTab === tab ? css.navPillActive : ""}`}
              aria-selected={activeTab === tab}
              aria-controls="tabpanel-main"
              onClick={() => setActiveTab(tab)}
              onKeyDown={(e) => handleKeyDown(e, tab)}
              role="tab"
              tabIndex={activeTab === tab ? 0 : -1}
              type="button"
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}
