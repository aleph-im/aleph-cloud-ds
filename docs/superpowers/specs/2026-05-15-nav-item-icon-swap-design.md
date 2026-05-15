# NavItem Icon-Swap Animation — Design Spec

## Overview

Animate the hover and active states of `NavItem` (in `AppShellSidebar`) so the icon visually slides from the left of the label to the right. The animation is a single horizontal translation of a wider content band behind an `overflow: hidden` mask — no animated widths or margins. The mechanic applies in both the expanded sidebar and the collapsed icon rail.

Target file: `packages/ds/src/components/app-shell-sidebar/app-shell-sidebar.tsx`

## Goals

1. Give nav-item hover and active states a satisfying motion signature, while keeping rest/hover/active color treatments intact (already shipped in [[nav-states-design]]).
2. Use a single, transform-only animation primitive that performs well and behaves identically in both layout modes.
3. Active state shares the exact end-state of hover — no separate "active-only" animation.
4. No new public props on `NavItem`. Consumers don't opt in.

## Mental Model

A wider band of content sits inside a mask. The mask is `overflow: hidden`. The band has the structure `[icon-A] gap [label] gap [icon-B]` (expanded) or `[icon-A][icon-B]` (collapsed). State change translates the band by exactly one "icon + gap" worth of distance.

```
Expanded — mask = the nav-item link

Default — translateX(0):
| [iconA] gap [label] |gap [iconB]      (iconB clipped on the right)

Hover / active — translateX(-(iconWidth + gap)):
[iconA] gap| [label] gap [iconB] |      (iconA clipped on the left)
```

```
Collapsed — mask = the icon bounding box (~16×16)

Default — translateX(0):
| [iconA] |[iconB]                       (iconB clipped on the right)

Hover / active — translateX(-iconWidth):
[iconA]| [iconB] |                       (iconA clipped on the left)
```

Both icons render the same `icon` prop, so the user perceives a single icon doing a clean carousel-style pan through the mask.

## State Rules

- **Active** = same end-state as hover. No separate animation, no entrance animation on mount.
- An item that is both hovered and active stays at the end-state. No motion.
- Active-on-mount appears in end-state instantly (CSS transitions only fire on state change).
- Route changes between two active items animate naturally: the outgoing item's band slides back to default, the incoming item's band slides to the end-state.
- `prefers-reduced-motion: reduce` → set `transition-duration: 0` on the band so state changes are instant.

## Scope

**In scope:**
- `NavItem` in `app-shell-sidebar.tsx` — both branches (bare `<a>` and `asChild`-cloned).

**Out of scope (no change):**
- `ProductStrip` tabs — share the color vocabulary with `NavItem` but live on a different surface and don't pair icons with labels.
- `SectionTitleRow` accordion title rows — already use a directional caret (CaretDown ↔ CaretRight) as an open/close indicator. Different semantics.
- `CollapseToggle` button at the bottom of the sidebar — separate UI, separate icon-swap (CaretLeft ↔ CaretRight) already in place.
- No new public props on `NavItem`.
- No changes to sidebar width, padding, or rail-collapse behavior.

## API

`NavItem`'s public props are unchanged:

```ts
type NavItemProps = Omit<AnchorAttrs, "href" | "children"> & {
  href?: string;
  icon: ReactNode;     // rendered twice internally — once at A, once at B
  children: ReactNode; // the label
  active?: boolean;
  asChild?: boolean;
};
```

The same `icon` prop is rendered in both A and B slots. The animation is fully internal.

## DOM Structure

```tsx
<li>
  <a
    href={href}
    aria-current={active ? "page" : undefined}
    data-slot="nav-item"
    data-active={active ? "true" : "false"}
    className="... overflow-hidden"
    {...rest}
  >
    <span data-slot="nav-band" className="...">
      <span data-slot="nav-icon-a" aria-hidden="true">{icon}</span>
      <span className="rail-hide truncate">{children}</span>
      <span data-slot="nav-icon-b" aria-hidden="true">{icon}</span>
    </span>
  </a>
</li>
```

For the `asChild` branch, the same structure is cloned into the consumer-provided element via Radix-style `cloneElement`, matching today's pattern.

### Slot attributes

