"use client";

import { useAtom } from "jotai";
import { useCallback, useRef } from "react";
import { activeTabState, lastUpdatedTextState } from "@/lib/state/atoms";
import css from "./Header.module.scss";

type TabId = 'dashboard' | 'teams' | 'training' | 'injury' | 'weekly-winners';

const TAB_ORDER: TabId[] = ['dashboard', 'teams', 'training', 'injury', 'weekly-winners'];

export default function Header() {
  const [activeTab, setActiveTab] = useAtom(activeTabState);
  const [lastUpdatedText] = useAtom(lastUpdatedTextState);
  const tabRefs = useRef<Map<TabId, HTMLButtonElement | null>>(new Map());

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLButtonElement>, currentTab: TabId) => {
    const currentIndex = TAB_ORDER.indexOf(currentTab);
    let newIndex = currentIndex;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      newIndex = (currentIndex + 1) % TAB_ORDER.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      newIndex = (currentIndex - 1 + TAB_ORDER.length) % TAB_ORDER.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      newIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      newIndex = TAB_ORDER.length - 1;
    }

    if (newIndex !== currentIndex) {
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
          <p className={css.subtitle}>{lastUpdatedText}</p>
        </div>
      </div>
      <nav className={css.actions} aria-label="Primary navigation">
        <div className={css.navGroup} role="tablist" aria-label="Dashboard views">
          <button
            ref={setTabRef('dashboard')}
            className={`${css.navPill} ${activeTab === "dashboard" ? css.navPillActive : ""}`}
            aria-selected={activeTab === "dashboard"}
            onClick={() => setActiveTab('dashboard')}
            onKeyDown={(e) => handleKeyDown(e, 'dashboard')}
            role="tab"
            type="button"
            tabIndex={activeTab === "dashboard" ? 0 : -1}
            id="tab-dashboard"
            aria-controls="tabpanel-main"
          >
            Dashboard
          </button>
          <button
            ref={setTabRef('teams')}
            className={`${css.navPill} ${activeTab === "teams" ? css.navPillActive : ""}`}
            aria-selected={activeTab === "teams"}
            onClick={() => setActiveTab('teams')}
            onKeyDown={(e) => handleKeyDown(e, 'teams')}
            role="tab"
            type="button"
            tabIndex={activeTab === "teams" ? 0 : -1}
            id="tab-teams"
            aria-controls="tabpanel-main"
          >
            Teams
          </button>
          <button
            ref={setTabRef('training')}
            className={`${css.navPill} ${activeTab === "training" ? css.navPillActive : ""}`}
            aria-selected={activeTab === "training"}
            onClick={() => setActiveTab('training')}
            onKeyDown={(e) => handleKeyDown(e, 'training')}
            role="tab"
            type="button"
            tabIndex={activeTab === "training" ? 0 : -1}
            id="tab-training"
            aria-controls="tabpanel-main"
          >
            Training Volume
          </button>
          <button
            ref={setTabRef('injury')}
            className={`${css.navPill} ${activeTab === "injury" ? css.navPillActive : ""}`}
            aria-selected={activeTab === "injury"}
            onClick={() => setActiveTab('injury')}
            onKeyDown={(e) => handleKeyDown(e, 'injury')}
            role="tab"
            type="button"
            tabIndex={activeTab === "injury" ? 0 : -1}
            id="tab-injury"
            aria-controls="tabpanel-main"
          >
            Injury Insights (Beta)
          </button>
          <button
            ref={setTabRef('weekly-winners')}
            className={`${css.navPill} ${activeTab === "weekly-winners" ? css.navPillActive : ""}`}
            aria-selected={activeTab === "weekly-winners"}
            onClick={() => setActiveTab('weekly-winners')}
            onKeyDown={(e) => handleKeyDown(e, 'weekly-winners')}
            role="tab"
            type="button"
            tabIndex={activeTab === "weekly-winners" ? 0 : -1}
            id="tab-weekly-winners"
            aria-controls="tabpanel-main"
          >
            Weekly Winners
          </button>
        </div>
      </nav>
    </header>
  );
}
