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
  const navRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLButtonElement>, currentTab: TabId) => {
    const currentIndex = TAB_ORDER.indexOf(currentTab);
    let nextIndex: number;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        nextIndex = (currentIndex + 1) % TAB_ORDER.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        nextIndex = (currentIndex - 1 + TAB_ORDER.length) % TAB_ORDER.length;
        break;
      case 'Home':
        e.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        nextIndex = TAB_ORDER.length - 1;
        break;
      default:
        return;
    }

    const nextTab = TAB_ORDER[nextIndex];
    setActiveTab(nextTab);
    const nextButton = navRef.current?.querySelector(`[data-tab="${nextTab}"]`) as HTMLButtonElement | null;
    nextButton?.focus();
  }, [setActiveTab]);

  return (
    <header className={css.header}>
      <div className={css.main}>
        <h1 className={css.h1}>
          Bullshark Analytics <span aria-hidden="true">🦈</span>
        </h1>
        <div className={css.subtitleContainer}>
          <p className={css.subtitle} aria-live="polite">{lastUpdatedText}</p>
        </div>
      </div>
      <nav className={css.actions} aria-label="Main navigation">
        <div className={css.navGroup} ref={navRef} role="group" aria-label="View selection">
          {TAB_ORDER.map((tabId) => (
            <button
              key={tabId}
              className={`${css.navPill} ${activeTab === tabId ? css.navPillActive : ""}`}
              aria-current={activeTab === tabId ? "page" : undefined}
              aria-pressed={activeTab === tabId}
              onClick={() => setActiveTab(tabId)}
              onKeyDown={(e) => handleKeyDown(e, tabId)}
              data-tab={tabId}
              tabIndex={activeTab === tabId ? 0 : -1}
              type="button"
            >
              {TAB_LABELS[tabId]}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}
