import { Suspense } from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import ActivityLogger from "~/components/activity-logger";
import GoalsDashboard from "~/components/goals-dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Skeleton } from "~/components/ui/skeleton";
import LandingPage from "~/components/ui/landing-page";
import Header from "~/components/ui/header";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <SignedOut>
        <LandingPage />
      </SignedOut>

      <SignedIn>
        <div className="container mx-auto px-4 py-6 md:px-6">
          <Header />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Goal Getter!</h1>
            <p className="mt-2 text-muted-foreground">
              Log your daily activities and get AI-powered insights on your
              progress
            </p>
          </div>

          <Tabs defaultValue="dashboard" className="mt-8 space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:w-auto">
              <TabsTrigger value="dashboard">Goals Dashboard</TabsTrigger>
              <TabsTrigger value="activity">Log Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <Suspense fallback={<GoalsDashboardSkeleton />}>
                <GoalsDashboard />
              </Suspense>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Suspense fallback={<ActivityLoggerSkeleton />}>
                <ActivityLogger />
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </SignedIn>
    </main>
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

function ActivityLoggerSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 rounded-lg" />
    </div>
  );
}
