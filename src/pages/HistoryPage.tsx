import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { BoldCard } from '@/components/ui/BoldCard';
import { BoldButton } from '@/components/ui/BoldButton';
import { formatDate } from '@/lib/utils';
import { memoriesService, type Memory } from '@/services/db/memoriesService';
import { Lock, Trash2, Calendar } from 'lucide-react';

import { TextScramble } from '@/components/ui/TextScramble';
import { Badge } from '@/components/ui/Badge';
import { MemoryDetailModal } from '@/features/memory/components/MemoryDetailModal';

export default function HistoryPage() {
    const [memories, setMemories] = useState<Memory[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        loadMemories();
    }, []);

    const loadMemories = async () => {
        try {
            const data = await memoriesService.getMemories();
            setMemories(data || []);
        } catch (error) {
            console.error("Failed to load memories:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this memory?")) {
            try {
                await memoriesService.deleteMemory(id);
                setMemories(prev => prev.filter(m => m.id !== id));
            } catch (error) {
                console.error("Failed to delete:", error);
            }
        }
    };

    return (
        <div className="flex min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto h-screen">
                <header className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter">
                            <TextScramble text="History" />
                        </h1>
                        <p className="text-[var(--text-secondary)] font-mono mt-2">Your rewritten narrative.</p>
                    </div>
                    <div className="text-sm font-mono opacity-50">
                        {memories.length} {memories.length === 1 ? 'Memory' : 'Memories'}
                    </div>
                </header>

                {loading ? (
                    <div className="text-center py-20 opacity-50 font-mono animate-pulse">Loading your timeline...</div>
                ) : memories.length === 0 ? (
                    <div className="text-center py-20 opacity-50 font-mono">
                        No memories recorded yet. <br />
                        <a href="/new" className="underline hover:text-[var(--text-primary)]">Start rewriting your past.</a>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {memories.map((memory) => {
                            const isLocked = memory.unlock_date && new Date(memory.unlock_date) > new Date();
                            return (
                                <BoldCard key={memory.id} className={`flex flex-col md:flex-row gap-6 relative group transition-all ${isLocked ? 'opacity-75 border-dashed' : ''}`}>
                                    {/* Delete Button (Hover) */}
                                    {!isLocked && (
                                        <button
                                            onClick={() => handleDelete(memory.id)}
                                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 rounded-full"
                                            title="Delete Memory"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}

                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Original</span>
                                            {memory.mood && (
                                                <Badge variant="outline" className="text-[10px] py-0">
                                                    {memory.mood}
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="font-mono text-sm opacity-60 line-clamp-3 hover:line-clamp-none transition-all">
                                            {memory.original_text}
                                        </p>
                                    </div>

                                    <div className="hidden md:block w-px bg-[var(--border)]"></div>

                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Rewritten</span>
                                            {isLocked && (
                                                <Badge variant="destructive" className="gap-1 text-[10px] py-0">
                                                    <Lock className="w-3 h-3" /> LOCKED
                                                </Badge>
                                            )}
                                        </div>

                                        {isLocked ? (
                                            <div className="font-mono text-lg font-bold opacity-50 select-none blur-sm">
                                                This memory is locked in a time capsule.
                                                It will reveal itself when the time is right.
                                            </div>
                                        ) : (
                                            <p className="font-mono text-lg font-bold">
                                                {memory.rewritten_text}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col justify-between items-end min-w-[140px] text-right">
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-xs font-mono text-[var(--text-secondary)]">
                                                {formatDate(memory.created_at)}
                                            </span>
                                            {isLocked && memory.unlock_date && (
                                                <span className="text-xs font-mono text-red-500 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    Unlocks {new Date(memory.unlock_date).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>

                                        {!isLocked && (
                                            <BoldButton variant="ghost" size="sm" onClick={() => {
                                                setSelectedMemory(memory);
                                                setIsModalOpen(true);
                                            }}>
                                                Edit / View
                                            </BoldButton>
                                        )}
                                    </div>
                                </BoldCard>
                            );
                        })}
                    </div>
                )}
                <MemoryDetailModal
                    memory={selectedMemory}
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            </main>
        </div>
    );
}
