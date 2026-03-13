# Dialog Component — Design Spec

## Overview

Modal dialog component for the Aleph Cloud design system. Wraps Radix UI Dialog with DS styling, frosted overlay, and configurable dismiss behavior. Requires `"use client"` directive.

## Primary Use Cases

1. **Confirmation dialogs** — short message + action buttons ("Delete this node?")
2. **Progress dialogs** (future) — multi-step transaction status (in progress → confirmed). The current API is sufficient: the dialog body is arbitrary children, so a progress view slots in without additional props.

## API Shape — Composable Re-export

Follows the Tooltip/Tabs pattern: Radix primitives re-exported directly, with `DialogContent` wrapped to apply DS styling.

### Exported Parts (8 pieces)

| Export | Wraps | DS-styled? | `forwardRef` | Purpose |
|--------|-------|-----------|-------------|---------|
| `Dialog` | `Dialog.Root` | No | No | Owns open/closed state |
| `DialogTrigger` | `Dialog.Trigger` | No | No | Optional trigger element |
| `DialogContent` | `Dialog.Portal` + `Dialog.Overlay` + `Dialog.Content` | Yes | Yes (`HTMLDivElement`) | Panel + overlay + close button |
| `DialogTitle` | `Dialog.Title` | Yes | Yes (`HTMLHeadingElement`) | Required heading (a11y) |
| `DialogDescription` | `Dialog.Description` | Yes | Yes (`HTMLParagraphElement`) | Optional description text |
| `DialogClose` | `Dialog.Close` | No | No | Direct re-export for consumer close buttons |
| `DialogHeader` | Plain `<div>` | Yes | No | Layout wrapper for title + description |
| `DialogFooter` | Plain `<div>` | Yes | No | Layout wrapper for action buttons |

### Type Exports

- `DialogContentProps` — extends `ComponentPropsWithoutRef<typeof DialogPrimitive.Content>` with `locked?: boolean`

### Consumer API

```tsx
// Controlled — confirmation dialog
<Dialog open={showConfirm} onOpenChange={setShowConfirm}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Delete node?</DialogTitle>
      <DialogDescription>
        This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <Button variant="primary" onClick={handleDelete}>
        Delete
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

// Uncontrolled — with trigger
<Dialog>
  <DialogTrigger asChild>
    <Button variant="secondary">View details</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogTitle>Details</DialogTitle>
    {/* ... */}
  </DialogContent>
</Dialog>

// Locked — force explicit action
<Dialog open={showDelete} onOpenChange={setShowDelete}>
  <DialogContent locked>
    <DialogHeader>
      <DialogTitle>Delete node?</DialogTitle>
      <DialogDescription>
        This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <Button variant="primary" onClick={handleDelete}>
        Delete
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Design Decisions

### DialogContent bundles overlay + portal

The overlay and content panel always appear together. Bundling `Portal` + `Overlay` + `Content` into a single `DialogContent` wrapper reduces consumer boilerplate from 3 elements to 1. The overlay is an internal implementation detail — consumers never need to customize it independently.

### DialogHeader / DialogFooter are plain divs

Not Radix primitives — just layout containers with flexbox classes. `DialogHeader` stacks title + description with vertical spacing. `DialogFooter` right-aligns action buttons with a gap (`flex justify-end gap-3 pt-4`). Both are optional convenience wrappers. Consumers can override layout via `className` if they need a different arrangement (e.g., buttons on both sides).

### Close button is built into DialogContent

An X button (Phosphor `X` icon) is rendered in the top-right corner of every dialog by default. This is an internal element wrapping `Dialog.Close` — separate from the exported `DialogClose`, which is a direct passthrough re-export of `Dialog.Close` for consumer use (e.g., wrapping a Cancel button with `asChild`). When `locked` is true, the internal X button is hidden.

### `displayName` on all forwardRef components

Every `forwardRef` wrapper sets `ComponentName.displayName = "ComponentName"` — consistent with all other DS components (Tooltip, Tabs, etc.).

## Visual Treatment

### Overlay

- `fixed inset-0 z-50 bg-black/60 backdrop-blur-sm` — frosted dark wash
- Fade in/out animation via `data-[state=open/closed]`

### Panel

- `fixed inset-0 z-50` container with `flex items-center justify-center` for centering
- `bg-surface rounded-2xl shadow-brand-lg` — matches elevated Card surfaces
- `max-w-md w-full` default width — consumer can override via `className`
- `p-6` internal padding

### Close Button

- Phosphor `X` icon, `weight="bold"`
- `absolute top-4 right-4`
- `text-muted-foreground hover:text-foreground` with transition
- Hidden when `locked` is true

### Typography

- `DialogTitle`: `font-heading font-bold text-lg text-foreground`
- `DialogDescription`: `text-sm text-muted-foreground`

## Configurable Dismiss Behavior

The `locked` prop on `DialogContent` controls dismiss behavior:

| Behavior | Default (`locked` absent) | `locked` |
|----------|--------------------------|----------|
| Overlay click closes | Yes | No |
| Escape key closes | Yes | No |
| Close (X) button visible | Yes | No |

Implementation: when `locked` is true, pass `onInteractOutside` and `onEscapeKeyDown` handlers on the `Dialog.Content` element (not Root or Overlay) that call `e.preventDefault()`. The internal X close button is conditionally rendered.

## Animation

Entry and exit via Radix's `data-[state=open/closed]` attributes:

**Overlay:**
- Open: `animate-in fade-in-0`
- Closed: `animate-out fade-out-0`

**Panel:**
- Open: `animate-in fade-in-0 zoom-in-95`
- Closed: `animate-out fade-out-0 zoom-out-95`

**Reduced motion:**
- `motion-reduce:animate-none` on both overlay and panel

## Accessibility

Handled by Radix Dialog:

- Focus trap — cycles within dialog while open
- `aria-modal="true"` on content
- Focus returns to trigger element on close
- `DialogTitle` required — linked via `aria-labelledby`
- `DialogDescription` linked via `aria-describedby` when present
- Escape key closes (unless `locked`)

## File Structure

```
packages/ds/src/components/dialog/
  dialog.tsx        # "use client", component implementation
  dialog.test.tsx   # Behavior + accessibility tests
```

## What to Test

| Category | Test case | Notes |
|----------|-----------|-------|
| Accessibility | `aria-labelledby` links to title | |
| Accessibility | `aria-describedby` links to description when present | |
| Dismiss behavior | Escape closes (default) | `fireEvent.keyDown(document, { key: "Escape" })` |
| Dismiss behavior | Escape blocked when `locked` | Same keyDown, assert dialog stays open |
| Close button | Rendered by default, hidden when `locked` | Query by accessible role/label |
| Prop forwarding | `className` merges on content panel | |
| Ref forwarding | `DialogContent` ref attaches to panel element | |

Note: overlay click tests (`onInteractOutside`) are unreliable in jsdom because Radix fires this via pointer capture, not a standard click event. Skip overlay-click tests — the Escape key tests cover the `locked` behavior path equivalently.

## What NOT to Test

- CSS class names or visual styling
- Animation behavior
- Overlay blur/opacity values
- Overlay click behavior (jsdom limitation with Radix pointer events)
