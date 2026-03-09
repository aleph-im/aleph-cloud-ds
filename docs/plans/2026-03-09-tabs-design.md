# Tabs Component Design

## Goal

Add a Tabs component to the DS — tab list with keyboard navigation, active indicator slide animation, and optional inline badges/subscripts/superscripts.

## Figma Reference

- File: `IgJMbTgEnoJlJKQonQFBA6`, node `174:6016`
- States: Default, Active, Hover, Disabled
- Typography: Rigid Square Bold 18px (`font-heading font-bold text-lg`)
- Active: primary purple text + 2px bottom border in primary
- Hover: primary purple text
- Disabled: 20% opacity
- Full-width bottom border on the tab list (active indicator overlaps it)

## Primitive

Radix UI Tabs (`@radix-ui/react-tabs` via the `radix-ui` package). Provides keyboard navigation (arrow keys), ARIA roles (`tablist`, `tab`, `tabpanel`), focus management, and `data-state` attributes.

## API Shape: Composable

```tsx
<Tabs.Root defaultValue="compute">
  <Tabs.List>
    <Tabs.Trigger value="compute">Compute</Tabs.Trigger>
    <Tabs.Trigger value="vms">
      VMs <Badge size="sm" variant="info">3</Badge>
    </Tabs.Trigger>
    <Tabs.Trigger value="soon" disabled>
      Storage <span className="tab-superscript">SOON</span>
    </Tabs.Trigger>
  </Tabs.List>

  <Tabs.Content value="compute">...</Tabs.Content>
  <Tabs.Content value="vms">...</Tabs.Content>
</Tabs.Root>
```

**Why composable:** Tab triggers can contain arbitrary children — plain text, badges, subscripts, icons. A flat API (`tabs={[{label, value}]}`) would force render props or slot props for these, adding complexity without benefit.

**Subscript/superscript:** Not baked into the component as props. Consumers render them as children with utility classes. The DS exports the trigger with `gap-2` and `items-center` so inline elements align naturally. This avoids props that only a few consumers would use.

## Styling

### Tabs.List

- `flex` row layout, `gap-0` (tabs sit flush)
- Full-width bottom border: `border-b-2 border-edge` (the baseline)
- `relative` positioning for the sliding indicator

### Tabs.Trigger

- `font-heading font-bold text-lg` (Rigid Square Bold 18px)
- `px-3 py-3` padding (12px matches Figma)
- `inline-flex items-center gap-2` for badge/subscript alignment
- Default: `text-foreground`
- Hover: `text-primary-600 dark:text-primary-400`
- Active: `text-primary-600 dark:text-primary-400`
- Disabled: `opacity-20 pointer-events-none`
- No individual bottom border — the sliding indicator handles the active state
- `transition-transform` for the text nudge

### Tabs.Content

- Minimal styling: just `mt-4` for spacing. Consumers control content layout.

### Active Indicator (sliding bar)

A separate `<div>` absolutely positioned at the bottom of `Tabs.List`:

- `absolute bottom-0 h-0.5 bg-primary-600 dark:bg-primary-400`
- `transition-[transform,width] duration-200 ease-out`
- Position and width driven by measuring the active tab's `offsetLeft` and `offsetWidth` via refs

This element lives inside the `Tabs.List` wrapper, not inside individual triggers.

## Micro-animations

### Indicator slide

On tab change:
1. Measure new active tab's `offsetLeft` and `offsetWidth`
2. Apply `transform: translateX(Xpx)` and `width: Wpx` to the indicator div
3. CSS `transition` handles the interpolation

Uses a `ResizeObserver` to recalculate on layout changes (window resize, content shifts).

Initial render: set position without transition to avoid a slide-in from 0,0.

### Text nudge

Active trigger gets a subtle upward shift:
- `data-[state=active]:-translate-y-0.5` (Tailwind, -2px)
- `transition-transform duration-200 ease-out`

Both animations respect `prefers-reduced-motion` via `motion-reduce:transition-none`.

## Dark Mode

All colors use DS tokens — no hardcoded values:
- Active/hover text: `primary-600` / `dark:primary-400`
- Indicator: `bg-primary-600` / `dark:bg-primary-400`
- List border: `border-edge` (semantic token, auto-swaps)
- Disabled opacity works identically in both themes

## Accessibility

Handled by Radix:
- `role="tablist"` on list, `role="tab"` on triggers, `role="tabpanel"` on content
- Arrow key navigation between tabs
- `aria-selected` on active tab
- `aria-controls` / `aria-labelledby` wiring
- Focus visible ring from DS base styles

Added by us:
- `motion-reduce:transition-none` on indicator and triggers
- `aria-disabled` for disabled triggers (Radix handles this)

## No Size Variants

Figma shows one size. No `size` prop for now — YAGNI.

## Files

| File | Purpose |
|------|---------|
| `packages/ds/src/components/tabs/tabs.tsx` | Component |
| `packages/ds/src/components/tabs/tabs.test.tsx` | Tests |
| `apps/preview/src/app/components/tabs/page.tsx` | Preview page |

## Exports

Add to `packages/ds/package.json`:
```json
"./tabs": "./src/components/tabs/tabs.tsx"
```
