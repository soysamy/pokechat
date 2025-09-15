import EventSource from "react-native-sse";

export async function streamAnthropicResponse(
  userMessage: string,
  onChunk: (text: string) => void,
  onComplete?: () => void,
  onError?: (err: unknown) => void
) {
  return new Promise<void>((resolve, reject) => {
    const es = new EventSource("https://api.anthropic.com/v1/messages", {
      headers: {
        "Content-Type": "application/json",
        "x-api-key":
          "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",
        "anthropic-version": "2023-06-01",
      },
      method: "POST",
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [{ role: "user", content: userMessage }],
        stream: true,
      }),
    });

    es.addEventListener("message", (event) => {
      if (event.data === "[DONE]") {
        onComplete?.();
        es.close();
        resolve();
        return;
      }

      try {
        const json = JSON.parse(event.data);
        if (json.type === "content_block_delta" && json.delta?.text) {
          onChunk(json.delta.text);
        }
      } catch (err) {
        console.error("Stream parse error:", err);
      }
    });

    es.addEventListener("error", (event) => {
      console.error("SSE error:", event);
      es.close();
      onError?.(event);
      reject(event);
    });
  });
}
