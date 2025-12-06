
import React, { createContext, useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface DialogContextType {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

interface DialogProps {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function Dialog({ children, open, onOpenChange }: DialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    const isControlled = open !== undefined;
    const currentOpen = isControlled ? open : isOpen;
    const handleOpenChange = (value: boolean) => {
        if (!isControlled) {
            setIsOpen(value);
        }
        onOpenChange?.(value);
    };

    return (
        <DialogContext.Provider value={{ open: currentOpen, setOpen: handleOpenChange }}>
            {children}
        </DialogContext.Provider>
    );
}

interface DialogContentProps {
    children: React.ReactNode;
    className?: string;
}

export function DialogContent({ children, className }: DialogContentProps) {
    const context = useContext(DialogContext);
    if (!context) throw new Error("DialogContent must be used within a Dialog");
    const { open, setOpen } = context;

    // Prevent scrolling when dialog is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [open]);

    if (!open) return null;

    return createPortal(
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)}
                        className="fixed inset-0 z-[99] bg-black/80 backdrop-blur-sm"
                    />

                    {/* Content */}
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className={cn(
                                "relative w-full overflow-hidden pointer-events-auto",
                                className
                            )}
                        >
                            <button
                                onClick={() => setOpen(false)}
                                className="absolute right-4 top-4 z-50 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white/70 hover:text-white transition-colors"
                            >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Close</span>
                            </button>
                            {children}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
