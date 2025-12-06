import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const moods = [
    { label: 'Angry', emoji: '😡', color: 'bg-red-500' },
    { label: 'Sad', emoji: '😢', color: 'bg-blue-500' },
    { label: 'Anxious', emoji: '😰', color: 'bg-yellow-500' },
    { label: 'Neutral', emoji: '😐', color: 'bg-gray-500' },
    { label: 'Happy', emoji: '😊', color: 'bg-green-500' },
];

interface MoodSelectorProps {
    onSelect: (mood: string) => void;
    selectedMood?: string;
}

export function MoodSelector({ onSelect, selectedMood }: MoodSelectorProps) {
    return (
        <div className="flex flex-wrap gap-4 justify-center">
            {moods.map((mood) => (
                <motion.button
                    key={mood.label}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onSelect(mood.label)}
                    className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                        selectedMood === mood.label
                            ? "border-black dark:border-white bg-[var(--bg-secondary)]"
                            : "border-transparent hover:bg-[var(--bg-secondary)]"
                    )}
                >
                    <span className="text-4xl">{mood.emoji}</span>
                    <span className="text-xs font-bold uppercase tracking-wider">{mood.label}</span>
                    {selectedMood === mood.label && (
                        <motion.div
                            layoutId="mood-indicator"
                            className={cn("h-1 w-8 rounded-full mt-1", mood.color)}
                        />
                    )}
                </motion.button>
            ))}
        </div>
    );
}
