"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import Card from "./Card";
import css from "./ErrorCard.module.scss";

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

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

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
              <div className="muted">
                An error occurred while rendering this section.
              </div>
            </>
          }
        >
          <div className={css.errorMessage} role="alert">
            <p>Please try refreshing the page.</p>
            {this.state.error && (
              <details>
                <summary>Error details</summary>
                <pre>{this.state.error.message}</pre>
              </details>
            )}
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}
