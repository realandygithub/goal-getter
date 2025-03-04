import { openai } from "@ai-sdk/openai";
import { type Message as AIMessage, streamText } from "ai";
import { NextResponse } from "next/server";

// Check if OpenAI API key is configured
if (!process.env.OPENAI_API_KEY) {
  console.warn("Missing OPENAI_API_KEY environment variable");
}

// Check if custom OpenAI base URL is configured
const customBaseUrl = process.env.OPENAI_BASE_URL;
if (customBaseUrl) {
  console.log(`Using custom OpenAI base URL: ${customBaseUrl}`);
}

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

    // Use the model specified in environment variables or default to gpt-4o
    const modelName = process.env.OPENAI_MODEL ?? "gpt-4o";

    // The OpenAI API key and base URL are automatically picked up from
    // environment variables by the AI SDK:
    // - OPENAI_API_KEY
    // - OPENAI_BASE_URL (if you're using a custom base URL)
    const model = openai(modelName);

    const stream = streamText({
      model,
      system: systemPrompt,
      prompt: lastMessage,
      onError: (error) => {
        console.error("Error in activity analysis:", error);
      },
    });

    return stream.toDataStreamResponse();
  } catch (error) {
    console.error("Error in activity analysis:", error);
    return NextResponse.json(
      { error: "There was an error processing your request" },
      { status: 500 },
    );
  }
}
