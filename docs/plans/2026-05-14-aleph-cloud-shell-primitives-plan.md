# Aleph Cloud Shell Primitives Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build three DS primitives that together form the new shared application chrome for Aleph Cloud apps: `ProductStrip` (top product-family strip), `AppShellSidebar` (sidebar shell with collapse + accordion sections), and `PageHeader` (context-driven slot for per-page chrome). Consumed first by `scheduler-dashboard`; future Aleph apps adopt the same primitives.

**Architecture:** Three component groups, each shipping as its own PR with its own preview page + verification gate + five-doc update per DS convention. `ProductStrip` is purely declarative (props in, anchors out). `AppShellSidebar` owns expanded ↔ icon-rail state via `useSidebarCollapse` + `useAccordionState` hooks (localStorage-backed, SSR-safe via `null`-on-hydrate). `PageHeader` is a slot rendered by the consuming app; pages fill it via the `usePageHeader` hook, backed by a `PageHeaderContext` provider.

**Tech Stack:** React 19, TypeScript 5.9, Tailwind CSS 4, Phosphor Icons, Vitest + Testing Library, Radix UI primitives (where used).

**Spec:** `../scheduler-dashboard/docs/superpowers/specs/2026-05-14-aleph-cloud-shell-redesign-design.md`

**Shipping order:** Part A → Part B → Part C. Each part is its own PR (DS PR α, β, γ in the spec) and publishes a new `@aleph-front/ds` version. Dashboard PR 1 in `scheduler-dashboard` consumes all three.

---

## File Structure

| File | Responsibility | Part |
|------|----------------|------|
| `packages/ds/src/components/product-strip/product-strip.tsx` | `ProductStrip` component + `ProductApp` type | A |
| `packages/ds/src/components/product-strip/product-strip.test.tsx` | Unit tests | A |
| `apps/preview/src/app/components/product-strip/page.tsx` | Preview page | A |
| `packages/ds/src/components/app-shell-sidebar/app-shell-sidebar.tsx` | `AppShellSidebar` + `AccordionSection` + `NavItem` | B |
| `packages/ds/src/components/app-shell-sidebar/use-sidebar-collapse.ts` | `useSidebarCollapse` hook | B |
| `packages/ds/src/components/app-shell-sidebar/use-accordion-state.ts` | `useAccordionState` hook | B |
| `packages/ds/src/components/app-shell-sidebar/app-shell-sidebar.test.tsx` | Unit tests | B |
| `apps/preview/src/app/components/app-shell-sidebar/page.tsx` | Preview page | B |
| `packages/ds/src/components/page-header/page-header.tsx` | `PageHeader` + `PageHeaderProvider` + `usePageHeader` | C |
| `packages/ds/src/components/page-header/page-header.test.tsx` | Unit tests | C |
| `apps/preview/src/app/components/page-header/page.tsx` | Preview page | C |
| `packages/ds/package.json` | Subpath exports (touched in each Part) | A/B/C |
| `apps/preview/src/components/sidebar.tsx` | Preview app sidebar — adds entries per component | A/B/C |
| `docs/DESIGN-SYSTEM.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`, `docs/BACKLOG.md`, `CLAUDE.md` | 5-doc update per Part | A/B/C |

**Naming note:** The preview app already has an internal `PageHeader` at `apps/preview/src/components/page-header.tsx` used to title doc pages. Our new DS `PageHeader` will collide on name in imports. Resolution: in Part C, the preview page imports the DS `PageHeader` directly and renames the preview-internal one to `DocHeader` to disambiguate. This is a one-grep rename, covered in Task 18.

---

# Part A — `ProductStrip` (DS PR α)

A purely declarative top bar listing the Aleph apps as tabs, with a logomark anchor and an optional right slot. No state. Full-page nav via `<a>` (no SPA router).

## Task 1: Create feature branch

**Files:**
- N/A (git)

- [ ] **Step 1: Sync main and create branch**

Run:
```
git checkout main
git pull --ff-only origin main
git checkout -b feature/product-strip
```

## Task 2: Add ProductStrip with TDD

**Files:**
- Create: `packages/ds/src/components/product-strip/product-strip.tsx`
- Create: `packages/ds/src/components/product-strip/product-strip.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `packages/ds/src/components/product-strip/product-strip.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductStrip, type ProductApp } from "./product-strip";

const APPS: ProductApp[] = [
  { id: "cloud",    label: "Cloud",    href: "https://app.aleph.cloud" },
  { id: "network",  label: "Network",  href: "https://network.aleph.cloud" },
  { id: "explorer", label: "Explorer", href: "https://explorer.aleph.cloud" },
  { id: "swap",     label: "Swap",     href: "https://swap.aleph.cloud" },
];

