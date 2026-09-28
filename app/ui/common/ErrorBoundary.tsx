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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className={css.errorCard}>
          <div className={css.content} role="alert">
            <div className={css.iconContainer}>
              <svg
                className={css.icon}
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                />
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
              {this.state.error && (
                <details className={css.details}>
                  <summary>Error details</summary>
                  <pre className={css.errorMessage}>
                    {this.state.error.message}
                  </pre>
                </details>
              )}
              <button
                type="button"
                className={css.resetButton}
                onClick={this.handleReset}
              >
                Try again
              </button>
            </div>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}
