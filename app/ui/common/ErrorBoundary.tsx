"use client";

import { Component, ErrorInfo, ReactNode } from 'react';
import Card from './Card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card>
          <div 
            role="alert"
            style={{ 
              padding: '20px', 
              textAlign: 'center' 
            }}
          >
            <h2 style={{ marginBottom: '12px', color: '#ef4444' }}>
              Something went wrong
            </h2>
            <p className="muted" style={{ marginBottom: '16px' }}>
              An error occurred while rendering this component.
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              style={{
                padding: '8px 16px',
                background: 'var(--accent)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
              type="button"
            >
              Try again
            </button>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}
