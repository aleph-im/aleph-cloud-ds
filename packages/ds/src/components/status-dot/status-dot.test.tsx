import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusDot } from "./status-dot";

describe("StatusDot", () => {
  it("renders a span element", () => {
    render(<StatusDot status="healthy" aria-label="Healthy" />);
    const dot = screen.getByLabelText("Healthy");
    expect(dot.tagName).toBe("SPAN");
  });

  it("applies correct aria-label", () => {
    render(<StatusDot status="degraded" aria-label="Degraded" />);
    expect(screen.getByLabelText("Degraded")).toBeTruthy();
  });

  it("merges custom className", () => {
    render(
      <StatusDot status="healthy" aria-label="test" className="custom" />,
    );
    const dot = screen.getByLabelText("test");
    expect(dot.className).toContain("custom");
  });

  it("applies status variant", () => {
    const { container } = render(
      <StatusDot status="offline" aria-label="Offline" />,
    );
    const dot = container.firstElementChild;
    expect(dot?.className).toBeTruthy();
  });

  it("applies size variant", () => {
    const { container } = render(
      <StatusDot status="healthy" size="sm" aria-label="small" />,
    );
    const dot = container.firstElementChild;
    expect(dot?.className).toBeTruthy();
  });
});
