import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DrawerProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    side?: "left" | "right"
    className?: string
}

export function Drawer({ isOpen, onClose, children, side = "left", className }: DrawerProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    />

                    {/* Drawer Panel */}
                    <motion.div
                        initial={{ x: side === "left" ? "-100%" : "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: side === "left" ? "-100%" : "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className={cn(
                            "fixed top-0 bottom-0 z-50 w-[300px] bg-[var(--bg-primary)] border-r-2 border-black dark:border-white p-6 shadow-2xl",
                            side === "right" && "right-0 border-l-2 border-r-0",
                            side === "left" && "left-0",
                            className
                        )}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                        {children}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
