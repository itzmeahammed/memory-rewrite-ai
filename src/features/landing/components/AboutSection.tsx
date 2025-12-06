import { motion } from 'framer-motion';

export function AboutSection() {
    return (
        <section className="py-24 px-4 bg-[var(--bg-secondary)] relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-12">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-black uppercase tracking-tighter"
                >
                    The Philosophy
                </motion.h2>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-lg md:text-xl font-mono leading-relaxed space-y-6 text-left md:text-justify"
                >
                    <p>
                        Our memories are not static recordings of the past; they are dynamic reconstructions influenced by our current emotions and beliefs.
                    </p>
                    <p>
                        Memory Rewriter AI leverages the principles of <span className="font-bold border-b-2 border-black dark:border-white">Cognitive Behavioral Therapy (CBT)</span> and <span className="font-bold border-b-2 border-black dark:border-white">Stoicism</span> to help you reframe negative experiences.
                    </p>
                    <p>
                        By identifying cognitive distortions and offering alternative perspectives, we empower you to rewrite your internal narrative and reclaim your peace of mind.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
