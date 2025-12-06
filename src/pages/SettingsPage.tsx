import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { BoldCard } from '@/components/ui/BoldCard';
import { BoldButton } from '@/components/ui/BoldButton';
import { Tabs } from '@/components/ui/Tabs';
import { TextScramble } from '@/components/ui/TextScramble';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { User, Moon, Sun, Shield } from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useTheme } from '@/features/theme/ThemeContext';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

export default function SettingsPage() {
    const { user, signOut } = useAuth();
    const { theme, setTheme } = useTheme();
    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState(user?.user_metadata?.full_name || "");
    const [updating, setUpdating] = useState(false);

    const handleUpdateProfile = async () => {
        if (!newUsername.trim()) return;
        setUpdating(true);
        try {
            const { error } = await supabase.auth.updateUser({
                data: { full_name: newUsername }
            });
            if (error) throw error;
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        } finally {
            setUpdating(false);
        }
    };

    const tabs = [
        {
            id: 'profile',
            label: 'Profile',
            content: (
                <section className="space-y-4 max-w-2xl">
                    <h2 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
                        <User className="h-5 w-5" /> Profile
                    </h2>
                    <BoldCard>
                        <div className="flex items-center gap-4 mb-6">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={user?.user_metadata?.avatar_url} />
                                <AvatarFallback>{user?.email?.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                {isEditing ? (
                                    <div className="flex gap-2">
                                        <input
                                            value={newUsername}
                                            onChange={(e) => setNewUsername(e.target.value)}
                                            className="bg-[var(--bg-secondary)] border border-[var(--border)] p-2 rounded w-full"
                                            placeholder="Enter username"
                                        />
                                        <BoldButton onClick={handleUpdateProfile} isLoading={updating} size="sm">Save</BoldButton>
                                        <BoldButton onClick={() => setIsEditing(false)} variant="ghost" size="sm">Cancel</BoldButton>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="font-bold text-lg">{user?.user_metadata?.full_name || user?.email}</p>
                                        <p className="text-sm text-[var(--text-secondary)]">{user?.email}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        {!isEditing && (
                            <BoldButton variant="secondary" size="sm" onClick={() => setIsEditing(true)}>Edit Profile</BoldButton>
                        )}
                    </BoldCard>
                    <div className="pt-4">
                        <BoldButton onClick={() => signOut()} className="w-full">Sign Out</BoldButton>
                    </div>
                </section>
            )
        },
        {
            id: 'appearance',
            label: 'Appearance',
            content: (
                <section className="space-y-4 max-w-2xl">
                    <h2 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
                        <Sun className="h-5 w-5" /> Appearance
                    </h2>
                    <BoldCard className="flex items-center justify-between">
                        <div>
                            <p className="font-bold">Theme</p>
                            <p className="text-sm text-[var(--text-secondary)]">Current: <span className="uppercase font-bold">{theme}</span></p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setTheme('dark')}
                                className={cn("p-2 rounded transition-colors", theme === 'dark' ? "bg-black text-white" : "border border-black dark:border-white")}
                            >
                                <Moon className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setTheme('light')}
                                className={cn("p-2 rounded transition-colors", theme === 'light' ? "bg-black text-white" : "border border-black dark:border-white")}
                            >
                                <Sun className="h-4 w-4" />
                            </button>
                        </div>
                    </BoldCard>
                </section>
            )
        },
        {
            id: 'privacy',
            label: 'Data & Privacy',
            content: (
                <section className="space-y-4 max-w-2xl">
                    <h2 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
                        <Shield className="h-5 w-5" /> Data & Privacy
                    </h2>
                    <BoldCard className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-bold">Export Data</p>
                                <p className="text-sm text-[var(--text-secondary)]">Download all your memories.</p>
                            </div>
                            <BoldButton variant="ghost" size="sm">Export CSV</BoldButton>
                        </div>
                        <div className="h-px bg-[var(--border)]"></div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-bold text-red-500">Delete Account</p>
                                <p className="text-sm text-[var(--text-secondary)]">Permanently remove all data.</p>
                            </div>
                            <BoldButton className="bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600 text-white" size="sm">Delete</BoldButton>
                        </div>
                    </BoldCard>
                </section>
            )
        }
    ];

    return (
        <div className="flex min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto h-screen">
                <header className="mb-8">
                    <h1 className="text-4xl font-black uppercase tracking-tighter">
                        <TextScramble text="Settings" />
                    </h1>
                    <p className="text-[var(--text-secondary)] font-mono mt-2">Configure your experience.</p>
                </header>

                <Tabs tabs={tabs} />
            </main>
        </div>
    );
}
