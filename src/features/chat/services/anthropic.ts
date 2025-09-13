import Constants from "expo-constants";

export async function streamAnthropicResponse(
  prompt: string,
  onMessage: (chunk: string) => void
) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": Constants.expoConfig?.extra?.ANTHROPIC_API_KEY,
    },
    body: JSON.stringify({
      model: "claude-3-sonnet-20240229",
      max_tokens: 512,
      messages: [{ role: "user", content: prompt }],
      stream: true,
    }),
  });

  const reader = response.body?.getReader();
  const decoder = new TextDecoder("utf-8");

  while (true) {
    const { done, value } = await reader!.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    try {
      const lines = chunk.split("\n").filter(Boolean);
      for (let line of lines) {
        if (line.startsWith("data:")) {
          const data = JSON.parse(line.replace("data: ", ""));
          if (data.type === "content_block_delta") {
            onMessage(data.delta.text);
          }
        }
      }
    } catch (e) {
      console.warn("Stream error:", e);
    }
  }
}
