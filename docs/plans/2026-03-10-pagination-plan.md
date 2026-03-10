# Pagination Component Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a controlled Pagination component with configurable sibling count, first/last jump buttons, and ellipsis logic.

**Architecture:** Pure `buildPageRange()` function for page number calculation (easy to test in isolation), wrapped by a `Pagination` `forwardRef` component that renders nav buttons and page buttons. No CVA — styling is direct Tailwind classes with conditional logic for active/disabled states.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, Phosphor Icons, Vitest + Testing Library

**Spec:** `docs/plans/2026-03-10-pagination-design.md`

---

## File Structure

| File | Responsibility |
|------|---------------|
| `packages/ds/src/components/pagination/pagination.tsx` | `buildPageRange()` function + `Pagination` component |
| `packages/ds/src/components/pagination/pagination.test.tsx` | Unit tests for range logic + component behavior/a11y |
| `apps/preview/src/app/components/pagination/page.tsx` | Preview page with interactive demos |

---

## Task 1: buildPageRange pure function (TDD)

**Files:**
- Create: `packages/ds/src/components/pagination/pagination.test.tsx`
- Create: `packages/ds/src/components/pagination/pagination.tsx`

The range function is the core logic. It returns an array of `number | "ellipsis"` items representing what to render.

- [ ] **Step 1: Write failing tests for buildPageRange**

```tsx
// packages/ds/src/components/pagination/pagination.test.tsx
import { describe, expect, it } from "vitest";
import { buildPageRange } from "./pagination";

describe("buildPageRange", () => {
  it("returns all pages when totalPages <= siblingCount * 2 + 3", () => {
    // 5 pages, siblingCount=1, showFirstLast=true → all fit: [1,2,3,4,5]
    expect(buildPageRange({ page: 3, totalPages: 5, siblingCount: 1, showFirstLast: true }))
      .toEqual([1, 2, 3, 4, 5]);
  });

  it("shows right ellipsis when current is near start", () => {
    // page=2, totalPages=10, siblingCount=1, showFirstLast=true
    // → [1, 2, 3, "ellipsis", 10]
    expect(buildPageRange({ page: 2, totalPages: 10, siblingCount: 1, showFirstLast: true }))
      .toEqual([1, 2, 3, "ellipsis", 10]);
  });

  it("shows left ellipsis when current is near end", () => {
    // page=9, totalPages=10, siblingCount=1, showFirstLast=true
    // → [1, "ellipsis", 8, 9, 10]
    expect(buildPageRange({ page: 9, totalPages: 10, siblingCount: 1, showFirstLast: true }))
      .toEqual([1, "ellipsis", 8, 9, 10]);
  });

  it("shows both ellipses when current is in the middle", () => {
    // page=5, totalPages=10, siblingCount=1, showFirstLast=true
    // → [1, "ellipsis", 4, 5, 6, "ellipsis", 10]
    expect(buildPageRange({ page: 5, totalPages: 10, siblingCount: 1, showFirstLast: true }))
      .toEqual([1, "ellipsis", 4, 5, 6, "ellipsis", 10]);
  });

  it("shows page instead of ellipsis when gap is exactly 1", () => {
    // page=3, totalPages=10, siblingCount=1 → left gap is 1 (between 1 and 2), no ellipsis
    // → [1, 2, 3, 4, "ellipsis", 10]
    expect(buildPageRange({ page: 3, totalPages: 10, siblingCount: 1, showFirstLast: true }))
      .toEqual([1, 2, 3, 4, "ellipsis", 10]);
  });

  it("works with siblingCount=0 and showFirstLast=false (minimal)", () => {
    // → [3] (just the current page)
    expect(buildPageRange({ page: 3, totalPages: 10, siblingCount: 0, showFirstLast: false }))
      .toEqual([3]);
  });

  it("works with siblingCount=1 and showFirstLast=false", () => {
    // → [2, 3, 4]
    expect(buildPageRange({ page: 3, totalPages: 10, siblingCount: 1, showFirstLast: false }))
      .toEqual([2, 3, 4]);
  });

  it("works with siblingCount=2 and showFirstLast=true (desktop max)", () => {
    // page=5, totalPages=10, siblingCount=2
    // → [1, "ellipsis", 3, 4, 5, 6, 7, "ellipsis", 10]
    expect(buildPageRange({ page: 5, totalPages: 10, siblingCount: 2, showFirstLast: true }))
      .toEqual([1, "ellipsis", 3, 4, 5, 6, 7, "ellipsis", 10]);
  });

  it("clamps siblings at page boundaries", () => {
    // page=1, totalPages=10, siblingCount=1, showFirstLast=true
    // → [1, 2, "ellipsis", 10]
    expect(buildPageRange({ page: 1, totalPages: 10, siblingCount: 1, showFirstLast: true }))
      .toEqual([1, 2, "ellipsis", 10]);
  });

  it("handles single page", () => {
    expect(buildPageRange({ page: 1, totalPages: 1, siblingCount: 1, showFirstLast: true }))
      .toEqual([1]);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd packages/ds && npx vitest run src/components/pagination/pagination.test.tsx`
