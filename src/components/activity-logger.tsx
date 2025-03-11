"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Send } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { type Message as DBMessage } from "~/server/db/types";
import { convertToUIMessages } from "~/lib/utils";
import VoiceRecorderButton from "./voice-recorder-button";
export default function ActivityLogger({
  chatId,
  initialMessages,
}: {
  chatId: string;
  initialMessages: DBMessage[];
}) {
  const [localInput, setLocalInput] = useState("");
  const { messages, append, status } = useChat({
    api: "/api/analyze-activity",
    initialMessages: convertToUIMessages(initialMessages),
  });

  // Check if the AI is currently processing or streaming a response
  const isProcessing = status === "submitted" || status === "streaming";

  // Fixed: Made async and added proper promise handling
  const submitText = async () => {
    if (!localInput.trim()) return;

    // Fixed: Added await to handle the promise
    await append({
      role: "user",
      content: localInput,
    });

    setLocalInput("");
  };

  // Fixed: Changed to handle button click events
  const handleSendClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Fixed: Using void to explicitly ignore the promise
    void submitText();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalInput(e.target.value);
  };

  const handleTranscriptChange = (transcript: string) => {
    setLocalInput(transcript);
  };

  // Handle key press events (e.g., Enter to submit)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void submitText();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Activity Logger</CardTitle>
        <CardDescription>
          Record what you&apos;ve accomplished today
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="flex flex-col space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "assistant" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`flex max-w-[80%] items-start space-x-2 rounded-lg p-3 ${
                    message.role === "assistant"
                      ? "bg-muted"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="space-y-1">
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-end space-x-2">
          <div className="relative flex-1">
            <Textarea
              placeholder="Describe what you've accomplished today..."
              value={localInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              rows={3}
              className="resize-none pr-10"
            />
            <div className="absolute bottom-2 right-2">
              <VoiceRecorderButton
                onTranscriptChange={handleTranscriptChange}
                isDisabled={isProcessing}
              />
            </div>
          </div>
          {/* Fixed: Changed onClick to use handleSendClick */}
          <Button
            type="button"
            disabled={!localInput.trim() || isProcessing}
            onClick={handleSendClick}
          >
            <Send className="mr-2 h-4 w-4" />
            Send
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
