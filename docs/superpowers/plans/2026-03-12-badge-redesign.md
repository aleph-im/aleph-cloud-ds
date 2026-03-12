# Badge Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign Badge component with gradient fill/outline modes, icon slots, and Figma-matching typography.

**Architecture:** CVA compound variants with `fill` axis (`solid`/`outline`) x existing `variant` axis. Gradient fills via CSS utility classes in tokens.css. Icon slots as conditional `<span>` wrappers.

**Tech Stack:** React, CVA, Tailwind CSS 4, CSS custom properties, Vitest + Testing Library

**Spec:** `docs/superpowers/specs/2026-03-12-badge-redesign-design.md`

---

## Chunk 1: CSS utilities and component implementation

### Task 1: Add gradient-fill utility classes to tokens.css

**Files:**
- Modify: `packages/ds/src/styles/tokens.css:234` (after `gradient-fill-lime:active`)

- [ ] **Step 1: Add four gradient-fill classes**

Insert after line 234 (after the `.gradient-fill-lime:active` closing brace), before the FX Grain section:

```css
.gradient-fill-success {
  background: var(--gradient-success) border-box;
}

.gradient-fill-warning {
  background: var(--gradient-warning) border-box;
}

.gradient-fill-error {
  background: var(--gradient-error) border-box;
}

.gradient-fill-info {
  background: var(--gradient-info) border-box;
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/ds/src/styles/tokens.css
git commit -m "feat: add gradient-fill utility classes for success, warning, error, info"
```

### Task 2: Write failing tests for the redesigned Badge

**Files:**
- Rewrite: `packages/ds/src/components/badge/badge.test.tsx`

- [ ] **Step 1: Rewrite badge.test.tsx**

```tsx
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- --run packages/ds/src/components/badge/badge.test.tsx`
Expected: Multiple failures — `fill` prop and icon props don't exist yet.

- [ ] **Step 3: Commit failing tests**

```bash
git add packages/ds/src/components/badge/badge.test.tsx
git commit -m "test: add failing tests for badge redesign (fill, icons, typography)"
```

### Task 3: Implement the redesigned Badge component

**Files:**
- Rewrite: `packages/ds/src/components/badge/badge.tsx`

- [ ] **Step 1: Rewrite badge.tsx**

```tsx
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ac/lib/cn";

const badgeVariants = cva(
  [
    "inline-flex items-center justify-center gap-1.5",
    "rounded-md font-heading font-extrabold italic uppercase",
    "whitespace-nowrap select-none",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "",
        success: "",
        warning: "",
        error: "",
        info: "",
      },
      fill: {
        solid: "",
        outline: "border",
      },
      size: {
        sm: "px-3 py-0.5 text-[10px]",
        md: "px-4 py-1 text-xs",
      },
    },
    compoundVariants: [
      // Solid — gradient fills with dark text
      {
        fill: "solid",
        variant: "default",
        className: "gradient-fill-info text-neutral-950 dark:text-white",
      },
      {
        fill: "solid",
        variant: "success",
        className: "gradient-fill-success text-neutral-950",
      },
      {
        fill: "solid",
        variant: "warning",
        className: "gradient-fill-warning text-neutral-950",
      },
      {
        fill: "solid",
        variant: "error",
        className: "gradient-fill-error text-neutral-950",
      },
      {
        fill: "solid",
        variant: "info",
        className: [
          "bg-neutral-100 text-neutral-700",
          "dark:bg-neutral-800 dark:text-neutral-300",
        ].join(" "),
      },
      // Outline — border + subtle bg
      {
        fill: "outline",
        variant: "default",
        className: [
          "border-primary-300 bg-primary-100 text-neutral-950",
          "dark:bg-primary-900/20 dark:text-white",
        ].join(" "),
      },
      {
        fill: "outline",
        variant: "success",
        className: [
          "border-success-400 bg-success-100 text-neutral-950",
          "dark:bg-success-900/20 dark:text-neutral-100",
        ].join(" "),
      },
      {
        fill: "outline",
        variant: "warning",
        className: [
          "border-warning-400 bg-warning-100 text-neutral-950",
          "dark:bg-warning-900/20 dark:text-neutral-100",
        ].join(" "),
      },
      {
        fill: "outline",
        variant: "error",
        className: [
          "border-error-400 bg-error-100 text-neutral-950",
          "dark:bg-error-900/20 dark:text-neutral-100",
        ].join(" "),
      },
      {
        fill: "outline",
        variant: "info",
        className: [
          "border-neutral-300 bg-neutral-100 text-neutral-700",
          "dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
        ].join(" "),
      },
    ],
    defaultVariants: {
      variant: "default",
      fill: "solid",
      size: "md",
    },
  },
);

type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants> & {
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
  };

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { variant, fill, size, iconLeft, iconRight, className, children, ...rest },
    ref,
  ) => {
    const iconSize = size === "sm" ? "size-2.5" : "size-3";
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, fill, size }), className)}
        {...rest}
      >
        {iconLeft && (
          <span className={cn(iconSize, "shrink-0")}>{iconLeft}</span>
        )}
        {children}
        {iconRight && (
          <span className={cn(iconSize, "shrink-0")}>{iconRight}</span>
        )}
      </span>
    );
  },
);

Badge.displayName = "Badge";

export { Badge, badgeVariants, type BadgeProps };
```

