# Breadcrumb Component Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a composable Breadcrumb navigation component with semantic HTML, `asChild` support, and hover states matching the Figma design.

**Architecture:** Six composable parts (`Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbSeparator`, `BreadcrumbPage`) exported individually. No CVA — no variants. `BreadcrumbLink` uses Radix `Slot` for `asChild`. All parts use `forwardRef` + `cn()`.

**Tech Stack:** React 19, Radix UI (Slot only), Tailwind CSS 4, Vitest + Testing Library

---

### Task 1: Write tests for Breadcrumb

**Files:**
- Create: `packages/ds/src/components/breadcrumb/breadcrumb.test.tsx`

- [ ] **Step 1: Write all tests (they will fail until implementation exists)**

```tsx
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";

function TestBreadcrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/nodes">Nodes</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Node Details</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

describe("Breadcrumb", () => {
  it("renders nav with aria-label", () => {
    render(<TestBreadcrumb />);
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveAttribute("aria-label", "Breadcrumb");
  });

  it("allows custom aria-label", () => {
    render(
      <Breadcrumb aria-label="Custom trail">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Home</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    expect(screen.getByRole("navigation")).toHaveAttribute(
      "aria-label",
      "Custom trail",
    );
  });

  it("renders ol > li structure", () => {
    render(<TestBreadcrumb />);
    const nav = screen.getByRole("navigation");
    const list = within(nav).getByRole("list");
    expect(list.tagName).toBe("OL");
    const items = within(list).getAllByRole("listitem");
    expect(items.length).toBeGreaterThanOrEqual(3);
  });

  it("renders links with href", () => {
    render(<TestBreadcrumb />);
    const dashboardLink = screen.getByRole("link", { name: "Dashboard" });
    expect(dashboardLink).toHaveAttribute("href", "/dashboard");
    const nodesLink = screen.getByRole("link", { name: "Nodes" });
    expect(nodesLink).toHaveAttribute("href", "/nodes");
  });

  it("renders current page with aria-current", () => {
    render(<TestBreadcrumb />);
    const page = screen.getByText("Node Details");
    expect(page).toHaveAttribute("aria-current", "page");
    expect(page.tagName).toBe("SPAN");
  });

  it("renders separator with aria-hidden", () => {
    render(<TestBreadcrumb />);
    const separators = screen
      .getAllByRole("listitem", { hidden: true })
      .filter((li) => li.getAttribute("aria-hidden") === "true");
    expect(separators).toHaveLength(2);
    expect(separators[0]!.textContent).toBe("/");
  });

  it("renders custom separator children", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <span data-testid="custom-sep">&gt;</span>
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Page</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    expect(screen.getByTestId("custom-sep")).toBeTruthy();
  });

  it("supports asChild on BreadcrumbLink", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <a href="/custom" data-testid="custom-link">
                Custom
              </a>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    const link = screen.getByTestId("custom-link");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/custom");
  });

  it("forwards className on Breadcrumb", () => {
    render(
      <Breadcrumb className="custom-nav" data-testid="bc-nav">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Home</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    expect(screen.getByTestId("bc-nav").className).toContain("custom-nav");
  });

  it("forwards className on BreadcrumbList", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList className="custom-list" data-testid="bc-list">
          <BreadcrumbItem>
            <BreadcrumbPage>Home</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    expect(screen.getByTestId("bc-list").className).toContain("custom-list");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd packages/ds && npx vitest run src/components/breadcrumb/breadcrumb.test.tsx`
Expected: FAIL — module `./breadcrumb` not found

---

### Task 2: Implement Breadcrumb component

**Files:**
- Create: `packages/ds/src/components/breadcrumb/breadcrumb.tsx`

- [ ] **Step 3: Write the component**

```tsx
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Slot } from "radix-ui";
import { cn } from "@ac/lib/cn";

/* ── Breadcrumb (nav wrapper) ────────────────── */

const Breadcrumb = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  ({ className, ...rest }, ref) => (
    <nav
      ref={ref}
      aria-label="Breadcrumb"
      className={cn(className)}
      {...rest}
    />
  ),
);

Breadcrumb.displayName = "Breadcrumb";

/* ── BreadcrumbList (ol) ─────────────────────── */

const BreadcrumbList = forwardRef<
  HTMLOListElement,
  HTMLAttributes<HTMLOListElement>
>(({ className, ...rest }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-1",
      "font-heading font-extrabold italic uppercase text-xs",
      className,
    )}
    {...rest}
  />
));

BreadcrumbList.displayName = "BreadcrumbList";

/* ── BreadcrumbItem (li) ─────────────────────── */

const BreadcrumbItem = forwardRef<
  HTMLLIElement,
  HTMLAttributes<HTMLLIElement>
>(({ className, ...rest }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center", className)}
    {...rest}
  />
));

BreadcrumbItem.displayName = "BreadcrumbItem";

/* ── BreadcrumbLink (a, with asChild) ────────── */

type BreadcrumbLinkProps = HTMLAttributes<HTMLAnchorElement> & {
  asChild?: boolean;
  href?: string;
};

const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ asChild, className, ...rest }, ref) => {
    const Comp = asChild ? Slot.default : "a";
    return (
      <Comp
        ref={ref}
        className={cn(
          "text-foreground",
          "transition-colors duration-150",
          "hover:text-primary-600 dark:hover:text-primary-400",
          "motion-reduce:transition-none",
          className,
        )}
        {...rest}
      />
    );
  },
);

BreadcrumbLink.displayName = "BreadcrumbLink";

/* ── BreadcrumbSeparator (li, visual only) ───── */

type BreadcrumbSeparatorProps = HTMLAttributes<HTMLLIElement> & {
  children?: ReactNode;
};

const BreadcrumbSeparator = forwardRef<
  HTMLLIElement,
  BreadcrumbSeparatorProps
>(({ children, className, ...rest }, ref) => (
  <li
    ref={ref}
    role="presentation"
    aria-hidden="true"
    className={cn("text-muted", className)}
    {...rest}
  >
    {children ?? "/"}
  </li>
));

BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

/* ── BreadcrumbPage (current page) ───────────── */

const BreadcrumbPage = forwardRef<
  HTMLSpanElement,
  HTMLAttributes<HTMLSpanElement>
>(({ className, ...rest }, ref) => (
  <span
    ref={ref}
    aria-current="page"
    className={cn("text-muted", className)}
    {...rest}
  />
));

BreadcrumbPage.displayName = "BreadcrumbPage";

/* ── Exports ─────────────────────────────────── */

export {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  type BreadcrumbLinkProps,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
```

