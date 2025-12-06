

export interface LocalAIState {
    isLoading: boolean;
    progress: number;
    text: string;
    isReady: boolean;
}

class LocalAIService {
    private listeners: ((state: LocalAIState) => void)[] = [];
    private state: LocalAIState = {
        isLoading: false,
        progress: 0,
        text: "",
        isReady: false
    };

    private updateState(newState: Partial<LocalAIState>) {
        this.state = { ...this.state, ...newState };
        this.listeners.forEach(listener => listener(this.state));
    }

    public subscribe(listener: (state: LocalAIState) => void) {
        this.listeners.push(listener);
        listener(this.state); // Initial emission
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    public async loadModel() {
        // No actual model loading needed for API
        this.updateState({
            isLoading: false,
            isReady: true,
            text: "Cloud Model Ready (Pollinations.ai)"
        });
    }

    public async *generateStream(prompt: string, systemPrompt?: string): AsyncGenerator<string> {
        const defaultSystemPrompt = "You are a helpful AI assistant that reframes negative memories into positive, stoic, or humorous perspectives. Keep it concise.";

        const messages = [
            { role: "system", content: systemPrompt || defaultSystemPrompt },
            { role: "user", content: prompt }
        ];

        try {
            const response = await fetch('https://text.pollinations.ai/openai/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: messages,
                    model: 'openai', // Pollinations auto-routes, but 'openai' is a safe default
                    stream: true
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() || ""; // Keep the last incomplete line in buffer

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed || trimmed === "data: [DONE]") continue;
                    if (trimmed.startsWith("data: ")) {
                        try {
                            const data = JSON.parse(trimmed.slice(6));
                            const content = data.choices[0]?.delta?.content || "";
                            if (content) yield content;
                        } catch (e) {
                            console.warn("Failed to parse SSE line:", line, e);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Generation failed:", error);
            throw error;
        }
    }
}

export const localAIService = new LocalAIService();
