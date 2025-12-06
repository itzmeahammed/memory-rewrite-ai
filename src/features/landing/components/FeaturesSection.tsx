import { motion } from 'framer-motion';

import { Brain, Shield, Sparkles, Zap } from 'lucide-react';

const features = [
    {
        icon: Brain,
        title: "Cognitive Reframing",
        description: "Advanced AI algorithms analyze your memories and suggest healthier perspectives based on CBT principles."
    },
    {
        icon: Shield,
        title: "Private & Local",
        description: "Your memories never leave your device. All processing is done locally using WebLLM technology."
    },
    {
        icon: Sparkles,
        title: "Socratic Mode",
        description: "Engage in a philosophical dialogue to uncover deep-seated beliefs and challenge distortions."
    },
    {
        icon: Zap,
        title: "Instant Insights",
        description: "Real-time sentiment analysis and cognitive distortion detection as you type."
    }
];

export function FeaturesSection() {
    return (
        <section className="py-24 px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-center mb-16"
                >
                    Features
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15, duration: 0.8 }}
                            className="group relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl border border-white/10" />

                            <div className="h-full p-8 flex flex-col items-start text-left border-l border-[var(--border)] group-hover:border-l-4 group-hover:border-[var(--text-primary)] transition-all pl-6">
                                <div className="mb-6 p-3 bg-[var(--bg-secondary)] rounded-lg group-hover:scale-110 transition-transform">
                                    <feature.icon className="w-8 h-8 text-[var(--text-primary)]" />
                                </div>
                                <h3 className="text-2xl font-black uppercase tracking-tight mb-4 group-hover:translate-x-2 transition-transform">{feature.title}</h3>
                                <p className="text-[var(--text-secondary)] leading-relaxed font-mono text-sm opacity-80 group-hover:opacity-100 transition-opacity">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
