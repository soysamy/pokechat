// store/useChatStore.ts
import Constants from "expo-constants";
import { create } from "zustand";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatStore {
  messages: ChatMessage[];
  loading: boolean;
  addMessage: (role: "user" | "assistant", content: string) => void;
  sendPrompt: (prompt: string) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  loading: false,

  addMessage: (role, content) =>
    set((state) => ({
      messages: [...state.messages, { role, content }],
    })),

  sendPrompt: async (prompt: string) => {
    const apiKey = Constants.expoConfig?.extra?.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error("Missing Anthropic API Key");
      return;
    }

    // Add user message immediately
    get().addMessage("user", prompt);

    set({ loading: true });

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-opus-20240229",
          stream: false,
          max_tokens: 512,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Anthropic error:", errorText);
        get().addMessage("assistant", "Error: " + errorText);
        return;
      }

      const data = await res.json();
      const text = data.completion ?? data.content?.[0]?.text ?? "";

      get().addMessage("assistant", text);
    } catch (err) {
      console.error("Request failed:", err);
      get().addMessage("assistant", "Request failed");
    } finally {
      set({ loading: false });
    }
  },
}));
