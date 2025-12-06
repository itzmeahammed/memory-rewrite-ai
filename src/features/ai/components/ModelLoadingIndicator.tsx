import { useEffect, useState } from 'react';
import { localAIService, type LocalAIState } from '@/services/ai/localAIService';
import { motion, AnimatePresence } from 'framer-motion';

export function ModelLoadingIndicator() {
    const [state, setState] = useState<LocalAIState>({
        isLoading: false,
        progress: 0,
        text: "",
        isReady: false
    });

    useEffect(() => {
        return localAIService.subscribe(setState);
    }, []);

    if (!state.isLoading && state.isReady) return null;
    if (!state.isLoading && !state.isReady && state.progress === 0) return null; // Not started

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed bottom-4 right-4 z-50 bg-black text-white p-4 border border-[var(--border)] shadow-[var(--shadow-sharp)] max-w-xs w-full"
            >
                <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-xs uppercase tracking-wider">
                            {state.isReady ? "AI Ready" : "Loading Model"}
                        </span>
                        <span className="font-mono text-xs">{Math.round(state.progress * 100)}%</span>
                    </div>

                    <div className="h-2 bg-gray-800 w-full overflow-hidden">
                        <motion.div
                            className="h-full bg-white"
                            initial={{ width: 0 }}
                            animate={{ width: `${state.progress * 100}%` }}
                            transition={{ duration: 0.2 }}
                        />
                    </div>

                    <p className="text-[10px] font-mono text-gray-400 truncate">
                        {state.text}
                    </p>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
