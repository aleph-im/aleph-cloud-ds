# Tabs Overflow Collapse Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `overflow="collapse"` to `TabsList` that auto-hides trailing tabs into a "..." popover dropdown when they exceed available width.

**Architecture:** The overflow logic lives entirely inside `TabsList`. A `useOverflow` hook measures tab children via `ResizeObserver` + `getBoundingClientRect`, computes a breakpoint index, builds the hidden tabs array, and applies `visibility: hidden` styles — all inside the effect, not the render phase. Hidden tabs stay in the DOM so Radix's state machine stays intact. A Radix Popover with a `DotsThree` trigger renders dropdown items that programmatically `.click()` the hidden triggers. The `Tabs` root export stays unchanged (direct Radix re-export).

**Tech Stack:** React 19, Radix UI (Tabs + Popover), Phosphor Icons, Tailwind CSS 4, Vitest + Testing Library

**Spec:** `docs/superpowers/specs/2026-03-13-tabs-overflow-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `packages/ds/src/components/tabs/tabs.tsx` | Modify | Add `overflow` prop to `TabsList`, `useOverflow` hook, overflow trigger + popover dropdown |
| `packages/ds/src/components/tabs/tabs.test.tsx` | Modify | Add overflow collapse tests |
| `apps/preview/src/app/components/tabs/page.tsx` | Modify | Add overflow demo sections (8 tabs, constrained width) |

---

## Chunk 1: Core Overflow Logic

### Task 1: Add `overflow` prop, overflow trigger, and popover dropdown

**Files:**
- Modify: `packages/ds/src/components/tabs/tabs.tsx`
- Modify: `packages/ds/src/components/tabs/tabs.test.tsx`

This task adds the `overflow` prop to `TabsListProps`, renders the `OverflowTrigger` component with Radix Popover, and exports the updated types.

- [ ] **Step 1: Write failing tests for overflow trigger and dropdown**

Add to `tabs.test.tsx`:

```tsx
/* ── Overflow collapse ───────────────────────── */

function renderOverflowTabs({
  defaultValue = "tab-1",
  containerWidth = 300,
  includeDisabled = false,
}: {
  defaultValue?: string;
  containerWidth?: number;
  includeDisabled?: boolean;
} = {}) {
  return render(
    <div style={{ width: containerWidth }}>
      <Tabs defaultValue={defaultValue}>
        <TabsList overflow="collapse">
          <TabsTrigger value="tab-1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab-2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab-3">Tab 3</TabsTrigger>
          <TabsTrigger value="tab-4">Tab 4</TabsTrigger>
          <TabsTrigger value="tab-5">Tab 5</TabsTrigger>
          <TabsTrigger value="tab-6">Tab 6</TabsTrigger>
          <TabsTrigger value="tab-7">Tab 7</TabsTrigger>
          <TabsTrigger value="tab-8" {...(includeDisabled ? { disabled: true } : {})}>
            Tab 8
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab-1">Content 1</TabsContent>
        <TabsContent value="tab-2">Content 2</TabsContent>
        <TabsContent value="tab-3">Content 3</TabsContent>
        <TabsContent value="tab-4">Content 4</TabsContent>
        <TabsContent value="tab-5">Content 5</TabsContent>
        <TabsContent value="tab-6">Content 6</TabsContent>
        <TabsContent value="tab-7">Content 7</TabsContent>
        <TabsContent value="tab-8">Content 8</TabsContent>
      </Tabs>
    </div>,
  );
}

