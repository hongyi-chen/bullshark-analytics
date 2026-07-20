"use client";

import { useEffect, useState } from 'react';

interface LoadingAnnouncerProps {
  isLoading: boolean;
  loadingMessage?: string;
  loadedMessage?: string;
}

export default function LoadingAnnouncer({ 
  isLoading, 
  loadingMessage = "Loading content",
  loadedMessage = "Content loaded"
}: LoadingAnnouncerProps) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isLoading) {
      setMessage(loadingMessage);
    } else {
      setMessage(loadedMessage);
      const timer = setTimeout(() => setMessage(''), 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, loadingMessage, loadedMessage]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      {message}
    </div>
  );
}