Expected: FAIL — `buildPageRange` not found

- [ ] **Step 3: Implement buildPageRange**

```tsx
// packages/ds/src/components/pagination/pagination.tsx

type PageItem = number | "ellipsis";

type BuildPageRangeArgs = {
  page: number;
  totalPages: number;
  siblingCount: number;
  showFirstLast: boolean;
};

function buildPageRange({
  page,
  totalPages,
  siblingCount,
  showFirstLast,
}: BuildPageRangeArgs): PageItem[] {
  const leftSibling = Math.max(page - siblingCount, 1);
  const rightSibling = Math.min(page + siblingCount, totalPages);

  const items: PageItem[] = [];

  if (showFirstLast) {
    const showLeftEllipsis = leftSibling > 3;
    const showRightEllipsis = rightSibling < totalPages - 2;

    // Left anchor
    items.push(1);

    if (showLeftEllipsis) {
      items.push("ellipsis");
    } else {
      // Fill pages between 1 and leftSibling
      for (let i = 2; i < leftSibling; i++) {
        items.push(i);
      }
    }

    // Sibling range (skip 1 if already added, skip totalPages — added later)
    for (let i = leftSibling; i <= rightSibling; i++) {
      if (i !== 1 && i !== totalPages) {
        items.push(i);
      }
    }

    if (showRightEllipsis) {
      items.push("ellipsis");
    } else {
      // Fill pages between rightSibling and totalPages
      for (let i = rightSibling + 1; i < totalPages; i++) {
        items.push(i);
      }
    }

    // Right anchor
    if (totalPages > 1) {
      items.push(totalPages);
    }
  } else {
    // No first/last — just the sibling range
    for (let i = leftSibling; i <= rightSibling; i++) {
      items.push(i);
    }
  }

  return items;
}

export { buildPageRange, type PageItem };
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd packages/ds && npx vitest run src/components/pagination/pagination.test.tsx`
Expected: All 10 tests PASS

- [ ] **Step 5: Commit**

```bash
git add packages/ds/src/components/pagination/
git commit -m "feat(pagination): add buildPageRange pure function with tests"
```

---

## Task 2: Pagination component (TDD)

**Files:**
- Modify: `packages/ds/src/components/pagination/pagination.tsx`
- Modify: `packages/ds/src/components/pagination/pagination.test.tsx`

- [ ] **Step 1: Write failing tests for Pagination component**

Append to the existing test file:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "./pagination";

