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
        <h1 id="page-title" className={css.h1}>
          Bullshark Analytics{" "}
          <span aria-hidden="true">🦈</span>
        </h1>
        <div className={css.subtitleContainer}>
          <p className={css.subtitle} aria-live="polite" aria-atomic="true">
            {lastUpdatedText}
          </p>
        </div>
      </div>
      <nav className={css.actions} aria-label="Main navigation">
        <div className={css.navGroup}>
          <button
            className={`${css.navPill} ${activeTab === "dashboard" ? css.navPillActive : ""}`}
            aria-current={activeTab === "dashboard" ? "page" : undefined}
            onClick={() => setActiveTab('dashboard')}
            type="button"
          >
            Dashboard
          </button>
          <button
            className={`${css.navPill} ${activeTab === "teams" ? css.navPillActive : ""}`}
            aria-current={activeTab === "teams" ? "page" : undefined}
            onClick={() => setActiveTab('teams')}
            type="button"
          >
            Teams
          </button>
          <button
            className={`${css.navPill} ${activeTab === "training" ? css.navPillActive : ""}`}
            aria-current={activeTab === "training" ? "page" : undefined}
            onClick={() => setActiveTab('training')}
            type="button"
          >
            Training Volume
          </button>
          <button
            className={`${css.navPill} ${activeTab === "injury" ? css.navPillActive : ""}`}
            aria-current={activeTab === "injury" ? "page" : undefined}
            onClick={() => setActiveTab('injury')}
            type="button"
          >
            Injury Insights (Beta)
          </button>
          <button
            className={`${css.navPill} ${activeTab === "weekly-winners" ? css.navPillActive : ""}`}
            aria-current={activeTab === "weekly-winners" ? "page" : undefined}
            onClick={() => setActiveTab('weekly-winners')}
            type="button"
          >
            Weekly Winners
          </button>
        </div>
      </nav>
    </header>
  );
}