describe("Tabs overflow collapse", () => {
  it("renders overflow trigger when overflow='collapse' is set", () => {
    renderOverflowTabs();
    expect(
      screen.getByRole("button", { name: "More tabs" }),
    ).toBeDefined();
  });

  it("does not render overflow trigger without overflow prop", () => {
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A</TabsContent>
      </Tabs>,
    );
    expect(
      screen.queryByRole("button", { name: "More tabs" }),
    ).toBeNull();
  });

  it("accepts overflow prop on TabsList without type error", () => {
    const { container } = render(
      <Tabs defaultValue="a">
        <TabsList overflow="collapse">
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A</TabsContent>
      </Tabs>,
    );
    expect(container).toBeDefined();
  });

  it("renders all TabsTrigger elements in the DOM even when overflowed", () => {
    renderOverflowTabs();
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(8);
  });

  it("shows default tab content when overflow is enabled", () => {
    renderOverflowTabs({ defaultValue: "tab-1" });
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Content 1");
  });

  it("preserves variant prop alongside overflow prop", () => {
    render(
      <Tabs defaultValue="a">
        <TabsList variant="pill" overflow="collapse">
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A</TabsContent>
      </Tabs>,
    );
    expect(screen.getByRole("tablist")).toHaveAttribute(
      "data-variant",
      "pill",
    );
    expect(
      screen.getByRole("button", { name: "More tabs" }),
    ).toBeDefined();
  });
});