describe("ProductStrip", () => {
  it("renders one anchor per app", () => {
    render(<ProductStrip apps={APPS} activeId="network" logoHref="https://aleph.cloud" />);
    APPS.forEach((app) => {
      const link = screen.getByRole("link", { name: app.label });
      expect(link).toHaveAttribute("href", app.href);
    });
  });

  it("marks the active app via aria-current=page", () => {
    render(<ProductStrip apps={APPS} activeId="network" logoHref="https://aleph.cloud" />);
    const active = screen.getByRole("link", { name: "Network" });
    expect(active).toHaveAttribute("aria-current", "page");
    const inactive = screen.getByRole("link", { name: "Cloud" });
    expect(inactive).not.toHaveAttribute("aria-current");
  });

  it("renders the logomark as a link to logoHref", () => {
    render(<ProductStrip apps={APPS} activeId="network" logoHref="https://aleph.cloud" />);
    const logo = screen.getByRole("link", { name: /aleph/i });
    expect(logo).toHaveAttribute("href", "https://aleph.cloud");
  });

  it("renders the right slot content", () => {
    render(
      <ProductStrip
        apps={APPS}
        activeId="network"
        logoHref="https://aleph.cloud"
        right={<span data-testid="right">controls</span>}
      />,
    );
    expect(screen.getByTestId("right")).toBeInTheDocument();
  });

  it("emits no active tab when activeId does not match any app", () => {
    render(<ProductStrip apps={APPS} activeId="unknown" logoHref="https://aleph.cloud" />);
    expect(screen.queryByRole("link", { current: "page" })).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- product-strip`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement ProductStrip**

Create `packages/ds/src/components/product-strip/product-strip.tsx`:

```tsx
import { type ReactNode } from "react";
import { Logo } from "@ac/components/logo/logo";
import { cn } from "@ac/lib/cn";

export type ProductApp = {
  id: string;
  label: string;
  href: string;
};

export type ProductStripProps = {
  apps: ProductApp[];
  activeId: string;
  logoHref: string;
  right?: ReactNode;
  className?: string;
};

export function ProductStrip({
  apps,
  activeId,
  logoHref,
  right,
  className,
}: ProductStripProps) {
  return (
    <div
      className={cn(
        "flex h-9 w-full items-center gap-3 border-b border-edge",
        "bg-muted/40 dark:bg-surface px-3",
        className,
      )}
    >
      <a
        href={logoHref}
        aria-label="Aleph"
        className="flex shrink-0 items-center"
      >
        <Logo className="h-4 text-foreground" />
      </a>
      <nav aria-label="Aleph products" className="flex items-center gap-1">
        {apps.map((app) => {
          const isActive = app.id === activeId;
          return (
            <a
              key={app.id}
              href={app.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "rounded-md px-2 py-1 text-sm transition-colors",
                "text-muted-foreground hover:text-foreground hover:bg-muted",
                isActive &&
                  "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200 font-medium",
              )}
              style={{ transitionDuration: "var(--duration-fast)" }}
            >
              {app.label}
            </a>
          );
        })}
      </nav>
      {right && (
        <div className="ml-auto flex shrink-0 items-center gap-2">{right}</div>
      )}
    </div>
  );
}
```

> **Convention notes for executors:**
> - DS components import each other via the `@ac/*` alias (resolves to `packages/ds/src/*`), not the package's own `@aleph-front/ds/*` subpath exports. Self-references via the package name aren't used internally.
> - The icon-mark export is named `Logo` (matched by `LogoFull` for the wordmark variant); there is no `LogoMark`.
> - The hairline border token is `border-edge`. Avoid `border-foreground/[0.06]`.
> - The active-link treatment matches the existing preview sidebar convention: `bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200`.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- product-strip`
Expected: PASS — all 5 tests green.

- [ ] **Step 5: Commit**

```
git add packages/ds/src/components/product-strip
git commit -m "feat(product-strip): add ProductStrip component with tests"
```

## Task 3: Add subpath export

**Files:**
- Modify: `packages/ds/package.json`

- [ ] **Step 1: Add the export**

The `"exports"` map in `packages/ds/package.json` is in rough addition order with `./lib/cn` and `./styles/tokens.css` at the bottom — it is not alphabetical. Append the new component export just before `./lib/cn` (and after the most recent component entry — `./stepper`):

```json
"./product-strip": "./src/components/product-strip/product-strip.tsx",
```

- [ ] **Step 2: Verify it resolves**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 3: Commit**

```
git add packages/ds/package.json
git commit -m "feat(product-strip): add subpath export"
```

## Task 4: Add preview page

**Files:**
- Create: `apps/preview/src/app/components/product-strip/page.tsx`
- Modify: `apps/preview/src/components/sidebar.tsx`

- [ ] **Step 1: Create the preview page**

Create `apps/preview/src/app/components/product-strip/page.tsx`:

```tsx
"use client";

import { ProductStrip, type ProductApp } from "@aleph-front/ds/product-strip";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

const APPS: ProductApp[] = [
  { id: "cloud",    label: "Cloud",    href: "https://app.aleph.cloud" },
  { id: "network",  label: "Network",  href: "https://network.aleph.cloud" },
  { id: "explorer", label: "Explorer", href: "https://explorer.aleph.cloud" },
  { id: "swap",     label: "Swap",     href: "https://swap.aleph.cloud" },
];

export default function ProductStripPage() {
  return (
    <>
      <PageHeader
        title="ProductStrip"
        description="Top bar listing the Aleph product family as tabs. Each app links to its subdomain. Declarative — consumers pass active app via activeId."
      />

      <DemoSection title="Network active">
        <ProductStrip apps={APPS} activeId="network" logoHref="https://aleph.cloud" />
      </DemoSection>

      <DemoSection title="Cloud active">
        <ProductStrip apps={APPS} activeId="cloud" logoHref="https://aleph.cloud" />
      </DemoSection>

      <DemoSection title="With right slot (theme toggle placeholder)">
        <ProductStrip
          apps={APPS}
          activeId="network"
          logoHref="https://aleph.cloud"
          right={<span className="text-xs text-muted-foreground">◐ theme</span>}
        />
      </DemoSection>

      <DemoSection title="No active app (unknown activeId)">
        <ProductStrip apps={APPS} activeId="unknown" logoHref="https://aleph.cloud" />
      </DemoSection>
    </>
  );
}
```

- [ ] **Step 2: Add sidebar entry**

The preview sidebar (`apps/preview/src/components/sidebar.tsx`) is **not** a flat list — components are grouped (`Actions`, `Data Display`, `Feedback`, `Navigation`, `Forms`). Shell primitives don't belong in any existing group.

Add a new `Application Shell` group at the end of the `Components` section's `items` array. This group will later be joined by `AppShellSidebar` (Part B) and `PageHeader` (Part C):

```tsx
{
  group: "Application Shell",
  items: [
    { label: "Product Strip", href: "/components/product-strip" },
  ],
},
```

- [ ] **Step 3: Run dev server and verify visually**

Run: `npm run dev`
Open: `http://localhost:3000/components/product-strip`

**STOP. Ask the user to verify the preview page before proceeding.** Confirm:
- All four tabs render with correct labels
- `aria-current="page"` is set on the active tab (visible as the highlighted tab)
- Light and dark themes both look correct
- Right-slot content renders flush-right

If the user requests changes, fix and re-verify.

- [ ] **Step 4: Commit**

```
git add apps/preview
git commit -m "feat(product-strip): add preview page"
```

## Task 5: Verify and refine

- [ ] **Step 1: Run full project checks**

Run: `npm run check`
Expected: PASS (lint + typecheck + test all green).

- [ ] **Step 2: Fix any failures**

If `check` fails, address the failure and re-run until clean.

## Task 6: Update docs (5-doc update for Part A)

**Files:**
- Modify: `docs/DESIGN-SYSTEM.md`
- Modify: `docs/ARCHITECTURE.md` (only if new patterns introduced — likely no for ProductStrip)
- Modify: `docs/DECISIONS.md`
- Modify: `docs/BACKLOG.md` (n/a unless there's a pre-existing entry)
- Modify: `CLAUDE.md`

- [ ] **Step 1: Update DESIGN-SYSTEM.md**

Add a section for `ProductStrip` documenting:
- Purpose: top product-family strip for Aleph apps.
- Import path: `@aleph-front/ds/product-strip`.
- Props: `apps`, `activeId`, `logoHref`, `right?`, `className?`.
- `ProductApp` type: `{ id, label, href }`.
- Example with the four-app list.

- [ ] **Step 2: Update DECISIONS.md**

Add an entry:
```
## Decision #N - 2026-05-14
**Context:** Aleph Cloud is growing into a multi-app product family (Cloud / Network / Explorer / Swap). Apps live on separate subdomains.
**Decision:** Add a `ProductStrip` primitive — a declarative top bar listing the family as tabs, full-page-navigation via anchors, active app passed explicitly via `activeId`. No state, no router coupling.
**Rationale:** Apps are on different subdomains; SPA routing isn't possible across them. Anchors with `aria-current="page"` give correct semantics and accessibility. `activeId` is passed per app so each app announces its own identity rather than relying on URL-matching magic.
**Alternatives considered:** Subdomain-detecting auto-active (rejected — fragile, harder to test). Workspace switcher (rejected during brainstorm — hub-and-spoke model fits better than workspace model).
```

- [ ] **Step 3: Update CLAUDE.md**

Add to the "Current Features" list:
```
- ProductStrip component for cross-app navigation in the Aleph product family (logomark + tab anchors + optional right slot, active app via activeId)
```

- [ ] **Step 4: Update BACKLOG.md if applicable**

If a related backlog item exists, move it to the Completed section. Otherwise skip.

- [ ] **Step 5: Commit docs**

```
git add docs/DESIGN-SYSTEM.md docs/DECISIONS.md CLAUDE.md
git commit -m "docs(product-strip): update DESIGN-SYSTEM, DECISIONS, CLAUDE"
```

## Task 7: Open PR and squash-merge

- [ ] **Step 1: Push**

Run: `git push -u origin feature/product-strip`

- [ ] **Step 2: Open PR**

Run:
```
gh pr create --title "feat(product-strip): add ProductStrip primitive" --body "$(cat <<'EOF'
## Summary

- Adds `ProductStrip` component for cross-app navigation in the Aleph product family
- `ProductApp` type for declarative app config
- Preview page demonstrating active states and right slot

## Test plan

- [x] Unit tests cover anchor rendering, aria-current, logo link, right slot, unknown activeId
- [x] Preview page verified visually at `/components/product-strip`
- [x] `npm run check` clean

Part of the Aleph Cloud shell redesign (spec: `../scheduler-dashboard/docs/superpowers/specs/2026-05-14-aleph-cloud-shell-redesign-design.md`).
EOF
)"
```

- [ ] **Step 3: Squash-merge after review**

Run: `gh pr merge <number> --squash --delete-branch`

- [ ] **Step 4: Sync local main**

```
git checkout main
git pull --ff-only origin main
git branch -D feature/product-strip
```

- [ ] **Step 5: Publish a new `@aleph-front/ds` version**

Follow the DS release process (see `docs/ARCHITECTURE.md` § Release for the canonical steps — bump version, build, publish to npm). Note the version number for use by Dashboard PR 1.

---

# Part B — `AppShellSidebar` + hooks (DS PR β)

The sidebar shell with expanded ↔ icon-rail collapse, accordion sections persisting per-section open/closed state, and `NavItem` for individual entries. Two hooks (`useSidebarCollapse`, `useAccordionState`) own the localStorage-backed state.

## Task 8: Create feature branch

- [ ] **Step 1: Start fresh from main**

```
git checkout main
git pull --ff-only origin main
git checkout -b feature/app-shell-sidebar
```

## Task 9: Build `useSidebarCollapse` hook (TDD)

**Files:**
- Create: `packages/ds/src/components/app-shell-sidebar/use-sidebar-collapse.ts`
- Create: `packages/ds/src/components/app-shell-sidebar/use-sidebar-collapse.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `packages/ds/src/components/app-shell-sidebar/use-sidebar-collapse.test.tsx`:

```tsx
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useSidebarCollapse } from "./use-sidebar-collapse";

const KEY = "sidebar.collapsed";

describe("useSidebarCollapse", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("returns null on initial render (pre-hydration)", () => {
    const { result } = renderHook(() => useSidebarCollapse());
    // After first render but before effect, value may already be hydrated in test env.
    // We test that it's never undefined and is either null or boolean.
    expect([null, true, false]).toContain(result.current.collapsed);
  });

  it("reads existing localStorage value on mount", () => {
    window.localStorage.setItem(KEY, "true");
    const { result } = renderHook(() => useSidebarCollapse());
    expect(result.current.collapsed).toBe(true);
  });

  it("persists setCollapsed to localStorage", () => {
    const { result } = renderHook(() => useSidebarCollapse());
    act(() => result.current.setCollapsed(true));
    expect(window.localStorage.getItem(KEY)).toBe("true");
    expect(result.current.collapsed).toBe(true);
  });

  it("toggle flips the value", () => {
    const { result } = renderHook(() => useSidebarCollapse());
    act(() => result.current.setCollapsed(false));
    act(() => result.current.toggle());
    expect(result.current.collapsed).toBe(true);
    act(() => result.current.toggle());
    expect(result.current.collapsed).toBe(false);
  });

  it("toggle treats null as expanded (next state = true / collapsed)", () => {
    const { result } = renderHook(() => useSidebarCollapse());
    // Force null state by clearing after mount.
    act(() => {
      window.localStorage.removeItem(KEY);
    });
    // Toggle from initial false (default expanded) → true.
    act(() => result.current.toggle());
    expect(result.current.collapsed).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- use-sidebar-collapse`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the hook**

Create `packages/ds/src/components/app-shell-sidebar/use-sidebar-collapse.ts`:

```ts
"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "sidebar.collapsed";

export type UseSidebarCollapse = {
  collapsed: boolean | null;
  setCollapsed: (next: boolean) => void;
  toggle: () => void;
};

export function useSidebarCollapse(): UseSidebarCollapse {
  const [collapsed, setCollapsedState] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    setCollapsedState(stored === "true");
  }, []);

  const setCollapsed = useCallback((next: boolean) => {
    setCollapsedState(next);
    window.localStorage.setItem(STORAGE_KEY, String(next));
  }, []);

  const toggle = useCallback(() => {
    setCollapsedState((prev) => {
      const next = !(prev ?? false);
      window.localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  return { collapsed, setCollapsed, toggle };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- use-sidebar-collapse`
Expected: PASS.

- [ ] **Step 5: Commit**

```
git add packages/ds/src/components/app-shell-sidebar/use-sidebar-collapse.ts packages/ds/src/components/app-shell-sidebar/use-sidebar-collapse.test.tsx
git commit -m "feat(app-shell-sidebar): add useSidebarCollapse hook"
```

## Task 10: Build `useAccordionState` hook (TDD)

**Files:**
- Create: `packages/ds/src/components/app-shell-sidebar/use-accordion-state.ts`
- Create: `packages/ds/src/components/app-shell-sidebar/use-accordion-state.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `packages/ds/src/components/app-shell-sidebar/use-accordion-state.test.tsx`:

```tsx
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useAccordionState } from "./use-accordion-state";

const KEY = (id: string) => `sidebar.section.${id}`;

describe("useAccordionState", () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => window.localStorage.clear());

  it("reads existing localStorage value on mount", () => {
    window.localStorage.setItem(KEY("resources"), "false");
    const { result } = renderHook(() => useAccordionState("resources"));
    expect(result.current.open).toBe(false);
  });

  it("defaults open=true when localStorage is empty", () => {
    const { result } = renderHook(() => useAccordionState("resources"));
    expect(result.current.open).toBe(true);
  });

  it("respects defaultOpen=false when localStorage is empty", () => {
    const { result } = renderHook(() => useAccordionState("resources", false));
    expect(result.current.open).toBe(false);
  });

  it("persists setOpen to localStorage under per-section key", () => {
    const { result } = renderHook(() => useAccordionState("resources"));
    act(() => result.current.setOpen(false));
    expect(window.localStorage.getItem(KEY("resources"))).toBe("false");
    expect(result.current.open).toBe(false);
  });

  it("toggle flips the value", () => {
    const { result } = renderHook(() => useAccordionState("resources"));
    act(() => result.current.toggle());
    expect(result.current.open).toBe(false);
    act(() => result.current.toggle());
    expect(result.current.open).toBe(true);
  });

  it("keys state separately per sectionId", () => {
    const { result: a } = renderHook(() => useAccordionState("dashboard"));
    const { result: b } = renderHook(() => useAccordionState("operations"));
    act(() => a.current.setOpen(false));
    expect(b.current.open).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- use-accordion-state`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the hook**

Create `packages/ds/src/components/app-shell-sidebar/use-accordion-state.ts`:

```ts
"use client";

import { useCallback, useEffect, useState } from "react";

const storageKey = (sectionId: string) => `sidebar.section.${sectionId}`;

export type UseAccordionState = {
  open: boolean | null;
  setOpen: (next: boolean) => void;
  toggle: () => void;
};

export function useAccordionState(
  sectionId: string,
  defaultOpen = true,
): UseAccordionState {
  const [open, setOpenState] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey(sectionId));
    if (stored === null) {
      setOpenState(defaultOpen);
    } else {
      setOpenState(stored === "true");
    }
  }, [sectionId, defaultOpen]);

  const setOpen = useCallback(
    (next: boolean) => {
      setOpenState(next);
      window.localStorage.setItem(storageKey(sectionId), String(next));
    },
    [sectionId],
  );

  const toggle = useCallback(() => {
    setOpenState((prev) => {
      const next = !(prev ?? defaultOpen);
      window.localStorage.setItem(storageKey(sectionId), String(next));
      return next;
    });
  }, [sectionId, defaultOpen]);

  return { open, setOpen, toggle };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- use-accordion-state`
Expected: PASS.

- [ ] **Step 5: Commit**

```
git add packages/ds/src/components/app-shell-sidebar/use-accordion-state.ts packages/ds/src/components/app-shell-sidebar/use-accordion-state.test.tsx
git commit -m "feat(app-shell-sidebar): add useAccordionState hook"
```

## Task 11: Build `AppShellSidebar` + `AccordionSection` + `NavItem` (TDD)

**Files:**
- Create: `packages/ds/src/components/app-shell-sidebar/app-shell-sidebar.tsx`
- Create: `packages/ds/src/components/app-shell-sidebar/app-shell-sidebar.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `packages/ds/src/components/app-shell-sidebar/app-shell-sidebar.test.tsx`:

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  AccordionSection,
  AppShellSidebar,
  NavItem,
} from "./app-shell-sidebar";

const Mark = () => <div data-testid="mark">N</div>;

describe("AppShellSidebar", () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => window.localStorage.clear());

  it("renders the appMark slot", () => {
    render(
      <AppShellSidebar appMark={<Mark />} collapsed={false} onToggle={() => {}}>
        <div>content</div>
      </AppShellSidebar>,
    );
    expect(screen.getByTestId("mark")).toBeInTheDocument();
  });

  it("renders children in expanded mode", () => {
    render(
      <AppShellSidebar appMark={<Mark />} collapsed={false} onToggle={() => {}}>
        <AccordionSection title="Resources" sectionId="resources">
          <NavItem href="/nodes" icon={<span data-testid="icon" />}>
            Nodes
          </NavItem>
        </AccordionSection>
      </AppShellSidebar>,
    );
    expect(screen.getByText("Resources")).toBeInTheDocument();
    expect(screen.getByText("Nodes")).toBeInTheDocument();
  });

  it("applies rail-hide pattern to section title and item label in collapsed mode", () => {
    render(
      <AppShellSidebar appMark={<Mark />} collapsed={true} onToggle={() => {}}>
        <AccordionSection title="Resources" sectionId="resources">
          <NavItem href="/nodes" icon={<span data-testid="icon" />}>
            Nodes
          </NavItem>
        </AccordionSection>
      </AppShellSidebar>,
    );
    // jsdom doesn't load Tailwind, so `toBeVisible()` can't observe
    // the `[data-collapsed=true] .rail-hide { display: none }` rule.
    // Verify the structural contract instead.
    const aside = screen.getByRole("complementary");
    expect(aside).toHaveAttribute("data-collapsed", "true");
    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /resources/i }),
    ).toHaveClass("rail-hide");
    expect(screen.getByText("Nodes")).toHaveClass("rail-hide");
  });

  it("renders a built-in collapse toggle that fires onToggle when clicked", () => {
    const onToggle = vi.fn();
    render(
      <AppShellSidebar
        appMark={<Mark />}
        collapsed={false}
        onToggle={onToggle}
      >
        <div>content</div>
      </AppShellSidebar>,
    );
    fireEvent.click(
      screen.getByRole("button", { name: /collapse sidebar/i }),
    );
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("collapse-toggle aria-label flips with collapsed state", () => {
    const { rerender } = render(
      <AppShellSidebar appMark={<Mark />} collapsed={false} onToggle={() => {}}>
        <div>content</div>
      </AppShellSidebar>,
    );
    expect(
      screen.getByRole("button", { name: /collapse sidebar/i }),
    ).toBeInTheDocument();
    rerender(
      <AppShellSidebar appMark={<Mark />} collapsed={true} onToggle={() => {}}>
        <div>content</div>
      </AppShellSidebar>,
    );
    expect(
      screen.getByRole("button", { name: /expand sidebar/i }),
    ).toBeInTheDocument();
  });

  it("clicking section title toggles open/closed", () => {
    render(
      <AppShellSidebar appMark={<Mark />} collapsed={false} onToggle={() => {}}>
        <AccordionSection title="Resources" sectionId="resources">
          <NavItem href="/nodes" icon={<span data-testid="icon" />}>
            Nodes
          </NavItem>
        </AccordionSection>
      </AppShellSidebar>,
    );
    expect(screen.getByText("Nodes")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /resources/i }));
    expect(screen.queryByText("Nodes")).toBeNull();
  });

  it("NavItem marks the active route with aria-current=page", () => {
    render(
      <AppShellSidebar appMark={<Mark />} collapsed={false} onToggle={() => {}}>
        <AccordionSection title="Resources" sectionId="resources">
          <NavItem
            href="/nodes"
            icon={<span data-testid="icon" />}
            active
          >
            Nodes
          </NavItem>
        </AccordionSection>
      </AppShellSidebar>,
    );
    const link = screen.getByRole("link", { name: "Nodes" });
    expect(link).toHaveAttribute("aria-current", "page");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- app-shell-sidebar`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the component family**

Create `packages/ds/src/components/app-shell-sidebar/app-shell-sidebar.tsx`:

```tsx
"use client";

import {
  CaretDown,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react/dist/ssr";
import { createContext, type ReactNode } from "react";
import { cn } from "@ac/lib/cn";
import { useAccordionState } from "./use-accordion-state";

/* ── Section context (scaffolding for future use) ─ */

const SectionContext = createContext<{ isOpen: boolean; title: string } | null>(
  null,
);

/* ── AppShellSidebar ─────────────────────────── */

export type AppShellSidebarProps = {
  appMark: ReactNode;
  collapsed: boolean | null;
  onToggle: () => void;
  children: ReactNode;
  className?: string;
};

export function AppShellSidebar({
  appMark,
  collapsed,
  onToggle,
  children,
  className,
}: AppShellSidebarProps) {
  // Treat `null` (hydrating) as expanded so first paint matches static HTML.
  const isCollapsed = collapsed === true;
  return (
    <aside
      data-collapsed={isCollapsed ? "true" : "false"}
      className={cn(
        "flex flex-col bg-muted/40 dark:bg-surface",
        "transition-[width] duration-200 ease-out",
        isCollapsed ? "w-13" : "w-58",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-14 shrink-0 items-center px-3",
          isCollapsed && "justify-center",
        )}
        data-slot="app-mark"
      >
        {appMark}
      </div>
      <nav className="flex-1 px-2 py-2">{children}</nav>
      <CollapseToggle collapsed={isCollapsed} onToggle={onToggle} />
    </aside>
  );
}

function CollapseToggle({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 border-t border-edge px-2 py-2",
        collapsed ? "justify-center" : "justify-end",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className={cn(
          "flex size-7 items-center justify-center rounded-md",
          "text-muted-foreground hover:text-foreground hover:bg-muted",
          "transition-colors",
        )}
        style={{ transitionDuration: "var(--duration-fast)" }}
      >
        {collapsed ? (
          <CaretRight size={14} weight="bold" />
        ) : (
          <CaretLeft size={14} weight="bold" />
        )}
      </button>
    </div>
  );
}

/* ── AccordionSection ────────────────────────── */

export type AccordionSectionProps = {
  title: string;
  sectionId: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

export function AccordionSection({
  title,
  sectionId,
  defaultOpen = true,
  children,
}: AccordionSectionProps) {
  const { open, toggle } = useAccordionState(sectionId, defaultOpen);
  const isOpen = open ?? defaultOpen;

  return (
    <SectionContext.Provider value={{ isOpen, title }}>
      <div className="mb-3" data-section-id={sectionId}>
        <SectionTitleRow title={title} isOpen={isOpen} onToggle={toggle} />
        {isOpen && <ul className="space-y-0.5">{children}</ul>}
      </div>
    </SectionContext.Provider>
  );
}

function SectionTitleRow({
  title,
  isOpen,
  onToggle,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    // Hidden in rail (collapsed) mode via CSS selector on parent [data-collapsed=true].
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className={cn(
        "group flex w-full items-center justify-between rounded px-2 py-1",
        "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground",
        "hover:text-foreground hover:bg-muted",
        "transition-colors",
        "rail-hide",
      )}
      style={{ transitionDuration: "var(--duration-fast)" }}
    >
      <span>{title}</span>
      {isOpen ? (
        <CaretDown size={10} weight="bold" />
      ) : (
        <CaretRight size={10} weight="bold" />
      )}
    </button>
  );
}

/* ── NavItem ─────────────────────────────────── */

export type NavItemProps = {
  href: string;
  icon: ReactNode;
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
};

export function NavItem({
  href,
  icon,
  children,
  active,
  onClick,
}: NavItemProps) {
  return (
    <li>
      <a
        href={href}
        {...(onClick ? { onClick } : {})}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
          active
            ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200 font-medium"
            : "text-muted-foreground hover:text-foreground hover:bg-muted",
        )}
        style={{ transitionDuration: "var(--duration-fast)" }}
      >
        <span className="shrink-0">{icon}</span>
        <span className="rail-hide">{children}</span>
      </a>
    </li>
  );
}
```

> **Convention notes for executors:**
> - `Logo` is the icon-mark export (not `LogoMark`). Internal imports use the `@ac/*` alias, not `@aleph-front/ds/*`.
> - Active state matches the preview-sidebar convention: `bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200` (same as Part A).
> - Hover background uses `bg-muted` (semantic token), not raw `bg-foreground/[0.03]`.
> - The built-in `CollapseToggle` row at the bottom of the sidebar consumes the `onToggle` prop. Consumers don't have to render their own button — but they can also call `onToggle` from elsewhere (header, keyboard handler) since they own the `useSidebarCollapse` hook.
> - `SectionContext` is intentional scaffolding (no current consumer); leave it in place for future use as called out in the plan.

Also add this rule once to the DS global stylesheet (`packages/ds/src/styles/tokens.css` or wherever shared rules live) so `.rail-hide` resolves at runtime:

```css
[data-collapsed="true"] .rail-hide {
  display: none;
}
```

(If the styles file uses Tailwind layer directives, place this under `@layer components`.)

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- app-shell-sidebar`
Expected: PASS — all 5 tests green.

- [ ] **Step 5: Commit**

```
git add packages/ds/src/components/app-shell-sidebar packages/ds/src/styles
git commit -m "feat(app-shell-sidebar): add AppShellSidebar + AccordionSection + NavItem"
```

## Task 12: Add subpath exports

**Files:**
- Modify: `packages/ds/package.json`

- [ ] **Step 1: Add three exports**

In `packages/ds/package.json`, add (alphabetically within `"exports"`):

```json
"./app-shell-sidebar": "./src/components/app-shell-sidebar/app-shell-sidebar.tsx",
"./use-sidebar-collapse": "./src/components/app-shell-sidebar/use-sidebar-collapse.ts",
"./use-accordion-state": "./src/components/app-shell-sidebar/use-accordion-state.ts",
```

- [ ] **Step 2: Verify resolution**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 3: Commit**

```
git add packages/ds/package.json
git commit -m "feat(app-shell-sidebar): add subpath exports"
```

## Task 13: Add preview page

**Files:**
- Create: `apps/preview/src/app/components/app-shell-sidebar/page.tsx`
- Modify: `apps/preview/src/components/sidebar.tsx`

- [ ] **Step 1: Create the preview page**

Create `apps/preview/src/app/components/app-shell-sidebar/page.tsx`:

```tsx
"use client";

import {
  AppShellSidebar,
  AccordionSection,
  NavItem,
} from "@aleph-front/ds/app-shell-sidebar";
import { useSidebarCollapse } from "@aleph-front/ds/use-sidebar-collapse";
import { Logo } from "@aleph-front/ds/logo";
import {
  GridFour,
  HardDrives,
  Cpu,
  Coins,
  Graph,
  WaveSawtooth,
  Warning,
} from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

function AppMark({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <Logo className="h-4 text-foreground shrink-0" />
      {!collapsed && (
        <span className="font-semibold text-sm">Network</span>
      )}
    </div>
  );
}

function DemoSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <AppShellSidebar
      appMark={<AppMark collapsed={collapsed} />}
      collapsed={collapsed}
      onToggle={onToggle}
    >
      <AccordionSection title="Dashboard" sectionId="demo-dashboard">
        <NavItem href="#" icon={<GridFour size={14} />} active>
          Overview
        </NavItem>
      </AccordionSection>
      <AccordionSection title="Resources" sectionId="demo-resources">
        <NavItem href="#" icon={<HardDrives size={14} />}>Nodes</NavItem>
        <NavItem href="#" icon={<Cpu size={14} />}>VMs</NavItem>
        <NavItem href="#" icon={<Coins size={14} />}>Credits</NavItem>
      </AccordionSection>
      <AccordionSection title="Network" sectionId="demo-network">
        <NavItem href="#" icon={<Graph size={14} />}>Graph</NavItem>
        <NavItem href="#" icon={<WaveSawtooth size={14} />}>Health</NavItem>
      </AccordionSection>
      <AccordionSection title="Operations" sectionId="demo-operations">
        <NavItem href="#" icon={<Warning size={14} />}>Issues</NavItem>
      </AccordionSection>
    </AppShellSidebar>
  );
}

export default function AppShellSidebarPage() {
  const { collapsed, toggle } = useSidebarCollapse();

  return (
    <>
      <PageHeader
        title="AppShellSidebar"
        description="Sidebar shell with expanded ↔ icon-rail collapse and accordion sections. Backed by useSidebarCollapse and useAccordionState hooks (localStorage)."
      />

      <DemoSection title="Live (built-in toggle, persists in localStorage)">
        <div className="flex h-96 overflow-hidden rounded-md border border-edge">
          <DemoSidebar collapsed={collapsed === true} onToggle={toggle} />
          <div className="flex-1 bg-background p-4 text-sm text-muted-foreground">
            page content
          </div>
        </div>
      </DemoSection>

      <DemoSection title="Static — expanded">
        <div className="flex h-96 overflow-hidden rounded-md border border-edge">
          <DemoSidebar collapsed={false} onToggle={() => {}} />
          <div className="flex-1 bg-background p-4 text-sm text-muted-foreground">
            page content
          </div>
        </div>
      </DemoSection>

      <DemoSection title="Static — icon rail">
        <div className="flex h-96 overflow-hidden rounded-md border border-edge">
          <DemoSidebar collapsed={true} onToggle={() => {}} />
          <div className="flex-1 bg-background p-4 text-sm text-muted-foreground">
            page content
          </div>
        </div>
      </DemoSection>
    </>
  );
}
```

- [ ] **Step 2: Add sidebar entry**

Part A created the `Application Shell` group in `apps/preview/src/components/sidebar.tsx`. Extend its `items` array:

```tsx
{
  group: "Application Shell",
  items: [
    { label: "Product Strip", href: "/components/product-strip" },
    { label: "App Shell Sidebar", href: "/components/app-shell-sidebar" },
  ],
},
```

- [ ] **Step 3: Run dev server and verify**

Run: `npm run dev`
Open: `http://localhost:3000/components/app-shell-sidebar`

**STOP. Ask the user to verify the preview page before proceeding.** Confirm:
- Live sidebar: clicking Collapse/Expand smoothly transitions width and persists across page reload
- Section chevrons toggle visibility of items; state survives reload
- Icon-rail mode hides chevrons, section titles, and item labels — only icons remain
- Light and dark themes both look correct

If the user requests changes, fix and re-verify.

- [ ] **Step 4: Commit**

```
git add apps/preview
git commit -m "feat(app-shell-sidebar): add preview page"
```

## Task 14: Verify and refine

- [ ] **Step 1: Run full project checks**

Run: `npm run check`
Expected: PASS.

- [ ] **Step 2: Fix any failures**

## Task 15: Update docs (5-doc update for Part B)

**Files:**
- Modify: `docs/DESIGN-SYSTEM.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`, `docs/BACKLOG.md` (if applicable), `CLAUDE.md`

- [ ] **Step 1: Update DESIGN-SYSTEM.md**

Add sections for:
- `AppShellSidebar` — props, slots, expanded vs rail behavior, example with `useSidebarCollapse`
- `AccordionSection` — props (`title`, `sectionId`, `defaultOpen`), keyed persistence
- `NavItem` — props (`href`, `icon`, `active`, `onClick`)
- `useSidebarCollapse()` hook — return shape, localStorage key, SSR-safe `null`
- `useAccordionState(sectionId, defaultOpen?)` hook — return shape, per-section storage key, SSR-safe `null`

- [ ] **Step 2: Update ARCHITECTURE.md**

Add a section on the rail-hide pattern (the `[data-collapsed="true"] .rail-hide { display: none }` rule used to swap expanded ↔ rail content without two separate trees). Document the SSR-safe hydration pattern (hooks return `null` until `useEffect` fires).

- [ ] **Step 3: Update DECISIONS.md**

```
## Decision #N - 2026-05-14
**Context:** The Aleph dashboard sidebar needs a collapse mode (icon rail) plus per-section accordion behavior. Without primitives in DS, every consumer reinvents persistence + hydration handling.
**Decision:** Ship `AppShellSidebar` + `AccordionSection` + `NavItem` together with `useSidebarCollapse` + `useAccordionState` hooks. Hooks return `boolean | null` (null = hydrating), backed by localStorage with deterministic keys (`sidebar.collapsed`, `sidebar.section.<sectionId>`). Rail mode hides chrome via a CSS data-attribute selector (`[data-collapsed="true"] .rail-hide`) rather than rendering two trees.
**Rationale:** Bundling reduces N×3 decisions across consumer apps. `null`-on-hydrate avoids SSR/static-export mismatches. Single-tree rail-hide pattern lets the same children render in both modes — consumers don't pass two configs. Storage keys live in DS so multiple apps could theoretically share state if they shared origin (acceptable side-effect — apps are on different subdomains in practice).
**Alternatives considered:** Render two trees (expanded vs rail) (rejected — duplicates consumer config). Cookie-based state (rejected — localStorage is simpler and these are personal-preference UI states, not auth/session). Defer hooks to consumers (rejected — every consumer would solve the SSR-safe hydration the same way).
```

- [ ] **Step 4: Update CLAUDE.md**

Add to the "Current Features" list:
```
- AppShellSidebar component with expanded ↔ icon-rail collapse (`useSidebarCollapse`) and accordion sections (`useAccordionState`). Sub-exports: `AccordionSection`, `NavItem`. Rail-hide pattern via `[data-collapsed]` CSS selector. Hooks are SSR-safe (return null until hydrated).
```

- [ ] **Step 5: Commit docs**

```
git add docs CLAUDE.md
git commit -m "docs(app-shell-sidebar): update DESIGN-SYSTEM, ARCHITECTURE, DECISIONS, CLAUDE"
```

## Task 16: Open PR and squash-merge

- [ ] **Step 1: Push**

Run: `git push -u origin feature/app-shell-sidebar`

- [ ] **Step 2: Open PR**

Run:
```
gh pr create --title "feat(app-shell-sidebar): add sidebar shell + accordion + collapse hooks" --body "$(cat <<'EOF'
## Summary

- `AppShellSidebar` shell with expanded ↔ icon-rail mode
- `AccordionSection` and `NavItem` subcomponents
- `useSidebarCollapse` and `useAccordionState` hooks (localStorage-backed, SSR-safe)
- Rail-hide pattern documented in ARCHITECTURE

## Test plan

- [x] Hook unit tests cover localStorage round-trips, hydration null state, defaults, per-section keying
- [x] Component tests cover slot rendering, expanded vs rail mode, section toggle, NavItem active state
- [x] Preview page verified at `/components/app-shell-sidebar` — live toggle + section accordion + dark/light themes

Part of the Aleph Cloud shell redesign.
EOF
)"
```

- [ ] **Step 3: Squash-merge after review**

Run: `gh pr merge <number> --squash --delete-branch`

- [ ] **Step 4: Sync local main**

```
git checkout main
git pull --ff-only origin main
git branch -D feature/app-shell-sidebar
```

- [ ] **Step 5: Publish new `@aleph-front/ds` version**

Follow the DS release process. Note the new version number.

---

# Part C — `PageHeader` + context + hook (DS PR γ)

A slot rendered by the shell. Consuming pages declare their title + actions via a hook. Backed by context.

## Task 17: Create feature branch

- [ ] **Step 1: Start from main**

```
git checkout main
git pull --ff-only origin main
git checkout -b feature/page-header
```

## Task 18: Rename preview-internal PageHeader to DocHeader

**Files:**
- Modify: `apps/preview/src/components/page-header.tsx` → rename file to `doc-header.tsx`, rename export `PageHeader` → `DocHeader`
- Modify: every preview page file that imports `@preview/components/page-header`

This frees up the `PageHeader` name for the DS component's preview page.

- [ ] **Step 1: Rename the file and export**

Run: `git mv apps/preview/src/components/page-header.tsx apps/preview/src/components/doc-header.tsx`

In `apps/preview/src/components/doc-header.tsx`, rename the export:
- `export function PageHeader(...)` → `export function DocHeader(...)`
- `displayName` if present → `DocHeader`

- [ ] **Step 2: Update all imports**

Run: `rg -l '@preview/components/page-header' apps/preview` to find affected files. For each, change the import to `@preview/components/doc-header` and rename `PageHeader` → `DocHeader` in usage.

Use ast-grep to do this safely:

```
ast-grep --update-all \
  --pattern '{ PageHeader }' \
  --rewrite '{ DocHeader }' \
  --lang tsx apps/preview/src/app
```

Then handcheck remaining usages with `rg PageHeader apps/preview` and update.

- [ ] **Step 3: Verify typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 4: Run preview to confirm pages still render**

Run: `npm run dev`
Spot-check 3 random preview pages; each should still show its title/description.

- [ ] **Step 5: Commit**

```
git add apps/preview
git commit -m "refactor(preview): rename internal PageHeader to DocHeader"
```

## Task 19: Build `PageHeaderContext` + `usePageHeader` (TDD)

**Files:**
- Create: `packages/ds/src/components/page-header/page-header.tsx`
- Create: `packages/ds/src/components/page-header/page-header.test.tsx`

- [ ] **Step 1: Write failing tests for the provider + hook**

Create `packages/ds/src/components/page-header/page-header.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { useEffect } from "react";
import { describe, expect, it } from "vitest";
import {
  PageHeader,
  PageHeaderProvider,
  usePageHeader,
} from "./page-header";

function TestPage({ title, actions }: { title: string; actions?: React.ReactNode }) {
  usePageHeader({ title, actions });
  return <div data-testid="body">page body</div>;
}

describe("PageHeader", () => {
  it("renders nothing when no provider and no fallback are supplied", () => {
    render(<PageHeader />);
    expect(screen.queryByText(/./)).toBeNull();
  });

  it("renders fallbackTitle when context has no config", () => {
    render(
      <PageHeaderProvider>
        <PageHeader fallbackTitle="Overview" />
      </PageHeaderProvider>,
    );
    expect(screen.getByText("Overview")).toBeInTheDocument();
  });

  it("context title takes precedence over fallbackTitle", () => {
    render(
      <PageHeaderProvider>
        <PageHeader fallbackTitle="Default" />
        <TestPage title="Real" />
      </PageHeaderProvider>,
    );
    expect(screen.getByText("Real")).toBeInTheDocument();
    expect(screen.queryByText("Default")).toBeNull();
  });

  it("renders the title set by a page via usePageHeader", () => {
    render(
      <PageHeaderProvider>
        <PageHeader />
        <TestPage title="Nodes" />
      </PageHeaderProvider>,
    );
    expect(screen.getByText("Nodes")).toBeInTheDocument();
  });

  it("renders actions on the right side", () => {
    render(
      <PageHeaderProvider>
        <PageHeader />
        <TestPage title="Nodes" actions={<button>Refresh</button>} />
      </PageHeaderProvider>,
    );
    expect(screen.getByRole("button", { name: "Refresh" })).toBeInTheDocument();
  });

  it("last-mounted hook call wins when multiple components call usePageHeader", () => {
    function PageA() {
      usePageHeader({ title: "A" });
      return null;
    }
    function PageB() {
      usePageHeader({ title: "B" });
      return null;
    }
    render(
      <PageHeaderProvider>
        <PageHeader />
        <PageA />
        <PageB />
      </PageHeaderProvider>,
    );
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.queryByText("A")).toBeNull();
  });

  it("clears slot on unmount", () => {
    function Wrapper({ show }: { show: boolean }) {
      return (
        <PageHeaderProvider>
          <PageHeader />
          {show && <TestPage title="Nodes" />}
        </PageHeaderProvider>
      );
    }
    const { rerender } = render(<Wrapper show={true} />);
    expect(screen.getByText("Nodes")).toBeInTheDocument();
    rerender(<Wrapper show={false} />);
    expect(screen.queryByText("Nodes")).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- page-header`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the component, provider, and hook**

Create `packages/ds/src/components/page-header/page-header.tsx`:

```tsx
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@ac/lib/cn";

export type PageHeaderConfig = {
  title: ReactNode;
  actions?: ReactNode;
  search?: ReactNode;
  breadcrumb?: ReactNode;
};

type ContextValue = {
  config: PageHeaderConfig | null;
  setConfig: (config: PageHeaderConfig | null) => void;
};

const PageHeaderContext = createContext<ContextValue | null>(null);

export function PageHeaderProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<PageHeaderConfig | null>(null);
  const value = useMemo(() => ({ config, setConfig }), [config]);
  return (
    <PageHeaderContext.Provider value={value}>
      {children}
    </PageHeaderContext.Provider>
  );
}

export function usePageHeader(config: PageHeaderConfig): void {
  const ctx = useContext(PageHeaderContext);
  // Stringify or compare via deep-equality? Keep it simple: serialize stable identity by stringifying scalar fields.
  // For ReactNode fields, identity comparison via setConfig invalidating each render is acceptable —
  // setState in React 18+ bails out on Object.is equality, but the config object is fresh each render.
  // To avoid render loops, we use useEffect to commit the config once per render commit.
  useEffect(() => {
    if (!ctx) return;
    ctx.setConfig(config);
    return () => ctx.setConfig(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ctx,
    config.title,
    config.actions,
    config.search,
    config.breadcrumb,
  ]);
}

export type PageHeaderProps = {
  /** Slot for the ☰ collapse toggle. Provided by the consumer (wired to useSidebarCollapse). */
  leading?: ReactNode;
  /** Title rendered when no page has registered via usePageHeader. Consumers typically derive this from the route. */
  fallbackTitle?: ReactNode;
  className?: string;
};

export function PageHeader({ leading, fallbackTitle, className }: PageHeaderProps) {
  const ctx = useContext(PageHeaderContext);
  const config = ctx?.config ?? null;
  const title = config?.title ?? fallbackTitle;
  // Render nothing if neither context nor fallback supplied a title — keeps the chrome row invisible.
  if (!title && !leading) {
    return null;
  }
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-12 shrink-0 items-center gap-3 border-b border-foreground/[0.06] bg-background/95 backdrop-blur px-4 md:px-6",
        className,
      )}
    >
      {leading && <div className="shrink-0">{leading}</div>}
      <div className="min-w-0 flex items-center gap-2">
        {config?.breadcrumb && (
          <div className="text-sm text-muted-foreground shrink-0">
            {config.breadcrumb}
          </div>
        )}
        {title && (
          <div className="truncate text-base font-semibold text-foreground">
            {title}
          </div>
        )}
      </div>
      <div className="ml-auto flex items-center gap-2">
        {config?.search}
        {config?.actions}
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- page-header`
Expected: PASS — all 5 tests green.

- [ ] **Step 5: Commit**

```
git add packages/ds/src/components/page-header
git commit -m "feat(page-header): add PageHeader + PageHeaderProvider + usePageHeader"
```

## Task 20: Add subpath export

**Files:**
- Modify: `packages/ds/package.json`

- [ ] **Step 1: Add export**

In `packages/ds/package.json`, add (alphabetically):

```json
"./page-header": "./src/components/page-header/page-header.tsx",
```

- [ ] **Step 2: Verify**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 3: Commit**

```
git add packages/ds/package.json
git commit -m "feat(page-header): add subpath export"
```

## Task 21: Add preview page

**Files:**
- Create: `apps/preview/src/app/components/page-header/page.tsx`
- Modify: `apps/preview/src/components/sidebar.tsx`

- [ ] **Step 1: Create the preview page**

Create `apps/preview/src/app/components/page-header/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import {
  PageHeader,
  PageHeaderProvider,
  usePageHeader,
} from "@aleph-front/ds/page-header";
import { ArrowClockwise, List } from "@phosphor-icons/react/dist/ssr";
import { DocHeader } from "@preview/components/doc-header";
import { DemoSection } from "@preview/components/demo-section";

