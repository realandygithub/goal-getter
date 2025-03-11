import {
  type Message,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from "ai";
import { NextResponse } from "next/server";
import { AIgatewayProvider } from "../custom-provider/custom-provider";
import {
  getChatById,
  getCurrentUser,
  saveChat,
  saveMessages,
} from "~/server/db/actions";
import {
  generateTitleFromUserMessage,
  getMostRecentUserMessage,
  sanitizeResponseMessages,
} from "~/lib/utils";
import { v4 as uuidv4 } from "uuid";

// Check if OpenAI API key is configured
if (!process.env.OPENAI_API_KEY) {
  console.warn("Missing OPENAI_API_KEY environment variable");
}

// Check if custom OpenAI base URL is configured
const customBaseUrl = process.env.OPENAI_BASE_URL;
if (customBaseUrl) {
  console.log(`Using custom OpenAI base URL: ${customBaseUrl}`);
}

// Configure the OpenAI provider with custom base URL if available
// The openai function from @ai-sdk/openai automatically uses OPENAI_BASE_URL
// from environment variables if it's set

// Mock goals data - in a real app, this would come from your database
const userGoals = [
  "Finish journal CRUD functionality features",
  "Conduct at least 5 client meetings this week",
  "Review and approve 10 pull requests",
  "Complete the leadership training module",
];

export async function POST(req: Request) {
  try {
    const { id, messages } = (await req.json()) as {
      id: string;
      messages: Array<Message>;
    };

    const user = await getCurrentUser();

    if (!user || user.banned || user.locked) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const lastMessage = getMostRecentUserMessage(messages);

    if (!lastMessage) {
      return new Response("No last user message found", { status: 400 });
    }
    const chat = await getChatById({ id });

    if (!chat) {
      const title = await generateTitleFromUserMessage({
        message: lastMessage,
      });

      await saveChat({ id, userId: user.id, title });
    } else {
      if (chat.userId !== user.id) {
        return new Response("Unauthorized", { status: 401 });
      }
    }

    await saveMessages({
      messages: [{ ...lastMessage, createdAt: new Date(), chatId: id }],
    });

    // Create a system prompt that includes the user's goals
    const systemPrompt = `
      You are an AI assistant that helps users track their work activities and compare them with their goals.
      
      The user has the following goals:
      ${userGoals.map((goal) => `- ${goal}`).join("\n")}
      
      Analyze the user's activities and provide insights on:
      1. How their activities align with their goals
      2. What areas they might need to focus more on
      3. Provide encouraging feedback on their progress
      
      Keep your responses concise, friendly, and actionable.
    `;

    const modelId = process.env.OPENAI_MODEL ?? "gpt-4o";

    return createDataStreamResponse({
      execute: async (dataStream) => {
        const result = streamText({
          model: AIgatewayProvider(modelId),
          system: systemPrompt,
          messages,
          maxSteps: 5,
          experimental_activeTools: [],
          experimental_transform: smoothStream({ chunking: "word" }),
          experimental_generateMessageId: uuidv4,
          tools: {},
          onFinish: async ({ response, reasoning }) => {
            if (user?.id) {
              try {
                const sanitizedResponseMessages = sanitizeResponseMessages({
                  messages: response.messages,
                  reasoning,
                });

                await saveMessages({
                  messages: sanitizedResponseMessages.map((message) => {
                    return {
                      id: message.id,
                      chatId: id,
                      role: message.role,
                      content: message.content,
                      createdAt: new Date(),
                    };
                  }),
                });
              } catch (error) {
                console.error("Failed to save chat", error);
              }
            }
          },
        });

        await result.consumeStream();

        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
        });
      },
      onError: () => {
        return "Oops, an error occurred!";
      },
    });
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
