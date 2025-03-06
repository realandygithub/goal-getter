"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import LandingPage from "~/components/ui/landing-page";
import { redirect } from "next/navigation";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <SignedOut>
        <LandingPage />
      </SignedOut>

      <SignedIn>
        <RedirectToDashboard />
      </SignedIn>
    </main>
  );
}

function RedirectToDashboard() {
  redirect("/dashboard");
  return null;
}
