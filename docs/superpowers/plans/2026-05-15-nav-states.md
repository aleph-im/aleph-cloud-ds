# Nav Item States Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the rest / hover / focus-visible / active states for ProductStrip tabs and AppShellSidebar NavItem so hover and active sit on a single primary-tinted spectrum, fix the dark-mode active state (currently a muddy `primary-900` fill), and add a proper keyboard focus ring.

**Architecture:** Two well-bounded component edits. Both components already construct their class strings with `cn()`; we replace the active block and the hover string in a branched, mutually-exclusive shape so the lighter hover background cannot win specificity against the active background. Token definitions stay untouched — the change is entirely at the consumer.

**Tech Stack:** React 19, Tailwind CSS 4 (with arbitrary opacity modifiers), `cn()` (clsx + tailwind-merge), Vitest + Testing Library.

**Spec:** `docs/superpowers/specs/2026-05-15-nav-states-design.md`

---

## File Structure

**Modify:**
- `packages/ds/src/components/product-strip/product-strip.tsx` — replace the class string on the tab anchor
- `packages/ds/src/components/app-shell-sidebar/app-shell-sidebar.tsx` — replace the `classes` variable in `NavItem`
- `docs/DESIGN-SYSTEM.md` — update ProductStrip and NavItem state vocabulary
- `docs/DECISIONS.md` — log the decision
- `CLAUDE.md` — update the ProductStrip and AppShellSidebar entries in Current Features
- `docs/BACKLOG.md` — move this work to Completed

**No new files.** No token changes. No new tests required (existing tests assert behavior and the only class-name assertion checks for `bg-primary-100`, which the new design preserves).

---

## Task 1: Update ProductStrip tab anchor classes

**Files:**
- Modify: `packages/ds/src/components/product-strip/product-strip.tsx:42-60`

- [ ] **Step 1: Read the current state**

Open `packages/ds/src/components/product-strip/product-strip.tsx`. The map function currently renders:

```tsx
<a
  key={app.id}
  href={app.href}
  aria-current={isActive ? "page" : undefined}
  className={cn(
    "rounded-md px-2 py-1 text-sm transition-colors",
    "text-muted-foreground hover:text-foreground hover:bg-muted",
    isActive &&
      "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200 font-medium",
  )}
  style={{ transitionDuration: "var(--duration-fast)" }}
>
  {app.label}
</a>
```

- [ ] **Step 2: Replace the className**

Change the `className={cn(...)}` block to the branched form:

```tsx
className={cn(
  "rounded-md px-2 py-1 text-sm transition-colors",
  "focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2",
  "dark:focus-visible:outline-primary-300",
  isActive
    ? [
        "bg-primary-100 text-primary-700 font-medium",
        "dark:bg-primary-500/18 dark:text-primary-200",
      ]
    : [
        "text-muted-foreground",
        "hover:bg-primary-100/50 hover:text-primary-700",
        "dark:hover:bg-primary-500/8 dark:hover:text-primary-200",
      ],
)}
```

The rest of the anchor (`href`, `aria-current`, `style`, children) is unchanged.

- [ ] **Step 3: Run the existing tests**

```bash
npm run test -w @aleph-front/ds -- product-strip
```

Expected: all 5 tests pass. The tests assert `aria-current`, link `href`, and the right-slot — none assert specific class names, so the visual change won't break them.

- [ ] **Step 4: Run typecheck and lint for the package**

```bash
npm run typecheck
npm run lint
```

Expected: no new errors.

- [ ] **Step 5: Commit**

```bash
git add packages/ds/src/components/product-strip/product-strip.tsx
git commit -m "feat(product-strip): refine tab states with primary-tinted hover and focus-visible outline"
```

---

## Task 2: Update AppShellSidebar NavItem classes

**Files:**
- Modify: `packages/ds/src/components/app-shell-sidebar/app-shell-sidebar.tsx:203-209`

- [ ] **Step 1: Read the current state**

Open `packages/ds/src/components/app-shell-sidebar/app-shell-sidebar.tsx`. Inside `NavItem`, the `classes` constant currently reads:

```tsx
const classes = cn(
  "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
  active
    ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200 font-medium"
    : "text-muted-foreground hover:text-foreground hover:bg-muted",
  className,
);
```

