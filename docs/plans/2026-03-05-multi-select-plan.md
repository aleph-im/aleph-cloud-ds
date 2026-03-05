# MultiSelect Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a searchable multi-selection dropdown with tag display, checkbox indicators, and clear-all action.

**Architecture:** Wraps cmdk + Radix Popover (same as Combobox). Trigger shows selected items as tags with overflow. Dropdown items show checkbox visuals. Selection toggles items without closing the dropdown.

**Tech Stack:** cmdk 1.1.1, Radix Popover (via radix-ui 1.4.3), CVA, Tailwind CSS 4, Vitest + Testing Library

**Design doc:** `docs/plans/2026-03-05-multi-select-design.md`

---

### Task 1: Create feature branch

**Step 1: Create and switch to feature branch**

Run: `git checkout -b feature/multi-select`

**Step 2: Verify branch**

Run: `git branch --show-current`
Expected: `feature/multi-select`

---

### Task 2: Write failing tests

**Files:**
- Create: `packages/ds/src/components/multi-select/multi-select.test.tsx`

**Step 1: Write the test file**

```tsx
// Polyfills for Radix Popover in jsdom — same as combobox.test.tsx
import { vi } from "vitest";

class MockPointerEvent extends Event {
  button: number;
  ctrlKey: boolean;
  pointerType: string;
  constructor(
    type: string,
    props: PointerEventInit & { pointerType?: string } = {},
  ) {
    super(type, props);
    this.button = props.button ?? 0;
    this.ctrlKey = props.ctrlKey ?? false;
    this.pointerType = props.pointerType ?? "mouse";
  }
}
window.PointerEvent = MockPointerEvent as unknown as typeof PointerEvent;
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}

if (typeof globalThis.DOMRect === "undefined") {
  globalThis.DOMRect = class DOMRect {
    x = 0;
    y = 0;
    width = 0;
    height = 0;
    top = 0;
    right = 0;
    bottom = 0;
    left = 0;
    constructor(x = 0, y = 0, width = 0, height = 0) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.top = y;
      this.right = x + width;
      this.bottom = y + height;
      this.left = x;
    }
    toJSON() {
      return JSON.stringify(this);
    }
    static fromRect() {
      return new DOMRect();
    }
  } as unknown as typeof DOMRect;
}

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { createRef } from "react";
import { MultiSelect } from "@ac/components/multi-select/multi-select";

const OPTIONS = [
  { value: "btc", label: "Bitcoin" },
  { value: "eth", label: "Ethereum" },
  { value: "sol", label: "Solana" },
  { value: "dot", label: "Polkadot", disabled: true },
  { value: "avax", label: "Avalanche" },
  { value: "atom", label: "Cosmos" },
];

describe("MultiSelect", () => {
  it("renders a trigger button", () => {
    render(<MultiSelect options={OPTIONS} />);
    expect(screen.getByRole("button")).toBeDefined();
  });

  it("shows placeholder when no values selected", () => {
    render(<MultiSelect options={OPTIONS} placeholder="Pick tokens..." />);
    expect(screen.getByText("Pick tokens...")).toBeDefined();
  });

  it("shows tags for selected values", () => {
    render(
      <MultiSelect
        options={OPTIONS}
        value={["btc", "eth"]}
        onValueChange={() => {}}
      />,
    );
    expect(screen.getByText("Bitcoin")).toBeDefined();
    expect(screen.getByText("Ethereum")).toBeDefined();
  });

  it("shows overflow count when more tags than maxDisplayedTags", () => {
    render(
      <MultiSelect
        options={OPTIONS}
        value={["btc", "eth", "sol", "avax", "atom"]}
        onValueChange={() => {}}
        maxDisplayedTags={2}
      />,
    );
    expect(screen.getByText("Bitcoin")).toBeDefined();
    expect(screen.getByText("Ethereum")).toBeDefined();
    expect(screen.getByText("+3 more")).toBeDefined();
    expect(screen.queryByText("Solana")).toBeNull();
  });

  it("opens popover on trigger click and shows search input", async () => {
    const user = userEvent.setup();
    render(<MultiSelect options={OPTIONS} />);
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("combobox")).toBeDefined();
  });

  it("filters options when typing in search", async () => {
    const user = userEvent.setup();
    render(<MultiSelect options={OPTIONS} />);
    await user.click(screen.getByRole("button"));
    const input = screen.getByRole("combobox");
    await user.type(input, "bit");
    expect(screen.getByText("Bitcoin")).toBeDefined();
    expect(screen.queryByText("Solana")).toBeNull();
  });

  it("toggles selection when item is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <MultiSelect options={OPTIONS} value={[]} onValueChange={onChange} />,
    );
    await user.click(screen.getByRole("button"));
    await user.click(screen.getByText("Solana"));
    expect(onChange).toHaveBeenCalledWith(["sol"]);
  });

  it("removes item when toggling an already-selected item", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <MultiSelect
        options={OPTIONS}
        value={["btc", "sol"]}
        onValueChange={onChange}
      />,
    );
    await user.click(screen.getByRole("button"));
    await user.click(screen.getByText("Solana"));
    expect(onChange).toHaveBeenCalledWith(["btc"]);
  });

  it("keeps dropdown open after selection", async () => {
    const user = userEvent.setup();
    render(
      <MultiSelect
        options={OPTIONS}
        value={[]}
        onValueChange={() => {}}
      />,
    );
    await user.click(screen.getByRole("button"));
    await user.click(screen.getByText("Solana"));
    // Dropdown should still be open — search input still visible
    expect(screen.getByRole("combobox")).toBeDefined();
  });

  it("removes individual tag via dismiss button", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <MultiSelect
        options={OPTIONS}
        value={["btc", "eth"]}
        onValueChange={onChange}
      />,
    );
    const removeBtn = screen.getByLabelText("Remove Bitcoin");
    await user.click(removeBtn);
    expect(onChange).toHaveBeenCalledWith(["eth"]);
  });

  it("clears all selections via clear-all button", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <MultiSelect
        options={OPTIONS}
        value={["btc", "eth", "sol"]}
        onValueChange={onChange}
      />,
    );
    const clearBtn = screen.getByLabelText("Clear all");
    await user.click(clearBtn);
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("shows chevron when empty, clear-all when items selected", () => {
    const { rerender } = render(
      <MultiSelect options={OPTIONS} value={[]} onValueChange={() => {}} />,
    );
    expect(screen.queryByLabelText("Clear all")).toBeNull();

    rerender(
      <MultiSelect
        options={OPTIONS}
        value={["btc"]}
        onValueChange={() => {}}
      />,
    );
    expect(screen.getByLabelText("Clear all")).toBeDefined();
  });

  it("shows empty message when no options match", async () => {
    const user = userEvent.setup();
    render(
      <MultiSelect options={OPTIONS} emptyMessage="Nothing found" />,
    );
    await user.click(screen.getByRole("button"));
    await user.type(screen.getByRole("combobox"), "zzzzz");
    expect(screen.getByText("Nothing found")).toBeDefined();
  });

  it("sets aria-invalid when error is true", () => {
    render(<MultiSelect options={OPTIONS} error />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("is disabled when disabled prop is true", () => {
    render(<MultiSelect options={OPTIONS} disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("forwards ref to trigger button", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<MultiSelect ref={ref} options={OPTIONS} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `cd packages/ds && npx vitest run src/components/multi-select/multi-select.test.tsx`
Expected: FAIL — module not found (component doesn't exist yet)

**Step 3: Commit**

```bash
git add packages/ds/src/components/multi-select/multi-select.test.tsx
git commit -m "test: add MultiSelect test suite (red)"
```

---

### Task 3: Implement MultiSelect component

**Files:**
- Create: `packages/ds/src/components/multi-select/multi-select.tsx`

**Step 1: Write the component**

```tsx
import { forwardRef, useState } from "react";
import { Popover } from "radix-ui";
import { Command } from "cmdk";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ac/lib/cn";

