"use client";

import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  Home as HomeIcon,
  Target,
  MessageSquare,
  History,
  BookOpen,
  LineChart,
} from "lucide-react";
import Link from "next/link";
import AuthenticatedLayout from "~/components/authenticated-layout";
import Header from "~/components/ui/header";

export default function DashboardPage() {
  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div className="mb-8">
          <div className="mb-2 flex items-center">
            <div className="mr-3 rounded-full bg-blue-100 p-2">
              <HomeIcon className="h-5 w-5 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Your Progress Dashboard
            </h1>
            <Header />
          </div>
          <p className="text-gray-600">
            Track your journey, reflect on your achievements, and stay focused
            on your goals.
          </p>
        </div>

        {/* Goal Reminder Section */}
        <div className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Active Goals</h2>
            <Link href="/goals">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Target className="mr-1 h-4 w-4" />
                View All Goals
              </Button>
            </Link>
          </div>

          {/* Goal Cards with Progress */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-medium">Improve technical leadership</h3>
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                    On Track
                  </span>
                </div>
                <div className="mb-2 h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-green-500"
                    style={{ width: "65%" }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>65% Complete</span>
                  <span>Due in 45 days</span>
                </div>
                <div className="mt-4 text-sm text-gray-700">
                  <p className="font-medium">Recent progress:</p>
                  <p className="mt-1 text-xs">• Led 2 code reviews this week</p>
                  <p className="text-xs">• Presented architecture proposal</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-medium">Mentor junior developers</h3>
                  <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                    Needs Focus
                  </span>
                </div>
                <div className="mb-2 h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-yellow-500"
                    style={{ width: "30%" }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>30% Complete</span>
                  <span>Due in 60 days</span>
                </div>
                <div className="mt-4 text-sm text-gray-700">
                  <p className="font-medium">Action needed:</p>
                  <p className="mt-1 text-xs">
                    • Schedule weekly mentoring sessions
                  </p>
                  <p className="text-xs">
                    • Create learning path for new team members
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-medium">
                    Complete system architecture redesign
                  </h3>
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                    Just Started
                  </span>
                </div>
                <div className="mb-2 h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{ width: "10%" }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>10% Complete</span>
                  <span>Due in 90 days</span>
                </div>
                <div className="mt-4 text-sm text-gray-700">
                  <p className="font-medium">Next steps:</p>
                  <p className="mt-1 text-xs">
                    • Finalize requirements document
                  </p>
                  <p className="text-xs">
                    • Schedule architecture review meeting
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Start Journal Section */}
        <div className="mb-10 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-center text-white shadow-lg">
          <h2 className="mb-2 text-2xl font-bold">Reflect on Your Progress</h2>
          <p className="mb-6">
            Record today&apos;s achievements and get AI insights on how they
            align with your goals.
          </p>
          <Link href="/new-journal">
            <Button
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Start New Journal Entry
            </Button>
          </Link>
        </div>

        {/* Recent Activity & Insights */}
        <div className="mb-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Recent Insights
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="border bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center">
                  <LineChart className="mr-2 h-5 w-5 text-blue-500" />
                  <h3 className="font-medium">Weekly Progress</h3>
                </div>
                <p className="mb-3 text-sm text-gray-600">
                  You&apos;ve made significant progress on your technical
                  leadership goal this week. Your code review activities are
                  particularly strong.
                </p>
                <p className="text-xs text-gray-500">
                  Based on your last 3 journal entries
                </p>
              </CardContent>
            </Card>

            <Card className="border bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-indigo-500" />
                  <h3 className="font-medium">AI Suggestion</h3>
                </div>
                <p className="mb-3 text-sm text-gray-600">
                  Consider scheduling dedicated time for mentoring activities to
                  make progress on your mentoring goal, which has been stagnant
                  for 2 weeks.
                </p>
                <Link href="/journal-analysis">
                  <Button variant="ghost" size="sm" className="text-xs">
                    View Full Analysis
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            <Link href="/new-journal">
              <Card className="border bg-white shadow-sm transition-all hover:shadow-md">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="mb-3 rounded-full bg-blue-100 p-3">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium">New Journal</h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Record today&apos;s activities
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/goals">
              <Card className="cursor-pointer border bg-white shadow-sm transition-all hover:shadow-md">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="mb-3 rounded-full bg-green-100 p-3">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-medium">Update Goals</h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Track your progress
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/ai-assistant">
              <Card className="cursor-pointer border bg-white shadow-sm transition-all hover:shadow-md">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="mb-3 rounded-full bg-purple-100 p-3">
                    <MessageSquare className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-medium">AI Chat</h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Get career guidance
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/journal">
              <Card className="cursor-pointer border bg-white shadow-sm transition-all hover:shadow-md">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="mb-3 rounded-full bg-amber-100 p-3">
                    <History className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="font-medium">History</h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Review past entries
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