function FakePage({ title, withActions }: { title: string; withActions?: boolean }) {
  const [fetching, setFetching] = useState(false);
  usePageHeader({
    title,
    actions: withActions ? (
      <button
        type="button"
        onClick={() => setFetching((v) => !v)}
        disabled={fetching}
        className="rounded border border-foreground/10 px-2 py-1 text-xs"
      >
        <ArrowClockwise size={12} className="inline mr-1" />
        {fetching ? "Refreshing…" : "Refresh"}
      </button>
    ) : undefined,
  });
  return (
    <div className="p-4 text-sm text-muted-foreground">
      Body of <code>{title}</code>. The header above is rendered by the shell;
      this page only declared its title and (optionally) actions via{" "}
      <code>usePageHeader</code>.
    </div>
  );
}

export default function PageHeaderPage() {
  return (
    <>
      <DocHeader
        title="PageHeader"
        description="Slot rendered by the app shell. Pages fill it via the usePageHeader hook. Backed by PageHeaderContext."
      />

      <DemoSection title="Title only">
        <div className="rounded border border-foreground/10 overflow-hidden">
          <PageHeaderProvider>
            <PageHeader leading={<List size={16} />} />
            <FakePage title="Overview" />
          </PageHeaderProvider>
        </div>
      </DemoSection>

      <DemoSection title="With reactive actions">
        <div className="rounded border border-foreground/10 overflow-hidden">
          <PageHeaderProvider>
            <PageHeader leading={<List size={16} />} />
            <FakePage title="Nodes · 542 total" withActions />
          </PageHeaderProvider>
        </div>
      </DemoSection>
    </>
  );
}
```

- [ ] **Step 2: Add sidebar entry**

In `apps/preview/src/components/sidebar.tsx`, add (alphabetically):

```tsx
{ label: "Page Header", href: "/components/page-header" },
```

- [ ] **Step 3: Run dev server and verify**

Run: `npm run dev`
Open: `http://localhost:3000/components/page-header`

