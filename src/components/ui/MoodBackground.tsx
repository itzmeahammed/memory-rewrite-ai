import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface MoodBackgroundProps {
    mood: string;
    sentimentScore?: number;
}

export function MoodBackground({ mood, sentimentScore = 0 }: MoodBackgroundProps) {
    const [color, setColor] = useState("bg-transparent");

    useEffect(() => {
        // Map moods to subtle background gradients
        // We use opacity-5 or similar to keep it extremely subtle
        if (sentimentScore > 2) setColor("from-yellow-100/20 to-orange-100/20 dark:from-yellow-900/10 dark:to-orange-900/10");
        else if (sentimentScore < -2) setColor("from-blue-100/20 to-gray-100/20 dark:from-blue-900/10 dark:to-gray-900/10");
        else setColor("from-transparent to-transparent");

        // Specific mood overrides if needed
        if (mood.includes("Happy") || mood.includes("Joy")) setColor("from-yellow-200/20 to-transparent dark:from-yellow-900/10");
        if (mood.includes("Sad") || mood.includes("Grief")) setColor("from-blue-200/20 to-transparent dark:from-blue-900/10");
        if (mood.includes("Anger")) setColor("from-red-200/20 to-transparent dark:from-red-900/10");

    }, [mood, sentimentScore]);

    return (
        <motion.div
            className={cn("absolute inset-0 z-0 pointer-events-none bg-gradient-to-br transition-colors duration-1000", color)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        />
    );
}
