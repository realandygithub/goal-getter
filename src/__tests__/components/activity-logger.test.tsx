import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ActivityLogger from "~/components/activity-logger";

// Import the useChat function to be able to mock it
import { useChat } from "@ai-sdk/react";

// Mock the useChat hook
vi.mock("@ai-sdk/react", () => ({
  useChat: vi.fn().mockReturnValue({
    messages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hi there! Tell me what you've accomplished today, and I'll help analyze how it aligns with your goals.",
        parts: [
          {
            type: "text",
            text: "Hi there! Tell me what you've accomplished today, and I'll help analyze how it aligns with your goals.",
          },
        ],
      },
    ],
    append: vi.fn().mockResolvedValue(undefined),
    status: "ready",
    error: undefined,
    reload: vi.fn(),
    stop: vi.fn(),
    setMessages: vi.fn(),
    input: "",
    setInput: vi.fn(),
    handleSubmit: vi.fn(),
    isLoading: false,
    data: undefined,
    addToolResult: vi.fn(),
    handleInputChange: vi.fn(),
    setData: vi.fn(),
    id: "chat-1",
  }),
}));

describe("ActivityLogger", () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  it("renders correctly with initial message", () => {
    render(<ActivityLogger />);

    // Check if the welcome message is displayed
    expect(
      screen.getByText(/Hi there! Tell me what you've accomplished today/i),
    ).toBeInTheDocument();

    // Check if the input textarea is present
    expect(
      screen.getByPlaceholderText(/Type what you've accomplished today/i),
    ).toBeInTheDocument();

    // Check if the microphone button is present - using a more reliable selector
    const micButton = document.querySelector("button svg.lucide-mic");
    expect(micButton).toBeInTheDocument();

    // Check if the send button is present but disabled (as there's no input)
    const sendButton = screen.getByRole("button", { name: /send/i });
    expect(sendButton).toBeInTheDocument();
    expect(sendButton).toBeDisabled();
  });

  it("allows typing and sending a message", async () => {
    const user = userEvent.setup();
    const mockAppend = vi.fn().mockResolvedValue(undefined);

    // Override the mock for this specific test
    (useChat as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      messages: [
        {
          id: "welcome",
          role: "assistant",
          content:
            "Hi there! Tell me what you've accomplished today, and I'll help analyze how it aligns with your goals.",
        },
      ],
      append: mockAppend,
      status: "ready",
    });

    render(<ActivityLogger />);

    // Type a message
    const textarea = screen.getByPlaceholderText(
      /Type what you've accomplished today/i,
    );
    await user.type(textarea, "I completed my project today");

    // Click the send button
    const sendButton = screen.getByRole("button", { name: /send/i });
    expect(sendButton).not.toBeDisabled();
    await user.click(sendButton);

    // Check if append was called with the correct message
    expect(mockAppend).toHaveBeenCalledWith({
      role: "user",
      content: "I completed my project today",
    });

    // Check if the textarea is cleared after sending
    expect(textarea).toHaveValue("");
  });

  it("handles Enter key to send a message", async () => {
    const user = userEvent.setup();
    const mockAppend = vi.fn().mockResolvedValue(undefined);

    // Override the mock for this specific test
    (useChat as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      messages: [
        {
          id: "welcome",
          role: "assistant",
          content:
            "Hi there! Tell me what you've accomplished today, and I'll help analyze how it aligns with your goals.",
        },
      ],
      append: mockAppend,
      status: "ready",
    });

    render(<ActivityLogger />);

    // Type a message
    const textarea = screen.getByPlaceholderText(
      /Type what you've accomplished today/i,
    );
    await user.type(textarea, "I completed my project today");

    // Press Enter to send
    await user.type(textarea, "{Enter}");

    // Check if append was called with the correct message
    expect(mockAppend).toHaveBeenCalledWith({
      role: "user",
      content: "I completed my project today",
    });
  });

  it("shows loading state when processing", () => {
    // Override the mock to simulate loading state
    (useChat as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      messages: [
        {
          id: "welcome",
          role: "assistant",
          content:
            "Hi there! Tell me what you've accomplished today, and I'll help analyze how it aligns with your goals.",
        },
      ],
      append: vi.fn().mockResolvedValue(undefined),
      status: "submitted", // This will trigger the loading state
    });

    render(<ActivityLogger />);

    // Check if the loading indicator is shown
    expect(screen.getByText(/processing/i)).toBeInTheDocument();

    // Check if the textarea is disabled
    const textarea = screen.getByPlaceholderText(
      /Type what you've accomplished today/i,
    );
    expect(textarea).toBeDisabled();

    // Check if the microphone button is disabled - using a more reliable selector
    const micButton = document.querySelector("button svg.lucide-mic");
    const micButtonElement = micButton?.closest("button");
    expect(micButtonElement).toBeDisabled();
  });

  it("displays user and AI messages correctly", () => {
    // Override the mock to include multiple messages
    vi.mocked(useChat).mockReturnValue({
      messages: [
        {
          id: "welcome",
          role: "assistant",
          content: "Hi there! Tell me what you've accomplished today.",
          parts: [
            {
              type: "text",
              text: "Hi there! Tell me what you've accomplished today.",
            },
          ],
        },
        {
          id: "user-1",
          role: "user",
          content: "I completed my project today",
          parts: [{ type: "text", text: "I completed my project today" }],
        },
        {
          id: "assistant-1",
          role: "assistant",
          content: "Great job! That aligns with your goals.",
          parts: [
            { type: "text", text: "Great job! That aligns with your goals." },
          ],
        },
      ],
      append: vi.fn().mockResolvedValue(undefined),
      status: "ready",
      error: undefined,
      reload: vi.fn(),
      stop: vi.fn(),
      setMessages: vi.fn(),
      input: "",
      setInput: vi.fn(),
      handleSubmit: vi.fn(),
      isLoading: false,
      data: undefined,
      addToolResult: vi.fn(),
      handleInputChange: vi.fn(),
      setData: vi.fn(),
      id: "chat-1",
    });

    render(<ActivityLogger />);

    // Check if all messages are displayed
    expect(
      screen.getByText(/Hi there! Tell me what you've accomplished today./i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/I completed my project today/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Great job! That aligns with your goals./i),
    ).toBeInTheDocument();

    // Check if user and AI avatars are displayed correctly
    const userAvatars = screen.getAllByText("U");
    const aiAvatars = screen.getAllByText("AI");
    expect(userAvatars.length).toBe(1);
    expect(aiAvatars.length).toBe(2);
  });
});
