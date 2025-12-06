import { BoldCard } from '@/components/ui/BoldCard';
import { useAuth } from '@/features/auth/context/AuthContext';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ProfileCompletenessProps {
    hasMemories: boolean;
}

export function ProfileCompleteness({ hasMemories }: ProfileCompletenessProps) {
    const { user } = useAuth();
    const navigate = useNavigate();

    const hasUsername = !!(user?.user_metadata?.full_name || user?.user_metadata?.username);
    const isVerified = !!user?.email_confirmed_at;

    const steps = [
        {
            id: 'signup',
            label: 'Sign Up',
            completed: true,
            action: () => { }
        },
        {
            id: 'verify',
            label: 'Verify Email',
            completed: isVerified,
            action: () => alert("Please check your email inbox for a verification link.")
        },
        {
            id: 'username',
            label: 'Set Username',
            completed: hasUsername,
            action: () => navigate('/settings')
        },
        {
            id: 'memory',
            label: 'First Memory',
            completed: hasMemories,
            action: () => navigate('/new')
        },
    ];

    const completedCount = steps.filter(s => s.completed).length;
    const progress = (completedCount / steps.length) * 100;

    return (
        <BoldCard className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-bold uppercase tracking-tight">Profile Status</h3>
                <span className="font-mono text-sm">{Math.round(progress)}%</span>
            </div>

            <div className="h-4 bg-[var(--bg-secondary)] w-full overflow-hidden relative rounded-full border border-[var(--border)]">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={cn(
                        "h-full transition-all duration-500",
                        progress === 100 ? "bg-green-500" : "bg-black dark:bg-white"
                    )}
                />
            </div>

            <ul className="space-y-3">
                {steps.map((step, i) => (
                    <li
                        key={step.id}
                        className={cn(
                            "flex items-center justify-between p-2 rounded-lg transition-colors border border-transparent",
                            !step.completed ? "hover:bg-[var(--bg-secondary)] cursor-pointer hover:border-[var(--border)]" : ""
                        )}
                        onClick={() => !step.completed && step.action()}
                    >
                        <div className="flex items-center gap-3 text-sm">
                            {step.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : (
                                <Circle className="w-5 h-5 text-[var(--text-secondary)]" />
                            )}
                            <span className={cn(
                                "font-medium",
                                step.completed ? "line-through opacity-50" : ""
                            )}>
                                {step.label}
                            </span>
                        </div>
                        {!step.completed && (
                            <ArrowRight className="w-4 h-4 text-[var(--text-secondary)] opacity-0 group-hover:opacity-100" />
                        )}
                    </li>
                ))}
            </ul>
        </BoldCard>
    );
}
