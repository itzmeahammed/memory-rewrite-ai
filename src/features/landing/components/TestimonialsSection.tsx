import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';

const testimonials = [
    {
        quote: "I never realized how much my own bias was coloring my past until I used this tool. It's like cleaning a dirty window.",
        author: "Sarah J.",
        role: "Early Adopter"
    },
    {
        quote: "The Socratic mode is brutal but necessary. It asks the questions I was too afraid to ask myself.",
        author: "Marcus A.",
        role: "Stoic Practitioner"
    },
    {
        quote: "Finally, an AI tool that respects privacy. Local processing means my secrets stay mine.",
        author: "David L.",
        role: "Privacy Advocate"
    }
];

export function TestimonialsSection() {
    return (
        <section className="py-24 px-4 relative z-10 overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-center mb-16"
                >
                    Voices
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <GlassCard className="h-full p-8 flex flex-col justify-between">
                                <p className="text-lg italic font-serif mb-6">"{t.quote}"</p>
                                <div>
                                    <p className="font-bold uppercase tracking-wider">{t.author}</p>
                                    <p className="text-xs text-[var(--text-secondary)] uppercase tracking-widest">{t.role}</p>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
