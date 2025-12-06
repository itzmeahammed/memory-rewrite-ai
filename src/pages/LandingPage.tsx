import { NeuralEcho } from "@/features/visuals/NeuralEcho";
import { SEO } from "@/components/layout/SEO";
import { HeroSection } from "@/features/landing/components/HeroSection";
import { AboutSection } from "@/features/landing/components/AboutSection";
import { FeaturesSection } from "@/features/landing/components/FeaturesSection";
import { TestimonialsSection } from "@/features/landing/components/TestimonialsSection";
import { CTASection } from "@/features/landing/components/CTASection";
import { motion, useScroll, useSpring } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] relative selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black overflow-x-hidden">
            <SEO
                title="Home"
                description="Rewrite your past. Reclaim your future. AI-powered memory reframing tool."
            />

            {/* Scroll Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-black dark:bg-white z-50 origin-left"
                style={{ scaleX }}
            />

            {/* Minimal top controls */}
            <div className="fixed top-6 right-6 z-50 flex gap-4">
                <button onClick={() => navigate('/login')} className="text-xs font-bold uppercase tracking-wider hover:underline opacity-60 hover:opacity-100 transition-opacity">
                    Login
                </button>
            </div>

            <NeuralEcho />

            {/* Background Grid */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-20"></div>

            <main className="relative z-10 flex flex-col gap-0">
                <HeroSection />

                {/* Seamless transitions between sections */}
                <div id="about" className="scroll-mt-20">
                    <AboutSection />
                </div>

                <div id="features" className="scroll-mt-20">
                    <FeaturesSection />
                </div>

                <TestimonialsSection />

                <div className="pb-20">
                    <CTASection />
                </div>
            </main>

            {/* Footer */}
            <footer className="py-12 border-t border-[var(--border)] relative z-10 bg-[var(--bg-primary)]">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-[var(--text-secondary)] text-sm font-mono">
                    <p>&copy; {new Date().getFullYear()} Memory Rewriter AI. All rights reserved.</p>
                    <div className="flex justify-center gap-8">
                        <a href="#" className="hover:text-[var(--text-primary)] transition-colors uppercase tracking-wider font-bold">Privacy</a>
                        <a href="#" className="hover:text-[var(--text-primary)] transition-colors uppercase tracking-wider font-bold">Terms</a>
                        <a href="#" className="hover:text-[var(--text-primary)] transition-colors uppercase tracking-wider font-bold">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
