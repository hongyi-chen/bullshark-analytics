'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        padding: '40px',
        textAlign: 'center',
      }}
    >
      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>
        Something went wrong
      </h2>
      <p
        className="muted"
        style={{ marginBottom: '24px', maxWidth: '400px' }}
      >
        An unexpected error occurred. Please try again or contact support if the
        problem persists.
      </p>
      <button
        onClick={reset}
        type="button"
        style={{
          padding: '12px 24px',
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--text)',
          background: 'rgba(34, 197, 94, 0.12)',
          border: '1px solid rgba(34, 197, 94, 0.5)',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'rgba(34, 197, 94, 0.2)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'rgba(34, 197, 94, 0.12)';
        }}
      >
        Try again
      </button>
    </div>
  );
}
