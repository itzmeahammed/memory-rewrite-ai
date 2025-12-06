import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import Dashboard from '@/pages/Dashboard';
import NewMemory from '@/pages/NewMemory';
import HistoryPage from '@/pages/HistoryPage';
import SettingsPage from '@/pages/SettingsPage';
import NotFoundPage from '@/pages/NotFoundPage';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { useAuth } from '@/features/auth/context/AuthContext';
import MeditationPage from '@/pages/MeditationPage';
import type { ReactNode } from 'react';

function PublicRoute({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth();
    if (!loading && user) {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
}

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />


            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />



            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/new" element={<NewMemory />} />
                <Route path="/meditate" element={<MeditationPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/settings" element={<SettingsPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}
