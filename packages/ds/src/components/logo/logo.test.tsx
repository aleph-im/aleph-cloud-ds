import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Logo, LogoFull } from "./logo";

describe("Logo", () => {
  it("renders an svg element", () => {
    render(<Logo data-testid="logo" />);
    const svg = screen.getByTestId("logo");
    expect(svg.tagName).toBe("svg");
  });

  it("uses currentColor for fill", () => {
    render(<Logo data-testid="logo" />);
    const svg = screen.getByTestId("logo");
    expect(svg.getAttribute("fill")).toBe("currentColor");
  });

  it("forwards className", () => {
    render(<Logo data-testid="logo" className="size-8" />);
    const svg = screen.getByTestId("logo");
    expect(svg.classList.contains("size-8")).toBe(true);
  });

  it("forwards aria-label", () => {
    render(<Logo aria-label="Aleph Cloud" />);
    expect(screen.getByLabelText("Aleph Cloud")).toBeTruthy();
  });
});

describe("LogoFull", () => {
  it("renders an svg element", () => {
    render(<LogoFull data-testid="logo-full" />);
    const svg = screen.getByTestId("logo-full");
    expect(svg.tagName).toBe("svg");
  });

  it("uses currentColor for fill", () => {
    render(<LogoFull data-testid="logo-full" />);
    const svg = screen.getByTestId("logo-full");
    expect(svg.getAttribute("fill")).toBe("currentColor");
  });

  it("forwards className", () => {
    render(<LogoFull data-testid="logo-full" className="h-10 w-auto" />);
    const svg = screen.getByTestId("logo-full");
    expect(svg.classList.contains("h-10")).toBe(true);
    expect(svg.classList.contains("w-auto")).toBe(true);
  });

  it("forwards aria-label", () => {
    render(<LogoFull aria-label="Aleph Cloud" />);
    expect(screen.getByLabelText("Aleph Cloud")).toBeTruthy();
  });
});
