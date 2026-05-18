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

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
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
        <div role="alert" aria-live="assertive">
          <Card
            header={
              <>
                <div className="bold">Something went wrong</div>
                <div className="muted">
                  An unexpected error occurred while rendering this component.
                </div>
              </>
            }
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <pre className={css.errorMessage}>
                {this.state.error?.message || "Unknown error"}
              </pre>
              <button
                type="button"
                onClick={this.handleReset}
                style={{
                  alignSelf: "flex-start",
                  padding: "8px 16px",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--text)",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                Try again
              </button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
