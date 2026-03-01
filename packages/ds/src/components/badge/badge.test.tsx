import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./badge";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText("Active")).toBeTruthy();
  });

  it("renders as a span by default", () => {
    render(<Badge>Test</Badge>);
    const badge = screen.getByText("Test");
    expect(badge.tagName).toBe("SPAN");
  });

  it("merges custom className", () => {
    render(<Badge className="custom">Test</Badge>);
    expect(screen.getByText("Test").className).toContain("custom");
  });

  it("applies variant classes", () => {
    const { container } = render(<Badge variant="success">OK</Badge>);
    const badge = container.firstElementChild;
    expect(badge?.className).toContain("success");
  });

  it("applies size classes", () => {
    const { container } = render(<Badge size="sm">Small</Badge>);
    const badge = container.firstElementChild;
    expect(badge?.className).toBeTruthy();
  });
});