Note on Radix Slot import: `radix-ui` re-exports Slot. The import is `import { Slot } from "radix-ui"` and usage is `Slot.default` for the component. If this doesn't work at test time, try `import { Slot } from "@radix-ui/react-slot"` — but check radix-ui v1.4.3 exports first.

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd packages/ds && npx vitest run src/components/breadcrumb/breadcrumb.test.tsx`
Expected: All 9 tests PASS

- [ ] **Step 5: Fix any issues**

If the `Slot` import doesn't resolve correctly, check how other components import from `radix-ui` (e.g., `import { Tooltip as TooltipPrimitive } from "radix-ui"` in tooltip.tsx). Radix UI v1.4.3 uses namespace imports — `Slot` may need `Slot.Root` or a direct import.

- [ ] **Step 6: Commit**

```bash
git add packages/ds/src/components/breadcrumb/
git commit -m "feat: add Breadcrumb component with composable API and asChild support"
```

---

### Task 3: Add subpath export

**Files:**
- Modify: `packages/ds/package.json` — add `"./breadcrumb"` export

- [ ] **Step 7: Add export entry**

In `packages/ds/package.json`, add to the `"exports"` object (alphabetical):

```json
"./breadcrumb": "./src/components/breadcrumb/breadcrumb.tsx",
```

Place it after `"./badge"` and before `"./button"`.

- [ ] **Step 8: Commit**

```bash
git add packages/ds/package.json
git commit -m "chore: add breadcrumb subpath export"
```

---

### Task 4: Build preview page

**Files:**
- Create: `apps/preview/src/app/components/breadcrumb/page.tsx`
- Modify: `apps/preview/src/components/sidebar.tsx` — add nav entry

- [ ] **Step 9: Create preview page**

```tsx
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@aleph-front/ds/breadcrumb";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

export default function BreadcrumbPreviewPage() {
  return (
    <>
      <PageHeader
        title="Breadcrumb"
        description="Navigational breadcrumb trail with composable parts, asChild support for framework routing, and accessible markup."
      />

      <DemoSection title="Default">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Nodes</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Node Details</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </DemoSection>

      <DemoSection title="Single item (current page only)">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </DemoSection>

      <DemoSection title="Deep nesting">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Settings</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Account</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Security</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Two-Factor Auth</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </DemoSection>

      <DemoSection title="Custom separator">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>&gt;</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Nodes</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>&gt;</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Details</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </DemoSection>
    </>
  );
}
```

- [ ] **Step 10: Add sidebar entry**

In `apps/preview/src/components/sidebar.tsx`, add `{ label: "Breadcrumb", href: "/components/breadcrumb" }` to the Components section items array, after "Badge" (alphabetical order).

- [ ] **Step 11: Commit**

```bash
git add apps/preview/src/app/components/breadcrumb/ apps/preview/src/components/sidebar.tsx
git commit -m "feat: add Breadcrumb preview page and sidebar entry"
```

---

### Task 5: Run full checks

- [ ] **Step 12: Run project checks**

Run: `npm run check` (from repo root)
Expected: lint, typecheck, and all tests pass

- [ ] **Step 13: Fix any issues**

If typecheck fails on the Slot import, investigate the correct import path from `radix-ui` v1.4.3. Check: `node -e "const r = require('radix-ui'); console.log(Object.keys(r).filter(k => k.includes('Slot')))"`.

---

### Task 6: Update docs

- [ ] **Step 14: Update docs**

- [ ] DESIGN-SYSTEM.md — add Breadcrumb component with usage example, parts table, styling notes
- [ ] ARCHITECTURE.md — no new patterns (uses existing composable re-export pattern)
- [ ] DECISIONS.md — log decision: composable API, `asChild` via Radix Slot, `text-xs` over Figma's 10px, `/` separator, no CVA
- [ ] BACKLOG.md — move Breadcrumb to Completed section
- [ ] CLAUDE.md — add Breadcrumb to Current Features list, update preview page count

- [ ] **Step 15: Commit**

```bash
git add docs/ CLAUDE.md
git commit -m "docs: add Breadcrumb component documentation"
```
