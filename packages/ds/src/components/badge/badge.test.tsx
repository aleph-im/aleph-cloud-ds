import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge, badgeVariants } from "./badge";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText("Active")).toBeTruthy();
  });

  it("renders as a span", () => {
    render(<Badge>Test</Badge>);
    expect(screen.getByText("Test").tagName).toBe("SPAN");
  });

  it("merges custom className", () => {
    render(<Badge className="custom">Test</Badge>);
    expect(screen.getByText("Test").className).toContain("custom");
  });

  describe("fill=solid (default)", () => {
    it("applies gradient-fill-info for default variant", () => {
      const { container } = render(<Badge>Label</Badge>);
      expect(container.firstElementChild?.className).toContain(
        "gradient-fill-info",
      );
    });

    it("applies gradient-fill-success for success variant", () => {
      const { container } = render(
        <Badge variant="success">Label</Badge>,
      );
      expect(container.firstElementChild?.className).toContain(
        "gradient-fill-success",
      );
    });

    it("applies gradient-fill-warning for warning variant", () => {
      const { container } = render(
        <Badge variant="warning">Label</Badge>,
      );
      expect(container.firstElementChild?.className).toContain(
        "gradient-fill-warning",
      );
    });

    it("applies gradient-fill-error for error variant", () => {
      const { container } = render(
        <Badge variant="error">Label</Badge>,
      );
      expect(container.firstElementChild?.className).toContain(
        "gradient-fill-error",
      );
    });

    it("applies neutral bg for info variant", () => {
      const { container } = render(
        <Badge variant="info">Label</Badge>,
      );
      const cls = container.firstElementChild?.className ?? "";
      expect(cls).toContain("bg-neutral-100");
      expect(cls).not.toContain("gradient-fill");
    });
  });

  describe("fill=outline", () => {
    it("applies border class", () => {
      const { container } = render(
        <Badge fill="outline">Label</Badge>,
      );
      expect(container.firstElementChild?.className).toContain("border");
    });

    it("applies border-success-400 for success variant", () => {
      const { container } = render(
        <Badge fill="outline" variant="success">Label</Badge>,
      );
      expect(container.firstElementChild?.className).toContain(
        "border-success-400",
      );
    });

    it("applies border-error-400 for error variant", () => {
      const { container } = render(
        <Badge fill="outline" variant="error">Label</Badge>,
      );
      expect(container.firstElementChild?.className).toContain(
        "border-error-400",
      );
    });

    it("applies border-primary-300 for default variant", () => {
      const { container } = render(
        <Badge fill="outline" variant="default">Label</Badge>,
      );
      expect(container.firstElementChild?.className).toContain(
        "border-primary-300",
      );
    });

    it("does not apply gradient-fill classes", () => {
      const { container } = render(
        <Badge fill="outline" variant="success">Label</Badge>,
      );
      expect(container.firstElementChild?.className).not.toContain(
        "gradient-fill",
      );
    });
  });

  describe("icons", () => {
    it("renders iconLeft before children", () => {
      const { container } = render(
        <Badge iconLeft={<svg data-testid="icon-left" />}>Label</Badge>,
      );
      const badge = container.firstElementChild!;
      const iconWrapper = badge.firstElementChild as HTMLElement;
      expect(iconWrapper.tagName).toBe("SPAN");
      expect(iconWrapper.querySelector("[data-testid='icon-left']")).toBeTruthy();
    });

    it("renders iconRight after children", () => {
      const { container } = render(
        <Badge iconRight={<svg data-testid="icon-right" />}>Label</Badge>,
      );
      const badge = container.firstElementChild!;
      const iconWrapper = badge.lastElementChild as HTMLElement;
      expect(iconWrapper.tagName).toBe("SPAN");
      expect(
        iconWrapper.querySelector("[data-testid='icon-right']"),
      ).toBeTruthy();
    });

    it("renders both icons", () => {
      const { container } = render(
        <Badge
          iconLeft={<svg data-testid="left" />}
          iconRight={<svg data-testid="right" />}
        >
          Label
        </Badge>,
      );
      const badge = container.firstElementChild!;
      expect(badge.children).toHaveLength(3);
    });

    it("does not render icon wrappers when no icons provided", () => {
      const { container } = render(<Badge>Label</Badge>);
      const badge = container.firstElementChild!;
      expect(badge.children).toHaveLength(0);
    });

    it("uses size-3 wrapper for md size", () => {
      const { container } = render(
        <Badge size="md" iconLeft={<svg />}>Label</Badge>,
      );
      const iconWrapper = container.firstElementChild!
        .firstElementChild as HTMLElement;
      expect(iconWrapper.className).toContain("size-3");
    });

    it("uses size-2.5 wrapper for sm size", () => {
      const { container } = render(
        <Badge size="sm" iconLeft={<svg />}>Label</Badge>,
      );
      const iconWrapper = container.firstElementChild!
        .firstElementChild as HTMLElement;
      expect(iconWrapper.className).toContain("size-2.5");
    });
  });

  describe("base styles", () => {
    it("applies heading font and uppercase", () => {
      const { container } = render(<Badge>Label</Badge>);
      const cls = container.firstElementChild?.className ?? "";
      expect(cls).toContain("font-heading");
      expect(cls).toContain("uppercase");
    });

    it("applies rounded-md", () => {
      const { container } = render(<Badge>Label</Badge>);
      expect(container.firstElementChild?.className).toContain("rounded-md");
    });
  });

  describe("badgeVariants export", () => {
    it("accepts fill parameter", () => {
      const cls = badgeVariants({ fill: "outline", variant: "success" });
      expect(cls).toContain("border");
      expect(cls).toContain("border-success-400");
    });
  });
});
