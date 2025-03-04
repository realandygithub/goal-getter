import { describe, it, expect } from "vitest";
import { cn } from "~/lib/utils";

describe("cn utility function", () => {
  it("merges class names correctly", () => {
    const result = cn("text-red-500", "bg-blue-500");
    expect(result).toBe("text-red-500 bg-blue-500");
  });

  it("handles conditional class names", () => {
    const isActive = true;
    const result = cn("text-base", isActive && "font-bold");
    expect(result).toBe("text-base font-bold");
  });

  it("handles falsy values", () => {
    const result = cn("text-base", false && "font-bold", null, undefined, 0);
    expect(result).toBe("text-base");
  });

  it("handles arrays of class names", () => {
    const result = cn(["text-base", "font-bold"], "text-red-500");
    expect(result).toBe("text-base font-bold text-red-500");
  });

  it("handles objects with boolean values", () => {
    const result = cn("text-base", {
      "font-bold": true,
      "text-red-500": false,
    });
    expect(result).toBe("text-base font-bold");
  });

  it("merges Tailwind classes correctly", () => {
    const result = cn("px-2 py-1", "py-2");
    expect(result).toBe("px-2 py-2");
  });

  it("handles complex Tailwind class merging", () => {
    const result = cn(
      "text-red-500 bg-blue-500 p-4",
      "bg-green-500 p-2 rounded",
    );
    // The later classes should override the earlier ones
    expect(result).toBe("text-red-500 bg-green-500 p-2 rounded");
  });

  it("handles empty inputs", () => {
    const result = cn();
    expect(result).toBe("");
  });

  it("handles multiple arguments with varying types", () => {
    const isError = true;
    const isPrimary = false;
    const result = cn(
      "base-class",
      isError && "error-class",
      isPrimary && "primary-class",
      { "conditional-class": true, "another-class": false },
    );
    expect(result).toBe("base-class error-class conditional-class");
  });
});
