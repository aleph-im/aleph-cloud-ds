# Tabs Pill Variant Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `variant="pill"` option to `TabsList` that renders a segmented-control style with a sliding gradient pill indicator.

**Architecture:** Add a `variant` prop to `TabsList`, conditionally apply container and indicator styles, and propagate the variant to `TabsTrigger` via a `data-variant` attribute on the list element with Tailwind `group` utilities. Reuses existing MutationObserver/ResizeObserver sliding indicator logic.

**Tech Stack:** React, Radix UI Tabs, Tailwind CSS 4, class-variance-authority

**Spec:** `docs/superpowers/specs/2026-03-12-tabs-pill-variant-design.md`

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `packages/ds/src/components/tabs/tabs.tsx` | Modify | Add `variant` prop to TabsList, conditional styles for container/indicator/trigger |
| `packages/ds/src/components/tabs/tabs.test.tsx` | Modify | Add tests for pill variant rendering, data attributes, className merging |
| `apps/preview/src/app/components/tabs/page.tsx` | Modify | Add pill variant demo section |

---

## Chunk 1: Implementation

### Task 1: Write failing tests for pill variant

**Files:**
- Modify: `packages/ds/src/components/tabs/tabs.test.tsx`

- [ ] **Step 1: Add pill variant tests**

Add these tests after the existing test block in `tabs.test.tsx`:

```tsx
function renderPillTabs({
  defaultValue = "one",
}: {
  defaultValue?: string;
} = {}) {
  return render(
    <Tabs defaultValue={defaultValue}>
      <TabsList variant="pill">
        <TabsTrigger value="one">Tab One</TabsTrigger>
        <TabsTrigger value="two">Tab Two</TabsTrigger>
      </TabsList>
      <TabsContent value="one">Content One</TabsContent>
      <TabsContent value="two">Content Two</TabsContent>
    </Tabs>,
  );
}

describe("Tabs pill variant", () => {
  it("renders tablist with data-variant='pill'", () => {
    renderPillTabs();
    expect(screen.getByRole("tablist")).toHaveAttribute(
      "data-variant",
      "pill",
    );
  });

  it("applies pill container styles (no border-b)", () => {
    renderPillTabs();
    const list = screen.getByRole("tablist");
    expect(list.className).not.toContain("border-b");
    expect(list.className).toContain("rounded-full");
  });

  it("renders tablist with group class for pill variant", () => {
    renderPillTabs();
    expect(screen.getByRole("tablist")).toHaveClass("group");
  });

  it("defaults to underline variant when no variant prop", () => {
    renderTabs();
    const list = screen.getByRole("tablist");
    expect(list).toHaveAttribute("data-variant", "underline");
    expect(list.className).toContain("border-b");
  });

  it("switches content on tab click in pill variant", async () => {
    const user = userEvent.setup();
    renderPillTabs();
    await user.click(screen.getByRole("tab", { name: "Tab Two" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Content Two");
  });

  it("merges custom className on pill TabsList", () => {
    render(
      <Tabs defaultValue="a">
        <TabsList variant="pill" className="custom-pill">
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A</TabsContent>
      </Tabs>,
    );
    const list = screen.getByRole("tablist");
    expect(list).toHaveClass("custom-pill");
    expect(list).toHaveClass("rounded-full");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- --run packages/ds/src/components/tabs/tabs.test.tsx`
Expected: FAIL — `variant` prop does not exist on `TabsList` yet

- [ ] **Step 3: Commit failing tests**

```bash
git add packages/ds/src/components/tabs/tabs.test.tsx
git commit -m "test: add failing tests for tabs pill variant"
```

### Task 2: Implement pill variant on TabsList

**Files:**
- Modify: `packages/ds/src/components/tabs/tabs.tsx`

- [ ] **Step 1: Add variant prop and conditional container styles to TabsList**

In `tabs.tsx`, update `TabsList` to accept a `variant` prop and apply conditional styles:

```tsx
type TabsVariant = "underline" | "pill";

type TabsListProps = ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
  variant?: TabsVariant;
};

const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, variant = "underline", ...rest }, ref) => {
    // ... existing innerRef, indicatorRef, ready state, setRefs, useEffect ...

    const isPill = variant === "pill";

    return (
      <TabsPrimitive.List
        ref={setRefs}
        data-variant={variant}
        className={cn(
          "relative flex",
          isPill
            ? "group inline-flex rounded-full bg-neutral-200 p-1 dark:bg-neutral-800/50"
            : "border-b-2 border-edge",
          className,
        )}
        {...rest}
      >
        {children}
        <div
          ref={indicatorRef}
          className={cn(
            "absolute left-0",
            isPill
              ? [
                  "inset-y-1 rounded-full gradient-fill-main",
                  ready ? "opacity-100" : "opacity-0",
                  ready
                    ? "transition-[transform,width,opacity] duration-200 ease-out"
                    : "",
                ]
              : [
                  "bottom-0 h-0.5",
                  "bg-primary-600 dark:bg-primary-400",
                  ready
                    ? "transition-[transform,width] duration-200 ease-out"
                    : "",
                ],
            "motion-reduce:transition-none",
          )}
          aria-hidden
        />
      </TabsPrimitive.List>
    );
  },
);
```

