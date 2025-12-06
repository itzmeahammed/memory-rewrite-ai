import { BoldCard } from "@/components/ui/BoldCard";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const quotes = [
    "The past is a place of reference, not a place of residence.",
    "We are not what happened to us, we are what we wish to become.",
    "Memory is the scribe of the soul.",
    "Rewrite the narrative, reclaim your power.",
    "Every moment is a fresh beginning."
];

export function DailyQuote() {
    const [quote, setQuote] = useState("");

    useEffect(() => {
        // Pick a random quote for now, could be daily based on date
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setQuote(randomQuote);
    }, []);

    return (
        <BoldCard className="bg-black text-white dark:bg-white dark:text-black border-black dark:border-white">
            <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider opacity-70">Daily Insight</span>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="font-mono text-lg md:text-xl leading-relaxed"
                >
                    "{quote}"
                </motion.p>
            </div>
        </BoldCard>
    );
}
