import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { BoldButton } from '@/components/ui/BoldButton';
import { TextScramble } from '@/components/ui/TextScramble';
import { motion, AnimatePresence } from 'framer-motion';
import { localAIService } from '@/services/ai/localAIService';
import { ModelLoadingIndicator } from '@/features/ai/components/ModelLoadingIndicator';
import { Play, Pause, Wind } from 'lucide-react';
import { BinauralBeats } from '@/features/mindfulness/components/BinauralBeats';

export default function MeditationPage() {
    const [input, setInput] = useState("");
    const [script, setScript] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [isActive, setIsActive] = useState(false);

    const generateMeditation = async () => {
        if (!input.trim()) return;
        setLoading(true);
        setScript([]);
        setCurrentStep(0);
        setIsActive(false);

        try {
            await localAIService.loadModel();

            const systemPrompt = `You are a gentle mindfulness guide. Create a short, 3-step guided meditation script based on the user's feeling.
            Format the output strictly as 3 paragraphs separated by newlines.
            Each paragraph should be a distinct step (e.g., Focus on Breath, Body Scan, Affirmation).
            Keep it soothing, simple, and direct.`;

            let fullResponse = "";
            const stream = localAIService.generateStream(input, systemPrompt);
            for await (const chunk of stream) {
                fullResponse += chunk;
            }

            // Split by double newlines or single newlines if they are distinct steps
            const steps = fullResponse.split(/\n\s*\n/).filter(line => line.length > 20);
            setScript(steps.length >= 3 ? steps.slice(0, 3) : steps);

        } catch (error) {
            console.error("Failed to generate meditation:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleSession = () => {
        setIsActive(!isActive);
    };

    return (
        <div className="flex min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto h-screen flex flex-col items-center">
                <header className="mb-12 text-center max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] mb-4 text-xs font-mono uppercase tracking-widest text-[var(--text-secondary)]">
                        <Wind className="w-3 h-3" /> AI Mindfulness
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
                        <TextScramble text="Mind Shift" />
                    </h1>
                    <p className="text-[var(--text-secondary)] font-mono">
                        Describe your current state. Receive a custom guided meditation instantly.
                    </p>
                </header>

                <div className="w-full max-w-xl space-y-6 relative z-10">
                    <div className="relative">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="I'm feeling overwhelmed by deadlines and need to reset..."
                            className="w-full bg-[var(--bg-secondary)] border-2 border-[var(--border)] p-6 rounded-2xl resize-none focus:border-black dark:focus:border-white outline-none transition-colors font-mono text-lg min-h-[120px] shadow-sm"
                        />
                        <div className="absolute bottom-4 right-4">
                            <BoldButton
                                onClick={generateMeditation}
                                isLoading={loading}
                                disabled={!input.trim()}
                                size="sm"
                            >
                                Generate Session
                            </BoldButton>
                        </div>
                    </div>

                    {/* Meditation Player */}
                    {script.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-black/5 dark:bg-white/5 border border-[var(--border)] rounded-2xl p-8 text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-400"></div>

                            <div className="mb-8 h-[200px] flex items-center justify-center relative">
                                {/* Ambient Circle Animation */}
                                {isActive && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-32 h-32 bg-blue-500/20 rounded-full animate-ping duration-[4000ms]"></div>
                                        <div className="w-48 h-48 bg-purple-500/10 rounded-full animate-pulse duration-[3000ms] absolute"></div>
                                    </div>
                                )}

                                <AnimatePresence mode="wait">
                                    <motion.p
                                        key={currentStep}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.1 }}
                                        className="text-xl md:text-2xl font-serif leading-relaxed max-w-lg relative z-10"
                                    >
                                        "{script[currentStep]}"
                                    </motion.p>
                                </AnimatePresence>
                            </div>

                            <div className="flex items-center justify-center gap-6">
                                <BoldButton
                                    variant="secondary"
                                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                                    disabled={currentStep === 0}
                                    size="sm"
                                >
                                    Prev
                                </BoldButton>

                                <button
                                    onClick={toggleSession}
                                    className="w-16 h-16 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:scale-105 transition-transform shadow-xl"
                                >
                                    {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                                </button>

                                <BoldButton
                                    variant="secondary"
                                    onClick={() => setCurrentStep(Math.min(script.length - 1, currentStep + 1))}
                                    disabled={currentStep === script.length - 1}
                                    size="sm"
                                >
                                    Next
                                </BoldButton>
                            </div>

                            <div className="mt-8 flex justify-center">
                                <BinauralBeats />
                            </div>

                            <div className="mt-4 text-xs font-mono text-[var(--text-secondary)] uppercase tracking-widest">
                                Step {currentStep + 1} of {script.length}
                            </div>
                        </motion.div>
                    )}
                </div>

                <ModelLoadingIndicator />
            </main>
        </div>
    );
}