- [ ] **Step 2: Replace the classes constant**

Change the `classes` definition to:

```tsx
const classes = cn(
  "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
  "focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2",
  "dark:focus-visible:outline-primary-300",
  active
    ? [
        "bg-primary-100 text-primary-700 font-medium",
        "dark:bg-primary-500/18 dark:text-primary-200",
      ]
    : [
        "text-muted-foreground",
        "hover:bg-primary-100/50 hover:text-primary-700",
        "dark:hover:bg-primary-500/8 dark:hover:text-primary-200",
      ],
  className,
);
```

The rest of `NavItem` (the `asChild` branch, the bare `<a>` branch, both with their icon/label spans) is unchanged.

- [ ] **Step 3: Run the existing NavItem tests**

```bash
npm run test -w @aleph-front/ds -- app-shell-sidebar
```

Expected: all tests pass. The one class-name assertion is `expect(link.className).toContain("bg-primary-100")`, which the new active class still includes.

- [ ] **Step 4: Run typecheck and lint**

```bash
npm run typecheck
npm run lint
```

Expected: no new errors.

- [ ] **Step 5: Commit**

```bash
git add packages/ds/src/components/app-shell-sidebar/app-shell-sidebar.tsx
git commit -m "feat(app-shell-sidebar): refine NavItem states with primary-tinted hover and focus-visible outline"
```

---

## Task 3: Visual verification in the preview app

**Files:**
- Verify only: `apps/preview/src/app/components/product-strip/page.tsx` (no edits)
- Verify only: `apps/preview/src/app/components/app-shell-sidebar/page.tsx` (no edits)

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

Wait for Turbopack to report "Ready". Open the URL it prints (typically `http://localhost:3000`).

- [ ] **Step 2: Verify ProductStrip**

Navigate to `/components/product-strip` in the preview.

**Light theme** (use the theme switcher to confirm light is active):
- Hover an inactive tab → background should be a very soft purple tint (`primary-100/50`), text should turn `primary-700`.
- Tab the keyboard focus onto an inactive tab → a purple outline appears with 2px gap around the pill.
- Active tab → full `primary-100` background, `primary-700` text, slightly heavier weight.
- Hover the active tab → no visual change (active and hover are mutually exclusive in the class list).

**Dark theme** (switch theme):
- Hover an inactive tab → very subtle translucent primary glow (`primary-500/8`), text turns `primary-200`.
- Tab the keyboard focus onto an inactive tab → lighter purple outline (`primary-300`) with 2px gap.
- Active tab → more visible translucent primary tint (`primary-500/18`), `primary-200` text. The pill should clearly stand out from the dark surface (this was the muddy state we fixed).

- [ ] **Step 3: Verify AppShellSidebar NavItem**

Navigate to `/components/app-shell-sidebar`.

Repeat the same four checks (hover light, focus-visible light, active light, dark counterparts) on the sidebar nav rows.

Additionally:
- Section title rows (the accordion toggles) should still show their current (chrome-style) hover — they are out of scope and must look unchanged.
- The bottom collapse toggle should still show its current hover — out of scope, unchanged.

- [ ] **Step 4: Verify keyboard-only focus ring**

Click on an inactive nav item with the mouse. The outline should NOT appear (because we used `focus-visible:`, not `focus:`). Press Tab to keyboard-focus a different item — the outline SHOULD appear.

- [ ] **Step 5: Note any visual regressions**

If anything looks off, stop and surface the issue before continuing. Do not edit the spec or rewrite the implementation without flagging it first.

- [ ] **Step 6: Stop the dev server**

Ctrl+C in the terminal where `npm run dev` is running.

---

## Task 4: Run full project checks

**Files:** None.

- [ ] **Step 1: Run the project's combined check**

```bash
npm run check
```

This runs lint + typecheck + test across all workspaces.

Expected: all green. If a test fails because it asserts a class string that has changed, surface it and decide whether to update the test or revisit the spec — do NOT silently relax the assertion.

---

## Task 5: Update docs

