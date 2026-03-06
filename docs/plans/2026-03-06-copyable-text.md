# CopyableText Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a `CopyableText` component that displays truncated text with copy-to-clipboard and optional external link, using Phosphor Icons and a clip-path circle reveal animation on copy.

**Architecture:** CVA + forwardRef pattern (like Badge). Internal state for copied feedback. Wraps DS Tooltip for full-text hover. Copy button uses a two-layer stacked approach: default Copy icon layer + reveal layer with foreground-colored circle expanding via `clip-path: circle()` transition (same proven pattern as checkbox/radio-group). No custom keyframes needed.

**Tech Stack:** React 19, CVA, Phosphor Icons (`Copy`, `Check`, `ArrowUpLeft`), DS Tooltip (Radix), Tailwind CSS 4

---

### Task 1: Write failing tests for CopyableText

**Files:**
- Create: `packages/ds/src/components/copyable-text/copyable-text.test.tsx`

**Step 1: Write the test file**

```tsx
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { CopyableText } from "./copyable-text";

const LONG_TEXT = "0x1234567890abcdef1234567890abcdef12345678";
const SHORT_TEXT = "0x1234abcd";

beforeEach(() => {
  Object.assign(navigator, {
    clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
  });
});

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
      const copyBtn = screen.getByRole("button", {
        name: "Copy to clipboard",
      });

      await user.click(copyBtn);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(LONG_TEXT);
    });

    it("shows Copied label after click", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });
      render(<CopyableText text={LONG_TEXT} />);

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
```

**Step 2: Run tests to verify they fail**

Run: `cd packages/ds && npx vitest run src/components/copyable-text/copyable-text.test.tsx`
Expected: FAIL — module `./copyable-text` not found

---

### Task 2: Implement CopyableText component

**Files:**
- Create: `packages/ds/src/components/copyable-text/copyable-text.tsx`

**Animation approach:** The copy button uses two stacked layers via `position: relative` + `position: absolute`:

1. **Default layer** — Copy icon in muted color, always visible
2. **Reveal layer** — Foreground-colored circle background + Check icon in `--background` color. Clipped to `clip-path: circle(0% at 50% 50%)` by default. On `copied` state, transitions to `circle(100% at 50% 50%)` over 200ms.

This reuses the exact same `clip-path` transition pattern from checkbox/radio-group (see Architecture doc: "Radix forceMount + Clip-Path Animation"). The circle uses `bg-foreground` so it's theme-aware (dark text on light, light on dark). The Check icon uses `text-background` to contrast against the circle.

**Step 1: Write the component**

```tsx
"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowUpLeft, Check, Copy } from "@phosphor-icons/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ac/components/tooltip/tooltip";
import { cn } from "@ac/lib/cn";

const copyableTextVariants = cva(
  "inline-flex items-center font-mono select-none",
  {
    variants: {
      size: {
        sm: "text-xs gap-1",
        md: "text-sm gap-1.5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const iconSize: Record<"sm" | "md", string> = {
  sm: "size-3.5",
  md: "size-4",
};

const buttonSize: Record<"sm" | "md", string> = {
  sm: "size-6",
  md: "size-7",
};

function truncateMiddle(
  text: string,
  startChars: number,
  endChars: number,
): string {
  if (text.length <= startChars + endChars) return text;
  return `${text.slice(0, startChars)}...${text.slice(-endChars)}`;
}

type CopyableTextProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> &
  VariantProps<typeof copyableTextVariants> & {
    text: string;
    startChars?: number;
    endChars?: number;
    href?: string;
  };

const CopyableText = forwardRef<HTMLSpanElement, CopyableTextProps>(
  (
    {
      text,
      startChars = 6,
      endChars = 4,
      href,
      size = "md",
      className,
      ...rest
    },
    ref,
  ) => {
    const [copied, setCopied] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

    useEffect(() => {
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }, []);

    const handleCopy = useCallback(() => {
      void navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopied(false), 1500);
      });
    }, [text]);

    const resolvedSize = size ?? "md";
    const iconCn = iconSize[resolvedSize];
    const btnCn = buttonSize[resolvedSize];

    return (
      <TooltipProvider>
        <span
          ref={ref}
          className={cn(copyableTextVariants({ size }), className)}
          {...rest}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-default">
                {truncateMiddle(text, startChars, endChars)}
              </span>
            </TooltipTrigger>
            <TooltipContent>{text}</TooltipContent>
          </Tooltip>

          <button
            type="button"
            onClick={handleCopy}
            className={cn(
              "relative inline-flex items-center justify-center",
              "rounded-full cursor-pointer",
              "hover:bg-muted transition-colors",
              btnCn,
            )}
            aria-label={copied ? "Copied" : "Copy to clipboard"}
          >
            {/* Default layer: Copy icon */}
            <Copy
              weight="bold"
              className={cn(iconCn, "text-muted-foreground")}
              aria-hidden="true"
            />

            {/* Reveal layer: circle bg + Check icon */}
            <span
              className={cn(
                "absolute inset-0 flex items-center justify-center",
                "rounded-full bg-foreground",
                "[clip-path:circle(0%_at_50%_50%)]",
                "transition-[clip-path] duration-200 ease-out",
                "motion-reduce:transition-none",
                copied && "[clip-path:circle(100%_at_50%_50%)]",
              )}
              aria-hidden="true"
            >
              <Check
                weight="bold"
                className={cn(iconCn, "text-background")}
              />
            </span>
          </button>

          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center justify-center rounded-full",
                "text-muted-foreground hover:text-foreground",
                "hover:bg-muted transition-colors",
                btnCn,
              )}
              aria-label="Open in new tab"
            >
              <ArrowUpLeft
                weight="bold"
                className={iconCn}
                aria-hidden="true"
              />
            </a>
          ) : null}
        </span>
      </TooltipProvider>
    );
  },
);

CopyableText.displayName = "CopyableText";

export { CopyableText, copyableTextVariants, type CopyableTextProps };
```

