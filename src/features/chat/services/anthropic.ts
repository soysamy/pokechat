// features/chat/services/anthropicService.ts
import { ANTHROPIC_API_KEY, ANTHROPIC_BASE } from "../../../core/api/client";

export type OnChunk = (chunk: string) => void;

export async function streamAnthropicResponse(
  prompt: string,
  onChunk: OnChunk
) {
  const res = await fetch(`${ANTHROPIC_BASE}/responses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
    },
    body: JSON.stringify({
      model: "claude-2.1",
      input: prompt,
      max_tokens: 800,
      stream: true,
    }),
  });

  if (!res.body) throw new Error("No response body");
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
