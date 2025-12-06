import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface Tab {
    id: string
    label: string
    content: React.ReactNode
}

interface TabsProps {
    tabs: Tab[]
    defaultTab?: string
    className?: string
}

export function Tabs({ tabs, defaultTab, className }: TabsProps) {
    const [activeTab, setActiveTab] = React.useState(defaultTab || tabs[0].id)

    return (
        <div className={cn("w-full", className)}>
            <div className="flex space-x-8 border-b border-[var(--border)] mb-6 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "relative pb-4 text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap",
                            activeTab === tab.id ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        )}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-[2px] bg-black dark:bg-white"
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                    </button>
                ))}
            </div>
            <div className="relative">
                {tabs.map((tab) => (
                    activeTab === tab.id && (
                        <motion.div
                            key={tab.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {tab.content}
                        </motion.div>
                    )
                ))}
            </div>
        </div>
    )
}
