"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import Card from "./Card";
import css from "./ErrorBoundary.module.scss";

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
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className={css.errorCard}>
          <div className={css.content}>
            <div className={css.icon} aria-hidden="true">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
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
            <h2 className={css.title}>Something went wrong</h2>
            <p className={css.message}>
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
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
