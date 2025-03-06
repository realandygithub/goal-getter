"use client";

import { Suspense } from "react";
import ActivityLogger from "~/components/activity-logger";
import { Skeleton } from "~/components/ui/skeleton";
import { MessageSquare } from "lucide-react";
import AuthenticatedLayout from "~/components/authenticated-layout";

export default function AIAssistantPage() {
  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div className="mb-8">
          <div className="mb-2 flex items-center">
            <div className="mr-3 rounded-full bg-blue-100 p-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
          </div>
          <p className="text-gray-600">
            Chat with your AI career assistant to get insights and guidance.
          </p>
        </div>

        <Suspense fallback={<ActivityLoggerSkeleton />}>
          <ActivityLogger />
        </Suspense>
      </div>
    </AuthenticatedLayout>
  );
}

function ActivityLoggerSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 rounded-lg" />
    </div>
  );
}
