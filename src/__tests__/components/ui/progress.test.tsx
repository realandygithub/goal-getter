import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Progress } from "~/components/ui/progress";

describe("Progress", () => {
  it("renders correctly with default props", () => {
    render(<Progress />);

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveClass("bg-primary/20");

    // Check the indicator style (default value is 0)
    const indicator = progressBar.querySelector("div");
    expect(indicator).toHaveClass("bg-primary");
    expect(indicator).toHaveStyle("transform: translateX(-100%)");
  });

  it("renders with a specific value", () => {
    render(<Progress value={50} />);

    const progressBar = screen.getByRole("progressbar");
    const indicator = progressBar.querySelector("div");

    // For value 50, the transform should be translateX(-50%)
    expect(indicator).toHaveStyle("transform: translateX(-50%)");
  });

  it("renders with a value of 0", () => {
    render(<Progress value={0} />);

    const progressBar = screen.getByRole("progressbar");
    const indicator = progressBar.querySelector("div");

    // For value 0, the transform should be translateX(-100%)
    expect(indicator).toHaveStyle("transform: translateX(-100%)");
  });

  it("renders with a value of 100", () => {
    render(<Progress value={100} />);

    const progressBar = screen.getByRole("progressbar");
    const indicator = progressBar.querySelector("div");

    // For value 100, the transform should be translateX(-0%)
    expect(indicator).toHaveStyle("transform: translateX(-0%)");
  });

  it("applies additional className", () => {
    render(<Progress className="custom-class" />);

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveClass("custom-class");
    expect(progressBar).toHaveClass("bg-primary/20"); // Still has the default classes
  });

  it("forwards additional props", () => {
    render(<Progress data-testid="test-progress" aria-label="Test Progress" />);

    const progressBar = screen.getByTestId("test-progress");
    expect(progressBar).toHaveAttribute("aria-label", "Test Progress");
  });
});
