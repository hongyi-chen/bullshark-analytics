"use client";

import { useEffect, useState } from "react";
import css from "./LoadingAnnouncer.module.scss";

interface LoadingAnnouncerProps {
  isLoading: boolean;
  loadingMessage?: string;
  loadedMessage?: string;
}

export default function LoadingAnnouncer({
  isLoading,
  loadingMessage = "Loading content...",
  loadedMessage = "Content loaded",
}: LoadingAnnouncerProps) {
  const [announcement, setAnnouncement] = useState<string>("");

  useEffect(() => {
    if (isLoading) {
      setAnnouncement(loadingMessage);
    } else if (announcement === loadingMessage) {
      setAnnouncement(loadedMessage);
    }
  }, [isLoading, loadingMessage, loadedMessage, announcement]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={css.announcer}
    >
      {announcement}
    </div>
  );
}
