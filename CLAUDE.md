# Working Habits

Persistent habits for maintaining project memory across sessions.

---

## Quick Start

**Sync up:** Say "sync up" or "catch me up" to restore context at session start.

---

## Three Habits

### 1. Decision Logging

Log decisions to `docs/DECISIONS.md` when these phrases appear:
- "decided" / "let's go with" / "rejected"
- "choosing X because" / "not doing X because"
- "actually, let's" / "changed my mind"

Before proposing anything, check if it contradicts a past decision. If conflict found:
> This would contradict Decision #N (summary). Override?

**Format:**
```
## Decision #[N] - [Date]
**Context:** [What we were working on]
**Decision:** [What was decided]
**Rationale:** [Why - this is the important part]
**Alternatives considered:** [If any were discussed]
```

### 2. Scope Drift Detection

**This is an active interrupt, not a passive log.**

When the conversation drifts from the stated task:
1. Stop and say: "This is drifting from [original task]. Add to backlog and refocus, or pivot?"
2. If backlog: log to `docs/BACKLOG.md` and return to the original task
3. If pivot: continue, but note the scope change

**Triggers to watch for:**
- "Would it be useful to add X?" (when X wasn't part of original request)
- "We could also do Y" (when Y is unrelated to core ask)
- "While we're at it, let's add Z"
- Any work that extends beyond what was asked

**Do NOT flag** clarifying questions about the core feature or technical approaches to achieve the original goal.

**Backlog format:**
```
### [Date] - [Short title]
**Source:** Identified while working on [context]
**Description:** [What needs to be done]
**Priority:** Low/Medium/High
```

### 3. Git Discipline

**Branching:**
- Brainstorm and plan on main
- **Push main before branching** — unpushed commits on main cause divergence after squash merge
- When dev starts, create feature branch from main before any file edits
- Branch naming: `<type>/[name]` (e.g. `feature/`, `fix/`, `chore/`, `refactor/`)

**Before merging:** Update ALL docs before squash merging to main.
- `docs/DESIGN-SYSTEM.md` -- add/update tokens, components, hooks, or patterns
- `docs/ARCHITECTURE.md` -- add/update patterns for any new architectural decisions, new files, or changed structure
- `CLAUDE.md` -- update the Current Features list if user-facing behavior changed
- `docs/DECISIONS.md` -- log any key decisions made during the feature
- `docs/BACKLOG.md` -- move completed items to Completed section, add any deferred ideas

**Checklist before merge:**
1. DESIGN-SYSTEM.md updated with new tokens/components?
2. ARCHITECTURE.md updated?
3. CLAUDE.md features updated?
4. DECISIONS.md has implementation decisions?
5. BACKLOG.md item moved to Completed?

**During development:** Track intent, not metrics.

- **Scope drift:** "This started as [X] but now includes [Y]. Commit [X] first?"
- **Feature complete:** When user says "done" or "that's it" -> squash merge to main
- **Pre-break:** When user says "break", "later", "tomorrow" -> "Push before you go?"

**Completion:** `gh pr merge --squash` keeps main history clean (one commit per feature). Never push directly to main — always go through a PR.

Never interrupt based on file count or commit count.

**Finishing a branch** (overrides the `finishing-a-development-branch` skill options):

1. Run project checks (lint, typecheck, test) — stop if anything fails
2. Push branch: `git push -u origin <branch>`
3. Create PR if none exists: `gh pr create --title "..." --body "..."`
4. Squash-merge: `gh pr merge <number> --squash --delete-branch`
5. Sync local main: `git checkout main && git pull --ff-only origin main`
6. Delete local branch: `git branch -D <branch>`
7. Remove any associated worktrees: `git worktree list` and `git worktree remove <path> --force` for stale entries

**Never merge locally.** Option 1 ("Merge back to main locally") from the finishing skill is not allowed — hooks block direct pushes to main, and local merges cause SHA divergence after squash-merge. Always go through the PR.

---

## Context Recovery

On "sync up" or "catch me up":

1. Read `docs/DECISIONS.md`, `docs/BACKLOG.md`, `docs/ARCHITECTURE.md`
2. Check for pending plans — list `docs/superpowers/plans/` and read the most recent file. If a plan exists that hasn't been fully implemented, surface it in the summary.
3. Check git status and recent git log — use **separate parallel Bash calls** (not chained with `&&`), so each matches `Bash(git status*)` / `Bash(git log*)` allow rules and avoids permission prompts
4. Present the summary as a structured table, not prose paragraphs:

```
## Sync Up

| Area | Status |
|------|--------|
| **Branch** | `main` — clean / 2 uncommitted files |
| **Last commit** | `abc1234` — Short commit message |
| **Last decision** | #N — Summary of decision |
| **Pending plan** | None / `2026-03-12-badge-redesign.md` — Brief summary |
| **Blockers** | None / description |

### Open Backlog

| Priority | Items |
|----------|-------|
| **High** | Item 1, Item 2 |
| **Medium** | Item 3, Item 4 |
| **Low** | Item 5 |

Ready to go — what are we working on?
```

5. State readiness

---

## Docs

| File | Purpose |
|------|---------|
| `docs/DESIGN-SYSTEM.md` | Consumer-facing: what to use, how to use it (props, variants, examples) |
| `docs/ARCHITECTURE.md` | Maintainer-facing: how it works internally (patterns, hooks, workarounds) |
| `docs/DECISIONS.md` | Decision log with rationale |
| `docs/BACKLOG.md` | Parking lot for scope creep and deferred ideas |
| `docs/superpowers/specs/` | Design specs from brainstorming sessions (read-only reference) |
| `docs/superpowers/plans/` | Implementation plans from planning sessions (read-only reference) |

---

## Skill Integration

Skills (superpowers) are tools, not separate processes. Use them naturally:

- **Brainstorming:** Use for non-trivial design work. Flag scope creep during brainstorming.
- **Planning:** Use `writing-plans` or `EnterPlanMode` for multi-file changes, new features, unclear requirements.
- **Implementation:** Use `subagent-driven-development` or `executing-plans` for complex implementations.
- **Debugging state/sync bugs:** Before writing any fix, trace the full data flow (write -> store -> fetch -> parse -> render). Identify all integration points that need coordinated changes. Don't patch one step without understanding the chain.
- **Post-implementation:** Run build/lint verification, handle git workflow, update ARCHITECTURE.md and DECISIONS.md if new patterns or decisions emerged.

### Session Workflow

Brainstorming, planning, and implementation happen across separate sessions:

1. **Brainstorm + Plan (current session):** Explore design, write the spec to `docs/superpowers/specs/` and the plan to `docs/superpowers/plans/`. This session ends after the plan is written.
2. **Implement (new session):** Start a fresh session, say "sync up", then execute the plan using `executing-plans` or `subagent-driven-development`. The plan file on disk is the handoff artifact — no brainstorm context carries over.

Why: brainstorm sessions accumulate rejected ideas, design exploration, and back-and-forth that wastes context window during implementation. A clean session starts with only what matters: the plan + project docs.

### Plans Must Include Doc Updates

Every implementation plan must include a final step with this exact checklist. This is not optional — it's part of the definition of done, not a merge-time afterthought.

The final plan task should be:

```
### Task N: Update docs

- [ ] DESIGN-SYSTEM.md — new tokens, components, hooks, or patterns
- [ ] ARCHITECTURE.md — new patterns, new files, or changed structure
- [ ] DECISIONS.md — design decisions made during this feature
- [ ] BACKLOG.md — completed items moved, deferred ideas added
- [ ] CLAUDE.md — Current Features list if user-facing behavior changed
```

Copy this checklist verbatim into every plan. Do not paraphrase or summarize — the explicit checklist prevents items from being forgotten.

---

## Project: Aleph Cloud Design System

Tokens-only design system for Aleph Cloud, with a Next.js preview app to visualize brand colors, semantic tokens, typography, gradients, shadows, and transitions.

### Tech Stack

- **Monorepo:** npm workspaces (`packages/ds` + `apps/preview`)
- **Framework:** Next.js 16 (App Router, static export)
- **Language:** TypeScript 5.9 (strict)
- **Styling:** Tailwind CSS 4 + CSS custom properties
- **Icons:** Phosphor Icons (`@phosphor-icons/react`)
- **Testing:** Vitest + Testing Library
- **Deployment:** Static export (`out/` directory)

### Commands

```bash
npm run dev       # Dev server (Turbopack) — preview app
npm run build     # Static export — preview app
npm run test      # vitest — DS package
npm run lint      # oxlint — all workspaces
npm run typecheck # tsc --noEmit — all workspaces
npm run check     # lint + typecheck + test — all workspaces
```

### Key Directories

```
packages/ds/src/styles/       # Design tokens (tokens.css with OKLCH scales)
packages/ds/src/components/   # DS components (button, input, textarea, form-field)
packages/ds/src/lib/          # Utilities (cn.ts)
apps/preview/src/app/         # Next.js pages and layout
apps/preview/src/components/  # Preview-only UI (sidebar, theme-switcher)
docs/plans/                   # Design and implementation plans
```

### Current Features

- npm workspaces monorepo with source-level subpath exports (`@aleph-front/ds/*`)
- Three-layer token system (OKLCH color scales 50–950, semantic tokens incl. `--surface` for elevated backgrounds, Tailwind mapping)
- OKLCH color scales for primary, accent, success, warning, error, neutral (unified brand-tinted scale at H:280)
- Light/dark theme switching via `.theme-dark` class with `@custom-variant dark`
- Button component with 6 variants, 4 sizes, CVA architecture (primary/secondary use gradient fills, outline uses gradient border)
- Spinner component for loading states
- cn() utility (clsx + tailwind-merge)
- Input component with 2 sizes, borderless flat fill, error/disabled states
- Textarea component with rows default, borderless flat fill, vertical resize, error/disabled states
- Checkbox component (Radix UI) with 3 sizes (xs/sm/md), error/disabled states, clip-path reveal animation
- RadioGroup component (Radix UI) with 3 sizes (xs/sm/md), group/item-level disabled, clip-path reveal animation
- Switch component (Radix UI) with 3 sizes (xs/sm/md), animated sliding thumb, disabled state
- Select component (Radix UI) with flat options prop, 2 sizes, borderless flat fill, error/disabled, portal dropdown
- Combobox component (cmdk + Radix Popover) with searchable dropdown, flat options prop, 2 sizes, borderless flat fill, error/disabled, check icon on selected
- MultiSelect component (cmdk + Radix Popover) with searchable multi-select dropdown, flat options prop, tags with overflow (maxDisplayedTags=2), per-tag dismiss, clear-all action, checkbox indicators, 2 sizes, borderless flat fill, error/disabled
- Slider component (Radix Slider) with CVA track/thumb variants, 2 sizes (sm/md), single or range (two-thumb) mode, optional hover tooltip, error state, keyboard accessible
- FormField wrapper with label, required asterisk, helper text, error message, auto-wired accessibility, auto-injects error/aria-invalid into child
- Alert component with 4 semantic variants (warning/error/info/success), optional title, dismissible with XCircle button and exit animation, auto-dismiss timer with progress bar, auto-styled links (bold, underline, ↗ icon via ::after), CSS gradient backgrounds at 10% opacity with dark mode support
- Pagination component with controlled API (`page`/`onPageChange`), configurable `siblingCount` (default 1), `showFirstLast` toggle, fixed-slot `buildPageRange()` function (always `2*siblingCount+5` items, no layout shift), position-keyed slots (no DOM flicker), `aria-disabled` boundary nav, `aria-current="page"` active state, `forwardRef` to `<nav>`
- Breadcrumb component with composable 6-part API (Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage), `asChild` via Radix Slot for framework routing, semantic nav/ol/li markup, custom separator support, hover color transition
- Badge component with 5 semantic variants (default/success/warning/error/info), 2 fill modes (solid gradient/outline), 2 sizes, optional iconLeft/iconRight slots, uppercase heading font
- StatusDot component with 5 health status variants (healthy/degraded/error/offline/unknown), pulse animation on healthy, 2 sizes, built-in role="status" and auto aria-label
- Card component with 3 variants (default/noise/ghost), 3 padding sizes, optional title prop — noise variant uses `fx-grain-lg`
- FX Grain texture utilities (`fx-grain-xs/sm/md/lg`) — SVG feTurbulence purple dot overlays with radial gradient backgrounds, 4 intensity levels, dark mode support, all colors from DS tokens
- Skeleton loading placeholder with consumer-driven sizing via className
- Table component with generic typing, sortable columns, keyboard-accessible sorting (Enter/Space), aria-sort, alternating rows, hover, row click (keyboard Enter), activeKey row highlight (aria-current), emptyState prop
- Tooltip component wrapping Radix UI with DS styling, dark mode contrast fix (composable API: Provider, Root, Trigger, Content)
- Tabs component (Radix UI) with composable API (Tabs, TabsList, TabsTrigger, TabsContent), sliding active indicator via MutationObserver, text nudge animation, arbitrary trigger children (badges, subscripts), disabled state, keyboard navigation, pill variant (`variant="pill"`) with solid-fill sliding indicator for segmented-control style, overflow collapse (`overflow="collapse"`) with auto-hidden trailing tabs in "..." dropdown menu (arrow key navigation, menu ARIA roles), indicator slides behind trigger when hidden tab is active
- CopyableText component with middle-ellipsis truncation, copy-to-clipboard with stroke-draw animation (SVG checkmark via stroke-dashoffset), optional external link (ArrowUpRight), clickable text when href is provided, 2 sizes (sm/md)
- Dialog component (Radix UI) with composable 8-part API (Dialog, DialogTrigger, DialogContent, DialogClose, DialogTitle, DialogDescription, DialogHeader, DialogFooter), frosted overlay (backdrop-blur), entry/exit animations (fade + zoom), `locked` prop to prevent all dismiss paths, focus trap
- Logo components — `Logo` (icon mark) and `LogoFull` (icon + wordmark), SVG with `fill="currentColor"` for automatic theme adaptation
- Phosphor Icons integration — 7,000+ icons in 6 weights (Thin/Light/Regular/Bold/Fill/Duotone), MIT licensed, used internally for UI chrome (CaretDown, Check, X, CaretUp)
- All animated components respect prefers-reduced-motion via motion-reduce: variants
- Preview app with responsive sidebar navigation (desktop fixed + mobile drawer) and route-per-page (30 pages)
- Static export for deployment
- CI workflow (GitHub Actions): lint + typecheck + test + build on PRs and main pushes
- Publish workflow: triggered by GitHub Release, patches version from git tag, publishes `@aleph-front/ds` to npm as raw TypeScript source
