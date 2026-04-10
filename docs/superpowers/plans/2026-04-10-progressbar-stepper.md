# ProgressBar & Stepper Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two structural primitive components to `@aleph-front/ds` — a ProgressBar (determinate + indeterminate) and a compound Stepper (horizontal + vertical, composable parts).

**Architecture:** ProgressBar is a single `forwardRef` component with CVA size variants, an inner fill bar targeted via `data-fill`, and an optional `ProgressBarDescription` child linked via `aria-describedby`. Stepper follows the Breadcrumb compound pattern — `nav > ol > li` with explicit connectors. State propagation via two React contexts (orientation + step state). No opinionated colors — consumers style via `data-*` attribute selectors.

**Tech Stack:** React 19, CVA, `cn()`, `forwardRef`, Tailwind CSS 4, Vitest + React Testing Library

**Spec:** `docs/superpowers/specs/2026-04-10-ds-progressbar-stepper-design.md` (in the app repo at `~/Library/CloudStorage/Dropbox/Claudio/repos/aleph-cloud-app/`)

---

## File Structure

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `packages/ds/src/components/progress-bar/progress-bar.tsx` | ProgressBar + ProgressBarDescription |
| Create | `packages/ds/src/components/progress-bar/progress-bar.test.tsx` | ProgressBar tests |
| Create | `packages/ds/src/components/stepper/stepper.tsx` | All 7 Stepper compound parts |
| Create | `packages/ds/src/components/stepper/stepper.test.tsx` | Stepper tests |
| Modify | `packages/ds/package.json` | Add subpath exports |
| Modify | `packages/ds/src/styles/tokens.css` | Add indeterminate animation keyframes |

---

## Task 1: ProgressBar — tests

**Files:**
- Create: `packages/ds/src/components/progress-bar/progress-bar.test.tsx`

- [ ] **Step 1: Create the test file**

```tsx
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
```

- [ ] **Step 2: Run tests — verify they fail**

Run: `cd packages/ds && npx vitest run src/components/progress-bar/progress-bar.test.tsx`
Expected: FAIL — module `./progress-bar` not found.

---

## Task 2: ProgressBar — implementation

**Files:**
- Create: `packages/ds/src/components/progress-bar/progress-bar.tsx`

- [ ] **Step 1: Create progress-bar.tsx**

```tsx
import {
  Children,
  forwardRef,
  isValidElement,
  useId,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ac/lib/cn";

/* ── Variants ──────────────────────────────────── */

const progressBarVariants = cva(
  "relative rounded-full bg-surface overflow-hidden",
  {
    variants: {
      size: {
        sm: "h-1",
        md: "h-1.5",
        lg: "h-2.5",
      },
    },
    defaultVariants: { size: "md" },
  },
);

/* ── ProgressBarDescription ────────────────────── */

type ProgressBarDescriptionProps = HTMLAttributes<HTMLSpanElement>;

const ProgressBarDescription = forwardRef<
  HTMLSpanElement,
  ProgressBarDescriptionProps
>(({ className, ...rest }, ref) => (
  <span
    ref={ref}
    data-description=""
    className={cn("text-xs text-muted-foreground", className)}
    {...rest}
  />
));

ProgressBarDescription.displayName = "ProgressBarDescription";

/* ── ProgressBar ───────────────────────────────── */

type ProgressBarProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof progressBarVariants> & {
    /** 0–max. Omit for indeterminate mode. */
    value?: number;
    /** Upper bound. Default 100. */
    max?: number;
    /** Accessible label (required). Becomes aria-label. */
    label: string;
    children?: ReactNode;
  };

const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ value, max = 100, label, size, className, children, ...rest }, ref) => {
    const descId = useId();
    const indeterminate = value === undefined;

    const clampedPercent = indeterminate
      ? 0
      : (Math.min(Math.max(value, 0), max) / max) * 100;

    let hasDescription = false;
    Children.forEach(children, (child) => {
      if (isValidElement(child) && child.type === ProgressBarDescription) {
        hasDescription = true;
      }
    });

    const track = (
      <div
        ref={hasDescription ? undefined : ref}
        role="progressbar"
        aria-label={label}
        aria-valuemin={indeterminate ? undefined : 0}
        aria-valuemax={indeterminate ? undefined : max}
        aria-valuenow={indeterminate ? undefined : Math.round(clampedPercent)}
        aria-describedby={hasDescription ? descId : undefined}
        className={cn(progressBarVariants({ size }), className)}
        {...(hasDescription ? {} : rest)}
      >
        <div
          data-fill=""
          data-indeterminate={indeterminate ? "" : undefined}
          className={cn(
            "h-full rounded-full bg-primary",
            indeterminate
              ? "animate-progress-indeterminate"
              : "transition-all",
            "motion-reduce:animate-none",
          )}
          style={indeterminate ? undefined : { width: `${clampedPercent}%` }}
        />
      </div>
    );

    if (!hasDescription) return track;

    const descChildren = Children.map(children, (child) => {
      if (isValidElement(child) && child.type === ProgressBarDescription) {
        return (
          <ProgressBarDescription
            {...child.props}
            id={descId}
            key={child.key}
          />
        );
      }
      return child;
    });

    return (
      <div ref={ref} className="flex flex-col gap-1.5" {...rest}>
        {track}
        {descChildren}
      </div>
    );
  },
);

ProgressBar.displayName = "ProgressBar";

/* ── Exports ───────────────────────────────────── */

export {
  ProgressBar,
  ProgressBarDescription,
  progressBarVariants,
  type ProgressBarProps,
  type ProgressBarDescriptionProps,
};
```

