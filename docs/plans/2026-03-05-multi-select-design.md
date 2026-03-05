# Multi-Select Component Design

## Overview

A searchable multi-selection dropdown with tag display, built on cmdk + Radix Popover (same stack as Combobox). Component name: `MultiSelect`.

## API

```tsx
type MultiSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type MultiSelectProps = {
  options: MultiSelectOption[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;          // "Select..."
  searchPlaceholder?: string;    // "Search..."
  emptyMessage?: string;         // "No results found."
  maxDisplayedTags?: number;     // default 3, then "+N more"
  size?: "sm" | "md";
  error?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  "aria-describedby"?: string;
};
```

The `Option` type is identical to Combobox's. Key differences from Combobox:

- `value` is `string[]` instead of `string`
- `onValueChange` receives `string[]`
- `maxDisplayedTags` controls the overflow threshold

## Trigger Layout

```
+-------------------------------------------------+
| [Tag x] [Tag x] [+2 more]                  [x]  |  <- items selected
+-------------------------------------------------+

+-------------------------------------------------+
| Select...                                   [v]  |  <- empty state
+-------------------------------------------------+
```

- Tags use pill shape, small size, muted background (`bg-muted`)
- Each tag has an x button that removes that item (stops event propagation so it doesn't toggle the dropdown)
- When items are selected, the chevron becomes a clear-all x icon
- When empty, shows placeholder text + chevron (same as Combobox)
- Tags wrap within the trigger -- trigger height grows naturally with `flex-wrap`

## Dropdown

Same as Combobox: cmdk search input at top, scrollable list below. Differences:

- Each item shows a checkbox visual (small bordered square with check mark when selected) instead of just a check icon
- Selecting an item toggles it and keeps the dropdown open (no `setOpen(false)`)
- Search input clears after each selection so the full list is visible for the next pick
- cmdk filter still works -- typing narrows the list

### Checkbox Indicator

Not using the actual `<Checkbox>` component (it's a Radix form control with its own focus/state management). Instead, render the same visual: a small bordered square that shows a check SVG when selected. Purely decorative -- `Command.Item` handles selection.

```
+-----------------------------+
| Search...                   |
|-----------------------------|
| [x] Selected Item           |
| [ ] Unselected Item         |
| [ ] Another Item            |
| [x] Also Selected           |
+-----------------------------+
```

## Behavior

1. Click trigger -> open dropdown
2. Type to filter -> cmdk filters by label
3. Click item -> toggle selection, clear search text, keep dropdown open
4. Click tag x -> remove that value, stop propagation
5. Click clear-all x -> set value to `[]`
6. Click outside / Escape -> close dropdown
7. Keyboard: Arrow keys navigate items, Enter/Space toggles, Escape closes

## Sizing

Uses the same `triggerVariants` as Combobox (sm/md). Tags scale with trigger size -- smaller font and padding in `sm`.

## States

- **Error:** `border-3 border-error-400` (same as Combobox/Select)
- **Disabled:** `opacity-50 pointer-events-none` (same as all form controls)
- **Empty dropdown after search:** Shows `emptyMessage`

## Accessibility

- Trigger: `role="combobox"`, `aria-expanded`, `aria-haspopup="listbox"`
- Tags: each x button gets `aria-label="Remove {label}"`
- Clear all x: `aria-label="Clear all"`
- Items: cmdk handles `aria-selected` and keyboard nav
- `aria-invalid` when `error` is true

## Files

- `packages/ds/src/components/multi-select/multi-select.tsx`
- `packages/ds/src/components/multi-select/multi-select.test.tsx`
- `apps/preview/src/app/components/multi-select/page.tsx`

## Design Decisions

- **Always searchable:** No `searchable` prop toggle. Search input is always present (costs nothing for short lists). Matches Combobox precedent.
- **Flat options only:** No grouped options. Neither Combobox nor Select support groups. Add to all three at once if needed later.
- **Clear all, no select all:** Clear-all x replaces chevron when items are selected. "Select all" creates ambiguity with filtered views.
- **Tags with overflow:** Show first N tags then "+N more". Configurable via `maxDisplayedTags` (default 3).
- **Visual-only checkbox:** Render checkbox appearance in items without using the actual Checkbox component to avoid nested focus/state conflicts.
- **Search clears on select:** After toggling an item, clear the search text so the full list is visible for the next pick.
