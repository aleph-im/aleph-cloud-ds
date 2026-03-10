# Alert Component Design

## Overview

A dismissible status banner with four semantic variants (warning, error, info, success). Supports optional title, auto-dismiss with animated progress bar, and exit animation.

## API

```tsx
type AlertProps = {
  variant: "warning" | "error" | "info" | "success";
  title?: string;
  onDismiss?: () => void;
  dismissAfter?: number; // ms, requires onDismiss
  children: ReactNode;
  className?: string;
};
```

- **`variant`** (required) — determines colors, border, gradient background, icon, and auto-generated uppercase label
- **`title`** — optional bold heading between the variant label and children
- **`onDismiss`** — shows X close button; called after exit animation completes
- **`dismissAfter`** — auto-dismiss timer in ms. Ignored without `onDismiss`. Shows shrinking bottom progress bar.
- **`children`** — ReactNode message body; consumers embed their own `<a>` links
- **`className`** — merged via `cn()`

No `size` prop — one size per Figma. YAGNI.

## Visual Structure

```
+-- left border (3px, solid variant color) ----------------------------+
| +-- gradient background (variant color at 10% -> transparent) -----+ |
| |                                                                   | |
| |  VARIANT LABEL (uppercase, font-heading, italic, bold)     [icon] | |
| |  **Optional title** (font-sans, bold)                             | |
| |  Message body children (font-sans, italic, text-sm)               | |
| |                                                                   | |
| |  [dismiss X button, top-right, only when onDismiss]               | |
| +-------------------------------------------------------------------+ |
| ################................. (timer progress bar, bottom edge)   |
+----------------------------------------------------------------------+
```

## Color Mapping (DS Tokens Only)

| Variant | Left border | Label/Icon text | Background gradient | Progress bar | Dark mode label | Dark mode bg gradient |
|---------|------------|----------------|--------------------|--------------|-----------------|-----------------------|
| warning | `warning-400` | `warning-600` | `warning-100 -> transparent` | `warning-400` | `warning-300` | `warning-900 -> transparent` |
| error | `error-400` | `error-600` | `error-100 -> transparent` | `error-400` | `error-300` | `error-900 -> transparent` |
| success | `success-400` | `success-600` | `success-100 -> transparent` | `success-400` | `success-300` | `success-900 -> transparent` |
| info | `primary-400` | `primary-600` | `primary-100 -> transparent` | `primary-400` | `primary-300` | `primary-900 -> transparent` |

## Behavior

### Dismiss Flow

1. `onDismiss` provided -> X button appears (Phosphor `X` icon, top-right)
2. Click X (or timer expires) -> sets internal `isDismissing = true`
3. Alert animates out: `opacity-0 -translate-y-2` over ~200ms
4. `onTransitionEnd` -> calls `onDismiss()` so parent unmounts
5. Keyboard: native `<button>`, Enter/Space for free

### Timer Flow (dismissAfter + onDismiss)

- On mount, progress bar starts at full width
- CSS transition shrinks to `width: 0` over `dismissAfter` ms
- Triggered after a `requestAnimationFrame` so browser paints full-width bar first
- `setTimeout` sets `isDismissing = true` when timer completes
- Cleanup: `useEffect` clears timeout on unmount

### Exit Animation

- Default: `transition-all duration-200` -- opacity 1->0 + translateY 0->-8px
- `motion-reduce:transition-none` -- instant removal

### Accessibility

- `role="alert"` on root (live region)
- Variant label provides semantic context
- Dismiss button: `aria-label="Dismiss"`
- Links in children are consumer-controlled

## Implementation

### Files

- `packages/ds/src/components/alert/alert.tsx`
- `packages/ds/src/components/alert/alert.test.tsx`
- `apps/preview/src/app/components/alert/page.tsx`

### CVA

Variants handle: left border color, label/icon text color, progress bar color. Background gradient uses a static class map or inline style with `var()` token references (Tailwind 4 tree-shakes dynamic class names).

### Internal State

- `isDismissing` (boolean) -- triggers exit animation
- `progressActive` (boolean) -- flipped after rAF to start progress bar transition

### Icon Mapping

| Variant | Phosphor Icon |
|---------|--------------|
| warning | `Warning` |
| error | `XCircle` |
| info | `Info` |
| success | `CheckCircle` |

### Export

```tsx
export { Alert, alertVariants, type AlertProps };
```

Subpath: `"./alert": "./src/components/alert/alert.tsx"`

### Tests

- Renders children and variant label
- Title renders when provided
- Dismiss button appears only when `onDismiss` is set
- Clicking dismiss triggers exit animation then calls `onDismiss`
- `dismissAfter` calls `onDismiss` after delay
- `role="alert"` present
- Dismiss button has `aria-label="Dismiss"`

### Preview Page

Showcase: all 4 variants, one with title, one dismissible, one with auto-dismiss timer, one with inline links in children.

### Doc Updates

- DESIGN-SYSTEM.md -- add Alert component section
- ARCHITECTURE.md -- no new patterns (uses existing CVA + forwardRef)
- DECISIONS.md -- log design decisions
- BACKLOG.md -- move Alert/Banner to completed
- CLAUDE.md -- add Alert to Current Features, update preview page count
