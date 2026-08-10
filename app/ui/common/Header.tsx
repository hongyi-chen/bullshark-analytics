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
  { id: 'dashboard', label: 'Dashboard', panelId: 'panel-dashboard' },
  { id: 'teams', label: 'Teams', panelId: 'panel-teams' },
  { id: 'training', label: 'Training Volume', panelId: 'panel-training' },
  { id: 'injury', label: 'Injury Insights (Beta)', panelId: 'panel-injury' },
  { id: 'weekly-winners', label: 'Weekly Winners', panelId: 'panel-weekly-winners' },
];

export default function Header() {
  const [activeTab, setActiveTab] = useAtom(activeTabState);
  const [lastUpdatedText] = useAtom(lastUpdatedTextState);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = TABS.findIndex(tab => tab.id === activeTab);
    let newIndex = currentIndex;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        newIndex = (currentIndex + 1) % TABS.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        newIndex = (currentIndex - 1 + TABS.length) % TABS.length;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = TABS.length - 1;
        break;
      default:
        return;
    }

    if (newIndex !== currentIndex) {
      setActiveTab(TABS[newIndex].id);
      const tabElement = document.getElementById(`tab-${TABS[newIndex].id}`);
      tabElement?.focus();
    }
  }, [activeTab, setActiveTab]);

  return (
    <header className={css.header}>
      <div className={css.main}>
        <h1 className={css.h1}>
          Bullshark Analytics
          <span role="img" aria-label="shark emoji"> 🦈</span>
        </h1>
        <div className={css.subtitleContainer}>
          <p className={css.subtitle} aria-live="polite">{lastUpdatedText}</p>
        </div>
      </div>
      <nav className={css.actions} aria-label="Primary navigation">
        <div
          className={css.navGroup}
          role="tablist"
          aria-label="Dashboard views"
          onKeyDown={handleKeyDown}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                className={`${css.navPill} ${isActive ? css.navPillActive : ""}`}
                role="tab"
                type="button"
                aria-selected={isActive}
                aria-controls={tab.panelId}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
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
