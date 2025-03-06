"use client";

import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { BookOpen, Send, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useChat } from "@ai-sdk/react";

export default function NewJournalPage() {
  const { input, handleInputChange, handleSubmit, error, status, stop } =
    useChat();

  return (
    <main className="container mx-auto max-w-3xl py-8">
      <Link
        href="/"
        className="mb-6 flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>
      <Card className="border shadow-sm">
        <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <CardTitle>New Journal Entry</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-4">
            <h2 className="text-lg font-medium">What did you work on today?</h2>
            <p className="text-sm text-gray-600">
              Describe your activities, achievements, and challenges. The AI
              will analyze how they align with your goals.
            </p>
          </div>

          <Textarea
            placeholder="Today I worked on..."
            className="min-h-[200px] resize-none"
            value={input}
            onChange={handleInputChange}
          />

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-800">
              <p className="font-medium">Error: {JSON.stringify(error)}</p>
            </div>
          )}

          <div className="mt-4 rounded-md bg-blue-50 p-4 text-sm">
            <p className="font-medium text-blue-800">Journal Prompts:</p>
            <ul className="mt-2 list-disc pl-5 text-blue-700">
              <li>What specific tasks did you complete today?</li>
              <li>Did you face any challenges? How did you overcome them?</li>
              <li>Which of your goals do these activities support?</li>
              <li>What did you learn that might help with future work?</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-gray-50 px-6 py-4">
          <Button
            className="ml-auto flex items-center"
            onClick={() => {
              if (status === "submitted" || status === "streaming") {
                stop();
              } else {
                handleSubmit();
              }
            }}
          >
            {status === "submitted" || status === "streaming" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Submit Journal Entry
                <Send className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