describe("Tabs overflow dropdown", () => {
  it("opens popover when overflow trigger is clicked", async () => {
    const user = userEvent.setup();
    renderOverflowTabs();
    await user.click(screen.getByRole("button", { name: "More tabs" }));
    expect(
      screen.getByRole("button", { name: "More tabs" }),
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("closes popover on Escape", async () => {
    const user = userEvent.setup();
    renderOverflowTabs();
    await user.click(screen.getByRole("button", { name: "More tabs" }));
    await user.keyboard("{Escape}");
    // Radix may remove aria-expanded or set to "false"
    const trigger = screen.getByRole("button", { name: "More tabs" });
    const expanded = trigger.getAttribute("aria-expanded");
    expect(expanded === null || expanded === "false").toBe(true);
  });

  it("does not activate a disabled tab from the dropdown", async () => {
    const user = userEvent.setup();
    renderOverflowTabs({ includeDisabled: true });
    await user.click(screen.getByRole("button", { name: "More tabs" }));
    // The disabled item in the dropdown should not change the active tab
    // (dropdown items for disabled triggers have disabled attribute)
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Content 1");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd packages/ds && npx vitest run src/components/tabs/tabs.test.tsx`
Expected: FAIL — `overflow` prop not recognized, "More tabs" button not found.

- [ ] **Step 3: Implement overflow trigger and popover**

In `tabs.tsx`:

**Update the existing `radix-ui` import** (replace line 10, do NOT add a second import):

```tsx
import { Tabs as TabsPrimitive, Popover } from "radix-ui";
```

Add Phosphor import:

```tsx
import { DotsThree } from "@phosphor-icons/react";
```

Update `TabsListProps`:

```tsx
type TabsListProps = ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
  variant?: TabsVariant;
  overflow?: "collapse";
};
```

Add the `HiddenTab` type and `OverflowTrigger` component (above `TabsList`):

```tsx
type HiddenTab = {
  value: string;
  label: string;
  disabled: boolean;
  triggerEl: HTMLElement;
};

type OverflowTriggerProps = {
  isPill: boolean;
  hiddenTabs: HiddenTab[];
  hasActiveHidden: boolean;
  visible: boolean;
};

const OverflowTrigger = forwardRef<HTMLButtonElement, OverflowTriggerProps>(
  ({ isPill, hiddenTabs, hasActiveHidden, visible }, ref) => {
    const [open, setOpen] = useState(false);

    return (
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            ref={ref}
            type="button"
            aria-label="More tabs"
            className={cn(
              "inline-flex items-center justify-center shrink-0",
              "font-heading font-bold",
              "text-muted-foreground",
              "transition-colors duration-200",
              "hover:text-primary-600 dark:hover:text-primary-400",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-primary-400 focus-visible:ring-offset-2",
              "motion-reduce:transition-none",
              isPill
                ? "relative z-10 rounded-full px-3 py-1.5 text-sm"
                : "px-4 py-3 text-lg",
              hasActiveHidden && "text-primary-600 dark:text-primary-400",
              !visible && "invisible",
            )}
          >
            <DotsThree weight="bold" className="size-5" aria-hidden="true" />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className={cn(
              "z-50 min-w-[8rem]",
              "rounded-md bg-surface border border-edge shadow-brand",
              "p-1",
              "motion-reduce:transition-none",
            )}
            sideOffset={4}
            align="end"
          >
            {hiddenTabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                disabled={tab.disabled}
                onClick={() => {
                  tab.triggerEl.click();
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center rounded-sm px-3 py-2",
                  "text-sm text-foreground cursor-pointer select-none",
                  "outline-none",
                  "hover:bg-muted focus-visible:bg-muted",
                  "disabled:opacity-50 disabled:pointer-events-none",
                  tab.triggerEl.dataset.state === "active" &&
                    "text-primary-600 dark:text-primary-400 font-bold",
                )}
              >
                {tab.label}
              </button>
            ))}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
  },
);

OverflowTrigger.displayName = "OverflowTrigger";
```

In `TabsList`, destructure `overflow` and conditionally render the trigger. **Do not add `overflow-hidden`** to the className — hidden tabs use `visibility: hidden; position: absolute` so they don't affect layout:

```tsx
const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, variant = "underline", overflow, ...rest }, ref) => {
    // ... existing innerRef, indicatorRef, ready state, setRefs, useEffect ...
    const isPill = variant === "pill";
    const isCollapse = overflow === "collapse";
    const overflowTriggerRef = useRef<HTMLButtonElement>(null);

    return (
      <TabsPrimitive.List
        ref={setRefs}
        data-variant={variant}
        className={cn(
          "relative flex",
          isPill
            ? "group inline-flex rounded-full bg-neutral-200 p-1 dark:bg-neutral-800/50"
            : "border-b-4 border-edge/40",
          className,
        )}
        {...rest}
      >
        {children}
        {isCollapse && (
          <OverflowTrigger
            ref={overflowTriggerRef}
            isPill={isPill}
            hiddenTabs={[]}
            hasActiveHidden={false}
            visible={false}
          />
        )}
        {/* existing indicator div unchanged */}
      </TabsPrimitive.List>
    );
  },
);
```

Note: `hiddenTabs` is empty and `visible` is `false` for now — wired up in Task 2.

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd packages/ds && npx vitest run src/components/tabs/tabs.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/ds/src/components/tabs/tabs.tsx packages/ds/src/components/tabs/tabs.test.tsx
git commit -m "feat(tabs): add overflow='collapse' prop with trigger and popover"
```

### Task 2: Implement `useOverflow` measurement hook

**Files:**
- Modify: `packages/ds/src/components/tabs/tabs.tsx`

This is the core measurement logic. The hook uses ResizeObserver + `getBoundingClientRect` to compute which tabs fit, applies `visibility: hidden` styles to overflowed tabs, builds the `hiddenTabs` array, and handles focus management — all inside the effect, not the render phase.

- [ ] **Step 1: Implement `useOverflow` hook**

Add `useCallback` to the React import (alongside the existing `forwardRef`, `useEffect`, `useRef`, `useState`).

Add this hook inside `tabs.tsx` (above `OverflowTrigger`):

```tsx
function useOverflow(
  listRef: React.RefObject<HTMLElement | null>,
  overflowTriggerRef: React.RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const [hiddenTabs, setHiddenTabs] = useState<HiddenTab[]>([]);
  const [hasActiveHidden, setHasActiveHidden] = useState(false);

  const measure = useCallback(() => {
    const list = listRef.current;
    const trigger = overflowTriggerRef.current;
    if (!list || !trigger || !enabled) {
      setHiddenTabs([]);
      setHasActiveHidden(false);
      return;
    }

    const tabs = Array.from(
      list.querySelectorAll<HTMLElement>('[role="tab"]'),
    );

    // Reset all tabs to normal flow so they can be measured.
    // Only this hook sets these inline styles, so clearing to empty
    // string is the correct "restore visible" operation.
    for (const tab of tabs) {
      tab.style.visibility = "";
      tab.style.position = "";
      tab.style.pointerEvents = "";
    }

    const containerLeft = list.getBoundingClientRect().left;
    const containerWidth = list.clientWidth;
    const triggerWidth = trigger.offsetWidth;

    let newBreakIndex: number | null = null;

    for (let i = 0; i < tabs.length; i++) {
      const tabRight = tabs[i].getBoundingClientRect().right - containerLeft;
      // If this tab's right edge + the trigger width exceeds the container,
      // this is where we need to break
      if (tabRight + triggerWidth > containerWidth) {
        newBreakIndex = i;
        break;
      }
    }

    // Check if the last tab fits WITHOUT the trigger (no overflow needed)
    if (newBreakIndex === null) {
      const lastTab = tabs[tabs.length - 1];
      if (lastTab) {
        const lastRight =
          lastTab.getBoundingClientRect().right - containerLeft;
        if (lastRight <= containerWidth) {
          // All tabs fit — restore and clear state
          setHiddenTabs([]);
          setHasActiveHidden(false);
          return;
        }
      }
      setHiddenTabs([]);
      setHasActiveHidden(false);
      return;
    }

    // Apply hidden styles only to overflowed tabs.
    // Visible tabs get their styles restored (already reset above).
    for (let i = newBreakIndex; i < tabs.length; i++) {
      tabs[i].style.visibility = "hidden";
      tabs[i].style.position = "absolute";
      tabs[i].style.pointerEvents = "none";
    }

    // Focus management: if the focused element moved into overflow,
    // shift focus to the "..." trigger
    const focused = document.activeElement;
    if (focused instanceof HTMLElement) {
      for (let i = newBreakIndex; i < tabs.length; i++) {
        if (tabs[i] === focused || tabs[i].contains(focused)) {
          trigger.focus();
          break;
        }
      }
    }

    // Build hiddenTabs array inside the effect (not during render)
    const newHidden: HiddenTab[] = [];
    let activeHidden = false;
    for (let i = newBreakIndex; i < tabs.length; i++) {
      const tab = tabs[i];
      newHidden.push({
        value: tab.getAttribute("data-value") ?? tab.id ?? "",
        label: tab.textContent ?? "",
        disabled: tab.hasAttribute("disabled"),
        triggerEl: tab,
      });
      if (tab.dataset.state === "active") activeHidden = true;
    }

    setHiddenTabs(newHidden);
    setHasActiveHidden(activeHidden);
  }, [listRef, overflowTriggerRef, enabled]);

  useEffect(() => {
    const list = listRef.current;
    if (!list || !enabled) return;

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(list);

    // Also re-measure when tab state changes (e.g., dropdown item clicked)
    const mutationObserver = new MutationObserver(measure);
    mutationObserver.observe(list, {
      attributes: true,
      subtree: true,
      attributeFilter: ["data-state"],
    });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [enabled, measure]);

  return { hiddenTabs, hasActiveHidden };
}
```

**Note on `data-value` attribute:** Radix Tabs renders `data-value` on `TabsTrigger` elements. The hook reads `tab.getAttribute("data-value")` to extract the tab value. Verify during implementation by inspecting the DOM — if Radix uses a different attribute, adjust accordingly.

- [ ] **Step 2: Wire `useOverflow` into `TabsList`**

Update `TabsList` to use the hook and pass results to `OverflowTrigger`. Also update the indicator logic to hide when the active tab is overflowed:

```tsx
const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, variant = "underline", overflow, ...rest }, ref) => {
    const innerRef = useRef<HTMLDivElement>(null);
    const indicatorRef = useRef<HTMLDivElement>(null);
    const overflowTriggerRef = useRef<HTMLButtonElement>(null);
    const [ready, setReady] = useState(false);
    const isPill = variant === "pill";
    const isCollapse = overflow === "collapse";

    const setRefs = (node: HTMLDivElement | null) => {
      innerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    const { hiddenTabs, hasActiveHidden } = useOverflow(
      innerRef,
      overflowTriggerRef,
      isCollapse,
    );

    useEffect(() => {
      const list = innerRef.current;
      const indicator = indicatorRef.current;
      if (!list || !indicator) return;

      function updateIndicator() {
        const activeTab = list!.querySelector<HTMLElement>(
          '[data-state="active"]',
        );
        if (!activeTab || !indicator) return;

        // Hide indicator if the active tab is visually hidden (in overflow)
        if (activeTab.style.visibility === "hidden") {
          indicator.style.opacity = "0";
          return;
        }
        indicator.style.opacity = "";

        const left = activeTab.offsetLeft;
        const width = activeTab.offsetWidth;
        indicator.style.transform = `translateX(${String(left)}px)`;
        indicator.style.width = `${String(width)}px`;
        if (!ready) setReady(true);
      }

      updateIndicator();

      const observer = new MutationObserver(updateIndicator);
      observer.observe(list, {
        attributes: true,
        subtree: true,
        attributeFilter: ["data-state"],
      });

      const resizeObserver = new ResizeObserver(updateIndicator);
      resizeObserver.observe(list);

      return () => {
        observer.disconnect();
        resizeObserver.disconnect();
      };
    }, [ready]);

    return (
      <TabsPrimitive.List
        ref={setRefs}
        data-variant={variant}
        className={cn(
          "relative flex",
          isPill
            ? "group inline-flex rounded-full bg-neutral-200 p-1 dark:bg-neutral-800/50"
            : "border-b-4 border-edge/40",
          className,
        )}
        {...rest}
      >
        {children}
        {isCollapse && (
          <OverflowTrigger
            ref={overflowTriggerRef}
            isPill={isPill}
            hiddenTabs={hiddenTabs}
            hasActiveHidden={hasActiveHidden}
            visible={hiddenTabs.length > 0}
          />
        )}
        <div
          ref={indicatorRef}
          className={cn(
            "absolute left-0",
            isPill
              ? [
                  "inset-y-1 rounded-full bg-primary-600 dark:bg-primary-500",
                  ready ? "opacity-100" : "opacity-0",
                  ready
                    ? "transition-[transform,width,opacity] duration-200 ease-out"
                    : "",
                ]
              : [
                  "-bottom-1 h-1",
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

- [ ] **Step 3: Run tests to verify they pass**

Run: `cd packages/ds && npx vitest run src/components/tabs/tabs.test.tsx`
Expected: PASS

- [ ] **Step 4: Run full checks**

Run: `cd /Users/dio/Library/CloudStorage/Dropbox/Claudio/repos/aleph-cloud-ds && npm run check`
Expected: PASS (lint + typecheck + test)

- [ ] **Step 5: Commit**

```bash
git add packages/ds/src/components/tabs/tabs.tsx
git commit -m "feat(tabs): implement useOverflow measurement hook with focus management"
```

---

## Chunk 2: Preview Page + Docs

### Task 3: Add overflow demo sections to the preview page

**Files:**
- Modify: `apps/preview/src/app/components/tabs/page.tsx`

- [ ] **Step 1: Add overflow demo sections**

Add two new `DemoSection` blocks at the end of `TabsPage` — one for underline variant, one for pill variant — each with many tabs in a constrained-width container so overflow is visible. Include one disabled tab in the pill demo to verify that edge case:

```tsx
<DemoSection title="Overflow Collapse (Underline)">
  <div className="max-w-md">
    <Tabs defaultValue="compute">
      <TabsList overflow="collapse">
        <TabsTrigger value="compute">Compute</TabsTrigger>
        <TabsTrigger value="storage">Storage</TabsTrigger>
        <TabsTrigger value="network">Network</TabsTrigger>
        <TabsTrigger value="domains">Domains</TabsTrigger>
        <TabsTrigger value="functions">Functions</TabsTrigger>
        <TabsTrigger value="volumes">Volumes</TabsTrigger>
        <TabsTrigger value="secrets">Secrets</TabsTrigger>
        <TabsTrigger value="logs">Logs</TabsTrigger>
      </TabsList>
      <TabsContent value="compute">
        <p className="text-muted-foreground">Compute resources and VMs.</p>
      </TabsContent>
      <TabsContent value="storage">
        <p className="text-muted-foreground">Persistent storage volumes.</p>
      </TabsContent>
      <TabsContent value="network">
        <p className="text-muted-foreground">Network policies.</p>
      </TabsContent>
      <TabsContent value="domains">
        <p className="text-muted-foreground">Custom domains.</p>
      </TabsContent>
      <TabsContent value="functions">
        <p className="text-muted-foreground">Serverless functions.</p>
      </TabsContent>
      <TabsContent value="volumes">
        <p className="text-muted-foreground">Volume management.</p>
      </TabsContent>
      <TabsContent value="secrets">
        <p className="text-muted-foreground">Secret management.</p>
      </TabsContent>
      <TabsContent value="logs">
        <p className="text-muted-foreground">Application logs.</p>
      </TabsContent>
    </Tabs>
  </div>
</DemoSection>

<DemoSection title="Overflow Collapse (Pill)">
  <div className="max-w-sm">
    <Tabs defaultValue="all">
      <TabsList variant="pill" overflow="collapse">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="stopped">Stopped</TabsTrigger>
        <TabsTrigger value="errored">Errored</TabsTrigger>
        <TabsTrigger value="archived" disabled>Archived</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <p className="text-muted-foreground">All resources.</p>
      </TabsContent>
      <TabsContent value="active">
        <p className="text-muted-foreground">Active resources.</p>
      </TabsContent>
      <TabsContent value="pending">
        <p className="text-muted-foreground">Pending resources.</p>
      </TabsContent>
      <TabsContent value="stopped">
        <p className="text-muted-foreground">Stopped resources.</p>
      </TabsContent>
      <TabsContent value="errored">
        <p className="text-muted-foreground">Errored resources.</p>
      </TabsContent>
      <TabsContent value="archived">
        <p className="text-muted-foreground">Archived resources.</p>
      </TabsContent>
    </Tabs>
  </div>
</DemoSection>
```

- [ ] **Step 2: Run dev server and visually verify**

Run: `npm run dev`
Navigate to the Tabs page. Verify:
- Underline: trailing tabs hidden behind "..." trigger at `max-w-md`
- Pill: trailing tabs hidden behind "..." trigger at `max-w-sm`
- Clicking "..." opens dropdown with hidden tab labels
- Clicking a dropdown item switches tab content
- Resizing browser window updates which tabs overflow
- Active tab in dropdown → "..." trigger highlighted
- Disabled "Archived" tab appears muted in dropdown and cannot be activated

Ask the user to check before proceeding.

- [ ] **Step 3: Commit**

```bash
git add apps/preview/src/app/components/tabs/page.tsx
git commit -m "feat(tabs): add overflow collapse demo sections to preview page"
```

### Task 4: Update docs

- [ ] DESIGN-SYSTEM.md — add `overflow="collapse"` prop to Tabs documentation
- [ ] ARCHITECTURE.md — no new patterns (reuses existing Radix Popover + ResizeObserver patterns)
- [ ] DECISIONS.md — log decision: opt-in `overflow` prop, right-to-left collapse, programmatic `.click()` activation, `visibility: hidden` DOM strategy
- [ ] BACKLOG.md — no changes needed (this wasn't a backlog item)
- [ ] CLAUDE.md — update Tabs entry in Current Features to mention overflow collapse

- [ ] **Step 1: Update docs**

Update each file listed above.

- [ ] **Step 2: Commit**

```bash
git add docs/DESIGN-SYSTEM.md docs/DECISIONS.md CLAUDE.md
git commit -m "docs: add tabs overflow collapse to design system docs"
```
