# DESIGN-SYSTEM.md Improvements Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve DESIGN-SYSTEM.md for agent consumption by adding fast-lookup structures, removing implementation internals, adding decision guidance, and fixing stale content.

**Architecture:** Four independent editing passes on `docs/DESIGN-SYSTEM.md`, plus one pass on `docs/ARCHITECTURE.md` to receive relocated implementation details. Each task edits a different section or adds a new section, so they can be reviewed independently but should be committed together as one logical change.

**Tech Stack:** Markdown only — no code changes.

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `docs/DESIGN-SYSTEM.md` | Modify | All four improvements |
| `docs/ARCHITECTURE.md` | Modify | Receive relocated implementation details |

---

### Task 1: Add Component Index at top of DESIGN-SYSTEM.md

**Files:**
- Modify: `docs/DESIGN-SYSTEM.md` (insert after line 4, before "## Design Methodology")

- [ ] **Step 1: Insert Component Index section**

Add a new `## Component Index` section immediately after the file's opening paragraph (line 3). This gives agents a quick-lookup table without scanning the full ~1500 lines.

```markdown
## Component Index

Quick reference for all DS exports. Click component name to jump to its full documentation below.

| Component | Purpose | Import |
|-----------|---------|--------|
| [Alert](#alert) | Dismissible status banner with auto-dismiss timer | `@aleph-front/ds/alert` |
| [Badge](#badge) | Semantic label for status, counts, categories | `@aleph-front/ds/badge` |
| [Breadcrumb](#breadcrumb) | Navigation trail with composable 6-part API | `@aleph-front/ds/breadcrumb` |
| [Button](#button) | Action trigger with 6 variants, 4 sizes, gradient fills | `@aleph-front/ds/button` |
| [Card](#card) | Content container with 3 variants (default/noise/ghost) | `@aleph-front/ds/card` |
| [Checkbox](#checkbox) | Boolean toggle with 3 sizes, clip-path animation | `@aleph-front/ds/checkbox` |
| [Combobox](#combobox) | Searchable dropdown selector | `@aleph-front/ds/combobox` |
| [CopyableText](#copyabletext) | Truncated text with copy-to-clipboard | `@aleph-front/ds/copyable-text` |
| [Dialog](#dialog) | Modal with composable 8-part API, lock mode | `@aleph-front/ds/dialog` |
| [FormField](#formfield) | Label + helper + error wrapper with auto-wired a11y | `@aleph-front/ds/form-field` |
| [Input](#input) | Text input with 2 sizes, shadow-brand styling | `@aleph-front/ds/input` |
| [Logo](#logo) | Brand mark (icon + full wordmark variants) | `@aleph-front/ds/logo` |
| [MultiSelect](#multiselect) | Searchable multi-selection with tags | `@aleph-front/ds/multi-select` |
| [Pagination](#pagination) | Controlled page navigation with fixed-slot layout | `@aleph-front/ds/pagination` |
| [RadioGroup](#radiogroup) | Mutually exclusive option set with 3 sizes | `@aleph-front/ds/radio-group` |
| [Select](#select) | Dropdown selector with flat options prop | `@aleph-front/ds/select` |
| [Skeleton](#skeleton) | Animated loading placeholder | `@aleph-front/ds/ui/skeleton` |
| [Slider](#slider) | Range input, single or two-thumb mode | `@aleph-front/ds/slider` |
| [Spinner](#spinner) | Animated loading indicator | `@aleph-front/ds/ui/spinner` |
| [StatusDot](#statusdot) | Health status circle with pulse animation | `@aleph-front/ds/status-dot` |
| [Switch](#switch) | On/off toggle with animated sliding thumb | `@aleph-front/ds/switch` |
| [Table](#table) | Generic typed table with sorting and row selection | `@aleph-front/ds/table` |
| [Tabs](#tabs) | Tabbed interface with underline/pill variants | `@aleph-front/ds/tabs` |
| [Textarea](#textarea) | Multi-line text input with vertical resize | `@aleph-front/ds/textarea` |
| [Tooltip](#tooltip) | Hover/focus tooltip with DS styling | `@aleph-front/ds/tooltip` |
```

- [ ] **Step 2: Verify anchor links resolve**

Scroll through the Components section and confirm each `#anchor` in the index matches the actual heading text. Markdown anchors are lowercase, spaces become hyphens, special chars removed. Adjust any that don't match (e.g., `CopyableText` heading → `#copyabletext`, `RadioGroup` → `#radiogroup`).

