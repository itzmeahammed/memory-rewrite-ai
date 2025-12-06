import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface TooltipProps {
    content: React.ReactNode
    children: React.ReactNode
    className?: string
}

export function Tooltip({ content, children, className }: TooltipProps) {
    const [isVisible, setIsVisible] = React.useState(false)

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            onFocus={() => setIsVisible(true)}
            onBlur={() => setIsVisible(false)}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                            "absolute z-50 px-2 py-1 text-xs font-bold text-white bg-black dark:bg-white dark:text-black whitespace-nowrap -translate-x-1/2 left-1/2 bottom-full mb-2 pointer-events-none",
                            className
                        )}
                    >
                        {content}
                        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-black dark:border-t-white"></div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
