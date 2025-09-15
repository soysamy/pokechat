// features/chat/services/anthropicService.ts

export type OnChunk = (chunk: string) => void;

export async function streamAnthropicResponse(
  prompt: string,
  onChunk: OnChunk
) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "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",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
      stream: true,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Anthropic API error: ${res.status} ${errorText}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // split on newlines (SSE style)
    const parts = buffer.split("\n");
    buffer = parts.pop() || "";

    for (let part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      // SSE format often: "data: {...}"
      if (trimmed.startsWith("data:")) {
        const jsonText = trimmed.replace(/^data:\s*/, "");
        try {
          const data = JSON.parse(jsonText);
          // adjust depending on Anthropic streaming payload
          if (data.type === "response.delta") {
            onChunk(data.delta?.content || "");
          } else if (data.type === "response.output_text.delta") {
            onChunk(data.delta || "");
          }
        } catch (e) {
          // sometimes the stream sends non-json lines (keep them safe)
          console.log(e);
          onChunk(trimmed);
        }
      }
    }
  }
}
