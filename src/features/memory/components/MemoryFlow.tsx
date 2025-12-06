import { motion } from 'framer-motion';
import { ArrowRight, Brain, Sparkles, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MemoryFlowProps {
    originalText: string;
    rewrittenText: string;
    isGenerating: boolean;
}

export function MemoryFlow({ originalText, rewrittenText, isGenerating }: MemoryFlowProps) {
    return (
        <div className="flex flex-col relative bg-black/90 rounded-xl border border-white/10 p-6">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            <div className="relative z-10 flex flex-col gap-8">
                {/* Step 1: Input */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-4"
                >
                    <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800">
                        <FileText className="w-6 h-6 text-neutral-400" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-2">Original Memory</h3>
                        <p className="text-neutral-300 font-mono text-sm line-clamp-2 opacity-70">{originalText || "Waiting for input..."}</p>
                    </div>
                </motion.div>

                {/* Flow Connector */}
                <div className="flex justify-center py-2">
                    <motion.div
                        animate={{
                            scale: isGenerating ? [1, 1.2, 1] : 1,
                            color: isGenerating ? ["#525252", "#ffffff", "#525252"] : "#525252"
                        }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                        <ArrowRight className="w-6 h-6 rotate-90" />
                    </motion.div>
                </div>

                {/* Step 2: Processing */}
                <motion.div
                    className="flex items-center gap-4 justify-center"
                    animate={{ opacity: isGenerating ? 1 : 0.5 }}
                >
                    <div className={cn("p-4 rounded-full border-2 transition-all duration-500", isGenerating ? "bg-white border-white shadow-[0_0_30px_rgba(255,255,255,0.3)]" : "bg-neutral-900 border-neutral-800")}>
                        <Brain className={cn("w-8 h-8 transition-colors", isGenerating ? "text-black" : "text-neutral-500")} />
                    </div>
                    {isGenerating && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs font-bold uppercase tracking-widest text-white animate-pulse"
                        >
                            Reframing...
                        </motion.span>
                    )}
                </motion.div>

                {/* Flow Connector */}
                <div className="flex justify-center py-2">
                    <ArrowRight className={cn("w-6 h-6 rotate-90 transition-colors", rewrittenText ? "text-white" : "text-neutral-700")} />
                </div>

                {/* Step 3: Output */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col"
                >
                    <div className="flex items-center gap-2 mb-3 shrink-0">
                        <Sparkles className={cn("w-5 h-5", rewrittenText ? "text-yellow-400" : "text-neutral-700")} />
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">New Perspective 🌟</h3>
                    </div>

                    <div className="bg-neutral-900/50 rounded-lg border border-white/10 p-4 shadow-inner min-h-[150px]">
                        {rewrittenText ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="font-mono text-base leading-relaxed text-white whitespace-pre-wrap"
                            >
                                {rewrittenText}
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-neutral-600 font-mono text-sm gap-2">
                                <span className="text-2xl animate-bounce">✨</span>
                                <span>Output will appear here...</span>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