- [ ] **Step 3: Commit**

```bash
git add docs/DESIGN-SYSTEM.md
git commit -m "docs: add component index to DESIGN-SYSTEM.md"
```

---

### Task 2: Add Component Selection Guide

**Files:**
- Modify: `docs/DESIGN-SYSTEM.md` (insert after Component Index, before "## Design Methodology")

- [ ] **Step 1: Insert Component Selection Guide section**

Add a `## Component Selection Guide` section after the Component Index. This helps agents choose the right component for a given UI need.

```markdown
## Component Selection Guide

### Status & Feedback

| Need | Use | Not |
|------|-----|-----|
| Inline health indicator next to text | **StatusDot** — compact, semantic colors, pulse on healthy | Badge — too large for inline status |
| Categorical label (count, type, state) | **Badge** — gradient fills, icon slots, uppercase heading font | StatusDot — no text content |
| Dismissible banner message | **Alert** — auto-dismiss timer, progress bar, semantic variants | Dialog — too interruptive for status messages |
| Blocking user decision | **Dialog** — overlay, focus trap, `locked` mode for forced choice | Alert — can be ignored or dismissed |
| Passive extra info on hover | **Tooltip** — non-blocking, hover/focus triggered | Dialog — too heavy for supplementary info |
| Loading placeholder (content area) | **Skeleton** — consumer-sized via className, pulse animation | Spinner — Skeleton is for layout placeholders, Spinner is for inline loading |
| Inline loading indicator (button, action) | **Spinner** — animated circle, no layout footprint | Skeleton — Skeleton is for content area placeholders |

### Selection & Input

| Need | Use | Not |
|------|-----|-----|
| Short list, no search needed | **Select** — flat options, Radix portal dropdown | Combobox — search adds unnecessary complexity |
| Long list, user needs to search | **Combobox** — type-to-filter with cmdk | Select — no search, unusable with 50+ options |
| Multiple selections from a list | **MultiSelect** — tags, checkbox indicators, clear-all | Combobox — single selection only |
| Boolean toggle (form context) | **Checkbox** — standard form control | Switch — use for settings/preferences, not form fields |
| On/off preference or setting | **Switch** — visual toggle metaphor | Checkbox — Switch communicates "live toggle" better |
| Mutually exclusive options | **RadioGroup** — visible options, no dropdown | Select — use RadioGroup when ≤5 options and screen space allows |
| Numeric range | **Slider** — visual, supports two-thumb range mode | Input — unless precise numeric entry is needed |

### Layout & Navigation

| Need | Use | Not |
|------|-----|-----|
| Content section with border/shadow | **Card** `variant="default"` — `bg-surface`, `border-edge` | Plain div — Card provides consistent elevation and theming |
| Textured decorative panel | **Card** `variant="noise"` — grain SVG overlay | Card default — noise adds visual interest for hero/feature cards |
| Transparent grouping (no chrome) | **Card** `variant="ghost"` — no border, no background | Card default — ghost avoids visual nesting when cards are inside cards |
| Location in page hierarchy | **Breadcrumb** — semantic nav/ol, `asChild` for router links | Plain text links — Breadcrumb handles separators and aria |
| Switching between content panels | **Tabs** — underline or pill variant, keyboard navigation | Buttons + conditional rendering — Tabs manages state, a11y, and indicators |
| Paginated data navigation | **Pagination** — fixed-slot layout, no layout shift | Custom prev/next buttons — Pagination handles ellipsis, boundaries, and aria |
```

- [ ] **Step 2: Commit**

```bash
git add docs/DESIGN-SYSTEM.md
git commit -m "docs: add component selection guide to DESIGN-SYSTEM.md"
```

---

### Task 3: Strip implementation internals to ARCHITECTURE.md

**Files:**
- Modify: `docs/DESIGN-SYSTEM.md` (trim sections)
- Modify: `docs/ARCHITECTURE.md` (add new pattern entries)

This task removes implementation details that serve DS maintainers but not DS consumers. The details move to ARCHITECTURE.md where they belong.

**Note:** Line numbers below reference the *original* file. Tasks 1-2 insert ~110 lines above the Components section. Match by content (heading text / paragraph opening), not line number.

- [ ] **Step 1: Trim Tabs section in DESIGN-SYSTEM.md**

