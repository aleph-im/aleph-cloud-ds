# Alert Component Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dismissible alert/banner component with 4 semantic variants, optional title, timed auto-dismiss with progress bar, and exit animation.

**Architecture:** Single flat `Alert` component using CVA for variant colors, internal state for dismiss/timer behavior. Follows the existing Badge/Card pattern (forwardRef + CVA + cn). Background gradient uses a static style map keyed by variant (Tailwind 4 tree-shakes dynamic classes).

**Tech Stack:** React 19, CVA, Tailwind CSS 4, Phosphor Icons, Vitest + Testing Library

**Spec:** `docs/plans/2026-03-10-alert-design.md`

---

## File Structure

| File | Purpose |
|------|---------|
| `packages/ds/src/components/alert/alert.tsx` | Alert component |
| `packages/ds/src/components/alert/alert.test.tsx` | Behavior tests |
| `apps/preview/src/app/components/alert/page.tsx` | Preview page |
| `packages/ds/package.json` | Add `"./alert"` subpath export |
| `apps/preview/src/components/sidebar.tsx` | Add "Alert" nav entry |

---

## Task 1: Write alert component tests

**Files:**
- Create: `packages/ds/src/components/alert/alert.test.tsx`

- [ ] **Step 1: Create the test file with all behavioral tests**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Alert } from "./alert";

describe("Alert", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders children", () => {
    render(<Alert variant="warning">Something happened</Alert>);
    expect(screen.getByText("Something happened")).toBeTruthy();
  });

  it("renders the variant label in uppercase", () => {
    render(<Alert variant="error">Message</Alert>);
    expect(screen.getByText("Error")).toBeTruthy();
  });

  it("renders title when provided", () => {
    render(
      <Alert variant="info" title="Heads up">
        Details here
      </Alert>,
    );
    const title = screen.getByText("Heads up");
    expect(title).toBeTruthy();
    expect(title.tagName).toBe("P");
  });

  it("omits title when not provided", () => {
    const { container } = render(
      <Alert variant="success">No title here</Alert>,
    );
    const titleEl = container.querySelector("[data-alert-title]");
    expect(titleEl).toBeNull();
  });

  it("has role=alert", () => {
    render(<Alert variant="warning">Msg</Alert>);
    expect(screen.getByRole("alert")).toBeTruthy();
  });

  it("does not render dismiss button when onDismiss is not set", () => {
    render(<Alert variant="warning">Msg</Alert>);
    expect(screen.queryByLabelText("Dismiss")).toBeNull();
  });

  it("renders dismiss button when onDismiss is set", () => {
    render(
      <Alert variant="warning" onDismiss={() => {}}>
        Msg
      </Alert>,
    );
    expect(screen.getByLabelText("Dismiss")).toBeTruthy();
  });

  it("calls onDismiss after clicking dismiss button", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    const { container } = render(
      <Alert variant="warning" onDismiss={onDismiss}>
        Msg
      </Alert>,
    );

    await user.click(screen.getByLabelText("Dismiss"));

    // Simulate transitionend since jsdom doesn't fire it
    const root = container.firstElementChild as HTMLElement;
    root.dispatchEvent(new Event("transitionend", { bubbles: true }));

    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it("calls onDismiss after dismissAfter timer expires", () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    const { container } = render(
      <Alert variant="warning" onDismiss={onDismiss} dismissAfter={3000}>
        Msg
      </Alert>,
    );

    vi.advanceTimersByTime(3000);

    // Simulate transitionend for exit animation
    const root = container.firstElementChild as HTMLElement;
    root.dispatchEvent(new Event("transitionend", { bubbles: true }));

    expect(onDismiss).toHaveBeenCalledOnce();
    vi.useRealTimers();
  });

  it("does not render progress bar without dismissAfter", () => {
    const { container } = render(
      <Alert variant="warning" onDismiss={() => {}}>
        Msg
      </Alert>,
    );
    expect(container.querySelector("[data-alert-progress]")).toBeNull();
  });

  it("renders progress bar when dismissAfter is set", () => {
    const { container } = render(
      <Alert variant="warning" onDismiss={() => {}} dismissAfter={5000}>
        Msg
      </Alert>,
    );
    expect(container.querySelector("[data-alert-progress]")).toBeTruthy();
  });

  it("merges custom className", () => {
    const { container } = render(
      <Alert variant="warning" className="custom-class">
        Msg
      </Alert>,
    );
    expect(container.firstElementChild?.className).toContain("custom-class");
  });

  it("renders inline links in children", () => {
    render(
      <Alert variant="info">
        Check <a href="https://example.com">settings</a> page
      </Alert>,
    );
    const link = screen.getByRole("link", { name: "settings" });
    expect(link).toHaveAttribute("href", "https://example.com");
  });

  it("cleans up timer on unmount", () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    const { unmount } = render(
      <Alert variant="warning" onDismiss={onDismiss} dismissAfter={5000}>
        Msg
      </Alert>,
    );

    unmount();
    vi.advanceTimersByTime(5000);

    expect(onDismiss).not.toHaveBeenCalled();
    vi.useRealTimers();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd packages/ds && npx vitest run src/components/alert/alert.test.tsx`
Expected: FAIL — `./alert` module not found

---

## Task 2: Implement the Alert component

**Files:**
- Create: `packages/ds/src/components/alert/alert.tsx`

- [ ] **Step 1: Write the Alert component**

```tsx
"use client";

import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  CheckCircle,
  Info,
  Warning,
  XCircle,
  X,
} from "@phosphor-icons/react";
import { cn } from "@ac/lib/cn";

