import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Tooltip } from '@/components/ui/Tooltip';
import type { SentimentResult, DistortionResult } from '@/lib/sentiment';
import { Brain, AlertTriangle, Activity } from 'lucide-react';

interface SentimentAnalysisProps {
    sentiment: SentimentResult | null;
    distortions: DistortionResult[];
}

export function SentimentAnalysis({ sentiment, distortions }: SentimentAnalysisProps) {
    if (!sentiment) return null;

    // Normalize score to 0-100 for the bar (assuming score range -5 to 5 roughly)
    const normalizedScore = Math.min(Math.max((sentiment.score + 5) * 10, 0), 100);

    // Determine color based on score
    const getColor = (score: number) => {
        if (score > 0) return "bg-green-500";
        if (score < 0) return "bg-red-500";
        return "bg-neutral-500";
    };

    const getLabel = (score: number) => {
        if (score > 2) return "Very Positive";
        if (score > 0) return "Positive";
        if (score === 0) return "Neutral";
        if (score > -3) return "Negative";
        return "Very Negative";
    };

    return (
        <div className="space-y-4 p-4 bg-[var(--bg-secondary)]/50 rounded-lg border border-[var(--border)]">
            {/* Header */}
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-70">
                <Activity className="w-4 h-4" />
                <span>Emotional Analysis</span>
            </div>

            {/* Sentiment Bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                    <span>Sentiment</span>
                    <span className={cn("font-bold", sentiment.score > 0 ? "text-green-600 dark:text-green-400" : sentiment.score < 0 ? "text-red-600 dark:text-red-400" : "")}>
                        {getLabel(sentiment.score)} ({sentiment.score})
                    </span>
                </div>
                <div className="h-2 w-full bg-[var(--bg-primary)] rounded-full overflow-hidden">
                    <motion.div
                        className={cn("h-full transition-colors duration-500", getColor(sentiment.score))}
                        initial={{ width: "50%" }}
                        animate={{ width: `${normalizedScore}%` }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    />
                </div>
            </div>

            {/* Distortions */}
            {distortions.length > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-70 text-red-500">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Cognitive Distortions Detected</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {distortions.map((distortion, idx) => (
                            <Tooltip
                                key={idx}
                                content={
                                    <div className="max-w-[200px] whitespace-normal">
                                        <p className="font-bold mb-1">{distortion.name}</p>
                                        <p className="text-[10px] opacity-80 mb-1">{distortion.description}</p>
                                        <p className="text-[10px] font-mono bg-white/10 p-1 rounded">Match: "{distortion.match}"</p>
                                    </div>
                                }
                            >
                                <Badge variant="destructive" className="cursor-help">
                                    {distortion.name}
                                </Badge>
                            </Tooltip>
                        ))}
                    </div>
                </div>
            )}

            {/* No Distortions - Positive Reinforcement */}
            {distortions.length === 0 && sentiment.score < 0 && (
                <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 font-mono">
                    <Brain className="w-3 h-3" />
                    <span>No obvious cognitive distortions detected. Good job!</span>
                </div>
            )}
        </div>
    );
}
