"use client";

import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  ArrowLeft,
  CheckCircle,
  Target,
  Lightbulb,
  Calendar,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  journalAnalysisSchema,
  type JournalAnalysis,
  type GoalProgress,
} from "~/lib/schemas";

// Default analysis data structure
const defaultAnalysis: JournalAnalysis = {
  summary: "",
  goalProgress: [],
  insights: [],
  suggestions: [],
};

export default function JournalAnalysisPage() {
  const [analysisData, setAnalysisData] = useState<
    JournalAnalysis & { date: string }
  >({
    ...defaultAnalysis,
    date: new Date().toLocaleDateString(),
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get analysis data from sessionStorage
    try {
      const storedAnalysis = sessionStorage.getItem("journalAnalysis");
      const storedContent = sessionStorage.getItem("journalContent");

      if (storedAnalysis) {
        // Parse and validate the stored analysis
        try {
          const parsedData: unknown = JSON.parse(storedAnalysis);
          const validationResult = journalAnalysisSchema.safeParse(parsedData);

          if (validationResult.success) {
            setAnalysisData({
              ...validationResult.data,
              date: new Date().toLocaleDateString(),
            });
          } else {
            console.error(
              "Invalid analysis data format:",
              validationResult.error,
            );
            // Use default values if validation fails
            setAnalysisData({
              ...defaultAnalysis,
              date: new Date().toLocaleDateString(),
            });
          }
        } catch (parseError) {
          console.error("Error parsing stored analysis:", parseError);
          setAnalysisData({
            ...defaultAnalysis,
            date: new Date().toLocaleDateString(),
          });
        }
      }

      if (!storedContent) {
        // If no journal content is found, redirect back to the journal entry page
        router.push("/new-journal");
      }
    } catch (error) {
      console.error("Error loading analysis data:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500" />
          <p className="mt-2 text-gray-600">Loading analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto max-w-3xl py-8">
      <Link
        href="/"
        className="mb-6 flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Journal Analysis</h1>
        <p className="text-gray-600">{analysisData.date}</p>
      </div>

      <Card className="mb-6 border shadow-sm">
        <CardHeader className="border-b bg-gray-50">
          <CardTitle className="flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p>{analysisData.summary}</p>
        </CardContent>
      </Card>

      <h2 className="mb-4 text-xl font-bold">Goal Progress Analysis</h2>
      <div className="space-y-4">
        {analysisData.goalProgress.map((goal: GoalProgress, index: number) => (
          <Card key={index} className="border shadow-sm">
            <CardHeader className="border-b pb-3 pt-4">
              <CardTitle className="flex items-center text-base">
                <Target className="mr-2 h-5 w-5 text-blue-600" />
                {goal.goal}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="mb-2 flex items-center">
                <span className="font-medium">Impact:</span>
                <span
                  className={`ml-2 rounded px-2 py-1 text-xs font-medium ${
                    goal.impact === "High"
                      ? "bg-green-100 text-green-800"
                      : goal.impact === "Medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {goal.impact}
                </span>
              </div>
              <p className="text-sm">{goal.analysis}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="border shadow-sm">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle className="flex items-center">
              <Lightbulb className="mr-2 h-5 w-5 text-amber-500" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-2">
              {analysisData.insights.map((insight: string, index: number) => (
                <li key={index} className="text-sm">
                  • {insight}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-indigo-500" />
              Suggested Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-2">
              {analysisData.suggestions.map(
                (suggestion: string, index: number) => (
                  <li key={index} className="text-sm">
                    • {suggestion}
                  </li>
                ),
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex justify-end space-x-4">
        <Link href="/">
          <Button variant="outline">Save & Return to Dashboard</Button>
        </Link>
        <Link href="/new-journal">
          <Button>Create Another Entry</Button>
        </Link>
      </div>
    </main>
  );
}
