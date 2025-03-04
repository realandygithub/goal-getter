import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

// Mock the modules
vi.mock("@ai-sdk/openai", () => ({
  openai: vi.fn().mockReturnValue({
    name: "gpt-4-turbo",
  }),
}));

vi.mock("ai", () => {
  return {
    streamText: vi.fn().mockReturnValue({
      toDataStreamResponse: vi
        .fn()
        .mockReturnValue(new Response(null, { status: 200 })),
    }),
  };
});

// Mock process.env
const originalEnv = { ...process.env };

describe("Analyze Activity API Route", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = {
      ...originalEnv,
      OPENAI_API_KEY: "test-api-key",
      OPENAI_MODEL: "gpt-4-turbo",
    };
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns 400 if no message content is provided", async () => {
    // Import the route inside the test to ensure it uses the mocked env
    const { POST } = await import("~/app/api/analyze-activity/route");

    const request = new NextRequest(
      "http://localhost:3000/api/analyze-activity",
      {
        method: "POST",
        body: JSON.stringify({
          messages: [],
        }),
      },
    );

    const response = await POST(request);
    expect(response.status).toBe(400);

    const data = (await response.json()) as { error: string };
    expect(data.error).toBe("No message content provided");
  });

  it("returns 400 if messages array is empty", async () => {
    // Import the route inside the test to ensure it uses the mocked env
    const { POST } = await import("~/app/api/analyze-activity/route");

    const request = new NextRequest(
      "http://localhost:3000/api/analyze-activity",
      {
        method: "POST",
        body: JSON.stringify({
          messages: [],
        }),
      },
    );

    const response = await POST(request);
    expect(response.status).toBe(400);

    const data = (await response.json()) as { error: string };
    expect(data.error).toBe("No message content provided");
  });

  it("processes a valid request and returns a streaming response", async () => {
    // Import the route and mocked modules inside the test
    const { POST } = await import("~/app/api/analyze-activity/route");
    const { openai } = await import("@ai-sdk/openai");
    const { streamText } = await import("ai");

    const request = new NextRequest(
      "http://localhost:3000/api/analyze-activity",
      {
        method: "POST",
        body: JSON.stringify({
          messages: [
            { id: "1", role: "user", content: "I completed my project today" },
          ],
        }),
      },
    );

    const response = await POST(request);
    expect(response.status).toBe(200);

    // Verify that streamText was called with the correct parameters
    expect(streamText).toHaveBeenCalledTimes(1);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    expect(streamText).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: "I completed my project today",
        model: expect.anything(),
      }),
    );

    // Verify that openai was called with the correct model
    expect(openai).toHaveBeenCalledWith("gpt-4-turbo");
  });

  it("includes user goals in the system prompt", async () => {
    // Import the route and mocked modules inside the test
    const { POST } = await import("~/app/api/analyze-activity/route");
    const { streamText } = await import("ai");

    let capturedSystemPrompt = "";

    // Mock the streamText function to capture the system prompt
    // @ts-expect-error - Mock implementation doesn't need to match the full type
    vi.mocked(streamText).mockImplementationOnce(({ system }) => {
      capturedSystemPrompt = system ?? "";
      return {
        toDataStreamResponse: vi
          .fn()
          .mockReturnValue(new Response(null, { status: 200 })),
        warnings: [],
        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
        sources: [],
        finishReason: "stop",
        text: "",
      };
    });

    const request = new NextRequest(
      "http://localhost:3000/api/analyze-activity",
      {
        method: "POST",
        body: JSON.stringify({
          messages: [
            { id: "1", role: "user", content: "I completed my project today" },
          ],
        }),
      },
    );

    await POST(request);

    // Check that the system prompt includes the user goals
    expect(capturedSystemPrompt).toContain("The user has the following goals:");
  });

  it("uses the model specified in environment variables", async () => {
    // Import the route and mocked modules inside the test
    const { POST } = await import("~/app/api/analyze-activity/route");
    const { openai } = await import("@ai-sdk/openai");

    const request = new NextRequest(
      "http://localhost:3000/api/analyze-activity",
      {
        method: "POST",
        body: JSON.stringify({
          messages: [
            { id: "1", role: "user", content: "I completed my project today" },
          ],
        }),
      },
    );

    await POST(request);

    // Check that the openai function was called with the correct model
    expect(openai).toHaveBeenCalledWith("gpt-4-turbo");
  });

  it("handles errors gracefully", async () => {
    // Import the route and mocked modules inside the test
    const { POST } = await import("~/app/api/analyze-activity/route");
    const { streamText } = await import("ai");

    // Mock streamText to throw an error
    vi.mocked(streamText).mockImplementationOnce(() => {
      throw new Error("API Error");
    });

    const request = new NextRequest(
      "http://localhost:3000/api/analyze-activity",
      {
        method: "POST",
        body: JSON.stringify({
          messages: [
            { id: "1", role: "user", content: "I completed my project today" },
          ],
        }),
      },
    );

    const response = await POST(request);
    expect(response.status).toBe(500);

    const data = (await response.json()) as { error: string };
    expect(data.error).toBe("There was an error processing your request");
  });
});
