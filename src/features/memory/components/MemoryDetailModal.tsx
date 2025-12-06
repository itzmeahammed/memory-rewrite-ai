import { Dialog, DialogContent } from '../../../components/ui/Dialog';
import { Badge } from '@/components/ui/Badge';
import { BoldButton } from '@/components/ui/BoldButton';
import { motion } from 'framer-motion';
import { Calendar, Brain, Share2, Quote, Sparkles } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { type Memory } from '@/services/db/memoriesService';

interface MemoryDetailModalProps {
    memory: Memory | null;
    open: boolean;
    onClose: () => void;
}

export function MemoryDetailModal({ memory, open, onClose }: MemoryDetailModalProps) {
    if (!memory) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 bg-transparent border-none sm:max-w-4xl overflow-hidden rounded-2xl shadow-2xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl overflow-hidden flex flex-col md:flex-row h-[85vh] md:h-[600px]"
                >
                    {/* Left Panel: Original Memory (Darker) */}
                    <div className="flex-1 bg-black/5 dark:bg-white/5 p-8 flex flex-col border-r border-[var(--border)] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-transparent"></div>
                        <div className="flex items-center gap-2 mb-6 text-red-500/80 uppercase tracking-widest text-xs font-bold">
                            <Brain className="w-4 h-4" /> Original Thought
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <p className="font-mono text-lg leading-relaxed whitespace-pre-wrap opacity-90">
                                {memory.original_text}
                            </p>
                        </div>

                        <div className="mt-8 pt-6 border-t border-[var(--border)] flex flex-wrap gap-2">
                            {memory.mood && (
                                <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                                    Mood: {memory.mood}
                                </Badge>
                            )}
                            <div className="text-xs font-mono opacity-50 flex items-center gap-1 ml-auto">
                                <Calendar className="w-3 h-3" />
                                {formatDate(memory.created_at)}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Rewritten Memory (Brighter/Premium) */}
                    <div className="flex-1 p-8 flex flex-col relative bg-[var(--bg-primary)]">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent to-green-500"></div>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 uppercase tracking-widest text-xs font-bold">
                                <Sparkles className="w-4 h-4" /> Reframed Perspective
                            </div>
                            <div className="flex gap-2">
                                <BoldButton size="sm" variant="ghost" className="h-8 w-8 p-0">
                                    <Share2 className="w-4 h-4" />
                                </BoldButton>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                            {/* Decorative Quote Icon */}
                            <Quote className="absolute -top-2 -left-2 w-8 h-8 opacity-10 rotate-180" />

                            <p className="font-serif text-xl md:text-2xl leading-relaxed text-[var(--text-primary)]">
                                {memory.rewritten_text}
                            </p>

                            <Quote className="absolute bottom-0 right-0 w-8 h-8 opacity-10" />
                        </div>

                        <div className="mt-8 pt-6 border-t border-[var(--border)]">
                            <div className="flex justify-between items-center text-sm text-[var(--text-secondary)]">
                                <span className="font-mono text-xs uppercase tracking-wider">Perspective Shift</span>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-green-500/50"></div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Decorative background element */}
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-green-500/5 blur-[80px] rounded-full pointer-events-none"></div>
                    </div>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
}
