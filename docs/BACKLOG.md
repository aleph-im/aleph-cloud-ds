# Backlog

Ideas and scope creep captured for later consideration.

---

## How Items Get Here

- Scope drift detected during focused work (active interrupt)
- Ideas that come up but aren't current priority
- "We should also..." moments
- Features identified but deferred

---

## Open Items

### 2026-05-15 — scheduler-dashboard: shell composition follow-ups

**Source:** Shell-primitives feedback while reviewing the scheduler app's first integration
**Description:** Five scheduler-side fixes that don't require any further DS changes. Each one is a small composition tweak.
- **Drop the duplicate Aleph logo.** ProductStrip already renders the Aleph mark at the top-left as the global cross-product anchor. The sidebar's `appMark` slot currently renders the same mark again next to "Network". Drop the mark from `appMark`; render only the sub-app name (or a sub-product logo if one exists).
- **Refresh button → `<Button variant="text" size="xs">`.** Currently using a primary-style button which is too loud for header chrome. The DS already supports `variant="text"` and `size="xs"`.
- **Move the rounded-corner mask above the PageHeader.** Today the rounded surface starts below the PageHeader, which makes the chrome row read as a separate strip. It should start just below the ProductStrip so the PageHeader sits inside the rounded surface.
- **Wire the version number into `AppShellSidebar`'s new `footer` prop.** DS shipped the slot — pass `footer={<span className="font-mono">v…</span>}`.
- **Pass `defaultOpen={false}` on the Operations `AccordionSection`.** DS default stays `true`; close just this one section.