const VARIANT_LABELS: Record<string, string> = {
  warning: "Warning",
  error: "Error",
  info: "Info",
  success: "Success",
};

const VARIANT_ICONS: Record<string, typeof Warning> = {
  warning: Warning,
  error: XCircle,
  info: Info,
  success: CheckCircle,
};

const VARIANT_BG_STYLES: Record<
  string,
  { light: string; dark: string }
> = {
  warning: {
    light:
      "linear-gradient(to right, var(--color-warning-100), transparent)",
    dark:
      "linear-gradient(to right, var(--color-warning-900), transparent)",
  },
  error: {
    light:
      "linear-gradient(to right, var(--color-error-100), transparent)",
    dark:
      "linear-gradient(to right, var(--color-error-900), transparent)",
  },
  info: {
    light:
      "linear-gradient(to right, var(--color-primary-100), transparent)",
    dark:
      "linear-gradient(to right, var(--color-primary-900), transparent)",
  },
  success: {
    light:
      "linear-gradient(to right, var(--color-success-100), transparent)",
    dark:
      "linear-gradient(to right, var(--color-success-900), transparent)",
  },
};

const alertVariants = cva(
  [
    "relative overflow-hidden rounded-sm border-l-3",
    "px-3 py-2",
    "transition-all duration-200",
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      variant: {
        warning: "border-warning-400",
        error: "border-error-400",
        info: "border-primary-400",
        success: "border-success-400",
      },
    },
    defaultVariants: {
      variant: "warning",
    },
  },
);

const labelVariants = cva(
  "font-heading font-extrabold italic text-[10px] uppercase leading-normal",
  {
    variants: {
      variant: {
        warning: "text-warning-600 dark:text-warning-300",
        error: "text-error-600 dark:text-error-300",
        info: "text-primary-600 dark:text-primary-300",
        success: "text-success-600 dark:text-success-300",
      },
    },
  },
);

const progressVariants = cva("absolute bottom-0 left-0 h-0.5", {
  variants: {
    variant: {
      warning: "bg-warning-400",
      error: "bg-error-400",
      info: "bg-primary-400",
      success: "bg-success-400",
    },
  },
});

type AlertVariant = "warning" | "error" | "info" | "success";

type AlertProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> &
  VariantProps<typeof alertVariants> & {
    title?: string;
    onDismiss?: () => void;
    dismissAfter?: number;
    children: ReactNode;
  };

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant = "warning",
      title,
      onDismiss,
      dismissAfter,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const [isDismissing, setIsDismissing] = useState(false);
    const [progressActive, setProgressActive] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
    const resolvedVariant: AlertVariant = variant ?? "warning";

    const Icon = VARIANT_ICONS[resolvedVariant];
    const label = VARIANT_LABELS[resolvedVariant];
    const bgStyle = VARIANT_BG_STYLES[resolvedVariant];

    // Timer for auto-dismiss
    useEffect(() => {
      if (!dismissAfter || !onDismiss) return;

      // Trigger progress bar transition after paint
      requestAnimationFrame(() => {
        setProgressActive(true);
      });

      timerRef.current = setTimeout(() => {
        setIsDismissing(true);
      }, dismissAfter);

      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }, [dismissAfter, onDismiss]);

    function handleDismiss() {
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsDismissing(true);
    }

    function handleTransitionEnd() {
      if (isDismissing && onDismiss) {
        onDismiss();
      }
    }

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          alertVariants({ variant }),
          isDismissing && "opacity-0 -translate-y-2",
          className,
        )}
        style={{
          backgroundImage: `var(--alert-bg)`,
          "--alert-bg": bgStyle.light,
          "--alert-bg-dark": bgStyle.dark,
        } as React.CSSProperties}
        onTransitionEnd={handleTransitionEnd}
        {...rest}
      >
        {/* Header row: label + icon */}
        <div className="flex items-center justify-between">
          <span className={labelVariants({ variant })}>
            {label}
          </span>
          <Icon
            weight="bold"
            className={cn(
              "size-3",
              labelVariants({ variant }),
            )}
            aria-hidden="true"
          />
        </div>

        {/* Optional title */}
        {title ? (
          <p
            data-alert-title=""
            className="font-sans font-bold text-sm text-foreground mt-0.5"
          >
            {title}
          </p>
        ) : null}

        {/* Body */}
        <div className="font-sans italic text-xs text-foreground leading-relaxed">
          {children}
        </div>

        {/* Dismiss button */}
        {onDismiss ? (
          <button
            type="button"
            onClick={handleDismiss}
            className={cn(
              "absolute top-2 right-2",
              "opacity-60 hover:opacity-100 transition-opacity",
              "motion-reduce:transition-none",
              labelVariants({ variant }),
            )}
            aria-label="Dismiss"
          >
            <X weight="bold" className="size-3.5" />
          </button>
        ) : null}

        {/* Progress bar (timed dismiss) */}
        {dismissAfter && onDismiss ? (
          <div
            data-alert-progress=""
            className={cn(
              progressVariants({ variant }),
              "motion-reduce:transition-none",
            )}
            style={{
              width: progressActive ? "0%" : "100%",
              transitionProperty: "width",
              transitionDuration: `${dismissAfter}ms`,
              transitionTimingFunction: "linear",
            }}
          />
        ) : null}
      </div>
    );
  },
);

