import { BoldButton } from '@/components/ui/BoldButton';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)] text-[var(--text-primary)] p-4 text-center">
            <h1 className="text-9xl font-black mb-4">404</h1>
            <h2 className="text-2xl font-bold uppercase tracking-tight mb-8">Memory Not Found</h2>
            <p className="text-[var(--text-secondary)] font-mono max-w-md mb-8">
                The timeline you are looking for does not exist. It may have been rewritten or deleted.
            </p>
            <Link to="/">
                <BoldButton>Return to Reality</BoldButton>
            </Link>
        </div>
    );
}
