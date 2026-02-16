"use client";

import { useAtom } from "jotai";
import { useCallback, useRef, KeyboardEvent } from "react";
import { activeTabState, lastUpdatedTextState } from "@/lib/state/atoms";
import css from "./Header.module.scss";

type TabId = 'dashboard' | 'teams' | 'training' | 'injury' | 'weekly-winners';

const TAB_ORDER: TabId[] = ['dashboard', 'teams', 'training', 'injury', 'weekly-winners'];

const TAB_LABELS: Record<TabId, string> = {
  dashboard: 'Dashboard',
  teams: 'Teams',
  training: 'Training Volume',
  injury: 'Injury Insights (Beta)',
  'weekly-winners': 'Weekly Winners',
};

export default function Header() {
  const [activeTab, setActiveTab] = useAtom(activeTabState);
  const [lastUpdatedText] = useAtom(lastUpdatedTextState);
  const tabRefs = useRef<Map<TabId, HTMLButtonElement | null>>(new Map());

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLButtonElement>, currentTab: TabId) => {
    const currentIndex = TAB_ORDER.indexOf(currentTab);
    let newIndex: number | null = null;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        newIndex = (currentIndex + 1) % TAB_ORDER.length;
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = (currentIndex - 1 + TAB_ORDER.length) % TAB_ORDER.length;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = TAB_ORDER.length - 1;
        break;
    }

    if (newIndex !== null) {
      const newTab = TAB_ORDER[newIndex];
      setActiveTab(newTab);
      tabRefs.current.get(newTab)?.focus();
    }
  }, [setActiveTab]);

  const setTabRef = useCallback((tabId: TabId) => (el: HTMLButtonElement | null) => {
    tabRefs.current.set(tabId, el);
  }, []);

  return (
    <header className={css.header}>
      <div className={css.main}>
        <h1 className={css.h1}>Bullshark Analytics 🦈</h1>
        <div className={css.subtitleContainer}>
          <p className={css.subtitle} aria-live="polite">{lastUpdatedText}</p>
        </div>
      </div>
      <nav className={css.actions} aria-label="Primary navigation">
        <div className={css.navGroup} role="tablist" aria-label="Dashboard views">
          {TAB_ORDER.map((tabId) => {
            const isSelected = activeTab === tabId;
            return (
              <button
                key={tabId}
                ref={setTabRef(tabId)}
                id={`tab-${tabId}`}
                className={`${css.navPill} ${isSelected ? css.navPillActive : ""}`}
                aria-selected={isSelected}
                aria-controls={`tabpanel-${tabId}`}
                onClick={() => setActiveTab(tabId)}
                onKeyDown={(e) => handleKeyDown(e, tabId)}
                role="tab"
                type="button"
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
