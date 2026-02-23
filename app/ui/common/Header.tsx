"use client";

import { useAtom } from "jotai";
import { useAtomValue } from "jotai";
import { activeTabState, lastUpdatedTextState } from "@/lib/state/atoms";
import { useCallback, KeyboardEvent } from "react";
import css from "./Header.module.scss";

type TabId = "dashboard" | "teams" | "training" | "injury" | "weekly-winners";

const TAB_ORDER: TabId[] = ["dashboard", "teams", "training", "injury", "weekly-winners"];

export default function Header() {
  const [activeTab, setActiveTab] = useAtom(activeTabState);
  const lastUpdatedText = useAtomValue(lastUpdatedTextState);

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = TAB_ORDER.indexOf(activeTab as TabId);
    let newIndex = currentIndex;

    switch (event.key) {
      case "ArrowRight":
        newIndex = currentIndex < TAB_ORDER.length - 1 ? currentIndex + 1 : 0;
        break;
      case "ArrowLeft":
        newIndex = currentIndex > 0 ? currentIndex - 1 : TAB_ORDER.length - 1;
        break;
      case "Home":
        newIndex = 0;
        break;
      case "End":
        newIndex = TAB_ORDER.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    setActiveTab(TAB_ORDER[newIndex]);
    const newTabButton = document.getElementById(`tab-${TAB_ORDER[newIndex]}`);
    newTabButton?.focus();
  }, [activeTab, setActiveTab]);

  return (
    <header className={css.header}>
      <div className={css.main}>
        <h1 className={css.h1}>
          Bullshark Analytics{" "}
          <span role="img" aria-label="shark">🦈</span>
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
          <button
            id="tab-dashboard"
            className={`${css.navPill} ${activeTab === "dashboard" ? css.navPillActive : ""}`}
            aria-selected={activeTab === "dashboard"}
            aria-controls="main-content"
            onClick={() => setActiveTab('dashboard')}
            role="tab"
            type="button"
            tabIndex={activeTab === "dashboard" ? 0 : -1}
          >
            Dashboard
          </button>
          <button
            id="tab-teams"
            className={`${css.navPill} ${activeTab === "teams" ? css.navPillActive : ""}`}
            aria-selected={activeTab === "teams"}
            aria-controls="main-content"
            onClick={() => setActiveTab('teams')}
            role="tab"
            type="button"
            tabIndex={activeTab === "teams" ? 0 : -1}
          >
            Teams
          </button>
          <button
            id="tab-training"
            className={`${css.navPill} ${activeTab === "training" ? css.navPillActive : ""}`}
            aria-selected={activeTab === "training"}
            aria-controls="main-content"
            onClick={() => setActiveTab('training')}
            role="tab"
            type="button"
            tabIndex={activeTab === "training" ? 0 : -1}
          >
            Training Volume
          </button>
          <button
            id="tab-injury"
            className={`${css.navPill} ${activeTab === "injury" ? css.navPillActive : ""}`}
            aria-selected={activeTab === "injury"}
            aria-controls="main-content"
            onClick={() => setActiveTab('injury')}
            role="tab"
            type="button"
            tabIndex={activeTab === "injury" ? 0 : -1}
          >
            Injury Insights (Beta)
          </button>
          <button
            id="tab-weekly-winners"
            className={`${css.navPill} ${activeTab === "weekly-winners" ? css.navPillActive : ""}`}
            aria-selected={activeTab === "weekly-winners"}
            aria-controls="main-content"
            onClick={() => setActiveTab('weekly-winners')}
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
