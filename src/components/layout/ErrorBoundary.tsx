import { Component, type ErrorInfo, type ReactNode } from 'react';
import { BoldButton } from '@/components/ui/BoldButton';
import { BoldCard } from '@/components/ui/BoldCard';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4">
                    <BoldCard className="max-w-md w-full text-center space-y-4">
                        <h2 className="text-2xl font-black uppercase tracking-tight">Something went wrong</h2>
                        <p className="text-[var(--text-secondary)] font-mono text-sm">
                            An unexpected error occurred. Our neural networks are untangling the mess.
                        </p>
                        {this.state.error && (
                            <pre className="text-xs text-left bg-black text-white p-4 overflow-auto max-h-40 font-mono">
                                {this.state.error.message}
                            </pre>
                        )}
                        <BoldButton onClick={() => window.location.reload()}>
                            Reload Application
                        </BoldButton>
                    </BoldCard>
                </div>
            );
        }

        return this.props.children;
    }
}
