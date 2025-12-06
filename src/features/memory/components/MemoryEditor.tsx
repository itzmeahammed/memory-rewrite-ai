import { useState, useEffect } from 'react';
import { BoldButton } from '@/components/ui/BoldButton';
import { History, Lock, Trash2, Save, Share2, Wind, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceRecorder } from '@/features/voice/VoiceRecorder';
import { TimeCapsuleModal } from '@/features/time-capsule/TimeCapsuleModal';
import { MoodSelector } from '@/features/memory/components/MoodSelector';
import { cn } from '@/lib/utils';
import { ModelLoadingIndicator } from '@/features/ai/components/ModelLoadingIndicator';
import { localAIService } from '@/services/ai/localAIService';
import { analyzeSentiment, detectDistortions, type SentimentResult, type DistortionResult } from '@/lib/sentiment';
import { memoriesService, type Memory } from '@/services/db/memoriesService';
import { MemoryFlow } from './MemoryFlow';
import { SentimentAnalysis } from './SentimentAnalysis';
import { MoodBackground } from '@/components/ui/MoodBackground';
import { BreathingGuide } from '@/features/mindfulness/components/BreathingGuide';
import { gamificationService } from '@/services/game/gamificationService';
import { BinauralBeats } from '@/features/mindfulness/components/BinauralBeats';
import { RelatedMemories } from './RelatedMemories';

