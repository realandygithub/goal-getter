"use client";

import React, { useState, useRef, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "~/components/ui/button";

// Fixed interface definitions
interface SpeechRecognitionResult {
  transcript: string;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
  item(index: number): SpeechRecognitionResult;
  isFinal: boolean;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: {
    [index: number]: SpeechRecognitionResultList;
    length: number;
    item(index: number): SpeechRecognitionResultList;
  };
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

// Add this to make TypeScript recognize the browser API
declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
    SpeechRecognition: new () => SpeechRecognition;
  }
}

interface VoiceRecorderButtonProps {
  onTranscriptChange: (transcript: string) => void;
  isDisabled?: boolean;
}

export default function VoiceRecorderButton({
  onTranscriptChange,
  isDisabled = false,
}: VoiceRecorderButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

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

          // Fixed: More robust type checking for event.results
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            try {
              // Use optional chaining throughout for cleaner code
              const transcript = event.results?.[i]?.[0]?.transcript;
              const isFinal = event.results?.[i]?.isFinal;

              if (transcript) {
                if (isFinal) {
                  finalTranscript += transcript;
                } else {
                  interimTranscript += transcript;
                }
              }
            } catch (error) {
              console.error("Error processing speech result:", error);
            }
          }

          // Send transcript to parent component
          onTranscriptChange(finalTranscript || interimTranscript);
        };

        recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
        };

        recognitionRef.current.onend = () => {
          // Only need to update recording state if it's still true
          if (isRecording) {
            setIsRecording(false);
          }
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscriptChange, isRecording]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error("Error starting speech recognition:", error);
      }
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleRecording}
      disabled={isDisabled}
      aria-label={isRecording ? "Stop recording" : "Start recording"}
      className={isRecording ? "text-red-500" : ""}
    >
      {isRecording ? (
        <MicOff className="h-5 w-5" />
      ) : (
        <Mic className="h-5 w-5" />
      )}
    </Button>
  );
}
