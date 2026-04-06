"use client";

import { useCallback, useRef, KeyboardEvent } from "react";
import { useAtom } from "jotai";
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
  const tabRefs = useRef<Map<TabId, HTMLButtonElement>>(new Map());

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLButtonElement>, currentTab: TabId) => {
    const currentIndex = TAB_ORDER.indexOf(currentTab);
    let nextIndex: number | null = null;

    switch (e.key) {
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % TAB_ORDER.length;
        break;
      case 'ArrowLeft':
        nextIndex = (currentIndex - 1 + TAB_ORDER.length) % TAB_ORDER.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = TAB_ORDER.length - 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    const nextTab = TAB_ORDER[nextIndex];
    setActiveTab(nextTab);
    tabRefs.current.get(nextTab)?.focus();
  }, [setActiveTab]);

  const setTabRef = useCallback((tab: TabId) => (el: HTMLButtonElement | null) => {
    if (el) {
      tabRefs.current.set(tab, el);
    } else {
      tabRefs.current.delete(tab);
    }
  }, []);

  return (
    <header className={css.header}>
      <a href="#main-content" className={css.skipLink}>
        Skip to main content
      </a>
      <div className={css.main}>
        <h1 className={css.h1}>Bullshark Analytics 🦈</h1>
        <div className={css.subtitleContainer}>
          <p className={css.subtitle} aria-live="polite">{lastUpdatedText}</p>
        </div>
      </div>
      <nav className={css.actions} aria-label="Main navigation">
        <div className={css.navGroup} role="tablist" aria-label="Dashboard views">
          {TAB_ORDER.map((tab) => (
            <button
              key={tab}
              ref={setTabRef(tab)}
              className={`${css.navPill} ${activeTab === tab ? css.navPillActive : ""}`}
              aria-selected={activeTab === tab}
              aria-controls={`tabpanel-${tab}`}
              id={`tab-${tab}`}
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