export const MemoryEditor = () => {
    const [input, setInput] = useState<string>("");
    const [output, setOutput] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [mood, setMood] = useState<string>("");
    const [sentiment, setSentiment] = useState<SentimentResult | null>(null);
    const [distortions, setDistortions] = useState<DistortionResult[]>([]);

    // Expanded modes including Haiku, Metaphor, Future Self
    const [mode, setMode] = useState<'rewrite' | 'socratic' | 'dream' | 'haiku' | 'metaphor' | 'future_self'>('rewrite');

    const [isCapsuleOpen, setIsCapsuleOpen] = useState<boolean>(false);
    const [isZenMode, setIsZenMode] = useState<boolean>(false);
    const [isBreathing, setIsBreathing] = useState<boolean>(false);
    const [showHistory, setShowHistory] = useState<boolean>(true);
    const [savedMemories, setSavedMemories] = useState<Memory[]>([]);
    const [perspective, setPerspective] = useState<string>('Stoic');
    const perspectives = ['Stoic', 'Optimistic', 'Humorous', 'Rational', 'Compassionate', 'Tough Love', 'Metaphorical', 'Poetic'];

    const modes = [
        { id: 'rewrite', label: 'Rewrite Memory' },
        { id: 'socratic', label: 'Socratic Questioning' },
        { id: 'dream', label: 'Dream Interpretation' },
        { id: 'haiku', label: 'Healing Haiku' },
        { id: 'metaphor', label: 'Metaphor Generator' },
        { id: 'future_self', label: 'Future Self Chat' },
    ];

    useEffect(() => {
        if (input) {
            const sentimentResult = analyzeSentiment(input);
            setSentiment(sentimentResult);
            const distortionsResult = detectDistortions(input);
            setDistortions(distortionsResult);
        } else {
            setSentiment(null);
            setDistortions([]);
        }
    }, [input]);

    useEffect(() => {
        loadMemories();

        // Real-time subscription
        const subscription = supabase
            .channel('memories_channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'memories' }, (payload: any) => {
                console.log('Real-time update:', payload);
                loadMemories();
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const loadMemories = async () => {
        try {
            const data = await memoriesService.getMemories();
            setSavedMemories(data || []);
        } catch (error) {
            console.error("Failed to load memories:", error);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this memory?")) {
            try {
                await memoriesService.deleteMemory(id);
            } catch (error) {
                console.error("Failed to delete:", error);
            }
        }
    };

    const handleRewrite = async () => {
        if (!input.trim()) return;
        setLoading(true);
        setOutput('');
        try {
            // Ensure model is loaded (API ready)
            await localAIService.loadModel();

            let systemPrompt = "You are a helpful AI assistant.";
            switch (mode) {
                case 'rewrite':
                    systemPrompt = `You are a helpful AI assistant that reframes negative memories into ${perspective.toLowerCase()} perspectives. Keep it concise.`;
                    break;
                case 'socratic':
                    systemPrompt = "You are a wise Socratic philosopher. Your goal is to help the user question their negative thoughts and cognitive distortions. Ask probing questions that lead them to self-discovery. Do not lecture, just ask insightful questions based on their input.";
                    break;
                case 'dream':
                    systemPrompt = "You are a Jungian dream analyst. Interpret the user's dream description. Focus on archetypes, symbolism, and potential subconscious messages. Be mystical yet grounded. Help the user uncover hidden meanings.";
                    break;
                case 'haiku':
                    systemPrompt = "You are a poet. Turn the user's memory or feeling into a beautiful, healing Haiku. 5-7-5 syllables. Capture the essence of the emotion but add a twist of hope or acceptance.";
                    break;
                case 'metaphor':
                    systemPrompt = "You are a creative writer. Transform the user's situation into a powerful metaphor or allegory that helps them understand it from a new, detached perspective. Keep it brief and evocative.";
                    break;
                case 'future_self':
                    systemPrompt = "You are the user's Future Self, 20 years from now. You are wise, at peace, and have overcome this current struggle. Speak to your younger self (the user) with compassion, reassurance, and hindsight. Tell them why this moment, while hard, is a necessary part of their growth.";
                    break;
            }

            // Use streaming response from Local AI
            const stream = localAIService.generateStream(input, systemPrompt);

            for await (const chunk of stream) {
                setOutput(prev => prev + chunk);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (unlockDate?: Date) => {
        if (!output || !input) return;
        try {
            await memoriesService.saveMemory(input, output, mood, unlockDate);

            // Gamification
            await gamificationService.addXp(50);
            await gamificationService.updateStreak();
            await gamificationService.awardBadge('first_step');
            if (isZenMode) await gamificationService.awardBadge('zen_master');

            // Refresh list
            await loadMemories();
            alert(unlockDate ? "Memory locked in Time Capsule!" : "Memory saved successfully!");
            if (unlockDate) setIsCapsuleOpen(false);
        } catch (error) {
            console.error("Failed to save:", error);
            alert("Failed to save memory. Please check if you are logged in.");
        }
    };

    return (
        <div className="flex h-full gap-4 relative">
            {/* History Sidebar (Collapsible) */}
            <AnimatePresence>
                {showHistory && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 300, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="h-[calc(100vh-6rem)] sticky top-8 bg-[var(--bg-secondary)] border-r border-[var(--border)] overflow-hidden flex flex-col rounded-xl"
                    >
                        <div className="p-4 border-b border-[var(--border)] font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                            <History className="w-4 h-4" /> Saved Memories
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {savedMemories.length === 0 ? (
                                <div className="text-xs text-neutral-500 text-center py-8">No saved memories yet.</div>
                            ) : (
                                savedMemories.map(mem => {
                                    const isLocked = mem.unlock_date && new Date(mem.unlock_date) > new Date();
                                    return (
                                        <div
                                            key={mem.id}
                                            className={cn(
                                                "p-3 bg-white dark:bg-black border border-[var(--border)] rounded-lg text-xs transition-colors group relative",
                                                isLocked ? "opacity-70 cursor-not-allowed" : "cursor-pointer hover:border-neutral-500"
                                            )}
                                            onClick={() => {
                                                if (isLocked) {
                                                    alert(`This memory is locked until ${new Date(mem.unlock_date!).toLocaleDateString()}`);
                                                    return;
                                                }
                                                setInput(mem.original_text);
                                                setOutput(mem.rewritten_text);
                                                setMood(mem.mood);
                                            }}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <div className="font-bold truncate">{mem.mood || "No Mood"}</div>
                                                {isLocked && (
                                                    <div className="flex items-center gap-1 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                                                        <Lock className="w-3 h-3" /> LOCKED
                                                    </div>
                                                )}
                                                {!isLocked && (
                                                    <button
                                                        onClick={(e) => handleDelete(mem.id, e)}
                                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-opacity text-red-500"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="line-clamp-2 text-neutral-500 font-mono">
                                                {isLocked ? "••••••••••••••••" : mem.rewritten_text}
                                            </div>
                                            <div className="mt-2 text-[10px] opacity-50 flex justify-between">
                                                <span>{new Date(mem.created_at).toLocaleDateString()}</span>
                                                {isLocked && <span className="text-red-500">Unlocks {new Date(mem.unlock_date!).toLocaleDateString()}</span>}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Related Memories Section */}
                        <div className="p-4 border-t border-[var(--border)]">
                            <RelatedMemories
                                currentInput={input}
                                savedMemories={savedMemories}
                                onSelect={(mem) => {
                                    setInput(mem.original_text);
                                    setOutput(mem.rewritten_text);
                                    setMood(mem.mood);
                                }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex-1 flex flex-col relative transition-all duration-500">
                {/* Zen Mode & History Toggles, plus Binaural Beats */}
                <div className="flex justify-end items-center gap-2 p-2 mb-6 relative z-50 bg-[var(--bg-primary)]/80 backdrop-blur-sm rounded-lg border border-[var(--border)] shadow-sm">
                    <div className="flex items-center gap-4 mr-auto px-2">
                        <BinauralBeats />
                    </div>

                    <div className="flex items-center gap-2">
                        <BoldButton size="sm" variant="ghost" onClick={() => setIsBreathing(!isBreathing)}>
                            <Wind className={cn("w-4 h-4", isBreathing ? "animate-pulse text-blue-400" : "")} />
                        </BoldButton>
                        <BoldButton size="sm" variant="ghost" onClick={() => setShowHistory(!showHistory)}>
                            <History className="w-4 h-4" />
                        </BoldButton>
                        <BoldButton size="sm" variant="ghost" onClick={() => setIsZenMode(!isZenMode)}>
                            {isZenMode ? "Exit Zen" : "Zen Mode"}
                        </BoldButton>
                    </div>
                </div>

                {/* Ambient Background */}
                <MoodBackground mood={mood} sentimentScore={sentiment?.score || 0} />
                {isBreathing && <BreathingGuide onClose={() => setIsBreathing(false)} />}

                <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10", isZenMode ? "lg:grid-cols-1" : "")}>

                    {/* Input Section */}
                    {/* Hide Input Section completely if in Zen Mode AND Output exists (Focus on reading) */}
                    {/* If in Zen Mode AND No Output (Writing phase), Input covers full screen */}
                    <div className={cn(
                        "flex flex-col space-y-4 relative z-10 p-0 rounded-xl",
                        isZenMode && output ? "hidden" : "flex",
                        isZenMode ? "lg:mx-auto lg:max-w-3xl w-full" : ""
                    )}>
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold uppercase tracking-wider">Original Memory</label>
                            <VoiceRecorder onTranscript={(text) => setInput((prev) => prev + (prev ? ' ' : '') + text)} />
                        </div>

                        {/* Hide Mood/Sentiment in Zen Mode for distraction-free writing */}
                        {!isZenMode && (
                            <div className="transition-opacity duration-300">
                                <MoodSelector onSelect={setMood} selectedMood={mood} />
                            </div>
                        )}

                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 bg-[var(--bg-secondary)] border-2 border-[var(--border)] p-6 resize-none focus:border-black dark:focus:border-white outline-none transition-colors font-mono text-lg min-h-[300px] rounded-xl shadow-inner my-4"
                            placeholder="Describe the memory you want to reframe..."
                        />

                        {!isZenMode && <SentimentAnalysis sentiment={sentiment} distortions={distortions} />}

                        <div className="flex flex-wrap justify-between items-center gap-4 pt-4 mt-4 bg-[var(--bg-secondary)]/50 p-4 rounded-lg border border-[var(--border)] shadow-sm">
                            <div className="flex flex-col sm:flex-row flex-wrap gap-4">

                                {/* Mode Selector Dropdown */}
                                <div className="relative group">
                                    <button className="flex items-center gap-2 px-3 py-1.5 bg-black text-white dark:bg-white dark:text-black border border-black dark:border-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] transition-all">
                                        <span>{modes.find(m => m.id === mode)?.label}</span>
                                        <ChevronDown className="w-3 h-3" />
                                    </button>
                                    <div className="absolute bottom-full left-0 mb-2 w-56 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg shadow-xl overflow-hidden hidden group-hover:block z-20">
                                        {modes.map(m => (
                                            <button
                                                key={m.id}
                                                onClick={() => setMode(m.id as any)}
                                                className={cn(
                                                    "w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider hover:bg-[var(--bg-secondary)] transition-colors border-b border-[var(--border)] last:border-0",
                                                    mode === m.id ? "bg-[var(--bg-secondary)]" : ""
                                                )}
                                            >
                                                {m.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {mode === 'rewrite' && (
                                    <div className="relative group">
                                        <button className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-xs font-bold uppercase tracking-wider hover:border-black dark:hover:border-white transition-colors">
                                            <span>Perspective: {perspective}</span>
                                            <ChevronDown className="w-3 h-3" />
                                        </button>
                                        <div className="absolute bottom-full left-0 mb-2 w-48 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg shadow-xl overflow-hidden hidden group-hover:block z-20">
                                            {perspectives.map(p => (
                                                <button
                                                    key={p}
                                                    onClick={() => setPerspective(p)}
                                                    className={cn(
                                                        "w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[var(--bg-secondary)] transition-colors",
                                                        perspective === p ? "bg-black text-white dark:bg-white dark:text-black" : ""
                                                    )}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <BoldButton onClick={handleRewrite} isLoading={loading} disabled={!input.trim()}>
                                Run {modes.find(m => m.id === mode)?.label.split(' ')[0]}
                            </BoldButton>
                        </div>
                    </div>

                    {/* Output Section */}
                    <div className="flex flex-col space-y-4">
                        <label className="text-sm font-bold uppercase tracking-wider">Transformation</label>

                        {/* New Flow Visualization */}
                        <div>
                            <MemoryFlow
                                originalText={input}
                                rewrittenText={output}
                                isGenerating={loading}
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <BoldButton variant="secondary" disabled={!output} onClick={() => handleSave()}>
                                <Save className="w-4 h-4 mr-2" /> Save
                            </BoldButton>
                            <BoldButton variant="ghost" disabled={!output} onClick={() => setIsCapsuleOpen(true)}>
                                Time Capsule
                            </BoldButton>
                            <BoldButton variant="ghost" disabled={!output}>
                                <Share2 className="w-4 h-4" />
                            </BoldButton>
                        </div>
                    </div>

                    <TimeCapsuleModal
                        isOpen={isCapsuleOpen}
                        onClose={() => setIsCapsuleOpen(false)}
                        onSave={(date) => handleSave(date)}
                    />
                    <ModelLoadingIndicator />
                </div>
            </div>
        </div>
    );
}
