"use client";

import { useAtom } from "jotai";
import { activeTabState, lastUpdatedTextState } from "@/lib/state/atoms";
import css from "./Header.module.scss";

export default function Header() {
  const [activeTab, setActiveTab] = useAtom(activeTabState);
  const [lastUpdatedText] = useAtom(lastUpdatedTextState);
  return (
    <header className={css.header}>
      <div className={css.main}>
        <h1 className={css.h1}>Bullshark Analytics 🦈</h1>
        <div className={css.subtitleContainer}>
          <p className={css.subtitle}>{lastUpdatedText}</p>
        </div>
      </div>
      <nav className={css.actions} aria-label="Primary">
        <div className={css.navGroup} role="tablist" aria-label="Views">
          <button
            className={`${css.navPill} ${activeTab === "dashboard" ? css.navPillActive : ""}`}
            aria-selected={activeTab === "dashboard"}
            aria-controls="main-content"
            onClick={() => setActiveTab('dashboard')}
            role="tab"
            type="button"
            id="tab-dashboard"
          >
            Dashboard
          </button>
          <button
            className={`${css.navPill} ${activeTab === "teams" ? css.navPillActive : ""}`}
            aria-selected={activeTab === "teams"}
            aria-controls="main-content"
            onClick={() => setActiveTab('teams')}
            role="tab"
            type="button"
            id="tab-teams"
          >
            Teams
          </button>
          <button
            className={`${css.navPill} ${activeTab === "training" ? css.navPillActive : ""}`}
            aria-selected={activeTab === "training"}
            aria-controls="main-content"
            onClick={() => setActiveTab('training')}
            role="tab"
            type="button"
            id="tab-training"
          >
            Training Volume
          </button>
          <button
            className={`${css.navPill} ${activeTab === "injury" ? css.navPillActive : ""}`}
            aria-selected={activeTab === "injury"}
            aria-controls="main-content"
            onClick={() => setActiveTab('injury')}
            role="tab"
            type="button"
            id="tab-injury"
          >
            Injury Insights (Beta)
          </button>
          <button
            className={`${css.navPill} ${activeTab === "weekly-winners" ? css.navPillActive : ""}`}
            aria-selected={activeTab === "weekly-winners"}
            aria-controls="main-content"
            onClick={() => setActiveTab('weekly-winners')}
            role="tab"
            type="button"
            id="tab-weekly-winners"
          >
            Weekly Winners
          </button>
        </div>
      </nav>
    </header>
  );
}
