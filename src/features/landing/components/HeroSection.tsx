import { BoldButton } from "@/components/ui/BoldButton";
import { motion, useScroll, useTransform } from "framer-motion";
import { ParticleText } from "@/components/ui/ParticleText";
import { useNavigate } from "react-router-dom";

export function HeroSection() {
    const navigate = useNavigate();
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 300], [0, 100]);


    return (
        <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden pt-20">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                style={{ y: y1 }}
                className="text-center space-y-10 max-w-5xl relative z-10 px-6"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute top-10 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)]/30 backdrop-blur-sm opacity-50 hover:opacity-100 transition-opacity"
                >
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-secondary)]">System Stable</span>
                </motion.div>

                <div className="flex-1 flex flex-col items-center justify-center w-full max-w-[1400px] relative">
                    {/* Massive Liquid Text */}
                    <motion.div
                        initial={{ opacity: 0, filter: 'blur(20px)' }}
                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                        transition={{ duration: 3.5, ease: "easeOut" }}
                        className="w-full h-[400px] flex items-center justify-center relative z-20"
                    >
                        <ParticleText text="REWRITER" className="w-full h-full" fontSize={180} />
                    </motion.div>

                    {/* Subtext overlay */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="absolute bottom-1/4 text-center font-mono text-sm uppercase tracking-[0.5em] text-[var(--text-secondary)] mix-blend-difference"
                    >
                        Construct Your Reality
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-6 justify-center pt-8 items-center"
                >
                    <BoldButton size="xl" className="min-w-[200px] shadow-[0_0_40px_-10px_rgba(0,0,0,0.3)] dark:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]" onClick={() => navigate('/register')}>
                        Start Transformation
                    </BoldButton>
                    <button
                        onClick={() => navigate('/login')}
                        className="text-sm font-bold uppercase tracking-widest hover:text-[var(--text-secondary)] transition-colors px-4 py-2"
                    >
                        Member Login
                    </button>
                </motion.div>
            </motion.div>
        </section>
    );
}
