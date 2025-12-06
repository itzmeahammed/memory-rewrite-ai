import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Memory } from '@/services/db/memoriesService';

interface RelatedMemoriesProps {
    currentInput: string;
    savedMemories: Memory[];
    onSelect: (memory: Memory) => void;
}

export function RelatedMemories({ currentInput, savedMemories, onSelect }: RelatedMemoriesProps) {
    const related = useMemo(() => {
        if (!currentInput || currentInput.length < 10) return [];

        const keywords = currentInput.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(w => w.length > 3 && !['this', 'that', 'with', 'from', 'have', 'what'].includes(w));

        if (keywords.length === 0) return [];

        return savedMemories
            .map(mem => {
                const memText = (mem.original_text + ' ' + mem.rewritten_text).toLowerCase();
                let score = 0;
                keywords.forEach(k => {
                    if (memText.includes(k)) score++;
                });
                return { memory: mem, score };
            })
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map(item => item.memory);
    }, [currentInput, savedMemories]);

    if (related.length === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-4 p-4 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 rounded-lg"
            >
                <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-indigo-500">
                    <Link2 className="w-3 h-3" />
                    <span>Related Memories</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    {related.map(mem => (
                        <div
                            key={mem.id}
                            onClick={() => onSelect(mem)}
                            className="p-2 bg-white dark:bg-black border border-[var(--border)] rounded cursor-pointer hover:border-indigo-400 transition-colors text-xs"
                        >
                            <div className="font-bold truncate opacity-70 mb-1">{new Date(mem.created_at).toLocaleDateString()}</div>
                            <div className="line-clamp-1 opacity-50">{mem.original_text}</div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