- [ ] **Step 2: Run tests — verify they pass**

Run: `cd packages/ds && npx vitest run src/components/progress-bar/progress-bar.test.tsx`
Expected: All tests PASS.

- [ ] **Step 3: Commit**

```bash
git add packages/ds/src/components/progress-bar/
git commit -m "feat(ds): add ProgressBar component with determinate + indeterminate modes"
```

---

## Task 3: ProgressBar — indeterminate animation + package export

**Files:**
- Modify: `packages/ds/src/styles/tokens.css`
- Modify: `packages/ds/package.json`

- [ ] **Step 1: Add indeterminate animation keyframes to tokens.css**

Append to the end of `packages/ds/src/styles/tokens.css`:

```css
/* ── ProgressBar indeterminate animation ───────── */

@keyframes progress-indeterminate {
  0% { translate: -100% 0; }
  100% { translate: 100% 0; }
}

.animate-progress-indeterminate {
  width: 40%;
  animation: progress-indeterminate 1.5s ease-in-out infinite;
}
```

- [ ] **Step 2: Add subpath export to package.json**

Add this entry to the `"exports"` object in `packages/ds/package.json`:

```json
"./progress-bar": "./src/components/progress-bar/progress-bar.tsx"
```

- [ ] **Step 3: Run full checks**

Run: `cd packages/ds && npm run check`
Expected: lint, typecheck, and all tests pass.

- [ ] **Step 4: Commit**

```bash
git add packages/ds/src/styles/tokens.css packages/ds/package.json
git commit -m "feat(ds): add indeterminate animation + progress-bar export"
```

---

## Task 4: Stepper — tests

**Files:**
- Create: `packages/ds/src/components/stepper/stepper.test.tsx`

- [ ] **Step 1: Create the test file**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Stepper,
  StepperConnector,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperLabel,
  StepperList,
} from "./stepper";

describe("Stepper", () => {
  it("renders a nav element", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem>
            <StepperLabel>One</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByRole("navigation")).toBeTruthy();
  });

  it("sets aria-label on nav", () => {
    render(
      <Stepper aria-label="Wizard">
        <StepperList>
          <StepperItem>
            <StepperLabel>One</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByRole("navigation")).toHaveAttribute(
      "aria-label",
      "Wizard",
    );
  });

  it("defaults to horizontal orientation", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem>
            <StepperLabel>One</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByRole("navigation")).toHaveAttribute(
      "data-orientation",
      "horizontal",
    );
  });

  it("accepts vertical orientation", () => {
    render(
      <Stepper orientation="vertical" aria-label="Steps">
        <StepperList>
          <StepperItem>
            <StepperLabel>One</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByRole("navigation")).toHaveAttribute(
      "data-orientation",
      "vertical",
    );
  });

  it("merges className on nav", () => {
    render(
      <Stepper aria-label="Steps" className="custom">
        <StepperList>
          <StepperItem>
            <StepperLabel>One</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByRole("navigation").className).toContain("custom");
  });

  it("forwards ref to nav element", () => {
    const ref = { current: null } as React.RefObject<HTMLElement | null>;
    render(
      <Stepper ref={ref} aria-label="Steps">
        <StepperList>
          <StepperItem>
            <StepperLabel>One</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(ref.current?.tagName).toBe("NAV");
  });
});

