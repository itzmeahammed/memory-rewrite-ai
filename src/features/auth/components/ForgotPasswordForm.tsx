import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BoldButton } from '@/components/ui/BoldButton';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const forgotPasswordSchema = z.object({
    email: z.string().email(),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema as any),
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setLoading(true);
        setError(null);
        setMessage(null);

        const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage("Check your email for the password reset link.");
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-sm">
            <div className="space-y-2 text-center">
                <h2 className="text-2xl font-black uppercase tracking-tight">Reset Password</h2>
                <p className="text-[var(--text-secondary)] text-sm">Enter your email to receive a reset link.</p>
            </div>

            <Input
                label="Email"
                {...register('email')}
                type="email"
                placeholder="Enter your email"
                error={errors.email?.message}
            />

            {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
            {message && <p className="text-green-500 text-sm font-bold">{message}</p>}

            <BoldButton type="submit" className="w-full" isLoading={loading}>
                Send Reset Link
            </BoldButton>

            <div className="text-center">
                <Link to="/login" className="text-sm font-bold underline hover:text-[var(--text-secondary)]">
                    Back to Login
                </Link>
            </div>
        </form>
    );
}
