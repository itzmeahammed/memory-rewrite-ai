import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BoldButton } from '@/components/ui/BoldButton';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema as any),
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const onSubmit = async (data: RegisterFormData) => {
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
        });

        if (error) {
            setError(error.message);
        } else {
            // Check if email confirmation is required
            navigate('/dashboard'); // Or show a "Check your email" message
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
                placeholder="Create a password"
                error={errors.password?.message}
            />

            <Input
                label="Confirm Password"
                {...register('confirmPassword')}
                type="password"
                placeholder="Confirm your password"
                error={errors.confirmPassword?.message}
            />

            {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

            <BoldButton type="submit" className="w-full" isLoading={loading}>
                Sign Up
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
