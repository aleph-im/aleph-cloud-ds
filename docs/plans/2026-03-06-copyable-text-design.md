# CopyableText Component Design

## Context

The scheduler-dashboard has a `CopyableHash` pattern — truncated text with a copy button and optional external link. This is a common UI pattern for hashes, addresses, API keys, and IDs. Promoting it to the DS as a generic `CopyableText` component with Phosphor Icons and a reusable icon-swap animation keyframe.

## Component API

```tsx
<CopyableText
  text="0x1234567890abcdef1234567890abcdef12345678"
  startChars={6}      // default: 6
  endChars={4}        // default: 4
  href="https://explorer.aleph.cloud/tx/0x1234..."  // optional
  size="md"           // "sm" | "md", default: "md"
  className="..."     // consumer overrides
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | required | Full text to display and copy |
| `startChars` | `number` | `6` | Characters shown at start |
| `endChars` | `number` | `4` | Characters shown at end |
| `href` | `string` | — | Optional URL for external link icon |
| `size` | `"sm" \| "md"` | `"md"` | Size variant |

## Visual Layout

```
┌──────────────────────────────────┐
│  0x1234...5678  [copy] [link]    │
│  ─────────────  ─────  ─────    │
│  truncated text  Copy  ArrowUpLeft
└──────────────────────────────────┘
```

## Behavior

1. **Copy button** — Click the Copy icon, text copies to clipboard via `navigator.clipboard.writeText()`, icon swaps to Check with micro-animation (scale 0.8 to 1 + opacity 0 to 1, 150ms), reverts after 1.5s.
2. **External link** — Only renders when `href` is provided. Opens in new tab (`target="_blank"` with `rel="noopener noreferrer"`). Uses `ArrowUpLeft` icon.
3. **Truncation** — Middle ellipsis: `text.slice(0, startChars) + "..." + text.slice(-endChars)`. If `text.length <= startChars + endChars`, show full text (no ellipsis).
4. **Tooltip** — Full text shown on hover via the DS Tooltip component so users can see/verify what they're copying.

## Architecture

- **Pattern:** CVA + forwardRef (like Badge) — no Radix needed beyond Tooltip
- **Icons:** `Copy`, `Check`, `ArrowUpLeft` from `@phosphor-icons/react` with `weight="bold"`
- **Animation:** `@keyframes icon-swap` in `tokens.css` — scale(0.8) + opacity(0) to scale(1) + opacity(1), 150ms ease-out. Reusable for any future icon transitions.
- **State:** Single `useState<boolean>` for `copied`, `setTimeout` to reset after 1.5s
- **Motion-reduce:** `motion-reduce:animate-none` on the icon swap animation

## Sizing (CVA variants)

| Size | Text | Icons | Gap |
|------|------|-------|-----|
| `sm` | `text-xs` | `size-3.5` | `gap-1` |
| `md` | `text-sm` | `size-4` | `gap-1.5` |

## Testing

- Renders truncated text (middle ellipsis)
- Shows full text when shorter than startChars + endChars
- Copies text to clipboard on click (mock `navigator.clipboard`)
- Shows Check icon after copy, reverts after timeout
- Renders external link only when `href` provided
- `aria-label` on copy button ("Copy to clipboard" / "Copied")
- External link has `target="_blank"` and `rel="noopener noreferrer"`
- Forwards className and ref

## Files to Create/Modify

- `packages/ds/src/components/copyable-text/copyable-text.tsx` — component
- `packages/ds/src/components/copyable-text/copyable-text.test.tsx` — tests
- `packages/ds/src/styles/tokens.css` — `@keyframes icon-swap` animation
- `packages/ds/package.json` — add `./copyable-text` subpath export
- `apps/preview/src/app/components/copyable-text/page.tsx` — preview page
- `apps/preview/src/components/sidebar.tsx` — add nav entry