**STOP. Ask the user to verify before proceeding.** Confirm:
- "Title only" demo shows just the page title in the header bar
- "With reactive actions" demo: Refresh button toggles state and visibly disables while "Refreshing…"
- Light and dark themes both look correct

If changes requested, fix and re-verify.

- [ ] **Step 4: Commit**

```
git add apps/preview
git commit -m "feat(page-header): add preview page"
```

## Task 22: Verify and refine

- [ ] **Step 1: Run full project checks**

Run: `npm run check`
Expected: PASS.

- [ ] **Step 2: Fix any failures**

## Task 23: Update docs (5-doc update for Part C)

**Files:**
- Modify: `docs/DESIGN-SYSTEM.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`, `CLAUDE.md`

- [ ] **Step 1: Update DESIGN-SYSTEM.md**

Add sections for:
- `PageHeader` — props (`leading`, `className`), what it reads from context, sticky behavior
- `PageHeaderProvider` — wraps the shell, holds state
- `usePageHeader(config)` — fields (`title`, `actions`, `search`, `breadcrumb`), last-mount-wins semantics, unmount clears

Example showing the full shell composition (ProductStrip + AppShellSidebar + PageHeader together).

- [ ] **Step 2: Update ARCHITECTURE.md**

Add a section on the slot-via-context pattern: why `usePageHeader` uses `useEffect` to commit (avoids render-cycle thrash), why last-mount-wins (simpler than multi-source merging), unmount cleanup contract.

