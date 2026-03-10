# Pagination Component — Design Spec

## Overview

Controlled pagination component for navigating paged data. Consumer owns page state; the component renders the current state and fires callbacks on interaction.

## API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `page` | `number` | required | Current active page (1-indexed) |
| `totalPages` | `number` | required | Total number of pages |
| `onPageChange` | `(page: number) => void` | required | Callback on page change |
| `siblingCount` | `number` | `1` | Pages shown on each side of current |
| `showFirstLast` | `boolean` | `true` | Show «/» jump-to-first/last buttons |
| `className` | `string` | — | Outer container class |

## Figma Variant Mapping

The Figma shows 4 named variants (Desktop/Mobile × Max/Min). These map to prop combinations:

| Figma Variant | Props | Output |
|--------------|-------|--------|
| Desktop Max | `siblingCount={2}, showFirstLast` | `« ← 1 2 [3] 4 5 → »` |
| Desktop Min / Mobile Max | `siblingCount={1}, showFirstLast={false}` | `← 2 [3] 4 →` |
| Mobile Min | `siblingCount={0}, showFirstLast={false}` | `← [3] →` |

No `variant` or `device` prop — consumers compose these primitives for their responsive needs.

## Visual Spec

- **Active page:** `bg-primary-600`, `text-white`, `rounded-full`, `size-8` (32px)
- **Inactive page:** `text-primary-600`, no background, `size-8` hit target
- **Hover (inactive):** `bg-primary-100` (light) / `bg-primary-900` (dark)
- **Disabled nav arrows:** `opacity-50`, `pointer-events-none`, `aria-disabled="true"`
- **Font:** `font-heading` (Rigid Square), `font-bold`, `text-lg` (18px)
- **Gap:** `gap-4` (16px) between items
- **Icons:** Phosphor `CaretDoubleLeft`, `CaretLeft`, `CaretRight`, `CaretDoubleRight` with `weight="bold"`
- **Ellipsis:** `...` in primary color, non-interactive, same `size-8` container
- **Dark mode:** `text-primary-400` for inactive pages, `bg-primary-800` for active page

## Page Range Algorithm

Given `page`, `totalPages`, `siblingCount`, `showFirstLast`:

1. Calculate sibling range: `[page - siblingCount, page + siblingCount]`, clamped to `[1, totalPages]`
2. If `showFirstLast`: always include page 1 and `totalPages`
3. If gap between first page (1) and left sibling > 1: insert `...` ellipsis
4. If gap is exactly 1: show the bridging page number instead of ellipsis
5. Same logic for right side (between right sibling and last page)

Example with `page=10, totalPages=20, siblingCount=1, showFirstLast=true`:
→ `1 ... 9 [10] 11 ... 20`

Example with `page=3, totalPages=20, siblingCount=1, showFirstLast=true`:
→ `1 2 [3] 4 ... 20` (no left ellipsis — gap between 1 and 2 is 0)

## Edge Navigation

- Prev/Next arrows always render
- At `page=1`: prev (and first, if shown) are disabled
- At `page=totalPages`: next (and last, if shown) are disabled
- Disabled = `aria-disabled="true"` + `opacity-50` + `pointer-events-none`

## Accessibility

- Root: `<nav aria-label="Pagination">`
- Active page: `aria-current="page"`
- Nav buttons: `aria-label="First page"`, `"Previous page"`, `"Next page"`, `"Last page"`
- Page buttons: `aria-label="Page 3"`
- Disabled buttons: `aria-disabled="true"`
- All interactive elements are `<button>` elements

## Architecture

- No CVA — no named variants. Styling is direct Tailwind classes with conditional logic for active/disabled states.
- `buildPageRange()` pure function extracts the page number calculation logic for easy testing.
- `forwardRef` on the `<nav>` wrapper.
- Phosphor Icons as direct imports (already a DS dependency).
