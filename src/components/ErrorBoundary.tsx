"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { Orbit } from "lucide-react";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0f1114] px-4 text-center text-[#f3ede3]">
            <Orbit className="h-10 w-10 text-[#d8b48e]" strokeWidth={1.4} />
            <h1 className="font-display text-2xl">页面遇到了异常</h1>
            <p className="max-w-md text-sm leading-6 text-[#958e8e]">
              可能是网络波动或临时错误，刷新页面通常可以恢复。
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 rounded-md border border-[#c25344] bg-[#c25344] px-5 py-3 text-sm font-medium text-white"
            >
              刷新页面
            </button>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <pre className="mt-4 max-w-xl overflow-auto rounded-lg border border-[#34322e] bg-[#0d1318] p-4 text-left text-xs text-[#df7766]">
                {this.state.error.message}
              </pre>
            )}
          </main>
        )
      );
    }

    return this.props.children;
  }
}