describe("Pagination", () => {
  it("renders a nav with aria-label", () => {
    render(<Pagination page={1} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeTruthy();
  });

  it("marks the active page with aria-current", () => {
    render(<Pagination page={3} totalPages={5} onPageChange={() => {}} />);
    const active = screen.getByRole("button", { name: "Page 3" });
    expect(active).toHaveAttribute("aria-current", "page");
  });

  it("does not mark inactive pages with aria-current", () => {
    render(<Pagination page={3} totalPages={5} onPageChange={() => {}} />);
    const inactive = screen.getByRole("button", { name: "Page 1" });
    expect(inactive).not.toHaveAttribute("aria-current");
  });

  it("calls onPageChange when clicking a page button", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={3} totalPages={10} onPageChange={onPageChange} />);

    await user.click(screen.getByRole("button", { name: "Page 4" }));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("calls onPageChange when clicking next", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={3} totalPages={10} onPageChange={onPageChange} />);

    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("calls onPageChange when clicking previous", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={3} totalPages={10} onPageChange={onPageChange} />);

    await user.click(screen.getByRole("button", { name: "Previous page" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("disables previous and first on page 1", () => {
    render(<Pagination page={1} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Previous page" })).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByRole("button", { name: "First page" })).toHaveAttribute("aria-disabled", "true");
  });

  it("disables next and last on last page", () => {
    render(<Pagination page={5} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Next page" })).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByRole("button", { name: "Last page" })).toHaveAttribute("aria-disabled", "true");
  });

  it("does not call onPageChange when clicking disabled previous", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={1} totalPages={5} onPageChange={onPageChange} />);

    await user.click(screen.getByRole("button", { name: "Previous page" }));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("hides first/last buttons when showFirstLast is false", () => {
    render(<Pagination page={3} totalPages={10} onPageChange={() => {}} showFirstLast={false} />);
    expect(screen.queryByRole("button", { name: "First page" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Last page" })).toBeNull();
  });

  it("renders ellipsis as non-interactive spans", () => {
    render(<Pagination page={5} totalPages={10} onPageChange={() => {}} />);
    const ellipses = screen.getAllByText("…");
    for (const el of ellipses) {
      expect(el.tagName).not.toBe("BUTTON");
    }
  });

  it("forwards ref to the nav element", () => {
    const ref = { current: null } as React.RefObject<HTMLElement | null>;
    render(<Pagination ref={ref} page={1} totalPages={5} onPageChange={() => {}} />);
    expect(ref.current?.tagName).toBe("NAV");
  });

  it("merges custom className onto the nav", () => {
    render(<Pagination page={1} totalPages={5} onPageChange={() => {}} className="custom" />);
    const nav = screen.getByRole("navigation", { name: "Pagination" });
    expect(nav.className).toContain("custom");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd packages/ds && npx vitest run src/components/pagination/pagination.test.tsx`
Expected: FAIL — `Pagination` not exported

- [ ] **Step 3: Implement the Pagination component**

Add to `packages/ds/src/components/pagination/pagination.tsx` below the existing `buildPageRange`:

```tsx
import { forwardRef, type HTMLAttributes } from "react";
import {
  CaretDoubleLeft,
  CaretDoubleRight,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import { cn } from "@ac/lib/cn";

type PaginationProps = Omit<HTMLAttributes<HTMLElement>, "onChange"> & {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  showFirstLast?: boolean;
};

const NAV_BUTTON = [
  "inline-flex items-center justify-center",
  "size-8 rounded-full",
  "text-primary-600 dark:text-primary-400",
  "hover:bg-primary-100 dark:hover:bg-primary-900",
  "transition-colors cursor-pointer",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
].join(" ");

const NAV_DISABLED = "opacity-50 pointer-events-none";

const PAGE_BUTTON = [
  "inline-flex items-center justify-center",
  "size-8 rounded-full",
  "font-heading font-bold text-lg",
  "text-primary-600 dark:text-primary-400",
  "hover:bg-primary-100 dark:hover:bg-primary-900",
  "transition-colors cursor-pointer",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
].join(" ");

const PAGE_ACTIVE = [
  "bg-primary-600 text-white dark:bg-primary-800",
  "hover:bg-primary-600 dark:hover:bg-primary-800",
].join(" ");

const Pagination = forwardRef<HTMLElement, PaginationProps>(
  (
    {
      page,
      totalPages,
      onPageChange,
      siblingCount = 1,
      showFirstLast = true,
      className,
      ...rest
    },
    ref,
  ) => {
    const items = buildPageRange({ page, totalPages, siblingCount, showFirstLast });

    const isFirst = page <= 1;
    const isLast = page >= totalPages;

    return (
      <nav
        ref={ref}
        aria-label="Pagination"
        className={cn("flex items-center gap-4", className)}
        {...rest}
      >
        {showFirstLast && (
          <button
            type="button"
            className={cn(NAV_BUTTON, isFirst && NAV_DISABLED)}
            aria-label="First page"
            aria-disabled={isFirst || undefined}
            onClick={isFirst ? undefined : () => onPageChange(1)}
          >
            <CaretDoubleLeft weight="bold" className="size-4" aria-hidden="true" />
          </button>
        )}

        <button
          type="button"
          className={cn(NAV_BUTTON, isFirst && NAV_DISABLED)}
          aria-label="Previous page"
          aria-disabled={isFirst || undefined}
          onClick={isFirst ? undefined : () => onPageChange(page - 1)}
        >
          <CaretLeft weight="bold" className="size-4" aria-hidden="true" />
        </button>

        {items.map((item, i) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${i}`}
              className="inline-flex items-center justify-center size-8 font-heading font-bold text-lg text-primary-600 dark:text-primary-400 select-none"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={cn(PAGE_BUTTON, item === page && PAGE_ACTIVE)}
              aria-label={`Page ${item}`}
              aria-current={item === page ? "page" : undefined}
              onClick={item === page ? undefined : () => onPageChange(item)}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          className={cn(NAV_BUTTON, isLast && NAV_DISABLED)}
          aria-label="Next page"
          aria-disabled={isLast || undefined}
          onClick={isLast ? undefined : () => onPageChange(page + 1)}
        >
          <CaretRight weight="bold" className="size-4" aria-hidden="true" />
        </button>

        {showFirstLast && (
          <button
            type="button"
            className={cn(NAV_BUTTON, isLast && NAV_DISABLED)}
            aria-label="Last page"
            aria-disabled={isLast || undefined}
            onClick={isLast ? undefined : () => onPageChange(totalPages)}
          >
            <CaretDoubleRight weight="bold" className="size-4" aria-hidden="true" />
          </button>
        )}
      </nav>
    );
  },
);

Pagination.displayName = "Pagination";

export { Pagination, type PaginationProps };
```

Note: The imports at the top of the file need to be consolidated — move the `import` statements to the top of the file. The final file should have all imports at the top, then `buildPageRange`, then the component.

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd packages/ds && npx vitest run src/components/pagination/pagination.test.tsx`
Expected: All tests PASS (both buildPageRange and Pagination suites)

- [ ] **Step 5: Commit**

```bash
git add packages/ds/src/components/pagination/
git commit -m "feat(pagination): add Pagination component with a11y"
```

---

## Task 3: Package export + preview page

**Files:**
- Modify: `packages/ds/package.json` — add subpath export
- Create: `apps/preview/src/app/components/pagination/page.tsx` — preview page
- Modify: `apps/preview/src/components/sidebar.tsx` — add nav entry

- [ ] **Step 1: Add subpath export to package.json**

Add to the `"exports"` object in `packages/ds/package.json`:

```json
"./pagination": "./src/components/pagination/pagination.tsx",
```

- [ ] **Step 2: Create preview page**

```tsx
// apps/preview/src/app/components/pagination/page.tsx
"use client";

import { useState } from "react";
import { Pagination } from "@aleph-front/ds/pagination";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

export default function PaginationPage() {
  const [page1, setPage1] = useState(3);
  const [page2, setPage2] = useState(5);
  const [page3, setPage3] = useState(3);
  const [page4, setPage4] = useState(3);

  return (
    <>
      <PageHeader
        title="Pagination"
        description="Controlled pagination with configurable sibling count and first/last jump buttons."
      />
      <DemoSection title="Desktop Max (siblingCount=2, showFirstLast)">
        <Pagination
          page={page1}
          totalPages={10}
          onPageChange={setPage1}
          siblingCount={2}
        />
        <p className="mt-2 text-sm text-muted-foreground">
          Page {page1} of 10
        </p>
      </DemoSection>
      <DemoSection title="Default (siblingCount=1, showFirstLast)">
        <Pagination
          page={page2}
          totalPages={20}
          onPageChange={setPage2}
        />
        <p className="mt-2 text-sm text-muted-foreground">
          Page {page2} of 20
        </p>
      </DemoSection>
      <DemoSection title="Compact (siblingCount=1, no firstLast)">
        <Pagination
          page={page3}
          totalPages={10}
          onPageChange={setPage3}
          showFirstLast={false}
        />
        <p className="mt-2 text-sm text-muted-foreground">
          Page {page3} of 10
        </p>
      </DemoSection>
      <DemoSection title="Minimal (siblingCount=0, no firstLast)">
        <Pagination
          page={page4}
          totalPages={10}
          onPageChange={setPage4}
          siblingCount={0}
          showFirstLast={false}
        />
        <p className="mt-2 text-sm text-muted-foreground">
          Page {page4} of 10
        </p>
      </DemoSection>
    </>
  );
}
```

- [ ] **Step 3: Add sidebar nav entry**

In `apps/preview/src/components/sidebar.tsx`, add `Pagination` to the Components section items array, in alphabetical order after `CopyableText`:

```tsx
{ label: "Pagination", href: "/components/pagination" },
```

- [ ] **Step 4: Run checks**

Run: `npm run check` from the repo root.
Expected: lint, typecheck, and tests all pass.

- [ ] **Step 5: Visual verification**

Run: `npm run dev` and open the Pagination preview page.
Ask the user to verify: all 4 demo variants render correctly, clicking pages updates state, disabled arrows at boundaries, ellipsis appears in the right places. Check both light and dark themes.

- [ ] **Step 6: Commit**

```bash
git add packages/ds/package.json apps/preview/src/app/components/pagination/ apps/preview/src/components/sidebar.tsx
git commit -m "feat(pagination): add subpath export and preview page"
```

---

## Task 4: Update docs

- [ ] **DESIGN-SYSTEM.md** — add Pagination component entry with props, usage examples, and variant mappings
- [ ] **ARCHITECTURE.md** — no new patterns introduced (uses existing forwardRef + Tailwind pattern)
- [ ] **DECISIONS.md** — log design decisions: controlled API, composable `siblingCount`+`showFirstLast` over named variants, ellipsis logic, disabled over hidden nav at boundaries
- [ ] **BACKLOG.md** — move Pagination from open to completed
- [ ] **CLAUDE.md** — add Pagination to Current Features list, update preview page count (27 → 28)

- [ ] **Commit docs**

```bash
git add docs/ CLAUDE.md
git commit -m "docs: add Pagination component documentation"
```
