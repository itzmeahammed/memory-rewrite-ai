import { BoldCard } from '@/components/ui/BoldCard';
import { cn } from '@/lib/utils';

interface EmotionHeatmapProps {
    data: { date: string; intensity: number }[]; // intensity 0-4
}

export function EmotionHeatmap({ data }: EmotionHeatmapProps) {
    // Generate last 365 days for demo
    const days = Array.from({ length: 365 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (364 - i));
        return d.toISOString().split('T')[0];
    });

    const getIntensity = (date: string) => {
        const entry = data.find(d => d.date === date);
        return entry ? entry.intensity : 0;
    };

    const getColor = (intensity: number) => {
        switch (intensity) {
            case 1: return "bg-neutral-200 dark:bg-neutral-800";
            case 2: return "bg-neutral-400 dark:bg-neutral-600";
            case 3: return "bg-neutral-600 dark:bg-neutral-400";
            case 4: return "bg-black dark:bg-white";
            default: return "bg-neutral-100 dark:bg-neutral-900";
        }
    };

    return (
        <BoldCard className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h3 className="text-2xl font-bold uppercase tracking-tight">Emotional Resilience</h3>
                    <p className="text-sm text-[var(--text-secondary)] font-mono">Your year in pixels.</p>
                </div>
                <div className="flex gap-2 text-xs font-mono text-[var(--text-secondary)]">
                    <span>Less</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 bg-neutral-100 dark:bg-neutral-900"></div>
                        <div className="w-3 h-3 bg-neutral-400 dark:bg-neutral-600"></div>
                        <div className="w-3 h-3 bg-black dark:bg-white"></div>
                    </div>
                    <span>More</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-1 justify-center">
                {days.map((date) => (
                    <div
                        key={date}
                        className={cn(
                            "w-3 h-3 transition-colors hover:scale-125",
                            getColor(getIntensity(date))
                        )}
                        title={`${date}: Level ${getIntensity(date)}`}
                    />
                ))}
            </div>
        </BoldCard>
    );
}
