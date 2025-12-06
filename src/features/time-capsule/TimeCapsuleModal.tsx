import { useState } from 'react';
import { BoldButton } from '@/components/ui/BoldButton';
import { BoldCard } from '@/components/ui/BoldCard';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Calendar } from 'lucide-react';


interface TimeCapsuleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (date: Date) => void;
}

export function TimeCapsuleModal({ isOpen, onClose, onSave }: TimeCapsuleModalProps) {
    const [selectedDate, setSelectedDate] = useState<string>('');

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-md"
                >
                    <BoldCard className="relative bg-[var(--bg-primary)]">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-black text-white dark:bg-white dark:text-black">
                                    <Lock className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight">Time Capsule</h2>
                                    <p className="text-sm text-[var(--text-secondary)] font-mono">Lock this memory until the future.</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider">Unlock Date</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full bg-[var(--bg-secondary)] border-2 border-[var(--border)] p-3 pl-10 focus:border-black dark:focus:border-white outline-none font-mono"
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                    <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-[var(--text-secondary)]" />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <BoldButton variant="ghost" onClick={onClose}>Cancel</BoldButton>
                                <BoldButton
                                    onClick={() => onSave(new Date(selectedDate))}
                                    disabled={!selectedDate}
                                >
                                    Lock Memory
                                </BoldButton>
                            </div>
                        </div>
                    </BoldCard>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
