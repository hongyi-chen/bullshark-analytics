"use client";

import { Component, ReactNode } from "react";
import Card from "./Card";
import css from "./ErrorBoundary.module.scss";

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
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className={css.errorCard}>
          <div className={css.content}>
            <div className={css.iconContainer}>
              <svg
                className={css.icon}
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                focusable="false"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M12 8v4M12 16h.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className={css.text}>
              <h2 className={css.title}>Something went wrong</h2>
              <p className={css.message}>
                An unexpected error occurred. Please try again or refresh the page.
              </p>
              {process.env.NODE_ENV === "development" && this.state.error && (
                <pre className={css.errorDetails}>{this.state.error.message}</pre>
              )}
            </div>
            <button
              type="button"
              className={css.retryButton}
              onClick={this.handleRetry}
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