**Step 2: Run tests to verify they pass**

Run: `cd packages/ds && npx vitest run src/components/copyable-text/copyable-text.test.tsx`
Expected: All 8 tests PASS

**Step 3: Commit**

```bash
git add packages/ds/src/components/copyable-text/
git commit -m "feat: add CopyableText component with clip-path reveal animation"
```

---

### Task 3: Add subpath export to package.json

**Files:**
- Modify: `packages/ds/package.json:19-39` (exports block)

**Step 1: Add the export**

Add this line after the `./multi-select` entry (line 37):

```json
"./copyable-text": "./src/components/copyable-text/copyable-text.tsx",
```

**Step 2: Run full checks**

Run: `npm run check` (from repo root)
Expected: lint + typecheck + test all pass

**Step 3: Commit**

```bash
git add packages/ds/package.json
git commit -m "feat: add copyable-text subpath export"
```

---

### Task 4: Create preview page

**Files:**
- Create: `apps/preview/src/app/components/copyable-text/page.tsx`

**Step 1: Write the preview page**

```tsx
"use client";

import { CopyableText } from "@aleph-front/ds/copyable-text";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

const HASH = "0x1234567890abcdef1234567890abcdef12345678";
const SHORT = "0x1a2b3c";
const API_KEY = "sk-proj-abc123def456ghi789jkl012mno345pqr678stu901vwx";

export default function CopyableTextPage() {
  return (
    <>
      <PageHeader
        title="CopyableText"
        description="Truncated text with copy-to-clipboard and optional external link. Click copy to see the circle-reveal micro-animation."
      />

      <DemoSection title="Sizes">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-8">sm</span>
            <CopyableText text={HASH} size="sm" />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground w-8">md</span>
            <CopyableText text={HASH} size="md" />
          </div>
        </div>
      </DemoSection>

      <DemoSection title="Custom Truncation">
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              startChars=8, endChars=6
            </p>
            <CopyableText text={HASH} startChars={8} endChars={6} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              Short text (no truncation)
            </p>
            <CopyableText text={SHORT} />
          </div>
        </div>
      </DemoSection>

      <DemoSection title="With External Link">
        <CopyableText
          text={HASH}
          href="https://explorer.aleph.cloud"
        />
      </DemoSection>

      <DemoSection title="Use Cases">
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              Wallet address
            </p>
            <CopyableText
              text="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
              href="https://etherscan.io/address/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">API key</p>
            <CopyableText text={API_KEY} startChars={10} endChars={6} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              Transaction hash
            </p>
            <CopyableText
              text="bafy2bzacedxyz123abc456def789ghi012jkl345mno678pqr"
              startChars={8}
              endChars={8}
              href="https://explorer.aleph.cloud"
              size="sm"
            />
          </div>
        </div>
      </DemoSection>
    </>
  );
}
```

**Step 2: Commit**

```bash
git add apps/preview/src/app/components/copyable-text/
git commit -m "feat: add CopyableText preview page"
```

---

### Task 5: Add sidebar nav entry

**Files:**
- Modify: `apps/preview/src/components/sidebar.tsx:36-42`

**Step 1: Add CopyableText entry**

In the `NAV` array, in the Components section items array, add after the Card entry (line 38):

```tsx
{ label: "CopyableText", href: "/components/copyable-text" },
```

**Step 2: Run build**

Run: `npm run build` (from repo root)
Expected: Static export succeeds

**Step 3: Commit**

```bash
git add apps/preview/src/components/sidebar.tsx
git commit -m "feat: add CopyableText to sidebar nav"
```

---

### Task 6: Verify end-to-end

**Step 1: Run all checks**

Run: `npm run check` (from repo root)
Expected: lint + typecheck + test all pass

**Step 2: Run dev server and verify visually**

Run: `npm run dev` (from repo root)
Navigate to `http://localhost:3000/components/copyable-text`
Verify:
- Both sizes render correctly
- Hover copy button shows dimmed bg
- Click copy -> foreground circle expands from center, check icon visible in bg color -> reverts after 1.5s
- Hover truncated text -> tooltip shows full text
- External link icon appears only when href provided
- External link opens in new tab
- Test in both light and dark themes

---

### Task 7: Update docs

- [ ] `docs/DESIGN-SYSTEM.md` -- add CopyableText component entry with props, usage examples
- [ ] `docs/ARCHITECTURE.md` -- no new patterns needed (reuses clip-path reveal from checkbox/radio-group)
- [ ] `docs/DECISIONS.md` -- log design decisions: middle ellipsis truncation, ArrowUpLeft icon, clip-path circle reveal with foreground color, no custom keyframe
- [ ] `docs/BACKLOG.md` -- move CopyableText to Completed section
- [ ] `CLAUDE.md` -- update Current Features list, increment preview page count (23 -> 24)
