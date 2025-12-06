import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BoldButton } from '@/components/ui/BoldButton';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema as any),
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });

        if (error) {
            setError(error.message);
        } else {
            navigate('/dashboard');
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-sm">
            <Input
                label="Email"
                {...register('email')}
                type="email"
                placeholder="Enter your email"
                error={errors.email?.message}
            />

            <Input
                label="Password"
                {...register('password')}
                type="password"
                placeholder="Enter your password"
                error={errors.password?.message}
            />

            {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

            <BoldButton type="submit" className="w-full" isLoading={loading}>
                Sign In
            </BoldButton>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-[var(--border)]" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[var(--bg-primary)] px-2 text-[var(--text-secondary)]">Or continue with</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <BoldButton type="button" variant="secondary" onClick={async () => {
                    const { error } = await supabase.auth.signInWithOAuth({
                        provider: 'google',
                        options: {
                            redirectTo: `${window.location.origin}/dashboard`
                        }
                    });
                    if (error) console.error('Google login error:', error);
                }}>
                    Google
                </BoldButton>
            </div>
        </form>
    );
}
