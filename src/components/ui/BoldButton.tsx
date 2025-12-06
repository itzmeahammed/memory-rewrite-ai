import { motion, type HTMLMotionProps, useMotionValue, useSpring } from "framer-motion";
import { type ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface BoldButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg" | "xl";
    isLoading?: boolean;
    children?: ReactNode;
    magnetic?: boolean;
}

export function BoldButton({
    className,
    variant = "primary",
    size = "md",
    isLoading,
    children,
    magnetic = true,
    ...props
}: BoldButtonProps) {
    const ref = useRef<HTMLButtonElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!magnetic || !ref.current) return;
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        x.set(middleX * 0.15); // Adjust strength here
        y.set(middleY * 0.15);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const baseStyles = "relative inline-flex items-center justify-center font-bold uppercase tracking-wider transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

    const variants = {
        primary: "bg-black text-white border-2 border-black hover:bg-white hover:text-black dark:bg-white dark:text-black dark:border-white dark:hover:bg-black dark:hover:text-white",
        secondary: "bg-transparent text-black border-2 border-black hover:bg-black hover:text-white dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black",
        ghost: "bg-transparent text-black hover:bg-gray-100 dark:text-white dark:hover:bg-zinc-800",
    };

    const sizes = {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-8 text-sm",
        lg: "h-14 px-10 text-base",
        xl: "h-16 px-12 text-lg",
    };

    return (
        <motion.button
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: springX, y: springY }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </motion.button>
    );
}
