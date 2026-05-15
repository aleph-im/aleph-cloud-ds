# Nav Item States — Design Spec

## Overview

Refine the rest / hover / focus-visible / active states for nav items in two shell primitives:

- **ProductStrip** tabs (`packages/ds/src/components/product-strip/product-strip.tsx`)
- **AppShellSidebar** `NavItem` (`packages/ds/src/components/app-shell-sidebar/app-shell-sidebar.tsx`)

Both surfaces share a single state vocabulary — hover and active sit on the same primary-tinted spectrum, separated by intensity. Focus-visible is an additive outline that stacks with whatever other state the item is in.

## Problem

Today's nav items use `hover:text-foreground hover:bg-muted`. The `--muted` token resolves to:

- **Light theme:** `var(--color-primary-100)` — the same color as the active-state pill background. Hover and active are visually identical except for text weight/color.
- **Dark theme:** `var(--color-base-900)` — the same color as the sidebar/topbar surface (`bg-surface`). Hover produces no visible background change.

The active state itself reads correctly in light theme but feels muddy in dark theme: `bg-primary-900` (a dark purple) on `base-900` (a near-equal dark neutral) gives the pill almost no edge against its surface.

## Goals

1. Hover, focus-visible, and active are all visually distinct in both themes.
2. Hover and active share the same color vocabulary, making the relationship feel intentional — active is "hover, intensified."
3. Dark-theme active stays in the same character as light-theme active (a soft tint over the surface), rather than switching to a darker-purple-on-dark-surface pattern.
4. Focus-visible is keyboard-only and additive (stacks with hover/active, doesn't replace them).

## State Specification

| State | Light theme | Dark theme |
|---|---|---|
| **Rest** | `text-muted-foreground` | `text-muted-foreground` |
| **Hover** | `bg-primary-100/50` + `text-primary-700` | `bg-primary-500/8` + `text-primary-200` |
| **Focus-visible** | `outline-2 outline-primary-500 outline-offset-2` | `outline-2 outline-primary-300 outline-offset-2` |
| **Active** | `bg-primary-100` + `text-primary-700` + `font-medium` | `bg-primary-500/18` + `text-primary-200` + `font-medium` |

Notes:

- Tailwind opacity modifiers (`/50`, `/8`, `/18`) emit `color-mix()` against the resolved primary value, so they work uniformly across both themes without needing separate token aliases.
- `outline-*` (not `ring-*`) is the chosen focus-visible primitive because the nav items sit inside surfaces with their own border-radius and outline doesn't trigger layout shift. The `outline-offset-2` clears the rounded corner cleanly.
- The focus outline color in dark theme is `primary-300` rather than `primary-500` — saturation is similar but lightness lifts it off the dark surface.

## Mental Model

A single primary-tinted spectrum:

```
rest  →  hover  →  active
 0%   →   ~33%  →   100%
```

- **Rest:** muted-foreground text, transparent background.
- **Hover:** primary text + ~½-strength tint (light: `primary-100/50`, dark: `primary-500/8`).
- **Active:** primary text + full tint (light: `primary-100`, dark: `primary-500/18`) + medium font weight.

Focus-visible is orthogonal: a 2px primary outline at `outline-offset-2`, applied via `focus-visible:` (not `focus:`) so mouse clicks don't trigger it.

## Scope

**In scope:**

- `ProductStrip` — the inline `<a>` elements rendered inside `<nav aria-label="Aleph products">`.
- `AppShellSidebar` `NavItem` — both branches (the bare `<a>` and the `asChild` cloned element).

**Out of scope (no change):**

- `SectionTitleRow` accordion toggles in the sidebar — keep their current `hover:text-foreground hover:bg-muted`.
- `CollapseToggle` button at the bottom of the sidebar — keep its current treatment.
- All other DS components (Button, Tabs, Pagination, etc.) — they have their own state systems.
- Token definitions in `tokens.css` — no token changes; we apply states via Tailwind utilities in the two components.

## Implementation Notes

### Class composition

Both components build their class strings with `cn()` and a conditional active block. The new states slot in alongside:

Both components branch hover off the active state — hover and active are mutually exclusive in the class list:

```tsx
// ProductStrip tab anchor
className={cn(
  "rounded-md px-2 py-1 text-sm transition-colors",
  "focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2",
  "dark:focus-visible:outline-primary-300",
  isActive
    ? [
        "bg-primary-100 text-primary-700 font-medium",
        "dark:bg-primary-500/18 dark:text-primary-200",
      ]
    : [
        "text-muted-foreground",
        "hover:bg-primary-100/50 hover:text-primary-700",
        "dark:hover:bg-primary-500/8 dark:hover:text-primary-200",
      ],
)}
```

```tsx
// NavItem — same shape
const classes = cn(
  "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
  "focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2",
  "dark:focus-visible:outline-primary-300",
  active
    ? [
        "bg-primary-100 text-primary-700 font-medium",
        "dark:bg-primary-500/18 dark:text-primary-200",
      ]
    : [
        "text-muted-foreground",
        "hover:bg-primary-100/50 hover:text-primary-700",
        "dark:hover:bg-primary-500/8 dark:hover:text-primary-200",
      ],
  className,
);
```

**Why branch instead of always-on hover:** `hover:bg-X` has higher CSS specificity than `bg-Y` (extra `:hover` pseudo-class), so hovering an active item would otherwise let the lighter hover background win over the full-strength active background. Mutually exclusive class lists sidestep that.

### Transition duration

Both components already set `transitionDuration: var(--duration-fast)` via inline `style`. Keep this — the `transition-colors` utility covers `outline-color` in modern Tailwind 4, so the focus outline also fades in/out smoothly. No change needed.

### Tailwind 4 + arbitrary opacity values

Tailwind 4 supports `/8` and `/18` as arbitrary opacity modifiers natively (no JIT config). These resolve to `color-mix(in oklch, var(--color-primary-500) 8%, transparent)`. Confirmed by existing usage of `oklch(from var(--color-primary-100) l c h / 0.40)` patterns in `tokens.css`.

## Testing

- **Unit tests:** No new tests required for the visual change itself. Existing tests in `product-strip.test.tsx` and `app-shell-sidebar.test.tsx` continue to verify behavior (active state announces `aria-current="page"`, etc.) — they don't assert specific class names.
- **Preview pages:** Visually verify in both light and dark themes on:
  - `/components/product-strip` (or wherever the ProductStrip preview lives)
  - `/components/app-shell-sidebar` (or wherever the sidebar preview lives)
- Verify keyboard navigation shows the focus ring on Tab; verify mouse click does NOT show the focus ring.
- Verify hover does not apply when the item is already active (both components branch hover off the active state).

## Documentation Updates

- `docs/DESIGN-SYSTEM.md` — update the ProductStrip and AppShellSidebar `NavItem` sections to describe the new state vocabulary.
- `docs/ARCHITECTURE.md` — no change (no new patterns, no new files).
- `CLAUDE.md` — update the ProductStrip and AppShellSidebar entries in the Current Features list to mention the refined state system.
- `docs/DECISIONS.md` — log the decision (hover and active on the same primary-tinted spectrum; dark theme uses translucent `primary-500` over the surface rather than `primary-900` fill).
- `docs/BACKLOG.md` — no entry expected.
