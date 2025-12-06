import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LevelProgressProps {
    level: number;
    progress: number;
    className?: string;
}

export function LevelProgress({ level, progress, className }: LevelProgressProps) {
    return (
        <div className={cn("flex items-center gap-4", className)}>
            <div className="relative">
                <div className="w-12 h-12 flex items-center justify-center bg-black dark:bg-white text-white dark:text-black font-black text-xl rounded-lg transform rotate-3 shadow-[var(--shadow-sharp)]">
                    {level}
                </div>
                <div className="absolute -top-2 -right-2 bg-[var(--accent)] text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-black">
                    LVL
                </div>
            </div>

            <div className="flex-1">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-1">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-3 w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-black dark:bg-white"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    />
                </div>
            </div>
        </div>
    );
}
