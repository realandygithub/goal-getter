"use client";

import { useState, useEffect, useRef } from "react";
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
import { Mic, Send, Loader2, MicOff } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";

interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResult[][];
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
    SpeechRecognition: new () => SpeechRecognition;
  }
}

export default function ActivityLogger() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/analyze-activity",
      initialMessages: [
        {
          id: "welcome",
          role: "assistant",
          content:
            "Hi there! Tell me what you've accomplished today, and I'll help analyze how it aligns with your goals.",
        },
      ],
    });

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognitionConstructor =
        window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognitionConstructor();

      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          let interimTranscript = "";
          let finalTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const result = event.results[i];
            if (result?.[0]?.isFinal) {
              finalTranscript += result[0].transcript;
            } else if (result?.[0]?.transcript) {
              interimTranscript += result[0].transcript;
            }
          }

          setTranscript(finalTranscript || interimTranscript);
        };

        recognitionRef.current.onerror = (event: { error: string }) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
          setIsTranscribing(false);
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
          setIsTranscribing(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setIsTranscribing(false);
    } else {
      setTranscript("");
      setIsRecording(true);
      setIsTranscribing(true);
      recognitionRef.current.start();
    }
  };

  const handleVoiceSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (transcript.trim()) {
      const formData = new FormData(e.currentTarget);
      formData.set("input", transcript);
      handleSubmit(e);
      setTranscript("");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="flex min-h-[500px] flex-col">
        <CardHeader>
          <CardTitle>Log Your Activities</CardTitle>
          <CardDescription>
            Tell the AI what you&apos;ve accomplished today
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex max-w-[80%] gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {message.role === "user" ? "U" : "AI"}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              {isTranscribing && transcript && (
                <div className="flex justify-end">
                  <div className="flex max-w-[80%] flex-row-reverse gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg bg-primary/80 px-4 py-2 text-primary-foreground">
                      {transcript}...
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <form onSubmit={handleVoiceSubmit} className="w-full space-y-4">
            <div className="flex gap-2">
              <Textarea
                placeholder="Type what you've accomplished today..."
                value={isTranscribing ? transcript : input}
                onChange={isTranscribing ? undefined : handleInputChange}
                className="min-h-[80px]"
                disabled={isTranscribing}
              />
            </div>
            <div className="flex justify-between">
              <Button
                type="button"
                variant={isRecording ? "destructive" : "outline"}
                size="icon"
                onClick={toggleRecording}
              >
                {isRecording ? (
                  <MicOff className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </Button>
              <div className="space-x-2">
                {isTranscribing && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (recognitionRef.current) {
                        recognitionRef.current.stop();
                      }
                      setIsTranscribing(false);
                      setIsRecording(false);
                    }}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type={isTranscribing ? "button" : "submit"}
                  disabled={isLoading || (isTranscribing && !transcript.trim())}
                  onClick={
                    isTranscribing
                      ? (e) => {
                          e.preventDefault();
                          handleVoiceSubmit(
                            e as unknown as React.FormEvent<HTMLFormElement>,
                          );
                        }
                      : undefined
                  }
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