- [ ] **Step 2: Run tests to verify they pass**

Run: `npm run test -- --run packages/ds/src/components/badge/badge.test.tsx`
Expected: All tests pass.

- [ ] **Step 3: Run lint and typecheck**

Run: `npm run lint && npm run typecheck`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add packages/ds/src/components/badge/badge.tsx
git commit -m "feat: redesign Badge with fill modes, icon slots, and gradient fills"
```

---

## Chunk 2: Preview page and docs

### Task 4: Update preview page

**Files:**
- Rewrite: `apps/preview/src/app/components/badge/page.tsx`

- [ ] **Step 1: Rewrite badge preview page**

```tsx
"use client";

import { Badge } from "@aleph-front/ds/badge";
import {
  CheckCircle,
  Warning,
  XCircle,
  Info,
} from "@phosphor-icons/react";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

const variants = ["default", "success", "warning", "error", "info"] as const;

export default function BadgePage() {
  return (
    <>
      <PageHeader
        title="Badge"
        description="Semantic labels with gradient fill or outline modes, optional icons, and 2 sizes."
      />

      <DemoSection title="Solid Fill (default)">
        <div className="flex flex-wrap items-center gap-3">
          {variants.map((v) => (
            <Badge key={v} variant={v}>
              {v}
            </Badge>
          ))}
        </div>
      </DemoSection>

      <DemoSection title="Outline Fill">
        <div className="flex flex-wrap items-center gap-3">
          {variants.map((v) => (
            <Badge key={v} variant={v} fill="outline">
              {v}
            </Badge>
          ))}
        </div>
      </DemoSection>

      <DemoSection title="With Icons">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="success" iconLeft={<CheckCircle size={12} weight="bold" />}>
            Healthy
          </Badge>
          <Badge variant="warning" iconLeft={<Warning size={12} weight="bold" />}>
            Degraded
          </Badge>
          <Badge variant="error" iconRight={<XCircle size={12} weight="bold" />}>
            Offline
          </Badge>
          <Badge variant="default" iconLeft={<Info size={12} weight="bold" />}>
            Scheduled
          </Badge>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Badge
            variant="success"
            fill="outline"
            iconLeft={<CheckCircle size={12} weight="bold" />}
          >
            Healthy
          </Badge>
          <Badge
            variant="warning"
            fill="outline"
            iconLeft={<Warning size={12} weight="bold" />}
          >
            Degraded
          </Badge>
          <Badge
            variant="error"
            fill="outline"
            iconRight={<XCircle size={12} weight="bold" />}
          >
            Offline
          </Badge>
        </div>
      </DemoSection>

      <DemoSection title="Sizes">
        <div className="flex flex-wrap items-center gap-3">
          <Badge size="sm">Small</Badge>
          <Badge size="md">Medium</Badge>
          <Badge size="sm" iconLeft={<CheckCircle size={10} weight="bold" />}>
            Small + icon
          </Badge>
          <Badge size="md" iconLeft={<CheckCircle size={12} weight="bold" />}>
            Medium + icon
          </Badge>
        </div>
      </DemoSection>

      <DemoSection title="Real-World Examples">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="success">Active</Badge>
          <Badge variant="warning">In Progress</Badge>
          <Badge variant="error">Failed</Badge>
          <Badge variant="default">Informational</Badge>
          <Badge variant="info">3 VMs</Badge>
        </div>
      </DemoSection>
    </>
  );
}
```

- [ ] **Step 2: Run build to verify no errors**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add apps/preview/src/app/components/badge/page.tsx
git commit -m "feat(preview): update badge page with fill modes and icon examples"
```

