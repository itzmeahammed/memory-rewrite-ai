import { useEffect, useRef, useState } from 'react';
import { Ear, Volume2 } from 'lucide-react';
import { BoldButton } from '@/components/ui/BoldButton';
import { cn } from '@/lib/utils';

export function BinauralBeats() {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const oscillatorsRef = useRef<OscillatorNode[]>([]);
    const gainNodeRef = useRef<GainNode | null>(null);

    const togglePlay = () => {
        if (isPlaying) {
            stop();
        } else {
            start();
        }
    };

    const start = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        const ctx = audioContextRef.current;
        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.1; // Low volume
        gainNode.connect(ctx.destination);
        gainNodeRef.current = gainNode;

        // Common carrier frequency for meditation (e.g., 200Hz)
        const carrier = 200;
        // Binaural beat frequency (Difference) - Alpha waves (10Hz) for relaxation/focus
        const beat = 10;

        // Left Ear
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.value = carrier;
        const panner1 = ctx.createStereoPanner();
        panner1.pan.value = -1; // Full Left
        osc1.connect(panner1);
        panner1.connect(gainNode);

        // Right Ear
        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.value = carrier + beat;
        const panner2 = ctx.createStereoPanner();
        panner2.pan.value = 1; // Full Right
        osc2.connect(panner2);
        panner2.connect(gainNode);

        osc1.start();
        osc2.start();

        oscillatorsRef.current = [osc1, osc2];
        setIsPlaying(true);
    };

    const stop = () => {
        oscillatorsRef.current.forEach(osc => osc.stop());
        oscillatorsRef.current = [];
        setIsPlaying(false);
    };

    useEffect(() => {
        return () => {
            stop();
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    return (
        <BoldButton
            size="sm"
            variant="ghost"
            onClick={togglePlay}
            className={cn("gap-2 transition-all", isPlaying ? "text-blue-400 bg-blue-400/10" : "")}
            title={isPlaying ? "Stop Binaural Beats" : "Play Focus Audio"}
        >
            {isPlaying ? <Volume2 className="w-4 h-4 animate-pulse" /> : <Ear className="w-4 h-4" />}
            <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">
                {isPlaying ? "Focusing..." : "Focus Audio"}
            </span>
        </BoldButton>
    );
}
