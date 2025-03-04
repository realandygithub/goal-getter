import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import * as React from "react";

// Mock the Radix UI Avatar components
vi.mock("@radix-ui/react-avatar", () => ({
  Root: ({
    className,
    children,
    ...props
  }: React.ComponentPropsWithoutRef<"div">) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
  Image: ({
    src,
    alt,
    className,
    ...props
  }: React.ComponentPropsWithoutRef<"img">) => (
    <img src={src} alt={alt} className={className} {...props} />
  ),
  Fallback: ({
    className,
    children,
    ...props
  }: React.ComponentPropsWithoutRef<"div">) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
}));

describe("Avatar", () => {
  it("renders correctly with default props", () => {
    render(<Avatar data-testid="avatar" />);

    const avatar = screen.getByTestId("avatar");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveClass("rounded-full");
  });

  it("applies additional className", () => {
    render(<Avatar className="custom-class" data-testid="avatar" />);

    const avatar = screen.getByTestId("avatar");
    expect(avatar).toHaveClass("custom-class");
    expect(avatar).toHaveClass("rounded-full"); // Still has the default classes
  });

  it("forwards additional props", () => {
    render(<Avatar data-testid="avatar" aria-label="User Avatar" />);

    const avatar = screen.getByTestId("avatar");
    expect(avatar).toHaveAttribute("aria-label", "User Avatar");
  });
});

describe("AvatarImage", () => {
  it("renders correctly with src prop", () => {
    const { container } = render(
      <Avatar data-testid="avatar">
        <AvatarImage
          src="/test-image.jpg"
          alt="Test User"
          data-testid="avatar-image"
        />
      </Avatar>,
    );

    const avatarImage = container.querySelector("img");
    expect(avatarImage).not.toBeNull();
    expect(avatarImage?.getAttribute("src")).toBe("/test-image.jpg");
    expect(avatarImage?.getAttribute("alt")).toBe("Test User");
  });

  it("applies additional className", () => {
    const { container } = render(
      <Avatar>
        <AvatarImage
          src="/test-image.jpg"
          alt="Test User"
          className="custom-class"
          data-testid="avatar-image"
        />
      </Avatar>,
    );

    const avatarImage = container.querySelector("img");
    expect(avatarImage).not.toBeNull();
    expect(avatarImage?.classList.contains("custom-class")).toBe(true);
  });
});

describe("AvatarFallback", () => {
  it("renders correctly with children", () => {
    render(
      <Avatar data-testid="avatar">
        <AvatarFallback data-testid="avatar-fallback">JD</AvatarFallback>
      </Avatar>,
    );

    const avatarFallback = screen.getByTestId("avatar-fallback");
    expect(avatarFallback).toBeInTheDocument();
    expect(avatarFallback).toHaveTextContent("JD");
    expect(avatarFallback).toHaveClass("bg-muted");
  });

  it("applies additional className", () => {
    render(
      <Avatar>
        <AvatarFallback className="custom-class" data-testid="avatar-fallback">
          JD
        </AvatarFallback>
      </Avatar>,
    );

    const avatarFallback = screen.getByTestId("avatar-fallback");
    expect(avatarFallback).toHaveClass("custom-class");
    expect(avatarFallback).toHaveClass("bg-muted"); // Still has the default classes
  });

  it("forwards additional props", () => {
    render(
      <Avatar>
        <AvatarFallback
          data-testid="avatar-fallback"
          aria-label="User Initials"
        >
          JD
        </AvatarFallback>
      </Avatar>,
    );

    const avatarFallback = screen.getByTestId("avatar-fallback");
    expect(avatarFallback).toHaveAttribute("aria-label", "User Initials");
  });
});

describe("Avatar with Image and Fallback", () => {
  it("renders a complete avatar with image and fallback", () => {
    const { container } = render(
      <Avatar data-testid="avatar">
        <AvatarImage
          src="/test-image.jpg"
          alt="Test User"
          data-testid="avatar-image"
        />
        <AvatarFallback data-testid="avatar-fallback">JD</AvatarFallback>
      </Avatar>,
    );

    const avatar = screen.getByTestId("avatar");
    const avatarImage = container.querySelector("img");
    const avatarFallback = screen.getByTestId("avatar-fallback");

    expect(avatar).toBeInTheDocument();
    expect(avatarImage).not.toBeNull();
    expect(avatarFallback).toBeInTheDocument();
  });
});
