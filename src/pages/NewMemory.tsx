import { Sidebar } from '@/components/layout/Sidebar';
import { MemoryEditor } from '@/features/memory/components/MemoryEditor';
import { TextScramble } from '@/components/ui/TextScramble';

export default function NewMemory() {
    return (
        <div className="flex min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto h-screen flex flex-col">
                <header className="mb-8">
                    <h1 className="text-4xl font-black uppercase tracking-tighter">
                        <TextScramble text="Rewrite Memory" />
                    </h1>
                    <p className="text-[var(--text-secondary)] font-mono mt-2">Transmute the past into power.</p>
                </header>
                <div className="flex-1">
                    <MemoryEditor />
                </div>
            </main>
        </div>
    );
}
