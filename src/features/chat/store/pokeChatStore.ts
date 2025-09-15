// store/useChatStore.ts
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { runPokemonTool } from "../services/pokemonApi";

interface ChatMessage {
  role: "user" | "ai";
  content: string;
  id: string;
  image?: string;
}

interface ChatStore {
  messages: ChatMessage[];
  loading: boolean;
  addMessage: (role: "user" | "ai", content: string, image?: string) => void;
  sendPrompt: (prompt: string) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  loading: false,

  addMessage: (role, content, image) =>
    set((state) => ({
      messages: [...state.messages, { role, content, image, id: uuidv4()}],
    })),

  sendPrompt: async (prompt: string) => {
    const apiKey = "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";
    if (!apiKey) {
      console.error("Missing Anthropic API Key");
      return;
    }

    // Add user message immediately
    get().addMessage("user", prompt);

    set({ loading: true });


    // Check for Pokemon tool invocation
      let pokemonText = "";
      let pokemonSprite: string | undefined;

      // we check for pokemon name
      const names = prompt.toLocaleLowerCase().split(" ");
      for (const name of names){
        const info = await runPokemonTool(name);
        if(info) {
          pokemonText = `Here is some data from PokeApi about ${info.name}:
          - ID: ${info.id}
          - Height: ${info.height}
          - Weight: ${info.weight}
          - Types: ${info.types.join(", ")}`;
          pokemonSprite = info.sprite;
          break;
        }
      }

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-opus-4-1-20250805",
          stream: false,
          max_tokens: 512,
          messages: [{ role: "user", content: prompt }, ...(pokemonText ? [{ role: "user", content: pokemonText }] : [] )],
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Anthropic error:", errorText);
        get().addMessage("ai", "Error: " + errorText);
        return;
      }

      const data = await res.json();
      const text = data.content ?? data.content?.[0]?.text ?? "";

      get().addMessage("ai", text[0].text || "No response", pokemonSprite);
    } catch (err) {
      console.error("Request failed:", err);
      get().addMessage("ai", "Request failed");
    } finally {
      set({ loading: false });
    }
  },
}));
