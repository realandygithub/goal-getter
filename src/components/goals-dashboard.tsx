import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Badge } from "~/components/ui/badge";
import { Clock, Target } from "lucide-react";

// This would typically come from your database
const mockGoals = [
  {
    id: 1,
    title: "Complete Project Documentation",
    description: "Finish all documentation for the Q2 project",
    progress: 65,
    dueDate: "2025-03-15",
    category: "Documentation",
  },
  {
    id: 2,
    title: "Client Meetings",
    description: "Conduct at least 5 client meetings this week",
    progress: 40,
    dueDate: "2025-03-10",
    category: "Client Relations",
  },
  {
    id: 3,
    title: "Code Review",
    description: "Review and approve 10 pull requests",
    progress: 80,
    dueDate: "2025-03-08",
    category: "Development",
  },
  {
    id: 4,
    title: "Team Training",
    description: "Complete the leadership training module",
    progress: 20,
    dueDate: "2025-03-20",
    category: "Professional Development",
  },
];

export default function GoalsDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Goals</h2>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockGoals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            AI Insights
          </CardTitle>
          <CardDescription>
            Based on your recent activities and goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              You&apos;re making good progress on your documentation tasks, but
              you might need to focus more on client meetings to meet your
              weekly target.
            </p>
            <p className="text-sm text-muted-foreground">
              Last updated: Today at 9:45 AM
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface Goal {
  id: number;
  title: string;
  description: string;
  progress: number;
  dueDate: string;
  category: string;
}

function GoalCard({ goal }: { goal: Goal }) {
  const dueDate = new Date(goal.dueDate);
  const today = new Date();
  const daysLeft = Math.ceil(
    (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{goal.title}</CardTitle>
          <Badge
            variant={
              goal.progress >= 70
                ? "default"
                : goal.progress >= 40
                  ? "default"
                  : "destructive"
            }
          >
            {goal.category}
          </Badge>
        </div>
        <CardDescription>{goal.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} className="h-2" />
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-1 h-4 w-4" />
          {daysLeft > 0 ? `${daysLeft} days left` : "Due today"}
        </div>
      </CardFooter>
    </Card>
  );
}
