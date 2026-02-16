"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import Card from "./Card";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component to catch and handle errors in child components.
 * Particularly useful for wrapping chart components that may fail with invalid data.
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console for debugging
    console.error("ErrorBoundary caught an error:", error, errorInfo);
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
        <Card>
          <div
            style={{
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
            }}
            role="alert"
          >
            <div style={{ fontSize: "14px", color: "var(--muted)" }}>
              {this.props.componentName
                ? `Something went wrong rendering ${this.props.componentName}.`
                : "Something went wrong rendering this component."}
            </div>
            <button
              onClick={this.handleRetry}
              type="button"
              style={{
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--text)",
                background: "rgba(231, 237, 246, 0.1)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                cursor: "pointer",
              }}
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
