import { NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import {
  journalEntrySchema,
  journalAnalysisSchema,
  type DbGoal,
} from "~/lib/schemas";

// Mock user goals - in a real app, these would come from your database
const userGoals: Partial<DbGoal>[] = [
  {
    id: "goal1",
    title: "Improve technical leadership",
    description:
      "Take on more leadership responsibilities in technical discussions and decisions",
    progress: 65,
    category: "Leadership",
  },
  {
    id: "goal2",
    title: "Mentor junior developers",
    description:
      "Regularly mentor junior team members to help them grow their skills",
    progress: 30,
    category: "Mentorship",
  },
  {
    id: "goal3",
    title: "Complete system architecture redesign",
    description:
      "Lead the redesign of the core system architecture to improve scalability",
    progress: 10,
    category: "Technical",
  },
];

export async function POST(req: Request) {
  try {
    // Check for API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 },
      );
    }

    // Get journal entry from request and validate with Zod
    const requestBody: unknown = await req.json();
    const parseResult = journalEntrySchema.safeParse(requestBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Journal entry content is required" },
        { status: 400 },
      );
    }

    const { content } = parseResult.data;

    // Construct the system prompt with user goals
    const goalsText = userGoals
      .map(
        (goal) =>
          `- ${goal.title}: ${goal.description} (Current progress: ${goal.progress}%)`,
      )
      .join("\n");

    const systemPrompt = `You are an AI career coach analyzing a user's daily work journal entry. 
The user has the following career goals:

${goalsText}

Analyze the journal entry and provide:
1. A brief summary of the activities
2. How each activity relates to the user's goals (high, medium, or low impact)
3. Specific insights about their progress
4. Actionable suggestions for further improvement

Format your response as JSON with the following structure:
{
  "summary": "Brief summary of the journal entry",
  "goalProgress": [
    {
      "goal": "Goal title",
      "impact": "High/Medium/Low",
      "analysis": "How the activities impact this goal"
    }
  ],
  "insights": ["Insight 1", "Insight 2", "Insight 3"],
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
}`;

    // Call OpenAI to analyze the journal entry
    const model = process.env.OPENAI_MODEL ?? "gpt-4o";

    const result = streamText({
      model: openai(model),
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content },
      ],
      temperature: 0.7,
      maxTokens: 1000,
    });

    // Parse the response as JSON
    try {
      // The result.text is not a Promise, so we don't need to await it
      const analysisText = result.text;

      // Parse the JSON response
      let parsedAnalysis: unknown;
      try {
        parsedAnalysis = JSON.parse(analysisText);
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        return NextResponse.json(
          { error: "Failed to parse AI analysis: Invalid JSON" },
          { status: 500 },
        );
      }

      // Validate the analysis with Zod
      const validationResult = journalAnalysisSchema.safeParse(parsedAnalysis);

      if (!validationResult.success) {
        console.error("Invalid analysis format:", validationResult.error);
        return NextResponse.json(
          { error: "AI response format was invalid" },
          { status: 500 },
        );
      }

      const analysis = validationResult.data;

      // In a real app, you would save the journal entry and analysis to your database here

      return NextResponse.json({ success: true, analysis });
    } catch (error) {
      console.error("Error parsing AI response:", error);
      return NextResponse.json(
        { error: "Failed to parse AI analysis" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error in journal analysis:", error);
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    return NextResponse.json(
      { error: `Error in journal analysis: ${errorMessage}` },
      { status: 500 },
    );
  }
}

// Add ESLint disable comments for specific lines
/* eslint-disable @typescript-eslint/await-thenable */
