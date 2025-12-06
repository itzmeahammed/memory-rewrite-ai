import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen flex">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[var(--bg-primary)] text-[var(--text-primary)]">
                <ForgotPasswordForm />
            </div>

            {/* Right Side - Visual */}
            <div className="hidden lg:flex w-1/2 bg-black items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.1)_75%,rgba(255,255,255,0.1)_100%)] bg-[size:20px_20px] opacity-20"></div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="text-white text-center z-10 p-12"
                >
                    <h2 className="text-6xl font-black uppercase tracking-tighter mb-4">Recover</h2>
                    <p className="font-mono text-xl opacity-80">Regain access to your timeline.</p>
                </motion.div>
            </div>
        </div>
    );
}
