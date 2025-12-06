import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface BoldCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    noPadding?: boolean;
}

export function BoldCard({ className, children, noPadding = false, ...props }: BoldCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5, boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)" }}
            className={cn(
                "border-2 border-black dark:border-white bg-[var(--bg-secondary)] transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]",
                !noPadding && "p-8",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}