### Task 5: Update DESIGN-SYSTEM.md

**Files:**
- Modify: `docs/DESIGN-SYSTEM.md:917-948`

- [ ] **Step 1: Replace badge section (lines 917-949)**

Replace the entire Badge section (from `### Badge` up to but not including `### Card`) with:

```markdown
### Badge

Semantic label for status, counts, and categories. Two fill modes (solid gradient, outline), optional icon slots, uppercase heading font.

```tsx
import { Badge } from "@aleph-front/ds/badge";
```

#### Fill Modes

**Solid (default):** gradient background with dark text.

```tsx
<Badge variant="default">Informational</Badge>  {/* gradient-fill-info */}
<Badge variant="success">Healthy</Badge>         {/* gradient-fill-success */}
<Badge variant="warning">In Progress</Badge>     {/* gradient-fill-warning */}
<Badge variant="error">Failed</Badge>            {/* gradient-fill-error */}
<Badge variant="info">3 VMs</Badge>              {/* neutral solid fill */}
```

**Outline:** colored border with subtle background.

```tsx
<Badge fill="outline" variant="success">Healthy</Badge>
<Badge fill="outline" variant="error">Failed</Badge>
```

#### Icons

```tsx
<Badge variant="success" iconLeft={<CheckCircle size={12} weight="bold" />}>Active</Badge>
<Badge variant="error" iconRight={<XCircle size={12} weight="bold" />}>Offline</Badge>
```

Icon wrappers scale with badge size: 10px (`size-2.5`) for sm, 12px (`size-3`) for md.

#### Sizes

```tsx
<Badge size="sm">Small</Badge>  {/* px-3, text-[10px] */}
<Badge size="md">Medium</Badge> {/* px-4, text-xs (default) */}
```

#### Custom Composition with badgeVariants

```tsx
import { badgeVariants } from "@aleph-front/ds/badge";

<span className={badgeVariants({ fill: "outline", variant: "success", size: "sm" })}>Active</span>
```

**Visual style:** `font-heading font-extrabold italic uppercase`, `rounded-md` (6px). Solid fill uses gradient CSS utility classes (`gradient-fill-success`, etc.) from tokens.css. Outline fill uses `border` + token-scale border colors + subtle `/20` opacity backgrounds in dark mode. `default` variant uses `dark:text-white` for contrast on the dark `gradient-info` endpoint.
```

- [ ] **Step 2: Commit**

```bash
git add docs/DESIGN-SYSTEM.md
git commit -m "docs: update badge section for fill modes, icons, and gradient fills"
```

### Task 6: Update docs

- [ ] **Step 1: Update CLAUDE.md Current Features list**

In `CLAUDE.md`, find the Badge line and replace with:
```
- Badge component with 5 semantic variants (default/success/warning/error/info), 2 fill modes (solid gradient/outline), 2 sizes, optional iconLeft/iconRight slots, uppercase heading font
```

- [ ] **Step 2: Update DESIGN-SYSTEM.md gradient utilities section**

In `docs/DESIGN-SYSTEM.md`, find the gradient utilities section and add the four new gradient-fill classes to the documentation alongside `gradient-fill-main` and `gradient-fill-lime`.

- [ ] **Step 3: Log decision in DECISIONS.md**

Add a decision entry for the badge redesign noting: CVA compound variants approach, `fill` prop naming (avoids HTML `type` collision), `default` variant mapped to `gradient-fill-info`, and the breaking visual change.

- [ ] **Step 4: Update BACKLOG.md**

Check if any backlog items relate to the badge redesign and move to Completed. Add any deferred ideas discovered during implementation.

- [ ] **Step 5: Commit**

```bash
git add CLAUDE.md docs/DESIGN-SYSTEM.md docs/DECISIONS.md docs/BACKLOG.md
git commit -m "docs: update project docs for badge redesign"
```

### Task 7: Final verification

- [ ] **Step 1: Run full check suite**

Run: `npm run check`
Expected: lint + typecheck + test all pass.

- [ ] **Step 2: Visual check**

Run: `npm run dev`
Navigate to `/components/badge` and verify:
- Solid variants show gradient fills
- Outline variants show borders with subtle backgrounds
- Icons render at correct sizes
- Both sizes look proportional
- Dark mode works correctly (toggle theme)
