import * as React from "react"
import { BoldCard } from "@/components/ui/BoldCard"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"

type ToastType = "success" | "error" | "info"

interface Toast {
    id: string
    message: string
    type: ToastType
}

interface ToastContextType {
    toasts: Toast[]
    addToast: (message: string, type?: ToastType) => void
    removeToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = React.useState<Toast[]>([])

    const addToast = (message: string, type: ToastType = "info") => {
        const id = Math.random().toString(36).substring(2, 9)
        setToasts((prev) => [...prev, { id, message, type }])
        setTimeout(() => removeToast(id), 5000)
    }

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="pointer-events-auto"
                        >
                            <BoldCard className="flex items-center gap-4 p-4 min-w-[300px] bg-black text-white dark:bg-white dark:text-black border-2 border-white dark:border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" noPadding>
                                <div className="flex-1 font-bold font-mono text-sm">{toast.message}</div>
                                <button onClick={() => removeToast(toast.id)} className="hover:opacity-70">
                                    <X className="h-4 w-4" />
                                </button>
                            </BoldCard>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = React.useContext(ToastContext)
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider")
    }
    return context
}
