import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, afterEach } from "vitest";
import { CopyableText } from "./copyable-text";

const LONG_TEXT = "0x1234567890abcdef1234567890abcdef12345678";
const SHORT_TEXT = "0x1234abcd";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("CopyableText", () => {
  describe("truncation", () => {
    it("shows middle-ellipsis for long text", () => {
      render(<CopyableText text={LONG_TEXT} />);
      expect(screen.getByText("0x1234...5678")).toBeTruthy();
    });

    it("shows full text when shorter than startChars + endChars", () => {
      render(
        <CopyableText text={SHORT_TEXT} startChars={6} endChars={4} />,
      );
      expect(screen.getByText(SHORT_TEXT)).toBeTruthy();
    });

    it("respects custom startChars and endChars", () => {
      render(
        <CopyableText text={LONG_TEXT} startChars={4} endChars={6} />,
      );
      expect(screen.getByText("0x12...345678")).toBeTruthy();
    });
  });

  describe("copy", () => {
    it("copies full text to clipboard on click", async () => {
      const user = userEvent.setup();
      render(<CopyableText text={LONG_TEXT} />);

      const spy = vi
        .spyOn(navigator.clipboard, "writeText")
        .mockResolvedValue(undefined);

      const copyBtn = screen.getByRole("button", {
        name: "Copy to clipboard",
      });

      await user.click(copyBtn);

      expect(spy).toHaveBeenCalledWith(LONG_TEXT);
    });

    it("shows Copied label after click", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });
      render(<CopyableText text={LONG_TEXT} />);

      vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(
        undefined,
      );

      await user.click(
        screen.getByRole("button", { name: "Copy to clipboard" }),
      );

      expect(
        screen.getByRole("button", { name: "Copied" }),
      ).toBeTruthy();

      act(() => {
        vi.advanceTimersByTime(1500);
      });

      expect(
        screen.getByRole("button", { name: "Copy to clipboard" }),
      ).toBeTruthy();

      vi.useRealTimers();
    });
  });

  describe("external link", () => {
    it("does not render link icon when href is absent", () => {
      render(<CopyableText text={LONG_TEXT} />);
      expect(screen.queryByRole("link")).toBeNull();
    });

    it("renders link with correct attributes when href is provided", () => {
      render(
        <CopyableText text={LONG_TEXT} href="https://example.com" />,
      );
      const link = screen.getByRole("link", { name: "Open in new tab" });
      expect(link).toBeTruthy();
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
      expect(link.getAttribute("href")).toBe("https://example.com");
    });
  });

  describe("props", () => {
    it("merges custom className", () => {
      const { container } = render(
        <CopyableText text={LONG_TEXT} className="custom-class" />,
      );
      expect(container.firstElementChild?.className).toContain(
        "custom-class",
      );
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLSpanElement | null>;
      render(<CopyableText ref={ref} text={LONG_TEXT} />);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });
  });
});
