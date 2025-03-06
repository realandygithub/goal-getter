import { SignInButton } from "@clerk/nextjs";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-blue-900">
            Goal Getter
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            Turn your daily work into measurable success! Track activities,
            visualize progress, and align your efforts with your goals using
            AI-powered insights.
          </p>
        </div>

        <div className="mb-12 flex justify-center">
          <SignInButton mode="modal">
            <button className="rounded-full bg-blue-600 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-700">
              Get Started
            </button>
          </SignInButton>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <FeatureCard
            title="Track Activities"
            description="Log your daily activities with ease and connect them to your goals."
            icon="📝"
          />
          <FeatureCard
            title="Visualize Progress"
            description="See your progress over time with beautiful, insightful charts."
            icon="📊"
          />
          <FeatureCard
            title="AI Insights"
            description="Get personalized recommendations to help you achieve your goals faster."
            icon="✨"
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg">
      <div className="mb-4 text-4xl">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