const triggerVariants = cva(
  [
    "inline-flex items-center gap-1.5",
    "w-full font-sans text-foreground bg-surface dark:bg-neutral-800",
    "border-0 shadow-brand rounded-2xl",
    "focus-visible:outline-none focus-visible:ring-3",
    "focus-visible:ring-primary-500",
    "disabled:opacity-50 disabled:pointer-events-none",
    "ring-0 transition-[color,box-shadow]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "min-h-9 py-1 px-3 text-sm",
        md: "min-h-11 py-1.5 px-4 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const tagVariants = cva(
  [
    "inline-flex items-center gap-1 rounded-full bg-muted",
    "text-foreground max-w-32 select-none",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-0.5 text-sm",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type MultiSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type MultiSelectProps = VariantProps<typeof triggerVariants> & {
  options: MultiSelectOption[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  maxDisplayedTags?: number;
  size?: "sm" | "md";
  error?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
};

const MultiSelect = forwardRef<HTMLButtonElement, MultiSelectProps>(
  (
    {
      options,
      value = [],
      onValueChange,
      placeholder = "Select...",
      searchPlaceholder = "Search...",
      emptyMessage = "No results found.",
      maxDisplayedTags = 3,
      size,
      error = false,
      disabled = false,
      className,
      id,
      "aria-describedby": ariaDescribedBy,
      ...rest
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const hasSelection = value.length > 0;

    const selectedOptions = options.filter((o) => value.includes(o.value));
    const displayedTags = selectedOptions.slice(0, maxDisplayedTags);
    const overflowCount = selectedOptions.length - displayedTags.length;

    function toggle(optionValue: string) {
      if (!onValueChange) return;
      const next = value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue];
      onValueChange(next);
      setSearch("");
    }

    function removeTag(
      e: React.MouseEvent,
      optionValue: string,
    ) {
      e.stopPropagation();
      onValueChange?.(value.filter((v) => v !== optionValue));
    }

    function clearAll(e: React.MouseEvent) {
      e.stopPropagation();
      onValueChange?.([]);
    }

    return (
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger
          ref={ref}
          id={id}
          disabled={disabled}
          aria-describedby={ariaDescribedBy}
          aria-invalid={error || undefined}
          className={cn(
            triggerVariants({ size }),
            "flex-wrap",
            error && "border-3 border-error-400 hover:border-error-500",
            !hasSelection && "text-muted-foreground",
            className,
          )}
          {...rest}
        >
          {hasSelection ? (
            <>
              {displayedTags.map((opt) => (
                <span
                  key={opt.value}
                  className={tagVariants({ size })}
                >
                  <span className="truncate">{opt.label}</span>
                  <button
                    type="button"
                    aria-label={`Remove ${opt.label}`}
                    onClick={(e) => removeTag(e, opt.value)}
                    className={cn(
                      "shrink-0 rounded-full",
                      "hover:bg-foreground/10 transition-colors",
                      size === "sm" ? "size-3.5" : "size-4",
                    )}
                    tabIndex={-1}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-full"
                      aria-hidden="true"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </span>
              ))}
              {overflowCount > 0 && (
                <span
                  className={cn(
                    "text-muted-foreground shrink-0",
                    size === "sm" ? "text-xs" : "text-sm",
                  )}
                >
                  +{overflowCount} more
                </span>
              )}
              <button
                type="button"
                aria-label="Clear all"
                onClick={clearAll}
                className={cn(
                  "ml-auto shrink-0 rounded-full text-muted-foreground",
                  "hover:text-foreground transition-colors",
                  size === "sm" ? "size-4" : "size-5",
                )}
                tabIndex={-1}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-full"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </>
          ) : (
            <>
              <span className="truncate flex-1 text-left">
                {placeholder}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn(
                  "ml-auto size-4 shrink-0 text-muted-foreground",
                  "transition-transform motion-reduce:transition-none",
                  open && "rotate-180",
                )}
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </>
          )}
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className={cn(
              "z-50 w-[var(--radix-popover-trigger-width)]",
              "overflow-hidden rounded-2xl",
              "bg-surface border border-edge shadow-brand",
            )}
            sideOffset={4}
            align="start"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <Command shouldFilter>
              <Command.Input
                placeholder={searchPlaceholder}
                value={search}
                onValueChange={setSearch}
                className={cn(
                  "w-full border-b border-edge bg-transparent px-4 py-2.5",
                  "text-sm text-foreground placeholder:text-muted-foreground",
                  "outline-none",
                )}
              />
              <Command.List className="max-h-60 overflow-y-auto p-1">
                <Command.Empty className="px-4 py-6 text-center text-sm text-muted-foreground">
                  {emptyMessage}
                </Command.Empty>
                {options.map((option) => {
                  const selected = value.includes(option.value);
                  return (
                    <Command.Item
                      key={option.value}
                      value={option.label}
                      {...(option.disabled ? { disabled: true } : {})}
                      onSelect={() => toggle(option.value)}
                      className={cn(
                        "relative flex items-center gap-2 rounded-xl px-3 py-2",
                        "text-sm text-foreground cursor-pointer select-none",
                        "outline-none",
                        "data-[selected=true]:bg-muted",
                        "data-[disabled=true]:opacity-50",
                        "data-[disabled=true]:pointer-events-none",
                      )}
                    >
                      {/* Checkbox visual */}
                      <span
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center",
                          "rounded border-2 transition-colors",
                          selected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-edge bg-surface",
                        )}
                        aria-hidden="true"
                      >
                        {selected && (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={3}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="size-3"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </span>
                      <span className="flex-1">{option.label}</span>
                    </Command.Item>
                  );
                })}
              </Command.List>
            </Command>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
  },
);

MultiSelect.displayName = "MultiSelect";

export {
  MultiSelect,
  triggerVariants,
  type MultiSelectProps,
  type MultiSelectOption,
};
```

**Step 2: Run tests to verify they pass**

Run: `cd packages/ds && npx vitest run src/components/multi-select/multi-select.test.tsx`
Expected: All 14 tests PASS

**Step 3: Commit**

```bash
git add packages/ds/src/components/multi-select/multi-select.tsx
git commit -m "feat: implement MultiSelect component"
```

---

### Task 4: Add subpath export

**Files:**
- Modify: `packages/ds/package.json`

**Step 1: Add the export entry**

Add to the `"exports"` object in `packages/ds/package.json`:

```json
"./multi-select": "./src/components/multi-select/multi-select.tsx",
```

Place it alphabetically after `"./lib/cn"`.

**Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: No errors

**Step 3: Commit**

```bash
git add packages/ds/package.json
git commit -m "feat: add multi-select subpath export"
```

---

### Task 5: Create preview page

**Files:**
- Create: `apps/preview/src/app/components/multi-select/page.tsx`

**Step 1: Write the preview page**

```tsx
"use client";

import { useState } from "react";
import { MultiSelect } from "@aleph-front/ds/multi-select";
import { FormField } from "@aleph-front/ds/form-field";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

const TOKENS = [
  { value: "btc", label: "Bitcoin" },
  { value: "eth", label: "Ethereum" },
  { value: "sol", label: "Solana" },
  { value: "dot", label: "Polkadot" },
  { value: "avax", label: "Avalanche" },
  { value: "atom", label: "Cosmos" },
  { value: "ada", label: "Cardano" },
  { value: "deprecated", label: "Legacy Token", disabled: true },
];

const REGIONS = [
  { value: "us-east", label: "US East" },
  { value: "us-west", label: "US West" },
  { value: "eu-west", label: "EU West" },
  { value: "ap-south", label: "Asia Pacific" },
];

export default function MultiSelectPage() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <>
      <PageHeader
        title="MultiSelect"
        description="A searchable dropdown for choosing multiple items from a list."
      />

      <div className="space-y-12">
        <DemoSection title="Default">
          <div className="max-w-sm">
            <MultiSelect
              options={TOKENS}
              placeholder="Select tokens..."
            />
          </div>
        </DemoSection>

        <DemoSection title="With Pre-selected Values">
          <div className="max-w-sm">
            <MultiSelect
              options={TOKENS}
              value={["btc", "eth", "sol"]}
              onValueChange={() => {}}
              placeholder="Select tokens..."
            />
          </div>
        </DemoSection>

        <DemoSection title="Overflow (maxDisplayedTags=2)">
          <div className="max-w-sm">
            <MultiSelect
              options={TOKENS}
              value={["btc", "eth", "sol", "avax", "atom"]}
              onValueChange={() => {}}
              maxDisplayedTags={2}
              placeholder="Select tokens..."
            />
          </div>
        </DemoSection>

        <DemoSection title="Sizes">
          <div className="max-w-sm space-y-4">
            <MultiSelect
              options={REGIONS}
              placeholder="Small"
              size="sm"
            />
            <MultiSelect
              options={REGIONS}
              placeholder="Medium"
              size="md"
            />
          </div>
        </DemoSection>

        <DemoSection title="States">
          <div className="max-w-sm space-y-4">
            <MultiSelect
              options={REGIONS}
              disabled
              placeholder="Disabled"
            />
            <MultiSelect
              options={REGIONS}
              error
              placeholder="Error"
            />
          </div>
        </DemoSection>

        <DemoSection title="Controlled">
          <div className="max-w-sm space-y-2">
            <MultiSelect
              options={TOKENS}
              value={value}
              onValueChange={setValue}
              placeholder="Search tokens..."
            />
            <p className="text-sm text-muted-foreground">
              Selected: {value.length > 0 ? value.join(", ") : "(none)"}
            </p>
          </div>
        </DemoSection>

        <DemoSection title="With FormField">
          <div className="max-w-sm space-y-4">
            <FormField label="Tokens" required>
              <MultiSelect
                options={TOKENS}
                placeholder="Select tokens..."
              />
            </FormField>
            <FormField
              label="Regions"
              helperText="Choose deployment regions"
            >
              <MultiSelect
                options={REGIONS}
                placeholder="Select regions..."
              />
            </FormField>
            <FormField
              label="Tokens"
              required
              error="At least one token is required"
            >
              <MultiSelect
                options={TOKENS}
                error
                placeholder="Select tokens..."
              />
            </FormField>
          </div>
        </DemoSection>
      </div>
    </>
  );
}
```

**Step 2: Commit**

```bash
git add apps/preview/src/app/components/multi-select/page.tsx
git commit -m "feat: add MultiSelect preview page"
```

---

### Task 6: Add sidebar entry

**Files:**
- Modify: `apps/preview/src/components/sidebar.tsx`

**Step 1: Add MultiSelect to the Forms group**

In the `NAV` array, inside the `Forms` group items array, add after the Combobox entry:

```tsx
{ label: "MultiSelect", href: "/components/multi-select" },
```

The Forms group items should now be (showing just the new line in context):

```tsx
{ label: "Combobox", href: "/components/combobox" },
{ label: "MultiSelect", href: "/components/multi-select" },
{ label: "Slider", href: "/components/slider" },
```

**Step 2: Commit**

```bash
git add apps/preview/src/components/sidebar.tsx
git commit -m "feat: add MultiSelect to sidebar navigation"
```

---

### Task 7: Run full checks

**Step 1: Run all checks**

Run: `npm run check`
Expected: lint, typecheck, and all tests pass

**Step 2: Start dev server and verify preview page**

Run: `npm run dev`
Then navigate to `http://localhost:3000/components/multi-select` and verify:
- All demo sections render
- Tags display correctly with dismiss buttons
- Overflow "+N more" works
- Search filters the dropdown
- Checkbox visuals show in items
- Clear-all x works
- Error and disabled states display
- Light and dark themes both look correct

Ask the user to check before proceeding.

---

### Task 8: Update docs

**Files:**
- Modify: `docs/DESIGN-SYSTEM.md` — add MultiSelect to Components section
- Modify: `docs/ARCHITECTURE.md` — no new patterns (reuses Combobox pattern)
- Modify: `docs/DECISIONS.md` — log design decisions
- Modify: `docs/BACKLOG.md` — move item to Completed
- Modify: `CLAUDE.md` — update Current Features list and page count

**Step 1: Update DESIGN-SYSTEM.md**

Add MultiSelect documentation to the Components section, following the pattern of the Combobox entry. Include: description, props table, usage examples.

**Step 2: Update DECISIONS.md**

Add decision entry for MultiSelect with:
- Context: Multi-select dropdown component
- Decision: Built on cmdk + Radix Popover (same as Combobox), tags with overflow, visual-only checkbox indicators, clear-all action
- Rationale: Reuses proven stack, keeps dropdown open for multi-toggle, search clears after each selection
- Alternatives: Radix Select (no multi-select support), Downshift (more boilerplate), Listbox pattern (no search)

**Step 3: Update BACKLOG.md**

Move "Multi-select dropdown with checkboxes" from Open Items to Completed section.

**Step 4: Update CLAUDE.md**

Add to Current Features:
```
- MultiSelect component (cmdk + Radix Popover) with searchable dropdown, flat options prop, tags with overflow (maxDisplayedTags), per-tag dismiss, clear-all action, checkbox indicators, 2 sizes, shadow-brand, error/disabled
```

Update preview app page count (22 -> 23 pages).

**Step 5: Commit**

```bash
git add docs/DESIGN-SYSTEM.md docs/DECISIONS.md docs/BACKLOG.md CLAUDE.md
git commit -m "docs: add MultiSelect to design system docs"
```

---

Plan complete and saved to `docs/plans/2026-03-05-multi-select-plan.md`. Two execution options:

**1. Subagent-Driven (this session)** — I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** — Open new session with executing-plans, batch execution with checkpoints

Which approach?