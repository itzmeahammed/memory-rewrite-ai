import { NavLink } from 'react-router-dom';
import { Home, PenTool, History, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { cn } from '@/lib/utils';

export function Sidebar() {
    const { signOut } = useAuth();

    const links = [
        { to: '/dashboard', icon: Home, label: 'Home' },
        { to: '/new', icon: PenTool, label: 'Rewrite' },
        { to: '/history', icon: History, label: 'History' },
        { to: '/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <aside className="hidden md:flex flex-col w-64 h-screen border-r border-[var(--border)] bg-[var(--bg-secondary)] p-4 sticky top-0">
            <div className="mb-8 px-4 pt-4">
                <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">
                    Memory<br />
                    <span className="text-[var(--text-secondary)]">Rewriter</span>
                </h1>
            </div>

            <nav className="flex-1 space-y-2">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wide transition-all duration-200 border-l-2 border-transparent hover:bg-[var(--bg-primary)] hover:pl-6",
                            isActive ? "border-black dark:border-white bg-[var(--bg-primary)] pl-6" : "text-[var(--text-secondary)]"
                        )}
                    >
                        <link.icon className="h-5 w-5" />
                        {link.label}
                    </NavLink>
                ))}
            </nav>

            <button
                onClick={() => signOut()}
                className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wide text-red-500 hover:bg-red-50 dark:hover:bg-red-950/10 transition-colors mt-auto w-full text-left"
            >
                <LogOut className="h-5 w-5" />
                Sign Out
            </button>
        </aside>
    );
}
