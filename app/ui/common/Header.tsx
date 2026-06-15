"use client";

import { useAtom } from "jotai";
import { useCallback, useRef, KeyboardEvent } from "react";
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
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    let newIndex: number | null = null;

    switch (event.key) {
      case 'ArrowRight':
        newIndex = (currentIndex + 1) % TABS.length;
        break;
      case 'ArrowLeft':
        newIndex = (currentIndex - 1 + TABS.length) % TABS.length;
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = TABS.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const newTab = TABS[newIndex];
    setActiveTab(newTab.id);
    tabRefs.current[newIndex]?.focus();
  }, [setActiveTab]);

  return (
    <header className={css.header}>
      <div className={css.main}>
        <h1 className={css.h1}>
          Bullshark Analytics
          <span aria-hidden="true"> 🦈</span>
        </h1>
        <div className={css.subtitleContainer}>
          <p className={css.subtitle}>{lastUpdatedText}</p>
        </div>
      </div>
      <nav className={css.actions} aria-label="Primary navigation">
        <div className={css.navGroup} role="tablist" aria-label="Dashboard views">
          {TABS.map((tab, index) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                ref={(el) => { tabRefs.current[index] = el; }}
                className={`${css.navPill} ${isSelected ? css.navPillActive : ""}`}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isSelected}
                aria-controls={`tabpanel-${tab.id}`}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                type="button"
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
