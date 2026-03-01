import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "./card";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Content here</Card>);
    expect(screen.getByText("Content here")).toBeTruthy();
  });

  it("renders title when provided", () => {
    render(<Card title="My Title">Body</Card>);
    expect(screen.getByText("My Title")).toBeTruthy();
    expect(screen.getByText("My Title").tagName).toBe("H3");
  });

  it("renders as a div", () => {
    const { container } = render(<Card>Test</Card>);
    expect(container.firstElementChild?.tagName).toBe("DIV");
  });

  it("merges custom className", () => {
    const { container } = render(<Card className="custom">Test</Card>);
    expect(container.firstElementChild?.className).toContain("custom");
  });

  it("omits title heading when not provided", () => {
    const { container } = render(<Card>No title</Card>);
    expect(container.querySelector("h3")).toBeNull();
  });
});
