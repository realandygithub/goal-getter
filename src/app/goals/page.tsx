"use client";

import { Suspense } from "react";
import GoalsDashboard from "~/components/goals-dashboard";
import { Skeleton } from "~/components/ui/skeleton";
import { Target } from "lucide-react";
import AuthenticatedLayout from "~/components/authenticated-layout";

export default function GoalsPage() {
  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div className="mb-8">
          <div className="mb-2 flex items-center">
            <div className="mr-3 rounded-full bg-blue-100 p-2">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Goals Dashboard
            </h1>
          </div>
          <p className="text-gray-600">
            Set, track, and achieve your professional development goals.
          </p>
        </div>

        <Suspense fallback={<GoalsDashboardSkeleton />}>
          <GoalsDashboard />
        </Suspense>
      </div>
    </AuthenticatedLayout>
  );
}

function GoalsDashboardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-48 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