describe("StepperList", () => {
  it("renders an ol element", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem>
            <StepperLabel>One</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByRole("list")).toBeTruthy();
  });

  it("applies horizontal flex by default", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem>
            <StepperLabel>One</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    const list = screen.getByRole("list");
    expect(list.className).toContain("flex");
    expect(list.className).not.toContain("flex-col");
  });

  it("applies vertical flex-col when orientation is vertical", () => {
    render(
      <Stepper orientation="vertical" aria-label="Steps">
        <StepperList>
          <StepperItem>
            <StepperLabel>One</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    const list = screen.getByRole("list");
    expect(list.className).toContain("flex-col");
  });
});

describe("StepperItem", () => {
  it("renders an li element", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem>
            <StepperLabel>One</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByRole("listitem")).toBeTruthy();
  });

  it("sets data-state from state prop", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem state="completed">
            <StepperLabel>One</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByRole("listitem")).toHaveAttribute(
      "data-state",
      "completed",
    );
  });

  it("defaults to inactive state", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem>
            <StepperLabel>One</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByRole("listitem")).toHaveAttribute(
      "data-state",
      "inactive",
    );
  });

  it("sets aria-current=step when active", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem state="active">
            <StepperLabel>One</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByRole("listitem")).toHaveAttribute(
      "aria-current",
      "step",
    );
  });

  it("does not set aria-current when completed", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem state="completed">
            <StepperLabel>One</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByRole("listitem")).not.toHaveAttribute("aria-current");
  });

  it("does not set aria-current when inactive", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem state="inactive">
            <StepperLabel>One</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByRole("listitem")).not.toHaveAttribute("aria-current");
  });
});

describe("StepperIndicator", () => {
  it("renders children", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem state="active">
            <StepperIndicator>2</StepperIndicator>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByText("2")).toBeTruthy();
  });

  it("inherits data-state from StepperItem", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem state="completed">
            <StepperIndicator data-testid="indicator">
              1
            </StepperIndicator>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByTestId("indicator")).toHaveAttribute(
      "data-state",
      "completed",
    );
  });
});

describe("StepperLabel", () => {
  it("renders label text", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem>
            <StepperLabel>Configure</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByText("Configure")).toBeTruthy();
  });

  it("inherits data-state from StepperItem", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem state="active">
            <StepperLabel data-testid="label">Configure</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByTestId("label")).toHaveAttribute(
      "data-state",
      "active",
    );
  });
});

describe("StepperDescription", () => {
  it("renders description text", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem state="active">
            <StepperLabel>Build</StepperLabel>
            <StepperDescription>Installing...</StepperDescription>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByText("Installing...")).toBeTruthy();
  });

  it("inherits data-state from StepperItem", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem state="active">
            <StepperLabel>Build</StepperLabel>
            <StepperDescription data-testid="desc">
              Installing...
            </StepperDescription>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByTestId("desc")).toHaveAttribute(
      "data-state",
      "active",
    );
  });
});

describe("StepperConnector", () => {
  it("renders with aria-hidden", () => {
    const { container } = render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem>
            <StepperLabel>One</StepperLabel>
          </StepperItem>
          <StepperConnector data-testid="conn" />
          <StepperItem>
            <StepperLabel>Two</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    const conn = screen.getByTestId("conn");
    expect(conn).toHaveAttribute("aria-hidden", "true");
  });

  it("sets data-orientation=horizontal by default", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem>
            <StepperLabel>One</StepperLabel>
          </StepperItem>
          <StepperConnector data-testid="conn" />
          <StepperItem>
            <StepperLabel>Two</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByTestId("conn")).toHaveAttribute(
      "data-orientation",
      "horizontal",
    );
  });

  it("sets data-orientation=vertical when Stepper is vertical", () => {
    render(
      <Stepper orientation="vertical" aria-label="Steps">
        <StepperList>
          <StepperItem>
            <StepperLabel>One</StepperLabel>
          </StepperItem>
          <StepperConnector data-testid="conn" />
          <StepperItem>
            <StepperLabel>Two</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByTestId("conn")).toHaveAttribute(
      "data-orientation",
      "vertical",
    );
  });

  it("applies h-px for horizontal and w-px for vertical", () => {
    const { rerender } = render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem>
            <StepperLabel>One</StepperLabel>
          </StepperItem>
          <StepperConnector data-testid="conn" />
          <StepperItem>
            <StepperLabel>Two</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByTestId("conn").className).toContain("h-px");

    rerender(
      <Stepper orientation="vertical" aria-label="Steps">
        <StepperList>
          <StepperItem>
            <StepperLabel>One</StepperLabel>
          </StepperItem>
          <StepperConnector data-testid="conn" />
          <StepperItem>
            <StepperLabel>Two</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByTestId("conn").className).toContain("w-px");
  });
});

