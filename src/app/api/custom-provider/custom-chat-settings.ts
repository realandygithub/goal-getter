export const modelId = process.env.OPENAI_MODEL ?? "gpt-4o";

export const baseUrl =
  process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";

export type AIgatewayChatModelId = typeof modelId;
export type AIgatewayCompletionModelId = typeof modelId;
export type AIgatewayEmbeddingModelId = typeof modelId;
