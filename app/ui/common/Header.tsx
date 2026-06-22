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
      <nav className={css.actions} aria-label="Main navigation">
        <div className={css.navGroup} role="tablist" aria-label="Dashboard views">
          <button
            className={`${css.navPill} ${activeTab === "dashboard" ? css.navPillActive : ""}`}
            aria-selected={activeTab === "dashboard"}
            onClick={() => setActiveTab('dashboard')}
            role="tab"
            type="button"
            id="tab-dashboard"
            aria-controls="tabpanel-main"
            tabIndex={activeTab === "dashboard" ? 0 : -1}
          >
            Dashboard
          </button>
          <button
            className={`${css.navPill} ${activeTab === "teams" ? css.navPillActive : ""}`}
            aria-selected={activeTab === "teams"}
            onClick={() => setActiveTab('teams')}
            role="tab"
            type="button"
            id="tab-teams"
            aria-controls="tabpanel-main"
            tabIndex={activeTab === "teams" ? 0 : -1}
          >
            Teams
          </button>
          <button
            className={`${css.navPill} ${activeTab === "training" ? css.navPillActive : ""}`}
            aria-selected={activeTab === "training"}
            onClick={() => setActiveTab('training')}
            role="tab"
            type="button"
            id="tab-training"
            aria-controls="tabpanel-main"
            tabIndex={activeTab === "training" ? 0 : -1}
          >
            Training Volume
          </button>
          <button
            className={`${css.navPill} ${activeTab === "injury" ? css.navPillActive : ""}`}
            aria-selected={activeTab === "injury"}
            onClick={() => setActiveTab('injury')}
            role="tab"
            type="button"
            id="tab-injury"
            aria-controls="tabpanel-main"
            tabIndex={activeTab === "injury" ? 0 : -1}
          >
            Injury Insights (Beta)
          </button>
          <button
            className={`${css.navPill} ${activeTab === "weekly-winners" ? css.navPillActive : ""}`}
            aria-selected={activeTab === "weekly-winners"}
            onClick={() => setActiveTab('weekly-winners')}
            role="tab"
            type="button"
            id="tab-weekly-winners"
            aria-controls="tabpanel-main"
            tabIndex={activeTab === "weekly-winners" ? 0 : -1}
          >
            Weekly Winners
          </button>
        </div>
      </nav>
    </header>
  );
}
