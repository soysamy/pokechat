// hooks/useAnthropicStream.ts
import { useEffect } from "react";

export function useAnthropicStream(
  prompt: string,
  onChunk: (chunk: string) => void
) {
  useEffect(() => {
    if (!prompt) return;

    let isCancelled = false;

    async function stream() {
      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key":
              "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",
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-3-opus-20240229",
            max_tokens: 256,
            stream: true,
            messages: [{ role: "user", content: prompt }],
          }),
        });

        const reader = response.body?.getReader();
        const decoder = new TextDecoder("utf-8");

        if (!reader) {
          console.error("No reader available on response body");
          return;
        }

        while (true) {
          const { done, value } = await reader.read();
          if (done || isCancelled) break;

          const chunk = decoder.decode(value, { stream: true });

          // Anthropic streams JSON objects line by line
          chunk.split("\n").forEach((line) => {
            if (line.trim().startsWith("{")) {
              try {
                const data = JSON.parse(line);
                const text = data.delta?.text ?? "";
                if (text) onChunk(text);
              } catch (err) {
                // skip non-JSON lines like keep-alive
              }
            }
          });
        }
      } catch (err) {
        console.error("Streaming error:", err);
      }
    }

    stream();

    return () => {
      isCancelled = true;
    };
  }, [prompt]);
}
