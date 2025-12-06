import { supabase } from '@/lib/supabase';

export interface Memory {
    id: string;
    user_id: string;
    original_text: string;
    rewritten_text: string;
    mood: string;
    unlock_date?: string; // ISO string
    created_at: string;
}

export const memoriesService = {
    async saveMemory(originalText: string, rewrittenText: string, mood: string, unlockDate?: Date) {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error("User not authenticated");
        }

        const { data, error } = await supabase
            .from('memories')
            .insert([
                {
                    user_id: user.id,
                    original_text: originalText,
                    rewritten_text: rewrittenText,
                    mood: mood,
                    unlock_date: unlockDate ? unlockDate.toISOString() : null
                }
            ])
            .select()
            .single();

        if (error) throw error;
        return data as Memory;
    },

    async getMemories() {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            // Return empty if not logged in, or throw depending on UX
            return [];
        }

        const { data, error } = await supabase
            .from('memories')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Memory[];
    },

    async deleteMemory(id: string) {
        const { error } = await supabase
            .from('memories')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