describe("integration", () => {
  it("renders a complete horizontal stepper", () => {
    render(
      <Stepper aria-label="Wizard">
        <StepperList>
          <StepperItem state="completed">
            <StepperIndicator>1</StepperIndicator>
            <StepperLabel>Select</StepperLabel>
          </StepperItem>
          <StepperConnector />
          <StepperItem state="active">
            <StepperIndicator>2</StepperIndicator>
            <StepperLabel>Configure</StepperLabel>
            <StepperDescription>Editing settings...</StepperDescription>
          </StepperItem>
          <StepperConnector />
          <StepperItem state="inactive">
            <StepperIndicator>3</StepperIndicator>
            <StepperLabel>Deploy</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );

    const items = screen.getAllByRole("listitem");
    // 3 StepperItems + 2 StepperConnectors = 5 list items
    expect(items).toHaveLength(5);
    expect(screen.getByText("Select")).toBeTruthy();
    expect(screen.getByText("Configure")).toBeTruthy();
    expect(screen.getByText("Deploy")).toBeTruthy();
    expect(screen.getByText("Editing settings...")).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

Run: `cd packages/ds && npx vitest run src/components/stepper/stepper.test.tsx`
Expected: FAIL — module `./stepper` not found.

---

## Task 5: Stepper — implementation

**Files:**
- Create: `packages/ds/src/components/stepper/stepper.tsx`

- [ ] **Step 1: Create stepper.tsx**

```tsx
"use client";

import {
  createContext,
  forwardRef,
  useContext,
  type HTMLAttributes,
} from "react";
import { cn } from "@ac/lib/cn";

/* ── Stepper context (orientation) ─────────────── */

type StepperContextValue = { orientation: "horizontal" | "vertical" };

const StepperContext = createContext<StepperContextValue>({
  orientation: "horizontal",
});

function useStepperContext(): StepperContextValue {
  return useContext(StepperContext);
}

/* ── StepperItem context (state propagation) ───── */

type StepperItemState = "completed" | "active" | "inactive";

type StepperItemContextValue = { state: StepperItemState };

const StepperItemContext = createContext<StepperItemContextValue>({
  state: "inactive",
});

function useStepperItemContext(): StepperItemContextValue {
  return useContext(StepperItemContext);
}

/* ── Stepper (nav root) ────────────────────────── */

type StepperProps = HTMLAttributes<HTMLElement> & {
  /** Layout direction. Default "horizontal". */
  orientation?: "horizontal" | "vertical";
};

const Stepper = forwardRef<HTMLElement, StepperProps>(
  ({ orientation = "horizontal", className, ...rest }, ref) => (
    <StepperContext.Provider value={{ orientation }}>
      <nav
        ref={ref}
        data-orientation={orientation}
        className={cn(className)}
        {...rest}
      />
    </StepperContext.Provider>
  ),
);

Stepper.displayName = "Stepper";

/* ── StepperList (ol container) ────────────────── */

type StepperListProps = HTMLAttributes<HTMLOListElement>;

const StepperList = forwardRef<HTMLOListElement, StepperListProps>(
  ({ className, ...rest }, ref) => {
    const { orientation } = useStepperContext();
    return (
      <ol
        ref={ref}
        className={cn(
          "flex gap-2",
          orientation === "horizontal" ? "items-center" : "flex-col",
          className,
        )}
        {...rest}
      />
    );
  },
);

StepperList.displayName = "StepperList";

/* ── StepperItem (li, carries state) ───────────── */

type StepperItemProps = HTMLAttributes<HTMLLIElement> & {
  /** Step state. Propagated as data-state to children. */
  state?: StepperItemState;
};

const StepperItem = forwardRef<HTMLLIElement, StepperItemProps>(
  ({ state = "inactive", className, ...rest }, ref) => (
    <StepperItemContext.Provider value={{ state }}>
      <li
        ref={ref}
        data-state={state}
        aria-current={state === "active" ? "step" : undefined}
        className={cn("flex items-center gap-2", className)}
        {...rest}
      />
    </StepperItemContext.Provider>
  ),
);

StepperItem.displayName = "StepperItem";

/* ── StepperIndicator (div slot) ───────────────── */

type StepperIndicatorProps = HTMLAttributes<HTMLDivElement>;

const StepperIndicator = forwardRef<HTMLDivElement, StepperIndicatorProps>(
  ({ className, ...rest }, ref) => {
    const { state } = useStepperItemContext();
    return (
      <div
        ref={ref}
        data-state={state}
        className={cn(className)}
        {...rest}
      />
    );
  },
);

StepperIndicator.displayName = "StepperIndicator";

/* ── StepperLabel (span) ───────────────────────── */

type StepperLabelProps = HTMLAttributes<HTMLSpanElement>;

const StepperLabel = forwardRef<HTMLSpanElement, StepperLabelProps>(
  ({ className, ...rest }, ref) => {
    const { state } = useStepperItemContext();
    return (
      <span
        ref={ref}
        data-state={state}
        className={cn(className)}
        {...rest}
      />
    );
  },
);

StepperLabel.displayName = "StepperLabel";

/* ── StepperDescription (span) ─────────────────── */

type StepperDescriptionProps = HTMLAttributes<HTMLSpanElement>;

const StepperDescription = forwardRef<
  HTMLSpanElement,
  StepperDescriptionProps
>(({ className, ...rest }, ref) => {
  const { state } = useStepperItemContext();
  return (
    <span
      ref={ref}
      data-state={state}
      className={cn(className)}
      {...rest}
    />
  );
});

StepperDescription.displayName = "StepperDescription";

/* ── StepperConnector (li, visual line) ────────── */

type StepperConnectorProps = HTMLAttributes<HTMLLIElement>;

const StepperConnector = forwardRef<HTMLLIElement, StepperConnectorProps>(
  ({ className, ...rest }, ref) => {
    const { orientation } = useStepperContext();
    return (
      <li
        ref={ref}
        aria-hidden="true"
        data-orientation={orientation}
        className={cn(
          "bg-edge flex-1",
          orientation === "horizontal" ? "h-px" : "w-px",
          className,
        )}
        {...rest}
      />
    );
  },
);

StepperConnector.displayName = "StepperConnector";

/* ── Exports ───────────────────────────────────── */

export {
  Stepper,
  StepperConnector,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperLabel,
  StepperList,
  type StepperConnectorProps,
  type StepperDescriptionProps,
  type StepperIndicatorProps,
  type StepperItemProps,
  type StepperLabelProps,
  type StepperListProps,
  type StepperProps,
};
```

- [ ] **Step 2: Run tests — verify they pass**

Run: `cd packages/ds && npx vitest run src/components/stepper/stepper.test.tsx`
Expected: All tests PASS.

- [ ] **Step 3: Commit**

```bash
git add packages/ds/src/components/stepper/
git commit -m "feat(ds): add Stepper compound component with orientation + state propagation"
```

---

## Task 6: Stepper — package export + full verification

**Files:**
- Modify: `packages/ds/package.json`

- [ ] **Step 1: Add subpath export to package.json**

Add this entry to the `"exports"` object in `packages/ds/package.json`:

```json
"./stepper": "./src/components/stepper/stepper.tsx"
```

- [ ] **Step 2: Run full checks**

Run: `cd packages/ds && npm run check`
Expected: lint, typecheck, and all tests pass (including both progress-bar and stepper tests).

- [ ] **Step 3: Commit**

```bash
git add packages/ds/package.json
git commit -m "feat(ds): add stepper subpath export"
```

---

## Task 7: Update docs

- [ ] ARCHITECTURE.md — add ProgressBar and Stepper to the component inventory, note the compound pattern for Stepper
- [ ] DECISIONS.md — log decision to use composable parts pattern for Stepper (not a single monolithic component)
- [ ] BACKLOG.md — add items for: (1) restyle app's hand-rolled progress bars to use DS ProgressBar, (2) restyle app's StepIndicator and pipeline to use DS Stepper
- [ ] CLAUDE.md — add ProgressBar and Stepper to the available components list
