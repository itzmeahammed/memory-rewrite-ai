import { delay } from '@/lib/utils';

export interface RewriteResponse {
    rewrittenText: string;
    tone: string;
}

export const aiService = {
    async rewrite(text: string, tone: 'positive' | 'stoic' | 'funny' = 'positive'): Promise<RewriteResponse> {
        // Simulate network delay
        await delay(2000);

        const responses = {
            positive: [
                "This experience, though challenging, has opened a door to new understanding.",
                "Every setback is a setup for a comeback. You are stronger now.",
                "The shadows only prove the existence of light. You found your way through."
            ],
            stoic: [
                "The event itself is neutral; only your judgment makes it good or bad.",
                "You endured. That is the only metric that matters.",
                "Accept what happened, for it is now part of the unchangeable past."
            ],
            funny: [
                "Well, at least it didn't explode. Or did it? Either way, you're here.",
                "Plot twist: This is just character development for your biopic.",
                "If life gives you lemons, make a lemon-powered battery and shock someone."
            ]
        };

        const options = responses[tone];
        const randomResponse = options[Math.floor(Math.random() * options.length)];

        return {
            rewrittenText: `[AI REWRITTEN]: ${text}\n\n>>> ${randomResponse}`,
            tone
        };
    },

    async *rewriteStream(text: string, tone: 'positive' | 'stoic' | 'funny' = 'positive'): AsyncGenerator<string> {
        // Simulate network delay
        await delay(1000);

        const responses = {
            positive: "This experience, though challenging, has opened a door to new understanding. Every setback is a setup for a comeback. You are stronger now.",
            stoic: "The event itself is neutral; only your judgment makes it good or bad. You endured. That is the only metric that matters.",
            funny: "Well, at least it didn't explode. Or did it? Either way, you're here. Plot twist: This is just character development."
        };

        const fullResponse = `[AI REWRITTEN]: ${text}\n\n>>> ${responses[tone]}`;
        const chunks = fullResponse.split(' ');

        for (const chunk of chunks) {
            await delay(50 + Math.random() * 50); // Random delay between words
            yield chunk + ' ';
        }
    }
};
