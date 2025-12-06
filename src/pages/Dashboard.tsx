import { useEffect, useState, useMemo } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { BoldButton } from '@/components/ui/BoldButton';
import { BoldCard } from '@/components/ui/BoldCard';
import { EmotionHeatmap } from '@/features/analytics/EmotionHeatmap';
import { DailyQuote } from '@/features/dashboard/DailyQuote';
import { EmailVerificationBanner } from '@/features/auth/components/EmailVerificationBanner';
import { ProfileCompleteness } from '@/features/dashboard/ProfileCompleteness';
import { memoriesService, type Memory } from '@/services/db/memoriesService';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@/lib/utils';
import { ParticleText } from '@/components/ui/ParticleText';
import { Skeleton } from '@/components/ui/Skeleton';
import { gamificationService, type UserStats } from '@/services/game/gamificationService';
import { LevelProgress } from '@/features/gamification/components/LevelProgress';
import { BadgeList } from '@/features/gamification/components/BadgeList';
import { Trophy, Flame } from 'lucide-react';

export default function Dashboard() {
    const navigate = useNavigate();
    const [memories, setMemories] = useState<Memory[]>([]);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const [memoriesData, statsData] = await Promise.all([
                    memoriesService.getMemories(),
                    gamificationService.getUserStats()
                ]);

                setMemories(memoriesData || []);
                setStats(statsData);

                // Update streak logic
                if (statsData) {
                    await gamificationService.updateStreak();
                    // Refetch stats to show updated streak immediately
                    const updatedStats = await gamificationService.getUserStats();
                    setStats(updatedStats);
                }

            } catch (error) {
                console.error("Failed to load dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadDashboardData();
    }, []);

    const recentMemories = memories.slice(0, 3);

    const heatmapData = useMemo(() => {
        const counts: Record<string, number> = {};
        memories.forEach(mem => {
            const date = new Date(mem.created_at).toISOString().split('T')[0];
            counts[date] = (counts[date] || 0) + 1;
        });
        return Object.entries(counts).map(([date, count]) => ({
            date,
            intensity: Math.min(count, 4) // Cap intensity at 4
        }));
    }, [memories]);

    return (
        <div className="flex min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto h-screen flex flex-col">
                <EmailVerificationBanner />
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter h-[60px] flex items-center">
                            <ParticleText text="Dashboard" className="w-[300px]" />
                        </h1>
                        <p className="text-[var(--text-secondary)] font-mono mt-2">Welcome back, Traveler.</p>
                    </div>
                    <div className="h-12 w-12 bg-black dark:bg-white rotate-45 shadow-[var(--shadow-sharp)] hidden md:block"></div>
                </header>

                <div className="mb-8">
                    <DailyQuote />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Quick Actions */}
                    <BoldCard className="space-y-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <div className="h-24 w-24 bg-black dark:bg-white rounded-full blur-2xl"></div>
                        </div>
                        <h3 className="text-2xl font-bold uppercase tracking-tight">New Memory</h3>
                        <p className="text-sm text-[var(--text-secondary)] font-mono">Rewrite a negative experience into a positive lesson using AI.</p>
                        <BoldButton size="sm" className="w-full" onClick={() => navigate('/new')}>Start Now</BoldButton>
                    </BoldCard>

                    <BoldCard className="space-y-6">
                        <h3 className="text-2xl font-bold uppercase tracking-tight">Stats</h3>
                        <div className="text-5xl font-black">{loading ? '-' : memories.length}</div>
                        <p className="text-sm text-[var(--text-secondary)] font-mono">Memories Rewritten</p>
                    </BoldCard>

                    <ProfileCompleteness hasMemories={memories.length > 0} />
                </div>

                {/* Gamification Section */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <BoldCard>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-[var(--accent)]" /> Level Progress
                                </h3>
                                <div className="text-xs font-mono flex items-center gap-1">
                                    <Flame className="w-4 h-4 text-orange-500" /> {stats.current_streak} Day Streak
                                </div>
                            </div>
                            <LevelProgress
                                level={stats.level}
                                progress={gamificationService.getLevelProgress(stats.xp, stats.level)}
                            />
                        </BoldCard>
                        <BoldCard>
                            <h3 className="text-xl font-bold uppercase tracking-tight mb-4">Badges</h3>
                            <BadgeList earnedBadges={stats.badges} />
                        </BoldCard>
                    </div>
                )}

                <div className="mt-12">
                    <EmotionHeatmap data={heatmapData} />
                </div>

                {/* Recent Activity Section */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold uppercase tracking-tight mb-6">Recent Activity</h2>
                    {loading ? (
                        <Skeleton className="h-20 w-full rounded-lg" />
                    ) : recentMemories.length === 0 ? (
                        <div className="text-[var(--text-secondary)] font-mono">No activity yet.</div>
                    ) : (
                        <div className="border-2 border-[var(--border)] divide-y-2 divide-[var(--border)]">
                            {recentMemories.map((memory) => (
                                <div key={memory.id} className="p-4 flex items-center justify-between hover:bg-[var(--bg-secondary)] transition-colors">
                                    <div className="flex-1 min-w-0 mr-4">
                                        <p className="font-bold truncate">{memory.mood || "Memory"}</p>
                                        <p className="text-xs text-[var(--text-secondary)] font-mono truncate">
                                            {formatDate(memory.created_at)}
                                        </p>
                                    </div>
                                    <BoldButton variant="ghost" size="sm" onClick={() => navigate('/history')}>View</BoldButton>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
