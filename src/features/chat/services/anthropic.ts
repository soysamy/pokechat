// hooks/useAnthropicRequest.ts
import { useState } from "react";

interface UseAnthropicRequestReturn {
  response: string;
  loading: boolean;
  ask: (prompt: string) => Promise<void>;
}

export function useAnthropicStream(): UseAnthropicRequestReturn {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const ask = async (prompt: string) => {
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "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",
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-opus-4-1-20250805",
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
      const text = data.content ?? data.content?.[0]?.text ?? "";
      console.log(text[0]);
      return;
    } catch (err) {
      console.error(err);
      setResponse("Request failed");
    } finally {
      setLoading(false);
    }
  };

  return { response, loading, ask };
}
