import { useAuth } from '@/features/auth/context/AuthContext';
import { BoldButton } from '@/components/ui/BoldButton';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

export function EmailVerificationBanner() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    if (!user || user.email_confirmed_at) return null;

    const resendEmail = async () => {
        setLoading(true);
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: user.email!,
        });
        if (!error) {
            setSent(true);
        }
        setLoading(false);
    };

    return (
        <div className="bg-yellow-400 text-black px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-bold uppercase">Please verify your email address.</span>
            </div>
            {sent ? (
                <span className="text-sm font-bold">Sent! Check your inbox.</span>
            ) : (
                <BoldButton
                    size="sm"
                    variant="ghost"
                    className="h-auto py-1 px-2 border-black hover:bg-black hover:text-white"
                    onClick={resendEmail}
                    isLoading={loading}
                >
                    Resend Email
                </BoldButton>
            )}
        </div>
    );
}
