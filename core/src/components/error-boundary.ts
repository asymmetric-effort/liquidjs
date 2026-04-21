import type { Props, LiquidNode, ErrorInfo } from '../shared/types';
import { Component } from './component';

export interface ErrorBoundaryProps extends Props {
  fallback?: LiquidNode;
  onError?: (error: unknown, info: ErrorInfo) => void;
  children?: LiquidNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: unknown;
}

/**
 * A built-in error boundary component.
 * Users can also create their own by implementing componentDidCatch
 * and getDerivedStateFromError on a class component.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static getDerivedStateFromError(error: unknown): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  componentDidCatch(error: unknown, info: ErrorInfo): void {
    this.props.onError?.(error, info);
  }

  render(): LiquidNode {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children ?? null;
  }
}
