"use client";

import { useAtom } from "jotai";
import { activeTabState, lastUpdatedTextState } from "@/lib/state/atoms";
import css from "./Header.module.scss";

type TabId = 'dashboard' | 'teams' | 'training' | 'injury' | 'weekly-winners';

interface TabConfig {
  id: TabId;
  label: string;
}

const TABS: TabConfig[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'teams', label: 'Teams' },
  { id: 'training', label: 'Training Volume' },
  { id: 'injury', label: 'Injury Insights (Beta)' },
  { id: 'weekly-winners', label: 'Weekly Winners' },
];

export default function Header() {
  const [activeTab, setActiveTab] = useAtom(activeTabState);
  const [lastUpdatedText] = useAtom(lastUpdatedTextState);

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    let newIndex = currentIndex;
    
    if (e.key === 'ArrowRight') {
      newIndex = (currentIndex + 1) % TABS.length;
    } else if (e.key === 'ArrowLeft') {
      newIndex = (currentIndex - 1 + TABS.length) % TABS.length;
    } else if (e.key === 'Home') {
      newIndex = 0;
    } else if (e.key === 'End') {
      newIndex = TABS.length - 1;
    } else {
      return;
    }
    
    e.preventDefault();
    setActiveTab(TABS[newIndex].id);
    const tabButton = document.getElementById(`tab-${TABS[newIndex].id}`);
    tabButton?.focus();
  };

  return (
    <header className={css.header}>
      <div className={css.main}>
        <h1 className={css.h1}>Bullshark Analytics 🦈</h1>
        <div className={css.subtitleContainer}>
          <p className={css.subtitle} aria-live="polite">{lastUpdatedText}</p>
        </div>
      </div>
      <nav className={css.actions} aria-label="Main navigation">
        <div className={css.navGroup} role="tablist" aria-label="Dashboard views">
          {TABS.map((tab, index) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              className={`${css.navPill} ${activeTab === tab.id ? css.navPillActive : ""}`}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              role="tab"
              type="button"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}
