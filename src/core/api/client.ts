// core/api/anthropicClient.ts
import Constants from "expo-constants";

export const ANTHROPIC_API_KEY =
  Constants.expoConfig?.extra?.ANTHROPIC_API_KEY || "";
export const ANTHROPIC_BASE = "https://api.anthropic.com/v1";
