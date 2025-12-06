import { useState, useEffect } from 'react';
import { BoldButton } from '@/components/ui/BoldButton';
import { Mic, Square } from 'lucide-react';

export function VoiceRecorder({ onTranscript }: { onTranscript: (text: string) => void }) {
    const [isRecording, setIsRecording] = useState(false);
    const [recognition, setRecognition] = useState<any>(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognitionInstance = new SpeechRecognition();
            recognitionInstance.continuous = true;
            recognitionInstance.interimResults = true;

            recognitionInstance.onresult = (event: any) => {
                const transcript = Array.from(event.results)
                    // @ts-ignore
                    .map((result: any) => result[0].transcript)
                    .join('');
                onTranscript(transcript);
            };

            setRecognition(recognitionInstance);
        }
    }, [onTranscript]);

    const toggleRecording = () => {
        if (!recognition) return;

        if (isRecording) {
            recognition.stop();
        } else {
            recognition.start();
        }
        setIsRecording(!isRecording);
    };

    if (!recognition) {
        return null; // Browser not supported
    }

    return (
        <BoldButton
            variant={isRecording ? "primary" : "secondary"}
            onClick={toggleRecording}
            className={isRecording ? "animate-pulse border-red-500 bg-red-500 hover:bg-red-600 hover:border-red-600 text-white" : ""}
        >
            {isRecording ? <Square className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
            {isRecording ? "Stop Recording" : "Voice Input"}
        </BoldButton>
    );
}