- `data-slot="nav-item"` on the link — anchor for the collapsed-mode CSS override.
- `data-active` on the link — drives the band's transform via attribute selector (independent of `:hover`).
- `data-slot="nav-band"` on the inner wrapper — the element that translates.
- `data-slot="nav-icon-a"` / `nav-icon-b` on the icon wrappers — sized as fixed-width boxes inside the band.

### Accessibility

- `aria-hidden="true"` on both icon wrappers so the link's accessible name is the label alone, not "icon icon label".
- `aria-current="page"` on the link when `active` (unchanged).
- The link's `focus-visible` outline (already on the component today) stays as-is.

## Animation Mechanics

### Expanded mode

- The link is `overflow: hidden` with the existing `px-2.5 py-2` padding.
- The band is a flex row: `[iconA][label flex-1][iconB]` with `gap-2.5`.
- The band is wider than the link's content area by exactly `iconWidth + gap` (16px + 10px = 26px). The label takes the remaining flex space.
- Default state: `transform: translateX(0)` — iconA + label visible, iconB clipped beyond the right edge.
- Hover / active state: `transform: translateX(-26px)` — iconA clipped beyond the left edge, label + iconB visible. The 26px = 16px icon + 10px gap; the exact value is a Tailwind arbitrary class like `data-[active=true]:-translate-x-[26px]`.
- Transition: `transform 150ms ease-out` (`var(--duration-fast)`).

### Collapsed mode

A CSS block scoped to `[data-collapsed="true"]` (the existing pattern used by `rail-hide`) overrides the mask sizing:

- The link's content area collapses to just the icon bounding box (16×16). The label has `display: none` via existing `rail-hide`.
- Inside the mask, the band reduces to `[iconA][iconB]` (no gap, no label).
- Default state: `translateX(0)` — iconA visible, iconB clipped right.
- Hover / active: `translateX(-100%)` (or `translateX(-iconWidth)`) — iconA clipped left, iconB visible.

The band's `data-active` and `:hover` selectors are scoped on the link (mask), so the same CSS rule drives both modes — only the mask geometry differs.

## CSS Location

- **Expanded-mode behavior:** Tailwind utilities composed with `cn()` directly on the spans. The hover/active transforms are expressed with `group-hover:` and a `data-[active=true]:` arbitrary variant on the band.
- **Collapsed-mode override:** a small block in `packages/ds/src/styles/tokens.css`, scoped under `[data-collapsed="true"]`, following the precedent of the existing `rail-hide` rule. Roughly:

```css
[data-collapsed="true"] [data-slot="nav-item"] {
  /* mask becomes the icon bounding box */
}
[data-collapsed="true"] [data-slot="nav-band"] {
  /* band reduces to two stacked icons */
}
```

(Exact properties to be finalized in the implementation plan.)

## Theming and Tokens

No new tokens. The animation uses:

- `var(--duration-fast)` — existing transition duration token.
- Component-local icon size and gap values: 16px (the Phosphor icon size typically passed by consumers) and 10px (`gap-2.5`). These are not tokens — they live inline in the component class strings.

`prefers-reduced-motion: reduce` is handled via a `motion-reduce:transition-none` utility on the band (CSS layer already in use elsewhere in the DS).

## Testing

In `app-shell-sidebar.test.tsx`:

- Both icon wrappers render and both carry `aria-hidden="true"`.
- `data-active="true"` is set on the link when the `active` prop is true.
- Existing tests for `asChild`, `rail-hide`, and `aria-current` continue to pass.

Visual review on the preview app:

- Expanded sidebar — hover, hover-out, active, and active+hover-out behave as described in both light and dark themes.
- Collapsed rail — same checks. Confirm the icon visibly pans through its bounding box and that no part of the band leaks outside the rail.
- Reduced-motion preference — state changes happen instantly, no transform animation.
- Active-on-mount — newly mounted active item appears in end-state with no animation flash.

## Documentation Updates

- `docs/DESIGN-SYSTEM.md` — extend the `NavItem` section to describe the icon-swap animation.
- `docs/ARCHITECTURE.md` — add a short note on the band-behind-mask mechanic (new pattern in the DS).
- `CLAUDE.md` — update the AppShellSidebar entry in the Current Features list to mention the hover/active icon-swap.
- `docs/DECISIONS.md` — log the decision to use a single `translateX` on a wider band rather than animating slot widths/margins, including the rationale (transform-only is cheaper and works identically in both modes).
- `docs/BACKLOG.md` — no entry expected.