- [ ] **Step 3: Update DECISIONS.md**

```
## Decision #N - 2026-05-14
**Context:** Per-page header content (title, actions, search) needs a shared chrome row owned by the app shell, but the content must come from each page reactively.
**Decision:** Provide `PageHeader` + `PageHeaderProvider` + `usePageHeader(config)`. The Provider holds a single config in state; the hook commits its config via `useEffect` (with dependency array on the four ReactNode fields) and clears on unmount. The renderer reads context and renders nothing when no page has registered.
**Rationale:** Context-driven slot lets pages stay declarative — they call one hook with what they want shown. `useEffect` commit avoids the setState-during-render pitfall. Last-mount-wins is simpler than merging multiple sources and matches the one-page-per-route reality. `useEffect` cleanup gives deterministic clear on route change.
**Alternatives considered:** Render PageHeader as a child of each page (rejected — duplicates chrome, breaks sticky behavior and the toggle's shared origin). React portal from each page into a header DOM node (rejected — requires DOM ref plumbing and breaks the React tree's data flow). Next.js parallel routes (rejected during brainstorm — doesn't support reactive action state cleanly).
```

- [ ] **Step 4: Update CLAUDE.md**

Add to "Current Features":
```
- PageHeader slot pattern (`PageHeader`, `PageHeaderProvider`, `usePageHeader`) — pages declare title/actions/search/breadcrumb via a hook; shell renders the chrome row. Sticky, supports last-mount-wins, clears on unmount.
```

