import { supabase } from '@/lib/supabase';

export interface UserStats {
    user_id: string;
    xp: number;
    level: number;
    current_streak: number;
    longest_streak: number;
    last_activity_date: string | null;
    badges: string[];
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    xpReward: number;
}

export const BADGES: Badge[] = [
    { id: 'first_step', name: 'First Step', description: 'Rewrote your first memory', icon: '🌱', xpReward: 50 },
    { id: 'streak_3', name: 'Momentum', description: '3-day streak', icon: '🔥', xpReward: 100 },
    { id: 'streak_7', name: 'Stoic Week', description: '7-day streak', icon: '🛡️', xpReward: 250 },
    { id: 'level_5', name: 'Scholar', description: 'Reached Level 5', icon: '📜', xpReward: 200 },
    { id: 'zen_master', name: 'Zen Master', description: 'Used Zen Mode 10 times', icon: '🧘', xpReward: 150 },
];

class GamificationService {
    async getUserStats(): Promise<UserStats | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        let { data, error } = await supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (error && error.code === 'PGRST116') {
            // No stats found, create them
            const { data: newData, error: createError } = await supabase
                .from('user_stats')
                .insert([{ user_id: user.id }])
                .select()
                .single();

            if (createError) {
                console.error("Error creating stats:", createError);
                return null;
            }
            return newData;
        }

        return data;
    }

    async addXp(amount: number): Promise<{ newLevel: number, leveledUp: boolean }> {
        const stats = await this.getUserStats();
        if (!stats) return { newLevel: 1, leveledUp: false };

        const newXp = stats.xp + amount;
        // Simple level formula: Level = floor(sqrt(XP / 100)) + 1
        // XP needed for level N: 100 * (N-1)^2
        const newLevel = Math.floor(Math.sqrt(newXp / 100)) + 1;
        const leveledUp = newLevel > stats.level;

        const updates: Partial<UserStats> = {
            xp: newXp,
            level: newLevel
        };

        await supabase
            .from('user_stats')
            .update(updates)
            .eq('user_id', stats.user_id);

        return { newLevel, leveledUp };
    }

    async updateStreak(): Promise<void> {
        const stats = await this.getUserStats();
        if (!stats) return;

        const today = new Date().toISOString().split('T')[0];
        const lastActivity = stats.last_activity_date;

        if (lastActivity === today) return; // Already updated today

        let newStreak = 1;

        if (lastActivity) {
            const lastDate = new Date(lastActivity);
            const currentDate = new Date(today);
            const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                newStreak = stats.current_streak + 1;
            } else {
                newStreak = 1; // Streak broken
            }
        }

        const updates: Partial<UserStats> = {
            current_streak: newStreak,
            longest_streak: Math.max(newStreak, stats.longest_streak),
            last_activity_date: today
        };

        if (newStreak === 3) await this.awardBadge('streak_3');
        if (newStreak === 7) await this.awardBadge('streak_7');

        await supabase
            .from('user_stats')
            .update(updates)
            .eq('user_id', stats.user_id);
    }

    async awardBadge(badgeId: string): Promise<boolean> {
        const stats = await this.getUserStats();
        if (!stats) return false;

        if (stats.badges.includes(badgeId)) return false; // Already has badge

        const newBadges = [...stats.badges, badgeId];
        await supabase
            .from('user_stats')
            .update({ badges: newBadges })
            .eq('user_id', stats.user_id);

        // Award badge XP
        const badge = BADGES.find(b => b.id === badgeId);
        if (badge) await this.addXp(badge.xpReward);

        return true;
    }

    getLevelProgress(xp: number, level: number) {
        const currentLevelBaseXp = 100 * Math.pow(level - 1, 2);
        const nextLevelBaseXp = 100 * Math.pow(level, 2);
        const needed = nextLevelBaseXp - currentLevelBaseXp;
        const current = xp - currentLevelBaseXp;
        return (current / needed) * 100;
    }
}

export const gamificationService = new GamificationService();
