import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  describe("rendering", () => {
    it("renders a button element with children", () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole("button", { name: "Click me" })).toBeTruthy();
    });

    it("applies default variant and size classes", () => {
      render(<Button>Default</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("bg-primary-600");
      expect(button.className).toContain("h-9");
    });
  });

  describe("variants", () => {
    it("applies secondary variant classes", () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("bg-primary-100");
      expect(button.className).toContain("text-primary-700");
    });

    it("applies outline variant classes", () => {
      render(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("border-neutral-400");
    });

    it("applies text variant classes", () => {
      render(<Button variant="text">Text</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("text-primary-600");
    });

    it("applies destructive variant classes", () => {
      render(<Button variant="destructive">Delete</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("bg-error-600/20");
    });

    it("applies warning variant classes", () => {
      render(<Button variant="warning">Careful</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("bg-warning-500/20");
      expect(button.className).toContain("text-warning-800");
    });
  });

  describe("sizes", () => {
    it("applies xs size", () => {
      render(<Button size="xs">XS</Button>);
      expect(screen.getByRole("button").className).toContain("h-7");
    });

    it("applies sm size", () => {
      render(<Button size="sm">SM</Button>);
      expect(screen.getByRole("button").className).toContain("h-8");
    });

    it("applies lg size", () => {
      render(<Button size="lg">LG</Button>);
      expect(screen.getByRole("button").className).toContain("h-10");
    });
  });

  describe("icons", () => {
    it("renders iconLeft before children", () => {
      render(
        <Button iconLeft={<svg data-testid="left-icon" />}>
          Label
        </Button>,
      );
      const button = screen.getByRole("button");
      const icon = screen.getByTestId("left-icon");
      expect(button.contains(icon)).toBe(true);
      const children = Array.from(button.children);
      const iconIndex = children.findIndex((c) => c.contains(icon));
      const labelIndex = children.findIndex(
        (c) => c.textContent === "Label",
      );
      expect(iconIndex).toBeLessThan(labelIndex);
    });

    it("renders iconRight after children", () => {
      render(
        <Button iconRight={<svg data-testid="right-icon" />}>
          Label
        </Button>,
      );
      const button = screen.getByRole("button");
      const icon = screen.getByTestId("right-icon");
      expect(button.contains(icon)).toBe(true);
      const children = Array.from(button.children);
      const iconIndex = children.findIndex((c) => c.contains(icon));
      const labelIndex = children.findIndex(
        (c) => c.textContent === "Label",
      );
      expect(iconIndex).toBeGreaterThan(labelIndex);
    });
  });

  describe("loading", () => {
    it("shows spinner when loading", () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole("button");
      const spinner = button.querySelector("svg.animate-spin");
      expect(spinner).toBeTruthy();
    });

    it("has aria-busy when loading", () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole("button").getAttribute("aria-busy")).toBe(
        "true",
      );
    });

    it("disables pointer events when loading", () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole("button").className).toContain(
        "pointer-events-none",
      );
    });

    it("hides icons when loading", () => {
      render(
        <Button
          loading
          iconLeft={<svg data-testid="left-icon" />}
          iconRight={<svg data-testid="right-icon" />}
        >
          Loading
        </Button>,
      );
      expect(screen.queryByTestId("left-icon")).toBeNull();
      expect(screen.queryByTestId("right-icon")).toBeNull();
    });
  });

  describe("disabled", () => {
    it("sets disabled attribute", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");
      expect((button as HTMLButtonElement).disabled).toBe(true);
    });
  });

  describe("asChild", () => {
    it("renders child element instead of button", () => {
      render(
        <Button asChild variant="primary">
          <a href="/test">Link</a>
        </Button>,
      );
      const link = screen.getByRole("link", { name: "Link" });
      expect(link).toBeTruthy();
      expect(link.tagName).toBe("A");
      expect(link.getAttribute("href")).toBe("/test");
      expect(link.className).toContain("bg-primary-600");
    });
  });

  describe("className merging", () => {
    it("merges custom className", () => {
      render(<Button className="custom-class">Merge</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("custom-class");
      expect(button.className).toContain("bg-primary-600");
    });
  });

  describe("prop forwarding", () => {
    it("forwards aria-label", () => {
      render(<Button aria-label="Close dialog">X</Button>);
      expect(
        screen.getByRole("button", { name: "Close dialog" }),
      ).toBeTruthy();
    });
  });
});
