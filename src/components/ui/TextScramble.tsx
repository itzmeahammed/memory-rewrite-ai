import { useEffect, useState } from "react";

interface TextScrambleProps {
    text: string;
    className?: string;
    trigger?: boolean;
}

const CHARS = "!@#$%^&*():{};|,.<>/?";

export function TextScramble({ text, className, trigger = true }: TextScrambleProps) {
    const [displayText, setDisplayText] = useState(text);

    useEffect(() => {
        if (!trigger) return;

        let iteration = 0;
        let interval: ReturnType<typeof setInterval>;

        interval = setInterval(() => {
            setDisplayText(() =>
                text
                    .split("")
                    .map((_, index) => {
                        if (index < iteration) {
                            return text[index];
                        }
                        return CHARS[Math.floor(Math.random() * CHARS.length)];
                    })
                    .join("")
            );

            if (iteration >= text.length) {
                clearInterval(interval);
            }

            iteration += 1 / 3;
        }, 30);

        return () => clearInterval(interval);
    }, [text, trigger]);

    return <span className={className}>{displayText}</span>;
}
