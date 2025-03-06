"use client";

import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";
import AuthenticatedLayout from "~/components/authenticated-layout";
import { Suspense } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import ActivityLogger from "~/components/activity-logger";

function ActivityLoggerSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 rounded-lg" />
    </div>
  );
}
export default function JournalHistoryPage() {
  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div className="mb-8">
          <div className="mb-2 flex items-center">
            <div className="mr-3 rounded-full bg-blue-100 p-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Journal History
            </h1>
          </div>
          <p className="text-gray-600">
            Review your past journal entries and AI insights.
          </p>
        </div>

        <div className="space-y-6">
          <Suspense fallback={<ActivityLoggerSkeleton />}>
            <ActivityLogger />
          </Suspense>
        </div>

        {/* Journal History Content */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium">
                    Daily Reflection -{" "}
                    {new Date(
                      Date.now() - i * 24 * 60 * 60 * 1000,
                    ).toLocaleDateString()}
                  </h3>
                  <span className="text-sm text-gray-500">{`${i} day${i > 1 ? "s" : ""} ago`}</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Led team standup, completed code review for authentication
                  module, and mentored a junior developer on API design.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                    Technical Leadership
                  </span>
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                    Mentoring
                  </span>
                </div>
                <div className="mt-4 flex justify-end">
                  <Link href="/journal-analysis">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      View Details
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
