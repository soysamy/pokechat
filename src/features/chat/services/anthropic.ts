// hooks/useAnthropicRequest.ts
import Constants from "expo-constants";
import { useState } from "react";

interface UseAnthropicRequestReturn {
  response: string;
  loading: boolean;
  ask: (prompt: string) => Promise<void>;
}

export function useAnthropicRequest(): UseAnthropicRequestReturn {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const ask = async (prompt: string) => {
    setLoading(true);
    setResponse("");

    try {
      const apiKey = Constants.expoConfig?.extra?.ANTHROPIC_API_KEY;
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey!,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-opus-20240229",
          stream: false, // <-- no streaming
          max_tokens: 512,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Anthropic error:", errorText);
        setResponse("Error: " + errorText);
        return;
      }

      const data = await res.json();
      // extract text (depends on Anthropic response format)
      const text = data.completion ?? data.choices?.[0]?.message?.content ?? "";
      setResponse(text);
    } catch (err) {
      console.error(err);
      setResponse("Request failed");
    } finally {
      setLoading(false);
    }
  };

  return { response, loading, ask };
}