Key changes from the current code:
- New `TabsListProps` type with `variant` prop
- `data-variant` attribute on the list element (used by triggers via `group-data-`)
- `group` class added when `isPill` (needed for `group-data-[variant=pill]:` on triggers)
- Container: `rounded-full bg-neutral-200 p-1 dark:bg-neutral-800/50 inline-flex` for pill, `border-b-2 border-edge` for underline
- Indicator: `inset-y-1 rounded-full gradient-fill-main` for pill, `bottom-0 h-0.5 bg-primary-*` for underline
- Pill indicator starts `opacity-0` and transitions to `opacity-100` when `ready`

- [ ] **Step 2: Update TabsTrigger styles for pill variant via group-data**

Update `TabsTrigger` to add pill-variant styles using `group-data-[variant=pill]:` selectors:

```tsx
const TabsTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...rest }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      [
        "inline-flex items-center gap-2 px-4 py-3",
        "font-heading font-bold text-lg",
        "text-foreground",
        "transition-[color,transform] duration-200 ease-out",
        "hover:text-primary-600 dark:hover:text-primary-400",
        "data-[state=active]:text-primary-600",
        "dark:data-[state=active]:text-primary-400",
        "data-[state=active]:-translate-y-0.5",
        "disabled:opacity-20 disabled:pointer-events-none",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-primary-400 focus-visible:ring-offset-2",
        "motion-reduce:transition-none",
        // Pill variant overrides (via group data attribute)
        "group-data-[variant=pill]:relative group-data-[variant=pill]:z-10",
        "group-data-[variant=pill]:rounded-full",
        "group-data-[variant=pill]:px-5 group-data-[variant=pill]:py-1.5",
        "group-data-[variant=pill]:text-sm",
        "group-data-[variant=pill]:text-muted-foreground",
        "group-data-[variant=pill]:translate-y-0",
        "group-data-[variant=pill]:hover:text-foreground",
        "group-data-[variant=pill]:data-[state=active]:text-white",
        "group-data-[variant=pill]:data-[state=active]:translate-y-0",
        "group-data-[variant=pill]:focus-visible:ring-offset-0",
      ].join(" "),
      className,
    )}
    {...rest}
  />
));
```

Key overrides for pill:
- `relative z-10` — sit above sliding indicator
- `rounded-full px-5 py-1.5 text-sm` — compact pill shape
- `text-muted-foreground` default, `text-white` when active — replaces primary color
- `translate-y-0` — override the `-translate-y-0.5` nudge
- `hover:text-foreground` — subtle hover instead of primary
- `ring-offset-0` — tighter focus ring for pill shape

- [ ] **Step 3: Run tests to verify they pass**

Run: `npm run test -- --run packages/ds/src/components/tabs/tabs.test.tsx`
Expected: ALL PASS

- [ ] **Step 4: Run full checks**

Run: `npm run check`
Expected: lint, typecheck, and all tests pass

- [ ] **Step 5: Commit implementation**

```bash
git add packages/ds/src/components/tabs/tabs.tsx
git commit -m "feat(tabs): add pill variant with gradient sliding indicator"
```

### Task 3: Add preview page demo

**Files:**
- Modify: `apps/preview/src/app/components/tabs/page.tsx`

- [ ] **Step 1: Add pill variant demo sections to the preview page**

Add after the last `DemoSection` in the file (before the closing `</>`):

```tsx
<DemoSection title="Pill Variant">
  <Tabs defaultValue="vms">
    <TabsList variant="pill">
      <TabsTrigger value="vms">VMs</TabsTrigger>
      <TabsTrigger value="nodes">Nodes</TabsTrigger>
    </TabsList>
    <TabsContent value="vms">
      <p className="text-muted-foreground">Virtual machines overview.</p>
    </TabsContent>
    <TabsContent value="nodes">
      <p className="text-muted-foreground">Compute nodes overview.</p>
    </TabsContent>
  </Tabs>
</DemoSection>

<DemoSection title="Pill Variant (3 Options)">
  <Tabs defaultValue="compute">
    <TabsList variant="pill">
      <TabsTrigger value="compute">Compute</TabsTrigger>
      <TabsTrigger value="storage">Storage</TabsTrigger>
      <TabsTrigger value="network">Network</TabsTrigger>
    </TabsList>
    <TabsContent value="compute">
      <p className="text-muted-foreground">Compute resources and allocation.</p>
    </TabsContent>
    <TabsContent value="storage">
      <p className="text-muted-foreground">Persistent storage volumes.</p>
    </TabsContent>
    <TabsContent value="network">
      <p className="text-muted-foreground">Network configuration and policies.</p>
    </TabsContent>
  </Tabs>
</DemoSection>
```

- [ ] **Step 2: Verify preview builds**

Run: `npm run build`
Expected: Static export succeeds

- [ ] **Step 3: Commit preview update**

```bash
git add apps/preview/src/app/components/tabs/page.tsx
git commit -m "docs(preview): add pill variant tabs demo"
```

### Task 4: Update docs

- [ ] DESIGN-SYSTEM.md -- add pill variant to Tabs component docs
- [ ] ARCHITECTURE.md -- add `group-data-` pattern note if it's the first usage
- [ ] DECISIONS.md -- log decision to use data-attribute approach over React context
- [ ] BACKLOG.md -- completed items moved, deferred ideas added (pill sizes if discussed)
- [ ] CLAUDE.md -- update Tabs entry in Current Features list to mention pill variant
