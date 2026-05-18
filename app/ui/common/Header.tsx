"use client";

import { useAtom } from "jotai";
import { useCallback, useRef, KeyboardEvent } from "react";
import { activeTabState, lastUpdatedTextState } from "@/lib/state/atoms";
import css from "./Header.module.scss";

type TabId = "dashboard" | "teams" | "training" | "injury" | "weekly-winners";

interface Tab {
  id: TabId;
  label: string;
}

const TABS: Tab[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "teams", label: "Teams" },
  { id: "training", label: "Training Volume" },
  { id: "injury", label: "Injury Insights (Beta)" },
  { id: "weekly-winners", label: "Weekly Winners" },
];

export default function Header() {
  const [activeTab, setActiveTab] = useAtom(activeTabState);
  const [lastUpdatedText] = useAtom(lastUpdatedTextState);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      const tabCount = TABS.length;
      let newIndex: number | null = null;

      switch (event.key) {
        case "ArrowRight":
          newIndex = (index + 1) % tabCount;
          break;
        case "ArrowLeft":
          newIndex = (index - 1 + tabCount) % tabCount;
          break;
        case "Home":
          newIndex = 0;
          break;
        case "End":
          newIndex = tabCount - 1;
          break;
        default:
          return;
      }

      event.preventDefault();
      const newTab = TABS[newIndex];
      setActiveTab(newTab.id);
      tabRefs.current[newIndex]?.focus();
    },
    [setActiveTab]
  );

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
          {TABS.map((tab, index) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                ref={(el) => { tabRefs.current[index] = el; }}
                id={`tab-${tab.id}`}
                className={`${css.navPill} ${isActive ? css.navPillActive : ""}`}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
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
