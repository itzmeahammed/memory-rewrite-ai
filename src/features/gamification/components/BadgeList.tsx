import { BADGES } from '@/services/game/gamificationService';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/ui/Tooltip';

interface BadgeListProps {
    earnedBadges: string[];
}

export function BadgeList({ earnedBadges }: BadgeListProps) {
    return (
        <div className="grid grid-cols-5 gap-2">
            {BADGES.map(badge => {
                const isEarned = earnedBadges.includes(badge.id);
                const tooltipContent = (
                    <div className="text-center p-1">
                        <div className="font-bold whitespace-nowrap">{badge.name}</div>
                        <div className="text-[10px] sm:text-xs max-w-[150px] whitespace-normal leading-tight mx-auto">{badge.description}</div>
                        {!isEarned && <div className="text-[10px] opacity-70 mt-1 font-mono uppercase">Locked</div>}
                    </div>
                );

                return (
                    <Tooltip key={badge.id} content={tooltipContent} className="h-auto py-2">
                        <div className={cn(
                            "aspect-square flex flex-col items-center justify-center p-2 border rounded-lg transition-all cursor-default",
                            isEarned
                                ? "bg-white dark:bg-black border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)]"
                                : "bg-[var(--bg-secondary)] border-transparent opacity-50 grayscale"
                        )}>
                            <span className="text-2xl mb-1 filter drop-shadow-sm">{badge.icon}</span>
                        </div>
                    </Tooltip>
                );
            })}
        </div>
    );
}