Alert.displayName = "Alert";

export { Alert, alertVariants, type AlertProps };
```

- [ ] **Step 2: Add dark mode background gradient support**

The inline `backgroundImage` style needs to swap for dark mode. Since inline styles can't respond to CSS classes, add a small CSS rule in `tokens.css` after the existing utility classes:

Add to the end of `packages/ds/src/styles/tokens.css`:

```css
/* Alert gradient backgrounds — dark mode swap */
.alert-bg-warning {
  background-image: linear-gradient(to right, var(--color-warning-100), transparent);
}
.alert-bg-error {
  background-image: linear-gradient(to right, var(--color-error-100), transparent);
}
.alert-bg-info {
  background-image: linear-gradient(to right, var(--color-primary-100), transparent);
}
.alert-bg-success {
  background-image: linear-gradient(to right, var(--color-success-100), transparent);
}

:is(.theme-dark .alert-bg-warning) {
  background-image: linear-gradient(to right, var(--color-warning-900), transparent);
}
:is(.theme-dark .alert-bg-error) {
  background-image: linear-gradient(to right, var(--color-error-900), transparent);
}
:is(.theme-dark .alert-bg-info) {
  background-image: linear-gradient(to right, var(--color-primary-900), transparent);
}
:is(.theme-dark .alert-bg-success) {
  background-image: linear-gradient(to right, var(--color-success-900), transparent);
}
```

Then **update `alert.tsx`** to remove the inline `style` background approach and instead use these CSS classes. Replace the `VARIANT_BG_STYLES` map with a simpler class map:

```tsx
const VARIANT_BG_CLASS: Record<string, string> = {
  warning: "alert-bg-warning",
  error: "alert-bg-error",
  info: "alert-bg-info",
  success: "alert-bg-success",
};
```

And in the component, replace the `style` prop with the class:

```tsx
className={cn(
  alertVariants({ variant }),
  VARIANT_BG_CLASS[resolvedVariant],
  isDismissing && "opacity-0 -translate-y-2",
  className,
)}
```

Remove the `style` prop and the `VARIANT_BG_STYLES` constant entirely.

- [ ] **Step 3: Run the tests**

Run: `cd packages/ds && npx vitest run src/components/alert/alert.test.tsx`
Expected: All tests PASS

- [ ] **Step 4: Commit**

```bash
git add packages/ds/src/components/alert/alert.tsx packages/ds/src/components/alert/alert.test.tsx packages/ds/src/styles/tokens.css
git commit -m "feat: add Alert component with 4 variants, dismiss, and timer"
```

---

## Task 3: Add subpath export and preview page

**Files:**
- Modify: `packages/ds/package.json` — add `"./alert"` export
- Modify: `apps/preview/src/components/sidebar.tsx` — add "Alert" nav entry
- Create: `apps/preview/src/app/components/alert/page.tsx`

- [ ] **Step 1: Add subpath export to package.json**

In `packages/ds/package.json`, add to `"exports"` (alphabetically after `"./lib/cn"`... actually, place it as the first component entry for consistency):

```json
"./alert": "./src/components/alert/alert.tsx",
```

- [ ] **Step 2: Add Alert to the sidebar navigation**

In `apps/preview/src/components/sidebar.tsx`, add `{ label: "Alert", href: "/components/alert" }` to the Components section items array. Place it before "Badge" (alphabetical):

```tsx
items: [
  { label: "Alert", href: "/components/alert" },
  { label: "Badge", href: "/components/badge" },
  // ... rest unchanged
```

- [ ] **Step 3: Create the preview page**

```tsx
"use client";

import { useState } from "react";
import { Alert } from "@aleph-front/ds/alert";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

const variants = ["warning", "error", "info", "success"] as const;

export default function AlertPage() {
  const [showDismissible, setShowDismissible] = useState(true);
  const [showTimed, setShowTimed] = useState(true);

  return (
    <>
      <PageHeader
        title="Alert"
        description="Dismissible status banners with 4 semantic variants. Supports optional title, auto-dismiss timer with progress bar, and exit animation."
      />

      <DemoSection title="Variants">
        <div className="space-y-3">
          {variants.map((v) => (
            <Alert key={v} variant={v}>
              This is a {v} alert — check your{" "}
              <a href="#" className="underline font-semibold">
                settings
              </a>{" "}
              for more details.
            </Alert>
          ))}
        </div>
      </DemoSection>

      <DemoSection title="With Title">
        <div className="space-y-3">
          <Alert variant="error" title="Instance Paused">
            Something went wrong with your instance. It has been
            automatically paused to prevent data loss.
          </Alert>
          <Alert variant="warning" title="Configuration Issue">
            Need to check your network settings — your instance might be
            malfunctioning.
          </Alert>
        </div>
      </DemoSection>

      <DemoSection title="Dismissible">
        <div className="space-y-3">
          {showDismissible ? (
            <Alert
              variant="info"
              onDismiss={() => setShowDismissible(false)}
            >
              Click the X button to dismiss this alert.
            </Alert>
          ) : (
            <button
              type="button"
              onClick={() => setShowDismissible(true)}
              className="text-sm text-primary-600 underline"
            >
              Show alert again
            </button>
          )}
        </div>
      </DemoSection>

      <DemoSection title="Auto-Dismiss with Timer">
        <div className="space-y-3">
          {showTimed ? (
            <Alert
              variant="success"
              title="Saved"
              onDismiss={() => setShowTimed(false)}
              dismissAfter={5000}
            >
              Your changes have been saved. This alert will dismiss in 5
              seconds.
            </Alert>
          ) : (
            <button
              type="button"
              onClick={() => setShowTimed(true)}
              className="text-sm text-primary-600 underline"
            >
              Show timed alert again
            </button>
          )}
        </div>
      </DemoSection>

      <DemoSection title="With Inline Links">
        <Alert variant="warning">
          Need to check{" "}
          <a href="#" className="underline font-semibold">
            [6489065788] setting
          </a>
          , your instance might be malfunctioning. See the{" "}
          <a href="#" className="underline font-semibold">
            documentation
          </a>{" "}
          for troubleshooting steps.
        </Alert>
      </DemoSection>
    </>
  );
}
```

- [ ] **Step 4: Run full project checks**

Run: `npm run check`
Expected: lint + typecheck + test all PASS

- [ ] **Step 5: Commit**

```bash
git add packages/ds/package.json apps/preview/src/components/sidebar.tsx apps/preview/src/app/components/alert/page.tsx
git commit -m "feat: add Alert preview page and subpath export"
```

---

## Task 4: Visual review

- [ ] **Step 1: Start dev server and verify**

Run: `npm run dev`

Open the preview app and check:
- All 4 variants render with correct colors (warning=amber, error=red, info=purple, success=green)
- Left border accent is visible
- Gradient background fades from variant color to transparent
- Title renders bold when provided
- Dismiss X button appears and triggers exit animation (fade + slide up)
- Auto-dismiss timer shows shrinking progress bar at bottom edge
- Progress bar color matches the variant
- Dark mode: toggle theme and verify colors swap correctly
- Inline links are clickable and styled
- Ask the user to verify before proceeding

---

## Task 5: Update docs

- [ ] **Step 1: Update DESIGN-SYSTEM.md** — add Alert component section with usage examples, props, variants

- [ ] **Step 2: Update ARCHITECTURE.md** — no new patterns needed (uses existing CVA + forwardRef + CSS class map for gradients)

- [ ] **Step 3: Update DECISIONS.md** — log design decisions:
  - Chose flat component over composable (Card pattern, not Tooltip pattern)
  - Children as ReactNode for flexible link embedding
  - CSS classes for gradient backgrounds (not inline styles) for dark mode support
  - Internal `isDismissing` state with `onTransitionEnd` for exit animation handoff
  - `dismissAfter` ignored without `onDismiss` (controlled pattern)

- [ ] **Step 4: Update BACKLOG.md** — move "Alert / Banner" from open to completed

- [ ] **Step 5: Update CLAUDE.md** — add Alert to Current Features list, update preview page count

- [ ] **Step 6: Commit**

```bash
git add docs/ CLAUDE.md
git commit -m "docs: add Alert component documentation"
```