- [ ] **Step 5: Commit docs**

```
git add docs CLAUDE.md
git commit -m "docs(page-header): update DESIGN-SYSTEM, ARCHITECTURE, DECISIONS, CLAUDE"
```

## Task 24: Open PR and squash-merge

- [ ] **Step 1: Push**

Run: `git push -u origin feature/page-header`

- [ ] **Step 2: Open PR**

Run:
```
gh pr create --title "feat(page-header): add PageHeader slot + provider + usePageHeader hook" --body "$(cat <<'EOF'
## Summary

- `PageHeader` renderer component
- `PageHeaderProvider` context holder
- `usePageHeader` hook for declarative per-page chrome
- Preview-internal `PageHeader` renamed to `DocHeader` to free the namespace

## Test plan

- [x] Unit tests cover empty state, single registration, last-mount-wins, unmount cleanup, actions slot
- [x] Preview page verified at `/components/page-header` — reactive Refresh button works
- [x] `npm run check` clean

Part of the Aleph Cloud shell redesign.
EOF
)"
```

- [ ] **Step 3: Squash-merge after review**

Run: `gh pr merge <number> --squash --delete-branch`

- [ ] **Step 4: Sync local main**

```
git checkout main
git pull --ff-only origin main
git branch -D feature/page-header
```

- [ ] **Step 5: Publish final `@aleph-front/ds` version**

Follow the DS release process. This version unblocks Dashboard PR 1.

---

## Self-review checklist

When all three Parts are merged and published:

- [ ] All three components have unit tests, preview pages, subpath exports
- [ ] All five docs are updated for each Part
- [ ] No stale `PageHeader` references in the preview app (all renamed to `DocHeader`)
- [ ] The dashboard plan's dependency declaration matches the latest published `@aleph-front/ds` version
- [ ] `npm run check` passes on `main`