**Priority:** Medium (blocks the dashboard's shell feeling polished, but no DS work is required)

### 2026-03-01 — Theme persistence across page reloads

**Source:** Identified during accessibility audit
**Description:** Theme selection resets on page reload. Persist to `localStorage` and apply before first paint (inline `<script>` in `<head>`) to avoid flash of wrong theme.
**Priority:** Medium

### 2026-03-01 — Font loading strategy

**Source:** Identified during accessibility audit
**Description:** External font loading (Typekit, Google Fonts) blocks render and has no fallback strategy. Consider `font-display: swap`, preconnect hints, or self-hosting critical fonts.
**Priority:** Low

### 2026-03-01 — Form control base class deduplication

**Source:** Identified during accessibility audit
**Description:** Input, Textarea, and Select share identical base styles (shadow-brand, focus ring, error border, dark mode bg). Extract shared form control base classes to reduce duplication.
**Priority:** Low

### 2026-02-27 — Form components (remaining)

**Source:** Identified while reviewing component coverage
**Description:** Build remaining form components using the token system and CVA architecture. Checkbox, RadioGroup, Switch, Select, Combobox, and Slider are done. Remaining:
- File Upload — drag-and-drop or click-to-upload area
- Number Input / Stepper — numeric input with +/- buttons
**Priority:** Medium

### 2026-02-27 — Component library (remaining)

**Source:** Design doc
**Description:** Build remaining UI components. Badge, StatusDot, Card, Skeleton, Table, Tooltip are done. Remaining:
- ~~Modal / Dialog~~ — done (see completed)
- ~~Tabs~~ — done (see completed)
- Accordion / Collapsible — expand/collapse sections
- ~~Alert / Banner~~ — done (see completed)
- Avatar — user image with fallback initials
- ~~Pagination~~ — done (see completed)
- ~~Progress~~ — done (see completed)
- ~~Breadcrumb~~ — done (see completed)
**Priority:** High

### 2026-03-09 — Card grain size variants

**Source:** Identified while bumping DS in scheduler-dashboard
**Description:** The Card component only exposes a single `noise` variant (`fx-grain-lg`). The token layer already has `fx-grain-xs`, `fx-grain-sm`, `fx-grain-md`, and `fx-grain-lg` classes. Expose grain size selection through the Card API — either as separate variants (`noise-xs`, `noise-sm`, `noise-md`, `noise-lg`) or a compound variant (`variant="noise" grain="sm"`).
**Priority:** Low


### 2026-03-14 — Composition recipes for DESIGN-SYSTEM.md

**Source:** Identified during DESIGN-SYSTEM.md improvement pass
**Description:** Expand the Patterns section with more composition recipes: form layout (FormField + inputs), data table page (Table + Pagination + Tabs), settings panel (Switch + Slider + Card), empty state (Skeleton + CopyableText). Show how components compose together for common product UI patterns.
**Priority:** Low

### 2026-03-17 — Scheduler API endpoint reference

**Source:** External reference from aleph-vm-scheduler repo
**Description:** Track the scheduler API endpoints for building dashboard UI that consumes them. Check periodically for new or changed routes.
**Link:** https://github.com/aleph-im/aleph-vm-scheduler/blob/260302ee7ac4a81f972a7b44b04e4f537091080d/scheduler-api/src/routes/mod.rs#L882
**Priority:** Low

### 2026-04-10 — Restyle app progress bars to use DS ProgressBar

**Source:** Identified during ProgressBar implementation
**Description:** The cloud app has hand-rolled progress bars (likely inline divs with width %). Replace with `@aleph-front/ds/progress-bar` ProgressBar component for consistency and accessibility.
**Priority:** Medium

### 2026-04-10 — Restyle app stepper/pipeline to use DS Stepper

**Source:** Identified during Stepper implementation
**Description:** The cloud app has a StepIndicator and pipeline component for multi-step flows. Replace with `@aleph-front/ds/stepper` compound Stepper for consistency, accessibility, and orientation support.
**Priority:** Medium

### 2026-02-26 — Button icon animations

**Source:** Deferred from button component design
**Description:** Add hover/focus animations to button icons (e.g., arrow slide on hover, plus rotate on focus).
**Priority:** Low

---

## Completed / Rejected

<details>
<summary>Archived items</summary>

- [x] 2026-02-26 — Typekit font integration (kit ID: `acb7qvn`)
- [x] 2026-02-26 — Global CLAUDE.md: bundler moduleResolution for Next.js
- [x] 2026-02-26 — Button component (CVA variants, OKLCH color scales, TDD)
- [x] 2026-02-27 — Input, Textarea, FormField components (CVA, accessibility, TDD)
- [x] 2026-02-27 — Monorepo + preview restructure (pnpm workspaces, sidebar + routes)
- [x] 2026-02-27 — Gradient button variants (primary=gradient-main, secondary=gradient-lime, outline=gradient border)
- [x] 2026-02-27 — Form components: Checkbox, RadioGroup, Switch, Select (Radix UI wrappers)
- [x] 2026-02-27 — Select dropdown animation classes are dead (removed, no phantom features)
- [x] 2026-03-01 — Dashboard components: Badge, StatusDot, Card, Skeleton, Table, Tooltip
- [x] 2026-03-01 — Accessibility audit & hardening (StatusDot a11y, FormField error injection, Table keyboard nav, motion-reduce support, responsive mobile layout)
- [x] 2026-03-02 — Align color token naming with Tailwind conventions (`destructive` → `error` alias)
- [x] 2026-03-02 — Package publishing to npm (CI/CD pipeline, raw TS source, GitHub Release trigger)
- [x] 2026-03-04 — Combobox component (cmdk + Radix Popover, searchable dropdown, sm/md sizes)
- [x] 2026-03-04 — Slider component (Radix Slider wrapper, track/thumb CVA, tooltip, sm/md sizes)
- [x] 2026-03-04 — Base color scale expansion (merged base into neutral at H:280, full 50-950 ramp)
- [x] 2026-03-05 — Multi-select dropdown with checkboxes (cmdk + Radix Popover, tags with overflow, clear-all)
- [x] 2026-03-06 — Phosphor Icons integration (replaced inline SVGs, added to DS as dependency, preview showcase)
- [x] 2026-03-06 — CopyableText component (middle-ellipsis truncation, clip-path circle reveal, optional external link)
- [x] 2026-03-09 — Logo components (icon mark + full logo, currentColor, 2 components instead of 4 SVGs)
- [x] 2026-03-09 — FX grain backgrounds (4 size variants xs/sm/md/lg, DS token colors, dark mode, preview showcase)
- [x] 2026-03-09 — Tabs component (Radix wrapper, sliding indicator, composable API, badge/subscript support)
- [x] 2026-03-10 — Alert component (4 variants, dismiss with exit animation, auto-dismiss timer, auto-styled links)
- [x] 2026-03-10 — Pagination component (controlled API, configurable siblingCount/showFirstLast, pure buildPageRange function, a11y)
- [x] 2026-03-10 — Breadcrumb component (composable 6-part API, asChild via Radix Slot, semantic nav/ol/li, custom separator)
- [x] 2026-03-12 — Tabs pill variant Tailwind 4 scanner fix (`@source inline()` safelist in tokens.css)
- [x] 2026-03-13 — Dialog component (Radix UI, composable API, frosted overlay, locked dismiss)
- [x] 2026-03-13 — CopyableText: remove tooltip, make text clickable when href provided
- [x] 2026-03-13 — CopyableText: internal links open in new tab (auto-detect relative vs absolute URLs)
- [x] 2026-03-16 — Button `text` variant hover invisible on `surface` background (bumped hover to primary-100, active to primary-200)
- [x] 2026-04-10 — ProgressBar component (determinate + indeterminate, 3 sizes, ProgressBarDescription child)
- [x] 2026-04-10 — Stepper compound component (7 parts, horizontal/vertical orientation, dual-context state propagation)
- [x] 2026-05-01 — Table sort-icon alignment fix on right-aligned headers (inline-flex + flex-row-reverse, no width shift on toggle)
- [x] 2026-05-02 — Table controlled-sort props (`sortColumn`/`sortDirection`/`onSortChange`) so externally paginated tables can sort the full dataset rather than only the current page
- [x] 2026-05-04 — Tabs `maxVisible` prop (count-based cap on visible tab count, stricter-wins composition with `overflow="collapse"`)
- [x] 2026-05-13 — ProductStrip primitive (Aleph cloud shell Part A — cross-app navigation strip with active tab convention)
- [x] 2026-05-14 — AppShellSidebar + AccordionSection + NavItem + useSidebarCollapse + useAccordionState (Aleph cloud shell Part B — sidebar shell, rail-hide pattern, SSR-safe hydration)
- [x] 2026-05-15 — PageHeader + PageHeaderProvider + usePageHeader (Aleph cloud shell Part C — context-driven slot, split read/write contexts to break the inline-JSX render-loop trap)
- [x] 2026-05-15 — NavItem `asChild` + AnchorHTMLAttributes passthrough (lets consumers plug in Next.js `Link` / React Router `Link` and attach `onMouseEnter`/`onFocus` for hover-prefetch — surfaced by the scheduler dashboard integration, see Decision #80)

</details>
