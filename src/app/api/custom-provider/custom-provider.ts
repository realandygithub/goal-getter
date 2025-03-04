import { type LanguageModelV1, type EmbeddingModelV1 } from "@ai-sdk/provider";
import {
  OpenAICompatibleChatLanguageModel,
  OpenAICompatibleCompletionLanguageModel,
  OpenAICompatibleEmbeddingModel,
} from "@ai-sdk/openai-compatible";
import {
  type FetchFunction,
  loadApiKey,
  withoutTrailingSlash,
} from "@ai-sdk/provider-utils";
import {
  type AIgatewayCompletionModelId,
  type AIgatewayChatModelId,
  type AIgatewayChatSettings,
  type AIgatewayCompletionSettings,
  type AIgatewayEmbeddingModelId,
  type AIgatewayEmbeddingSettings,
} from "./custom-chat-settings";
// Import your model id and settings here.

export interface AIgatewayProviderSettings {
  /**
AIgateway API key.
*/
  apiKey?: string;
  /**
Base URL for the API calls.
*/
  baseURL?: string;
  /**
Custom headers to include in the requests.
*/
  headers?: Record<string, string>;
  /**
Optional custom url query parameters to include in request urls.
*/
  queryParams?: Record<string, string>;
  /**
Custom fetch implementation. You can use it as a middleware to intercept requests,
or to provide a custom fetch implementation for e.g. testing.
*/
  fetch?: FetchFunction;
}

export interface AIgatewayProvider {
  /**
Creates a model for text generation.
*/
  (
    modelId: AIgatewayChatModelId,
    settings?: AIgatewayChatSettings,
  ): LanguageModelV1;

  /**
Creates a chat model for text generation.
*/
  chatModel(
    modelId: AIgatewayChatModelId,
    settings?: AIgatewayChatSettings,
  ): LanguageModelV1;

  /**
Creates a completion model for text generation.
*/
  completionModel(
    modelId: AIgatewayCompletionModelId,
    settings?: AIgatewayCompletionSettings,
  ): LanguageModelV1;

  /**
Creates a text embedding model for text generation.
*/
  textEmbeddingModel(
    modelId: AIgatewayEmbeddingModelId,
    settings?: AIgatewayEmbeddingSettings,
  ): EmbeddingModelV1<string>;
}

export function createAIgatewayProvider(
  options: AIgatewayProviderSettings = {},
): AIgatewayProvider {
  const baseURL = withoutTrailingSlash(
    options.baseURL ?? "https://api.example.com/v1",
  );
  const getHeaders = () => ({
    Authorization: `Bearer ${loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: "EXAMPLE_API_KEY",
      description: "AIgateway API key",
    })}`,
    ...options.headers,
  });

  interface CommonModelConfig {
    provider: string;
    url: ({ path }: { path: string }) => string;
    headers: () => Record<string, string>;
    fetch?: FetchFunction;
  }

  const getCommonModelConfig = (modelType: string): CommonModelConfig => ({
    provider: `example.${modelType}`,
    url: ({ path }) => {
      const url = new URL(`${baseURL}${path}`);
      if (options.queryParams) {
        url.search = new URLSearchParams(options.queryParams).toString();
      }
      return url.toString();
    },
    headers: getHeaders,
    fetch: options.fetch,
  });

  const createChatModel = (
    modelId: AIgatewayChatModelId,
    settings: AIgatewayChatSettings = {},
  ) => {
    return new OpenAICompatibleChatLanguageModel(modelId, settings, {
      ...getCommonModelConfig("chat"),
      defaultObjectGenerationMode: "tool",
    });
  };

  const createCompletionModel = (
    modelId: AIgatewayCompletionModelId,
    settings: AIgatewayCompletionSettings = {},
  ) =>
    new OpenAICompatibleCompletionLanguageModel(
      modelId,
      settings,
      getCommonModelConfig("completion"),
    );

  const createTextEmbeddingModel = (
    modelId: AIgatewayEmbeddingModelId,
    settings: AIgatewayEmbeddingSettings = {},
  ) =>
    new OpenAICompatibleEmbeddingModel(
      modelId,
      settings,
      getCommonModelConfig("embedding"),
    );

  const provider = (
    modelId: AIgatewayChatModelId,
    settings?: AIgatewayChatSettings,
  ) => createChatModel(modelId, settings);

  provider.completionModel = createCompletionModel;
  provider.chatModel = createChatModel;
  provider.textEmbeddingModel = createTextEmbeddingModel;

  return provider;
}

// Use the model specified in environment variables or default to gpt-4o
const baseURL = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";
// Export default instance
export const AIgatewayProvider = createAIgatewayProvider({
  baseURL,
  apiKey: process.env.OPENAI_API_KEY,
});
