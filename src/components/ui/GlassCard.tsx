import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    intensity?: "low" | "medium" | "high";
}

export function GlassCard({ children, className, intensity = "medium", ...props }: GlassCardProps) {
    const intensityStyles = {
        low: "bg-white/30 dark:bg-black/30 backdrop-blur-sm border-white/20 dark:border-white/10",
        medium: "bg-white/50 dark:bg-black/50 backdrop-blur-md border-white/30 dark:border-white/10",
        high: "bg-white/70 dark:bg-black/70 backdrop-blur-lg border-white/40 dark:border-white/20",
    };

    return (
        <motion.div
            className={cn(
                "rounded-xl border shadow-lg relative overflow-hidden",
                intensityStyles[intensity],
                className
            )}
            {...props}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            {children}
        </motion.div>
    );
}
