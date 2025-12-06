import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from '@/features/auth/context/AuthContext';
import { ToastProvider } from '@/components/ui/Toast';
import { ThemeProvider } from '@/features/theme/ThemeContext';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000,
        },
    },
});

import { CustomCursor } from '@/components/ui/CustomCursor';

import { ErrorBoundary } from '@/components/layout/ErrorBoundary';

export function AppProvider({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <ErrorBoundary>
                <AuthProvider>
                    <ThemeProvider>
                        <ToastProvider>
                            <BrowserRouter>
                                <CustomCursor />
                                {children}
                            </BrowserRouter>
                        </ToastProvider>
                    </ThemeProvider>
                </AuthProvider>
            </ErrorBoundary>
        </QueryClientProvider>
    );
}
