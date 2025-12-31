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
            aria-current={activeTab === "dashboard" ? "page" : undefined}
            onClick={() => setActiveTab('dashboard')}
            role="tab"
            type="button"
          >
            Dashboard
          </button>
          <button
            className={`${css.navPill} ${activeTab === "teams" ? css.navPillActive : ""}`}
            aria-current={activeTab === "teams" ? "page" : undefined}
            onClick={() => setActiveTab('teams')}
            role="tab"
            type="button"
          >
            Teams
          </button>
          <button
            className={`${css.navPill} ${activeTab === "training" ? css.navPillActive : ""}`}
            aria-current={activeTab === "training" ? "page" : undefined}
            onClick={() => setActiveTab('training')}
            role="tab"
            type="button"
          >
            Training Volume
          </button>
          <button
            className={`${css.navPill} ${activeTab === "injury" ? css.navPillActive : ""}`}
            aria-current={activeTab === "injury" ? "page" : undefined}
            onClick={() => setActiveTab('injury')}
            role="tab"
            type="button"
          >
            Injury Insights (Beta)
          </button>
        </div>
      </nav>
    </header>
  );
}
