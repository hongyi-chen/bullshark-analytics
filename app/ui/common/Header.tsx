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

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLButtonElement>, currentTab: TabId) => {
    const currentIndex = TAB_ORDER.indexOf(currentTab);
    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowRight':
        newIndex = (currentIndex + 1) % TAB_ORDER.length;
        break;
      case 'ArrowLeft':
        newIndex = (currentIndex - 1 + TAB_ORDER.length) % TAB_ORDER.length;
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = TAB_ORDER.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const newTab = TAB_ORDER[newIndex];
    setActiveTab(newTab);
    tabRefs.current.get(newTab)?.focus();
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
          {TAB_ORDER.map((tabId) => (
            <button
              key={tabId}
              ref={setTabRef(tabId)}
              id={`tab-${tabId}`}
              className={`${css.navPill} ${activeTab === tabId ? css.navPillActive : ""}`}
              aria-selected={activeTab === tabId}
              aria-controls={`tabpanel-${tabId}`}
              onClick={() => setActiveTab(tabId)}
              onKeyDown={(e) => handleKeyDown(e, tabId)}
              role="tab"
              type="button"
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
