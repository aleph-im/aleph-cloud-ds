# Tabs Pill Variant

**Date:** 2026-03-12
**Status:** Approved

## Summary

Add a `variant` prop to `TabsList` with two values: `"underline"` (default, current behavior) and `"pill"` (segmented control with sliding gradient pill).

## API

```tsx
<Tabs defaultValue="nodes">
  <TabsList variant="pill">
    <TabsTrigger value="vms">VMs</TabsTrigger>
    <TabsTrigger value="nodes">Nodes</TabsTrigger>
  </TabsList>
  <TabsContent value="vms">...</TabsContent>
  <TabsContent value="nodes">...</TabsContent>
</Tabs>
```

No new exports. `variant` is optional, defaults to `"underline"`.

## Visual Spec

### Container (`TabsList variant="pill"`)
- `rounded-full` shape
- `bg-neutral-800/50` (dark) / `bg-neutral-200` (light)
- `p-1` internal padding
- No bottom border (unlike underline variant)
- `inline-flex` width (shrink to content)

### Sliding Indicator (pill)
- `rounded-full`
- Uses existing `gradient-fill-main` utility class (theme-aware `--gradient-main` token, consistent with Button primary)
- `absolute inset-y-1` to fill container height minus padding — only tracks `translateX` and `width` (same as underline variant)
- Uses the existing MutationObserver + ResizeObserver logic
- Hidden (`opacity-0`) until `ready` state is true, then `opacity-100` with transition (prevents flash at width 0)
- `transition-[transform,width,opacity]` for smooth sliding
- Respects `prefers-reduced-motion`

### Triggers (when inside pill variant)
- `rounded-full` shape
- `text-muted-foreground` when inactive, `text-white` when active
- Color transition only — no translate-y nudge
- `px-5 py-1.5` padding (compact)
- `font-heading font-bold` (matches existing triggers)
- `relative z-10` to sit above the sliding indicator
- No underline hover effect

### Focus
- `focus-visible:ring-2 ring-primary-400` on trigger, adjusted for rounded shape

## Technical Approach

### TabsList changes
- Accept `variant?: "underline" | "pill"` prop
- Conditionally apply container styles based on variant
- Conditionally style the indicator div (underline = bottom bar, pill = full pill)
- Pass variant down to triggers via React context (or Radix data attribute)

### Variant context
- Add a small React context (`TabsVariantContext`) so `TabsTrigger` can read the variant and adjust its styles
- Alternative: use a `data-variant="pill"` attribute on the list and style triggers with `group-data-[variant=pill]:` — avoids context overhead

Recommendation: **data attribute approach** — simpler, no context needed, works with Tailwind `group` utilities. Requires adding `group` class to `TabsList` when `variant="pill"`.

### Indicator positioning
- Underline variant: `bottom-0, h-0.5, translateX + width`
- Pill variant: `inset-y-1, rounded-full, gradient-fill-main, translateX + width`

The `updateIndicator` function already reads `offsetLeft` and `offsetWidth`. The pill indicator uses `absolute inset-y-1` to fill the container height minus padding, so it only needs to track `translateX` and `width` — same as the underline variant.

## What Doesn't Change

- `Tabs` root — untouched
- `TabsTrigger` export signature — untouched (styles adapt via parent data attribute)
- `TabsContent` — untouched
- Default behavior — `variant` defaults to `"underline"`, zero breaking changes

## Scope

- Single size (no size prop for pill variant)
- Supports any number of triggers (2+)
- Active pill uses primary gradient fill
