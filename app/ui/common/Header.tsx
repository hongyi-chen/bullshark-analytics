"use client";

import { useAtom } from "jotai";
import { useCallback, useRef, KeyboardEvent } from "react";
import { activeTabState, lastUpdatedTextState } from "@/lib/state/atoms";
import css from "./Header.module.scss";

type TabId = 'dashboard' | 'teams' | 'training' | 'injury' | 'weekly-winners';

const TABS: { id: TabId; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'teams', label: 'Teams' },
  { id: 'training', label: 'Training Volume' },
  { id: 'injury', label: 'Injury Insights (Beta)' },
  { id: 'weekly-winners', label: 'Weekly Winners' },
];

export default function Header() {
  const [activeTab, setActiveTab] = useAtom(activeTabState);
  const [lastUpdatedText] = useAtom(lastUpdatedTextState);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = TABS.findIndex(tab => tab.id === activeTab);
    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : TABS.length - 1;
        break;
      case 'ArrowRight':
        event.preventDefault();
        newIndex = currentIndex < TABS.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = TABS.length - 1;
        break;
      default:
        return;
    }

    setActiveTab(TABS[newIndex].id);
    tabsRef.current[newIndex]?.focus();
  }, [activeTab, setActiveTab]);

  return (
    <header className={css.header}>
      <div className={css.main}>
        <h1 className={css.h1}>Bullshark Analytics 🦈</h1>
        <div className={css.subtitleContainer}>
          <p className={css.subtitle}>{lastUpdatedText}</p>
        </div>
      </div>
      <nav className={css.actions} aria-label="Main navigation">
        <div
          className={css.navGroup}
          role="tablist"
          aria-label="Dashboard views"
          onKeyDown={handleKeyDown}
        >
          {TABS.map((tab, index) => (
            <button
              key={tab.id}
              ref={(el) => { tabsRef.current[index] = el; }}
              id={`tab-${tab.id}`}
              className={`${css.navPill} ${activeTab === tab.id ? css.navPillActive : ""}`}
              onClick={() => setActiveTab(tab.id)}
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
