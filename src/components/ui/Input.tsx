import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export interface InputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
    label?: string;
    error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, ...props }, ref) => {
        return (
            <div className="space-y-2 w-full">
                {label && (
                    <label className="text-sm font-bold uppercase tracking-wider block">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        type={type}
                        className={cn(
                            "flex h-10 w-full bg-transparent border-b-2 border-[var(--border)] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--text-secondary)] focus-visible:outline-none focus-visible:border-black dark:focus-visible:border-white disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200",
                            error && "border-red-500 focus-visible:border-red-500",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                    <motion.div
                        initial={false}
                        animate={{ scaleX: 0 }}
                        whileFocus={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-black dark:bg-white origin-left pointer-events-none"
                    />
                </div>
                {error && (
                    <p className="text-xs font-medium text-red-500 animate-in slide-in-from-top-1">
                        {error}
                    </p>
                )}
            </div>
        )
    }
)
Input.displayName = "Input"

export { Input }
