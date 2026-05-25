'use client';

import { useEffect } from 'react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          background: 'var(--panel)',
          borderRadius: '12px',
          padding: '32px',
          maxWidth: '500px',
          border: '1px solid var(--border)',
        }}
      >
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 700,
            marginBottom: '12px',
            color: 'var(--text)',
          }}
        >
          Something went wrong
        </h1>
        <p
          style={{
            color: 'var(--muted)',
            marginBottom: '24px',
            fontSize: '14px',
          }}
        >
          An unexpected error occurred. Please try again, or contact support if the
          problem persists.
        </p>
        {error.message && (
          <pre
            style={{
              background: 'var(--bg)',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '12px',
              color: 'var(--muted)',
              overflow: 'auto',
              marginBottom: '24px',
              textAlign: 'left',
            }}
          >
            {error.message}
          </pre>
        )}
        <button
          onClick={reset}
          style={{
            background: 'var(--accent)',
            color: 'var(--bg)',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
