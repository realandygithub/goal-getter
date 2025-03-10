import { type Message as AIMessage, streamText } from "ai";
import { NextResponse } from "next/server";
import { AIgatewayProvider } from "../custom-provider/custom-provider";

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

interface Message extends AIMessage {
  id: string;
}

// Mock goals data - in a real app, this would come from your database
const userGoals = [
  "Complete Project Documentation for Q2 project",
  "Conduct at least 5 client meetings this week",
  "Review and approve 10 pull requests",
  "Complete the leadership training module",
];

export async function POST(req: Request) {
  try {
    // Ensure API key is available
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 },
      );
    }

    const { messages } = (await req.json()) as { messages: Message[] };
    const lastMessage = messages[messages.length - 1]?.content;

    if (!lastMessage) {
      return NextResponse.json(
        { error: "No message content provided" },
        { status: 400 },
      );
    }

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

    const stream = streamText({
      model: AIgatewayProvider(modelId),
      system: systemPrompt,
      prompt: lastMessage,
      onError: (err) => {
        const errorMessage =
          err instanceof Error ? err.message : JSON.stringify(err);
        console.error("Error in activity analysis:", errorMessage);
      },
    });

    return stream.toDataStreamResponse();
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : JSON.stringify(err);
    console.error("Error in activity analysis:", errorMessage);
    return NextResponse.json(
      { error: "There was an error processing your request" },
      { status: 500 },
    );
  }
}
