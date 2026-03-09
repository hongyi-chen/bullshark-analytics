"use client";

import { useCallback } from "react";
import { useAtom } from "jotai";
import { activeTabState, lastUpdatedTextState, TabId } from "@/lib/state/atoms";
import css from "./Header.module.scss";

export default function Header() {
  const [activeTab, setActiveTab] = useAtom(activeTabState);
  const [lastUpdatedText] = useAtom(lastUpdatedTextState);

  const handleTabClick = useCallback((tab: TabId) => {
    setActiveTab(tab);
  }, [setActiveTab]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    const tabs: TabId[] = ['dashboard', 'teams', 'training', 'injury', 'weekly-winners'];
    const currentIndex = tabs.indexOf(activeTab);
    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'ArrowLeft':
        event.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    setActiveTab(tabs[newIndex]);
    const tabButtons = event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    tabButtons[newIndex]?.focus();
  }, [activeTab, setActiveTab]);

  return (
    <header className={css.header}>
      <div className={css.main}>
        <h1 className={css.h1}>Bullshark Analytics 🦈</h1>
        <div className={css.subtitleContainer}>
          <p className={css.subtitle}>{lastUpdatedText}</p>
        </div>
      </div>
      <nav className={css.actions} aria-label="Primary">
        <div
          className={css.navGroup}
          role="tablist"
          aria-label="Views"
          onKeyDown={handleKeyDown}
        >
          <button
            className={`${css.navPill} ${activeTab === "dashboard" ? css.navPillActive : ""}`}
            aria-selected={activeTab === "dashboard"}
            onClick={() => handleTabClick('dashboard')}
            role="tab"
            type="button"
            tabIndex={activeTab === "dashboard" ? 0 : -1}
          >
            Dashboard
          </button>
          <button
            className={`${css.navPill} ${activeTab === "teams" ? css.navPillActive : ""}`}
            aria-selected={activeTab === "teams"}
            onClick={() => handleTabClick('teams')}
            role="tab"
            type="button"
            tabIndex={activeTab === "teams" ? 0 : -1}
          >
            Teams
          </button>
          <button
            className={`${css.navPill} ${activeTab === "training" ? css.navPillActive : ""}`}
            aria-selected={activeTab === "training"}
            onClick={() => handleTabClick('training')}
            role="tab"
            type="button"
            tabIndex={activeTab === "training" ? 0 : -1}
          >
            Training Volume
          </button>
          <button
            className={`${css.navPill} ${activeTab === "injury" ? css.navPillActive : ""}`}
            aria-selected={activeTab === "injury"}
            onClick={() => handleTabClick('injury')}
            role="tab"
            type="button"
            tabIndex={activeTab === "injury" ? 0 : -1}
          >
            Injury Insights (Beta)
          </button>
          <button
            className={`${css.navPill} ${activeTab === "weekly-winners" ? css.navPillActive : ""}`}
            aria-selected={activeTab === "weekly-winners"}
            onClick={() => handleTabClick('weekly-winners')}
            role="tab"
            type="button"
            tabIndex={activeTab === "weekly-winners" ? 0 : -1}
          >
            Weekly Winners
          </button>
        </div>
      </nav>
    </header>
  );
}
