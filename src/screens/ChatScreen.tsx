// screens/ChatScreen.tsx
import React, { useState } from "react";
import { Button, TextInput, View } from "react-native";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { streamAnthropicResponse } from "../features/chat/services/anthropic";
import { runPokemonTool } from "../features/chat/services/pokemonApi";
import { useChatStore } from "../features/chat/store/pokeChatStore";

export const ChatScreen = () => {
  const addMessage = useChatStore((s) => s.addMessage);
  const updateMessage = useChatStore((s) => s.updateMessage);
  const [text, setText] = useState("");

  async function handleSend() {
    if (!text.trim()) return;
    try {
      const userMsg = { id: uuidv4(), role: "user" as const, text };
      addMessage(userMsg);
    } catch (error) {
      console.error("Error sending user message:", error);
    }

    const aiId = uuidv4();
    addMessage({ id: aiId, role: "ai", text: "" });

    // If the message seems to request pokemon tool, run it first
    if (/pokemon/i.test(text)) {
      const p = await runPokemonTool(text);
      if (p) {
        updateMessage(aiId, {
          text: `Pokémon: ${p.name}\nTypes: ${p.types.join(", ")}\n`,
        });
      }
    }

    // Stream response from Anthropic and append to AI message
    streamAnthropicResponse(text, (chunk) => {
      // append chunk
      updateMessage(
        aiId,
        (prev: any) => ({ text: (prev?.text || "") + chunk } as any)
      );
    }).catch((e) => {
      console.error("Error streaming Anthropic response:", e);
      updateMessage(aiId, { text: "Error: " + String(e) });
    });

    setText("");
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* ChatWindow organism */}
      <View style={{ flex: 1 }}>
        {/* place ChatWindow component here in your app */}
      </View>

      <View style={{ flexDirection: "row", gap: 8 }}>
        <TextInput
          value={text}
          onChangeText={setText}
          style={{ flex: 1, borderWidth: 1, padding: 8 }}
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </View>
  );
};
