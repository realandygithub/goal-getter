import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import GoalsDashboard from "~/components/goals-dashboard";

// Store the original Date
const originalDate = global.Date;
const mockDate = new Date("2025-03-01T12:00:00Z");

describe("GoalsDashboard", () => {
  beforeEach(() => {
    // Mock the Date constructor
    global.Date = class extends originalDate {
      constructor(date?: string | number | Date) {
        super(date ?? mockDate.getTime());
      }

      static now() {
        return mockDate.getTime();
      }
    } as unknown as DateConstructor;
  });

  afterEach(() => {
    // Restore the original Date
    global.Date = originalDate;
  });

  it("renders the dashboard with the correct title", () => {
    render(<GoalsDashboard />);

    expect(screen.getByText("Your Goals")).toBeInTheDocument();
  });

  it("displays the current date", () => {
    render(<GoalsDashboard />);

    // With our mocked date (2025-03-01), this should be "Saturday, March 1, 2025"
    // Use a regex to match the date since it might be formatted differently
    expect(screen.getByText(/March 1, 2025/)).toBeInTheDocument();
  });

  it("renders all mock goals", () => {
    render(<GoalsDashboard />);

    // Check if all goal titles are displayed
    expect(
      screen.getByText("Complete Project Documentation"),
    ).toBeInTheDocument();
    expect(screen.getByText("Client Meetings")).toBeInTheDocument();
    expect(screen.getByText("Code Review")).toBeInTheDocument();
    expect(screen.getByText("Team Training")).toBeInTheDocument();
  });

  it("displays goal descriptions", () => {
    render(<GoalsDashboard />);

    expect(
      screen.getByText("Finish all documentation for the Q2 project"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Conduct at least 5 client meetings this week"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Review and approve 10 pull requests"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Complete the leadership training module"),
    ).toBeInTheDocument();
  });

  it("shows the correct progress for each goal", () => {
    render(<GoalsDashboard />);

    expect(screen.getByText("65%")).toBeInTheDocument();
    expect(screen.getByText("40%")).toBeInTheDocument();
    expect(screen.getByText("80%")).toBeInTheDocument();
    expect(screen.getByText("20%")).toBeInTheDocument();
  });

  it("displays the correct days left for each goal", () => {
    render(<GoalsDashboard />);

    // Based on our mock date (2025-03-01) and the due dates in the mock data
    expect(screen.getByText("14 days left")).toBeInTheDocument(); // March 15
    expect(screen.getByText("9 days left")).toBeInTheDocument(); // March 10
    expect(screen.getByText("7 days left")).toBeInTheDocument(); // March 8
    expect(screen.getByText("19 days left")).toBeInTheDocument(); // March 20
  });

  it("displays the AI insights section", () => {
    render(<GoalsDashboard />);

    expect(screen.getByText("AI Insights")).toBeInTheDocument();
    expect(
      screen.getByText("Based on your recent activities and goals"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /You're making good progress on your documentation tasks/i,
      ),
    ).toBeInTheDocument();
  });

  it("shows the correct categories for each goal", () => {
    render(<GoalsDashboard />);

    expect(screen.getByText("Documentation")).toBeInTheDocument();
    expect(screen.getByText("Client Relations")).toBeInTheDocument();
    expect(screen.getByText("Development")).toBeInTheDocument();
    expect(screen.getByText("Professional Development")).toBeInTheDocument();
  });
});