In the Tabs component section, replace the dense implementation paragraph about `useOverflow`, `MutationObserver`, `ResizeObserver`, `data-variant`, and Tailwind safelisting with a consumer-focused summary. Preserve the Exports and Variants lines (`**Exports:**` and `**Variants:**`).

**Remove** the paragraph starting "Hidden tabs stay in the DOM" through the end of the "Styling (pill)" paragraph. Keep the `**Exports:**` and `**Variants:**` lines that follow the overflow description.

Replace the implementation paragraphs with a shorter consumer-focused version:

```markdown
**Overflow behavior:** Hidden tabs remain functional (Radix state intact). The dropdown uses `role="menu"` with arrow key navigation. Disabled tabs appear muted in the dropdown. Container height is locked to prevent layout collapse.

**Styling (underline):** `font-heading font-bold text-lg` triggers. 4px baseline at 40% `edge` opacity, 4px solid primary sliding indicator. Active/hover text uses `primary-600` / `dark:primary-400`.

**Styling (pill):** Rounded container `bg-neutral-200` / `dark:bg-neutral-800/50`. Active indicator `bg-primary-600` / `dark:bg-primary-500`. Triggers `text-muted-foreground` inactive, `text-white` active, compact `px-5 py-1.5 text-sm`.

**Exports:** `Tabs` (Root), `TabsList`, `TabsTrigger`, `TabsContent`, `TabsListProps`, `TabsVariant`

**Variants:** `TabsList` accepts `variant?: "underline" | "pill"` (default `"underline"`) and `overflow?: "collapse"`.
```

- [ ] **Step 2: Trim CopyableText animation internals**

Replace the detailed animation implementation (lines ~1049–1053, the "Copy button uses a two-layer stack" paragraph) with:

```markdown
**Animation:** Copy button plays a reveal animation (circle expand + check icon) on click. Respects `prefers-reduced-motion`.
```

- [ ] **Step 3: Trim Tabs animation internals**

In the Tabs "Animations" bullet list, simplify the sliding indicator description. Replace:

```
- **Sliding indicator** — absolutely-positioned element that slides between tabs via `MutationObserver` + `ResizeObserver`. Initial render positions without transition to avoid slide-in from 0,0. Pill variant uses `opacity-0` → `opacity-100` to prevent flash at width 0.
```

With:

```
- **Sliding indicator** — slides between tabs on selection change. Initial render positions instantly (no slide-in from origin).
```

- [ ] **Step 4: Add relocated details to ARCHITECTURE.md**

Add a new pattern entry under the existing Patterns section in `docs/ARCHITECTURE.md`:

```markdown
### Tabs Implementation Details

**Overflow collapse (`overflow="collapse"`):**
Hidden tabs stay in the DOM (Radix state machine intact). A `useOverflow` hook measures tab widths via `ResizeObserver` + `getBoundingClientRect` and applies `visibility: hidden` to overflowed tabs. The dropdown uses Radix `DropdownMenu` for arrow key navigation and proper `role="menu"`/`role="menuitem"` semantics. Items activate tabs via deferred `.focus()` (Radix auto-activation after menu closes). Container height is locked via `min-height` snapshot to prevent layout collapse when the tallest tab overflows.

**Sliding indicator:**
Absolutely-positioned element that slides between tabs via `MutationObserver` + `ResizeObserver`. Initial render positions without transition to avoid slide-in from 0,0. Pill variant uses `opacity-0` → `opacity-100` to prevent flash at width 0.

**Pill variant propagation:**
Variant is propagated to triggers via `data-variant` attribute + Tailwind `group-data-[variant=pill]:` utilities. All pill variant classes are safelisted via `@source inline(...)` in `tokens.css` — Tailwind 4's scanner can't extract `=` inside data-attribute brackets.

### CopyableText Animation

Copy button uses a two-layer stack:
1. Default layer: Copy icon in muted color
2. Reveal layer: `bg-foreground` circle expanding via `clip-path: circle(0% → 50%)` with spring `cubic-bezier(0.34, 1.56, 0.64, 1)`, plus a Check icon that scales in with 75ms delay

Hover state uses `bg-foreground/10` for visibility in both light and dark themes.
```

- [ ] **Step 5: Commit**

```bash
git add docs/DESIGN-SYSTEM.md docs/ARCHITECTURE.md
git commit -m "docs: move implementation internals from DESIGN-SYSTEM to ARCHITECTURE"
```

---

### Task 4: Fix stale Preview App route table

**Files:**
- Modify: `docs/DESIGN-SYSTEM.md` (replace Preview App routes table, lines ~1527–1553)

