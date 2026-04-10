import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  ProgressBar,
  ProgressBarDescription,
  progressBarVariants,
} from "./progress-bar";

describe("ProgressBar", () => {
  it("renders with role=progressbar", () => {
    render(<ProgressBar label="Loading" />);
    expect(screen.getByRole("progressbar")).toBeTruthy();
  });

  it("sets aria-label from label prop", () => {
    render(<ProgressBar label="Upload progress" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-label",
      "Upload progress",
    );
  });

  describe("determinate mode", () => {
    it("sets aria-valuenow from value prop", () => {
      render(<ProgressBar value={35} label="Progress" />);
      const bar = screen.getByRole("progressbar");
      expect(bar).toHaveAttribute("aria-valuenow", "35");
    });

    it("sets aria-valuemin to 0", () => {
      render(<ProgressBar value={50} label="Progress" />);
      expect(screen.getByRole("progressbar")).toHaveAttribute(
        "aria-valuemin",
        "0",
      );
    });

    it("sets aria-valuemax to 100 by default", () => {
      render(<ProgressBar value={50} label="Progress" />);
      expect(screen.getByRole("progressbar")).toHaveAttribute(
        "aria-valuemax",
        "100",
      );
    });

    it("respects custom max prop", () => {
      render(<ProgressBar value={5} max={10} label="Progress" />);
      expect(screen.getByRole("progressbar")).toHaveAttribute(
        "aria-valuemax",
        "10",
      );
    });

    it("renders fill with data-fill attribute", () => {
      const { container } = render(
        <ProgressBar value={50} label="Progress" />,
      );
      const fill = container.querySelector("[data-fill]");
      expect(fill).toBeTruthy();
    });

    it("does not set data-indeterminate on fill", () => {
      const { container } = render(
        <ProgressBar value={50} label="Progress" />,
      );
      const fill = container.querySelector("[data-fill]");
      expect(fill).not.toHaveAttribute("data-indeterminate");
    });

    it("sets fill width as percentage of max", () => {
      const { container } = render(
        <ProgressBar value={50} label="Progress" />,
      );
      const fill = container.querySelector("[data-fill]") as HTMLElement;
      expect(fill.style.width).toBe("50%");
    });

    it("clamps value to 0 when negative", () => {
      const { container } = render(
        <ProgressBar value={-10} label="Progress" />,
      );
      const fill = container.querySelector("[data-fill]") as HTMLElement;
      expect(fill.style.width).toBe("0%");
    });

    it("clamps value to max when exceeding", () => {
      const { container } = render(
        <ProgressBar value={150} label="Progress" />,
      );
      const fill = container.querySelector("[data-fill]") as HTMLElement;
      expect(fill.style.width).toBe("100%");
    });
  });

  describe("indeterminate mode", () => {
    it("omits aria-valuenow when value is undefined", () => {
      render(<ProgressBar label="Loading" />);
      expect(screen.getByRole("progressbar")).not.toHaveAttribute(
        "aria-valuenow",
      );
    });

    it("sets data-indeterminate on fill", () => {
      const { container } = render(<ProgressBar label="Loading" />);
      const fill = container.querySelector("[data-fill]");
      expect(fill).toHaveAttribute("data-indeterminate");
    });
  });

  describe("size variants", () => {
    it("applies sm height class", () => {
      const cls = progressBarVariants({ size: "sm" });
      expect(cls).toContain("h-1");
    });

    it("applies md height class by default", () => {
      const cls = progressBarVariants({});
      expect(cls).toContain("h-1.5");
    });

    it("applies lg height class", () => {
      const cls = progressBarVariants({ size: "lg" });
      expect(cls).toContain("h-2.5");
    });
  });

  it("merges custom className onto track", () => {
    render(<ProgressBar value={50} label="Progress" className="custom" />);
    const bar = screen.getByRole("progressbar");
    expect(bar.className).toContain("custom");
  });

  it("forwards ref to the root element", () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
    render(<ProgressBar ref={ref} label="Progress" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("ProgressBarDescription", () => {
  it("renders description text", () => {
    render(
      <ProgressBar value={50} label="Progress">
        <ProgressBarDescription>Uploading...</ProgressBarDescription>
      </ProgressBar>,
    );
    expect(screen.getByText("Uploading...")).toBeTruthy();
  });

  it("links to progressbar via aria-describedby", () => {
    render(
      <ProgressBar value={50} label="Progress">
        <ProgressBarDescription>Uploading...</ProgressBarDescription>
      </ProgressBar>,
    );
    const bar = screen.getByRole("progressbar");
    const describedBy = bar.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    const desc = document.getElementById(describedBy!);
    expect(desc?.textContent).toBe("Uploading...");
  });

  it("has data-description attribute", () => {
    render(
      <ProgressBar value={50} label="Progress">
        <ProgressBarDescription>Info</ProgressBarDescription>
      </ProgressBar>,
    );
    const desc = screen.getByText("Info");
    expect(desc).toHaveAttribute("data-description");
  });

  it("does not render wrapper div when no description", () => {
    const { container } = render(
      <ProgressBar value={50} label="Progress" />,
    );
    expect(container.firstElementChild?.getAttribute("role")).toBe(
      "progressbar",
    );
  });
});