**Files:**
- Modify: `docs/DESIGN-SYSTEM.md` — find the ProductStrip and AppShellSidebar `NavItem` sections, update the state vocabulary description
- Modify: `docs/DECISIONS.md` — append a new decision entry
- Modify: `CLAUDE.md` — find the ProductStrip and AppShellSidebar entries in "Current Features", update the state descriptions
- Modify: `docs/BACKLOG.md` — if a nav-states item exists in the active list, move it to Completed; otherwise add a Completed entry

- [ ] **Step 1: Update `docs/DESIGN-SYSTEM.md`**

Find the ProductStrip section. Wherever the active-state classes are described (look for `bg-primary-100` or "active app"), replace the prose with the new four-state table from the spec (rest / hover / focus-visible / active). Do the same for the `NavItem` section under AppShellSidebar.

The exact wording in DESIGN-SYSTEM.md should match the table in `docs/superpowers/specs/2026-05-15-nav-states-design.md` under "State Specification".

- [ ] **Step 2: Update `docs/DECISIONS.md`**

Open the file, find the highest existing decision number, then append:

```markdown
## Decision #[N] - 2026-05-15
**Context:** Refining nav item appearance in ProductStrip and AppShellSidebar — the existing `hover:bg-muted` was identical to the active background in light theme and identical to the surface color in dark theme, so hover was effectively broken on both. The dark-mode active state (`bg-primary-900` over `base-900`) also read as muddy.
**Decision:** Adopt a single primary-tinted state spectrum across both nav surfaces. Hover and active share the same color story; intensity is the differentiator. Dark-mode active becomes `primary-500/18` (translucent over the dark surface) instead of `primary-900` fill, mirroring the soft-tint character of the light theme. Focus-visible adds a 2px primary outline (light: `primary-500`, dark: `primary-300`) with 2px offset, applied via `focus-visible:` so mouse interactions do not trigger it.
**Rationale:** Hover and active feel like one design language. Dark mode no longer needs a special "darker pill" pattern that fights the surface — it uses a glow that mirrors the light theme. Keyboard users get a clear focus ring without bothering mouse users.
**Alternatives considered:** A solid `primary-500` pill (rejected as too aggressive), an indicator-only treatment (rejected — too quiet for primary nav), giving section title rows and the collapse toggle the same new hover (rejected — they are sidebar chrome, not nav items).
```

Pick the actual next number when writing this.

- [ ] **Step 3: Update `CLAUDE.md`**

Open `CLAUDE.md`, search for the ProductStrip and AppShellSidebar entries in the "Current Features" list. Update the state vocabulary description in each entry to match the new four-state system. Keep the surrounding sentence structure consistent with the rest of the list.

- [ ] **Step 4: Update `docs/BACKLOG.md`**

If there's an active item related to nav state appearance, move it to the Completed section with today's date. If not, add a Completed entry:

```markdown
### 2026-05-15 - Refine nav item states (ProductStrip + AppShellSidebar)
**Description:** Replaced broken `bg-muted` hover with primary-tinted hover/active spectrum, fixed muddy dark-mode active state, added keyboard-only focus-visible outline.
```

- [ ] **Step 5: Verify the docs build (if applicable)**

```bash
npm run check
```

Expected: still green. (No code touched in this task, so this is a sanity step in case of typos in code blocks.)

- [ ] **Step 6: Commit the docs**

```bash
git add docs/DESIGN-SYSTEM.md docs/DECISIONS.md docs/BACKLOG.md CLAUDE.md
git commit -m "docs: update nav state vocabulary and log decision"
```

---

## Task 6: Update docs (checklist verification)

This task verifies the doc update from Task 5 covered everything. Do not skip — it is the definition-of-done checklist from the project's CLAUDE.md.

- [ ] DESIGN-SYSTEM.md — ProductStrip + NavItem state vocabulary updated to the new four-state table
- [ ] ARCHITECTURE.md — no change (no new patterns, no new files, no token changes)
- [ ] DECISIONS.md — decision entry added with rationale
- [ ] BACKLOG.md — Completed entry added (or existing item moved)
- [ ] CLAUDE.md — Current Features list updated for both ProductStrip and AppShellSidebar entries

If any box is unchecked, return to Task 5 and complete it before declaring the feature done.
