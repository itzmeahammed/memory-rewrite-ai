import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface BreathingGuideProps {
    onClose?: () => void;
}

export function BreathingGuide({ onClose }: BreathingGuideProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
            {/* Close Button */}
            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white/50 hover:text-white transition-all hover:scale-110"
                >
                    <X className="w-8 h-8" />
                </button>
            )}

            <motion.div
                className="relative flex items-center justify-center"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
                <div className="w-64 h-64 rounded-full border-4 border-white/20 absolute" />
                <div className="w-48 h-48 rounded-full bg-white/10 blur-xl" />
                <div className="text-white font-mono text-xl tracking-[0.2em] relative z-10">
                    <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 4, repeat: Infinity, times: [0, 0.5, 1] }}
                    >
                        BREATHE
                    </motion.span>
                </div>
            </motion.div>

            <div className="absolute bottom-12 text-white/30 font-mono text-sm animate-pulse">
                Inhale... Exhale...
            </div>
        </div>
    );
}
