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

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = TAB_ORDER.indexOf(activeTab);
    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        newIndex = (currentIndex + 1) % TAB_ORDER.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        newIndex = (currentIndex - 1 + TAB_ORDER.length) % TAB_ORDER.length;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = TAB_ORDER.length - 1;
        break;
      default:
        return;
    }

    const newTabId = TAB_ORDER[newIndex];
    setActiveTab(newTabId);
    tabRefs.current.get(newTabId)?.focus();
  }, [activeTab, setActiveTab]);

  const setTabRef = useCallback((tabId: TabId) => (el: HTMLButtonElement | null) => {
    tabRefs.current.set(tabId, el);
  }, []);

  return (
    <header className={css.header}>
      <div className={css.main}>
        <h1 className={css.h1}>
          <span aria-hidden="true">Bullshark Analytics 🦈</span>
          <span className="sr-only">Bullshark Analytics</span>
        </h1>
        <div className={css.subtitleContainer}>
          <p className={css.subtitle} aria-live="polite" aria-atomic="true">
            {lastUpdatedText}
          </p>
        </div>
      </div>
      <nav className={css.actions} aria-label="Main navigation">
        <div
          className={css.navGroup}
          role="tablist"
          aria-label="Dashboard views"
          onKeyDown={handleKeyDown}
        >
          {TAB_ORDER.map((tabId) => {
            const isSelected = activeTab === tabId;
            return (
              <button
                key={tabId}
                ref={setTabRef(tabId)}
                className={`${css.navPill} ${isSelected ? css.navPillActive : ""}`}
                role="tab"
                id={`tab-${tabId}`}
                aria-selected={isSelected}
                aria-controls={`panel-${tabId}`}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setActiveTab(tabId)}
                type="button"
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