- [ ] **Step 1: Replace the route table**

Replace the existing route table with the complete list matching the actual `apps/preview/src/app/` directory structure and sidebar navigation categories:

```markdown
## Preview App

Run `npm run dev` and visit http://localhost:3000. Sidebar navigation organized by category:

### Foundations

| Route | Content |
|-------|---------|
| `/` | Overview — foundation cards, component showcase |
| `/foundations/colors` | OKLCH color scales (50-950), semantic tokens, borders |
| `/foundations/typography` | Heading scale (Header-H7), body styles, font families |
| `/foundations/spacing` | Spacing scale, breakpoints table, border radius |
| `/foundations/effects` | Shadow tokens, gradient swatches, transition demos |
| `/foundations/icons` | Phosphor Icons showcase — weights, sizes, usage |
| `/foundations/logo` | Logo and LogoFull variants, theming |

### Components

**Actions**

| Route | Content |
|-------|---------|
| `/components/button` | Variants, sizes, icons, loading, disabled, asChild |

**Data Display**

| Route | Content |
|-------|---------|
| `/components/badge` | Variants, fill modes, sizes, icons |
| `/components/card` | Default/noise/ghost variants, padding sizes, title |
| `/components/copyable-text` | Sizes, truncation, external link, copy animation |
| `/components/status-dot` | Statuses, sizes, inline usage |
| `/components/table` | Sorting, row click, active row, empty state |

**Feedback**

| Route | Content |
|-------|---------|
| `/components/alert` | Variants, title, dismiss, auto-dismiss timer |
| `/components/dialog` | Uncontrolled, controlled, locked mode |
| `/components/skeleton` | Basic shapes, card loading, table row loading |
| `/components/tooltip` | Basic, sides, placement |

**Navigation**

| Route | Content |
|-------|---------|
| `/components/breadcrumb` | Default, custom separator, asChild routing |
| `/components/pagination` | Default, compact, sibling count |
| `/components/tabs` | Underline, pill, overflow collapse, badges |

**Forms**

| Route | Content |
|-------|---------|
| `/components/checkbox` | Sizes, states, controlled, FormField |
| `/components/combobox` | Sizes, states, search, controlled, FormField |
| `/components/form-field` | Label, helper text, error |
| `/components/input` | Sizes and states |
| `/components/multi-select` | Pre-selected, overflow, sizes, states, FormField |
| `/components/radio-group` | Sizes, states, controlled, FormField |
| `/components/select` | Sizes, states, controlled, FormField |
| `/components/slider` | Sizes, tooltip, range, custom step, states, FormField |
| `/components/switch` | Sizes, disabled, controlled, FormField |
| `/components/textarea` | Default, error, disabled |
```

- [ ] **Step 2: Remove the Breakpoints section**

Delete the `## Breakpoints` section (lines ~397–407). It just lists Tailwind defaults that every agent already knows. This saves ~12 lines of context window.

- [ ] **Step 3: Commit**

```bash
git add docs/DESIGN-SYSTEM.md
git commit -m "docs: fix stale preview routes, remove redundant breakpoints section"
```

---

### Task 5: Update docs

- [ ] DESIGN-SYSTEM.md — this IS the doc being updated (changes are the feature)
- [ ] ARCHITECTURE.md — new pattern entries added in Task 3
- [ ] DECISIONS.md — log decision: "DESIGN-SYSTEM.md serves consumers, ARCHITECTURE.md serves maintainers"
- [ ] BACKLOG.md — add item: "Expand Patterns section with more composition recipes (form layout, data table page, settings panel, empty state)"
- [ ] CLAUDE.md — no user-facing behavior changed, skip

---

## Verification

After all tasks are complete:

1. **Read the final DESIGN-SYSTEM.md** and verify:
   - Component Index appears right after the opening paragraph
   - Component Selection Guide appears after the index
   - No implementation internals remain in component sections (no MutationObserver, ResizeObserver, useOverflow, clip-path bezier curves, data-variant safelisting)
   - Preview App route table matches the 30 actual routes
   - Breakpoints section is gone
   - All anchor links in the Component Index resolve to actual headings

2. **Read the final ARCHITECTURE.md** and verify:
   - Tabs Implementation Details pattern exists
   - CopyableText Animation pattern exists
   - No duplication with existing patterns

3. **Run `npm run check`** to ensure no build/lint/test regressions (doc-only changes shouldn't break anything, but verify).
