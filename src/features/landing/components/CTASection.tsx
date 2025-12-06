import { BoldButton } from "@/components/ui/BoldButton";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export function CTASection() {
    const navigate = useNavigate();

    return (
        <section className="py-32 px-4 relative z-10 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="max-w-3xl mx-auto space-y-8"
            >
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                    Ready to <br /> Rewrite?
                </h2>
                <p className="text-xl text-[var(--text-secondary)] font-mono">
                    Join thousands of others who have taken control of their narrative.
                </p>
                <div className="pt-8">
                    <BoldButton size="xl" onClick={() => navigate('/register')}>
                        Get Started Now
                    </BoldButton>
                </div>
            </motion.div>
        </section>
    );
}
