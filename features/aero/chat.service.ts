export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  tokens?: number;
}

class AeroChatService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || "";
    this.baseUrl = "https://openrouter.ai/api/v1";
  }

  async sendMessage(messages: Message[]) {
    if (!this.apiKey) {
      throw new Error("OpenRouter API key is not configured.");
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "Aerophantom Teacher Panel",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo", // Default model
        messages: [
          {
            role: "system",
            content:
              "You are Aero, a helpful AI assistant for the Aerophantom Teacher Management System. You help teachers manage students, courses, and answer their questions concisely and professionally.",
          },
          ...messages.map(({ role, content }) => ({ role, content })),
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.error?.message || "Failed to get response from Aero AI.",
      );
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      tokens: data.usage?.total_tokens || 0,
    };
  }
}

const aeroChatService = new AeroChatService();
export default aeroChatService;
