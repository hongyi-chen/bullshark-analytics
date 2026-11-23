"use client";

import { useAtom } from "jotai";
import { useCallback, useRef, KeyboardEvent } from "react";
import { activeTabState, lastUpdatedTextState } from "@/lib/state/atoms";
import css from "./Header.module.scss";

type TabId = 'dashboard' | 'teams' | 'training' | 'injury' | 'weekly-winners';

const TAB_IDS: TabId[] = ['dashboard', 'teams', 'training', 'injury', 'weekly-winners'];
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

  const setTabRef = useCallback((id: TabId) => (el: HTMLButtonElement | null) => {
    tabRefs.current.set(id, el);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLButtonElement>, currentTab: TabId) => {
    const currentIndex = TAB_IDS.indexOf(currentTab);
    let nextIndex: number | null = null;

    switch (e.key) {
      case 'ArrowLeft':
        nextIndex = currentIndex > 0 ? currentIndex - 1 : TAB_IDS.length - 1;
        break;
      case 'ArrowRight':
        nextIndex = currentIndex < TAB_IDS.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = TAB_IDS.length - 1;
        break;
      default:
        return;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      const nextTab = TAB_IDS[nextIndex];
      setActiveTab(nextTab);
      tabRefs.current.get(nextTab)?.focus();
    }
  }, [setActiveTab]);

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
          {TAB_IDS.map((tabId) => (
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
