"use client";

import { useCallback } from "react";
import { useAtom } from "jotai";
import { activeTabState, lastUpdatedTextState } from "@/lib/state/atoms";
import css from "./Header.module.scss";

type TabId = 'dashboard' | 'teams' | 'training' | 'injury' | 'weekly-winners';

interface TabConfig {
  id: TabId;
  label: string;
  panelId: string;
}

const TABS: TabConfig[] = [
  { id: 'dashboard', label: 'Dashboard', panelId: 'tabpanel-dashboard' },
  { id: 'teams', label: 'Teams', panelId: 'tabpanel-teams' },
  { id: 'training', label: 'Training Volume', panelId: 'tabpanel-training' },
  { id: 'injury', label: 'Injury Insights (Beta)', panelId: 'tabpanel-injury' },
  { id: 'weekly-winners', label: 'Weekly Winners', panelId: 'tabpanel-weekly-winners' },
];

export default function Header() {
  const [activeTab, setActiveTab] = useAtom(activeTabState);
  const [lastUpdatedText] = useAtom(lastUpdatedTextState);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    let newIndex = currentIndex;
    
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      newIndex = (currentIndex + 1) % TABS.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      newIndex = (currentIndex - 1 + TABS.length) % TABS.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      newIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      newIndex = TABS.length - 1;
    }

    if (newIndex !== currentIndex) {
      setActiveTab(TABS[newIndex].id);
      const tabElement = document.getElementById(`tab-${TABS[newIndex].id}`);
      tabElement?.focus();
    }
  }, [setActiveTab]);

  const handleTabClick = useCallback((tabId: TabId) => {
    setActiveTab(tabId);
  }, [setActiveTab]);

  return (
    <header className={css.header}>
      <div className={css.main}>
        <h1 className={css.h1}>
          <span aria-hidden="true">🦈 </span>
          Bullshark Analytics
        </h1>
        <div className={css.subtitleContainer}>
          <p className={css.subtitle} aria-live="polite">{lastUpdatedText}</p>
        </div>
      </div>
      <nav className={css.actions} aria-label="Main navigation">
        <div className={css.navGroup} role="tablist" aria-label="Dashboard views">
          {TABS.map((tab, index) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                className={`${css.navPill} ${isSelected ? css.navPillActive : ""}`}
                role="tab"
                type="button"
                aria-selected={isSelected}
                aria-controls={tab.panelId}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => handleTabClick(tab.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
