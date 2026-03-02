"use client";

import { Component, ReactNode } from "react";
import Card from "./Card";
import css from "./ErrorCard.module.scss";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card
          header={
            <>
              <div className="bold">Something went wrong</div>
              <div className="muted">An unexpected error occurred.</div>
            </>
          }
        >
          <div role="alert" aria-live="assertive">
            <pre className={css.errorMessage}>
              {this.state.error?.message || "Unknown error"}
            </pre>
            <button
              onClick={this.handleReset}
              style={{
                marginTop: "16px",
                padding: "8px 16px",
                backgroundColor: "var(--accent)",
                color: "var(--bg)",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Try Again
            </button>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}
