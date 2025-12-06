import { LoginForm } from '@/features/auth/components/LoginForm';
import { Link } from 'react-router-dom';

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left Side - Visual */}
            <div className="hidden md:flex w-1/2 bg-black text-white items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,#1a1a1a_25%,transparent_25%,transparent_75%,#1a1a1a_75%,#1a1a1a),linear-gradient(45deg,#1a1a1a_25%,transparent_25%,transparent_75%,#1a1a1a_75%,#1a1a1a)] bg-[size:20px_20px] bg-[position:0_0,10px_10px] opacity-20"></div>
                <div className="relative z-10 max-w-md space-y-6">
                    <h2 className="text-5xl font-black uppercase tracking-tighter">Enter the Vault.</h2>
                    <p className="text-xl text-neutral-400 font-mono">Access your rewritten history.</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[var(--bg-primary)] text-[var(--text-primary)]">
                <div className="w-full max-w-sm space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold uppercase tracking-tight">Sign In</h1>
                        <p className="text-[var(--text-secondary)]">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-bold underline hover:text-[var(--text-primary)]">
                                Register
                            </Link>
                        </p>
                    </div>
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}
