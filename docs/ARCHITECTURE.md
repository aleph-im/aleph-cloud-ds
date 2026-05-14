# Architecture

Technical patterns and decisions.

---

## Stack

| Layer | Technology |
|-------|------------|
| Monorepo | npm workspaces |
| Framework | Next.js 16 (App Router, static export) |
| Language | TypeScript 5.9 (strict) |
| Styling | Tailwind CSS 4 + CSS custom properties |
| Icons | Phosphor Icons (`@phosphor-icons/react`) |
| Testing | Vitest + Testing Library |
| Deployment | Static export (`out/` directory) |

---

## Project Structure

```
aleph-cloud-ds/
├── package-lock.json             # Lockfile
├── tsconfig.base.json            # Shared TS compiler options
├── package.json                  # Root scripts (delegates to workspaces)
│
├── packages/
│   └── ds/                       # @aleph-front/ds
│       ├── src/
│       │   ├── components/
│       │   │   ├── badge/
│       │   │   │   ├── badge.tsx
│       │   │   │   └── badge.test.tsx
│       │   │   ├── button/
│       │   │   │   ├── button.tsx
│       │   │   │   └── button.test.tsx
│       │   │   ├── card/
│       │   │   │   ├── card.tsx
│       │   │   │   └── card.test.tsx
│       │   │   ├── checkbox/
│       │   │   │   ├── checkbox.tsx
│       │   │   │   └── checkbox.test.tsx
│       │   │   ├── combobox/
│       │   │   │   ├── combobox.tsx
│       │   │   │   └── combobox.test.tsx
│       │   │   ├── input/
│       │   │   │   ├── input.tsx
│       │   │   │   └── input.test.tsx
│       │   │   ├── logo/
│       │   │   │   ├── logo.tsx
│       │   │   │   └── logo.test.tsx
│       │   │   ├── radio-group/
│       │   │   │   ├── radio-group.tsx
│       │   │   │   └── radio-group.test.tsx
│       │   │   ├── select/
│       │   │   │   ├── select.tsx
│       │   │   │   └── select.test.tsx
│       │   │   ├── slider/
│       │   │   │   ├── slider.tsx
│       │   │   │   └── slider.test.tsx
│       │   │   ├── switch/
│       │   │   │   ├── switch.tsx
│       │   │   │   └── switch.test.tsx
│       │   │   ├── textarea/
│       │   │   │   ├── textarea.tsx
│       │   │   │   └── textarea.test.tsx
│       │   │   ├── form-field/
│       │   │   │   ├── form-field.tsx
│       │   │   │   └── form-field.test.tsx
│       │   │   ├── progress-bar/
│       │   │   │   ├── progress-bar.tsx
│       │   │   │   └── progress-bar.test.tsx
│       │   │   ├── stepper/
│       │   │   │   ├── stepper.tsx
│       │   │   │   └── stepper.test.tsx
│       │   │   ├── table/
│       │   │   │   ├── table.tsx
│       │   │   │   └── table.test.tsx
│       │   │   ├── status-dot/
│       │   │   │   ├── status-dot.tsx
│       │   │   │   └── status-dot.test.tsx
│       │   │   ├── tabs/
│       │   │   │   ├── tabs.tsx
│       │   │   │   └── tabs.test.tsx
│       │   │   ├── tooltip/
│       │   │   │   ├── tooltip.tsx
│       │   │   │   └── tooltip.test.tsx
│       │   │   └── ui/
│       │   │       ├── skeleton.tsx
│       │   │       ├── skeleton.test.tsx
│       │   │       └── spinner.tsx
│       │   ├── styles/
│       │   │   └── tokens.css
│       │   └── lib/
│       │       └── cn.ts
│       ├── package.json          # Subpath exports, peer deps
│       ├── tsconfig.json
│       └── vitest.config.ts
│
├── apps/
│   └── preview/                  # @aleph-front/preview
│       ├── src/
│       │   ├── app/
│       │   │   ├── layout.tsx    # Shell: header + sidebar + content
│       │   │   ├── page.tsx      # Overview landing
│       │   │   ├── globals.css
│       │   │   ├── foundations/
│       │   │   │   ├── colors/page.tsx
│       │   │   │   ├── typography/page.tsx
│       │   │   │   ├── spacing/page.tsx
│       │   │   │   ├── effects/page.tsx
│       │   │   │   ├── icons/page.tsx
│       │   │   │   └── logo/page.tsx
│       │   │   └── components/
│       │   │       ├── badge/page.tsx
│       │   │       ├── button/page.tsx
│       │   │       ├── card/page.tsx
│       │   │       ├── checkbox/page.tsx
│       │   │       ├── input/page.tsx
│       │   │       ├── radio-group/page.tsx
│       │   │       ├── combobox/page.tsx
│       │   │       ├── select/page.tsx
│       │   │       ├── slider/page.tsx
│       │   │       ├── switch/page.tsx
│       │   │       ├── textarea/page.tsx
│       │   │       ├── form-field/page.tsx
│       │   │       ├── skeleton/page.tsx
│       │   │       ├── table/page.tsx
│       │   │       ├── status-dot/page.tsx
│       │   │       ├── tabs/page.tsx
│       │   │       └── tooltip/page.tsx
│       │   └── components/
│       │       ├── sidebar.tsx
│       │       ├── page-header.tsx
│       │       ├── demo-section.tsx
│       │       └── theme-switcher.tsx
│       ├── package.json
│       ├── tsconfig.json
│       ├── next.config.ts        # transpilePackages + turbopack.root
│       └── postcss.config.mjs
│
└── docs/
    ├── DESIGN-SYSTEM.md
    ├── ARCHITECTURE.md
    ├── DECISIONS.md
    ├── BACKLOG.md
    └── plans/
```

---

## Workspaces

| Workspace | Package name | Purpose |
|-----------|-------------|---------|
| `packages/ds` | `@aleph-front/ds` | Publishable design system (tokens, components, utilities) |
| `apps/preview` | `@aleph-front/preview` | Next.js preview app for visual documentation |

### Source exports (no build step)

The DS package exports raw `.tsx` source files via `"exports"` in `package.json`. Consumers compile it themselves via their bundler. This eliminates a build step entirely. Consumer apps must add `transpilePackages: ["@aleph-front/ds"]` to their Next.js config.

### Deep imports (no barrel files)

Components are imported individually: `@aleph-front/ds/button`, not `@aleph-front/ds`. This is explicit, tree-shakeable, and requires no barrel file maintenance.

---

## Import Aliases

| Alias | Scope | Resolved to | Configured in |
|-------|-------|-------------|---------------|
| `@ac/*` | DS package internal | `packages/ds/src/*` | `packages/ds/tsconfig.json`, `packages/ds/vitest.config.ts` |
| `@preview/*` | Preview app internal | `apps/preview/src/*` | `apps/preview/tsconfig.json` |
| `@ac/*` | Preview app (cross-workspace) | `packages/ds/src/*` | `apps/preview/tsconfig.json` |

The preview app needs `@ac/*` in its tsconfig because TypeScript follows imports inside transpiled DS source files.

**CSS imports are the exception** — PostCSS does not resolve tsconfig aliases, so `@import` paths in `.css` files must be relative (see Decision #5).

---

## Rules

### Styled by Default, Overridable via className

Every DS component must ship with sensible default styling — colors, borders, typography, transitions, state-based visual changes. A consumer who imports the component and renders it with only required props should get a polished, usable result that matches the preview app.

Consumers override defaults via `className` (merged with `cn()`). No component should require the consumer to build visual treatment from scratch using `data-*` attribute selectors.

**Test:** `<StepperIndicator>1</StepperIndicator>` should render a styled circle with border, font, and state-based fills — not an unstyled `<div>`.

### No Tailwind Prefix Collisions in Token Names

Semantic token names must not duplicate a Tailwind utility prefix. When a token name matches a prefix, the resulting class stutters (e.g., `border-border`). Check against: `bg-`, `text-`, `border-`, `shadow-`, `ring-`, `outline-`.

**Example:** The border color token is named `edge`, not `border`, giving `border-edge` instead of `border-border`.

### Promote Layer 1 Values to Layer 2 When Theme-Dependent

Layer 1 (`@theme`) holds raw brand values that are the same in all themes. If a brand value needs to change between light and dark mode, it must be promoted to a semantic token in Layer 2.

**Pre-flight check before using any brand token in a component:**
1. Will this value look correct on *both* light and dark backgrounds?
2. Does the value contain colors that match or blend into a theme's background?

If either answer is "no," promote the token:
1. Keep the raw value(s) in `@theme` with descriptive suffixes (`-base`, `-dark`)
2. Create a semantic alias in `:root` → `var(--<name>-base)`
3. Override in `.theme-dark` → `var(--<name>-dark)`
4. Consumers reference the semantic name (no suffix)

**Example:** `--gradient-main` has a dark end (`#141421`) that matches the dark mode background. Promoted: `--gradient-main-base` and `--gradient-main-dark` in Layer 1, `--gradient-main` in Layer 2 swaps per theme.

### Card Corner Radius as Surface Default

All elevated surface components (Dialog, dropdowns, popovers, future overlays) must use `rounded-md` — the same corner radius as the Card component. This ensures visual consistency across all "floating panel" surfaces.

**Reference:** `packages/ds/src/components/card/card.tsx` — `cva("rounded-md", ...)`

### Ecosystem Aliases for Color Tokens

When a widely-used convention (shadcn, Bootstrap) uses a different name for a color the DS already provides, add a `var()` alias in Layer 1 rather than renaming. The canonical name stays authoritative; the alias prevents silent CSS failures in consumer projects.

**Pattern:** `--color-<alias>-<stop>: var(--color-<canonical>-<stop>)` for each stop in the scale. Also alias gradients if one exists.

**Current aliases:**
| Alias | Canonical | Source convention |
|-------|-----------|-------------------|
| `destructive` | `error` | shadcn/Tailwind |

**When NOT to alias:** Don't alias names that differ in meaning, only in vocabulary. `danger` (Bootstrap) and `destructive` (shadcn) both mean "error-colored" — alias is appropriate. But `info` and `primary` use different colors — that's not an alias, it's a new scale.

---

## Patterns

### Three-Layer Token Architecture

**Context:** Need design tokens that work with Tailwind utilities AND support theming.

**Approach:** Layer 1 (`@theme`) defines raw brand values. Layer 2 (`:root`/`.theme-dark`) defines semantic tokens as CSS custom properties. Layer 3 (`@theme inline`) maps semantic tokens to Tailwind's color system.

**Key files:** `packages/ds/src/styles/tokens.css`

**Notes:** `@theme inline` tells Tailwind to resolve at runtime (not compile time), enabling theme switching. Any Layer 1 value that needs to change per theme (e.g., `--gradient-main`) must be promoted to Layer 2 — see the "Promote Layer 1 Values to Layer 2" rule above.

### Theme Switching

**Context:** Support light/dark themes without JS-based CSS-in-JS.

**Approach:** Toggle `.theme-dark` class on `<html>` element. CSS custom properties in `:root` vs `.theme-dark` swap automatically. A `@custom-variant dark` in `globals.css` registers the `dark:` Tailwind variant to match `.theme-dark`, enabling `dark:text-error-300` etc. in components.

**Key files:** `packages/ds/src/styles/tokens.css`, `apps/preview/src/app/globals.css`, `apps/preview/src/components/theme-switcher.tsx`

**Adding more themes:** Use the same `@custom-variant` pattern (e.g., `@custom-variant contrast (&:where(.theme-contrast, .theme-contrast *))`). Add corresponding CSS custom property blocks in `tokens.css`.

### CVA Variant Pattern

**Context:** Need type-safe component variants without CSS-in-JS or manual class string management.

**Approach:** Use Class Variance Authority (`cva`) to define variant maps. Each variant is an object key mapping to Tailwind class strings. `defaultVariants` sets fallbacks. The `cn()` utility (clsx + tailwind-merge) handles conditional classes and Tailwind conflict resolution.

**Key files:** `packages/ds/src/components/button/button.tsx`, `packages/ds/src/lib/cn.ts`

**Adding a new variant:** Add an entry to the `variants` object inside the `cva()` call. The variant key becomes the prop value (e.g., `variant="ghost"` → add `ghost: "..."` to the variant map). TypeScript infers the new prop value automatically.

### Data-Attribute Variant Propagation

**Context:** Need to style child components differently based on a parent's variant prop, without React context.

**Approach:** Parent sets `data-variant="pill"` and `class="group"`. Children use `group-data-[variant=pill]:` prefixed Tailwind utilities to conditionally apply styles. No context, no prop drilling.

**Key files:** `packages/ds/src/components/tabs/tabs.tsx` (first usage)

**When to use:** When a parent component has a variant that affects child styling, and the variant is a simple enum (not dynamic or deeply nested). For complex variant propagation across multiple levels, use React context instead.

### Custom CSS Classes for Complex Effects

**Context:** Some CSS effects (gradient borders, complex backgrounds) require multiple properties working together and can't be expressed as plain Tailwind utilities.

**Approach:** Define plain CSS classes in `tokens.css`, colocated with the tokens they consume. Include interactive states (`:hover`, `:active`) directly in the class so components just apply a single class name. Plain CSS avoids Tailwind's `@media (hover: hover)` wrapping, which causes Turbopack CSS parser issues with `var()` in nested hover contexts.

**Key files:** `packages/ds/src/styles/tokens.css` (after the Layer 3 Tailwind bridge block)

**Why not `@utility`?** Tailwind 4's `@utility` wraps `:hover` in `@media (hover: hover)`, and Turbopack's CSS optimizer can't parse `var()` in that nesting. Plain CSS classes avoid this.

**Decision framework — when a style can't be a plain Tailwind class:**

1. **First choice: Tailwind utility or arbitrary value** — if the effect can be a single `[property:value]` in a class string, use it inline.
2. **Second choice: plain CSS class in `tokens.css`** — if the effect requires multiple CSS properties working together (e.g., `background-clip` + `background` + `border-color`), extract to a CSS class with interactive states baked in.
3. **Never: custom classes in `globals.css`** — `globals.css` is for Tailwind imports, content sources, variant registrations, and base element styles only.

**Examples:**

`border-gradient-main` — gradient borders via `background-clip` trick:
```css
.border-gradient-main {
  border-color: transparent;
  background:
    linear-gradient(var(--color-primary-100), var(--color-primary-100)) padding-box,
    var(--gradient-main) border-box;
}
.border-gradient-main:hover { /* same with primary-200 */ }
.border-gradient-main:active { /* same with primary-300 */ }
```

`gradient-fill-main` / `gradient-fill-lime` — gradient fills with overlay-based hover states:
```css
.gradient-fill-main { background: var(--gradient-main) border-box; }
.gradient-fill-main:hover {
  background:
    linear-gradient(oklch(1 0 0 / 0.1), oklch(1 0 0 / 0.1)) border-box,
    var(--gradient-main) border-box;
}
```

The overlay technique layers a semi-transparent `linear-gradient(solid, solid)` over the base gradient. This avoids maintaining separate hover gradient definitions — just tune the overlay opacity. Each layer uses inline `border-box` to set both `background-origin` and `background-clip` — this prevents sub-pixel artifacts at rounded corners with `border-transparent` (using a separate `background-origin` longhand after the shorthand causes clipping issues with multi-layer backgrounds).

```tsx
/* Component just applies the class — interactive states are built in */
"gradient-fill-main text-white border-transparent",
```

### Responsive Sidebar Layout (SidebarShell)

**Context:** Preview app needs a sidebar that stays in place while only the main content scrolls, and works on mobile devices.

**Approach:** `SidebarShell` is a client component that owns the mobile drawer state and renders both layouts:
- **Desktop (`lg+`):** Fixed sidebar (`hidden lg:block w-75`) with independent scroll. The outer layout wrapper uses `h-screen flex-col` to lock to viewport height. Below the header, a `flex flex-1 overflow-hidden` container holds sidebar and main.
- **Mobile (`<lg`):** Slide-in drawer (`fixed inset-0 z-40`) with backdrop overlay, `translate-x` transition, and Escape key close. Touch targets bumped to `py-2 px-3` for 44px minimum. A hamburger menu button in a sub-header triggers the drawer.

`SidebarShell` wraps `{children}` (the page content) so the layout component stays a server component — no client-side state leaks into the root layout.

**Key files:** `apps/preview/src/app/layout.tsx`, `apps/preview/src/components/sidebar.tsx`

**Why not `sticky`?** `sticky` positions relative to the scroll container, but the parent flex container grows with content — so there's nothing to stick against. The fixed-height container pattern avoids this entirely.

**Collapsible nav groups:** The sidebar supports `NavGroup` entries (e.g., "Forms") with a chevron toggle. Groups auto-expand when the active route is within their children.

### Overview Page Showcase Pattern

**Context:** The overview page (`apps/preview/src/app/page.tsx`) needs to demonstrate DS components in a way that's more useful than isolated prop tables.

**Approach:** Composed UI blocks that simulate real product interfaces — a node dashboard with Table + Tabs + StatusDot, a settings panel with FormField + Slider + Switch, an auth form, etc. Each block is a `Card` in a responsive 2-column grid. Full-width blocks use `md:col-span-2`. The hero section uses negative margins (`-mx-4 sm:-mx-8 -mt-6 sm:-mt-8`) to bleed past the parent's `max-w-4xl` constraint.

**Key files:** `apps/preview/src/app/page.tsx`

**Notes:** All state is local (`useState`), all data is static mock data defined inline. The page is `"use client"` because most blocks need interactivity (tabs, pagination, dismissible alerts). A Quick Links footer at the bottom links to all foundation and component pages grouped by category.

### Motion-Reduce Support

**Context:** Users with vestibular disorders or motion sensitivity need a way to disable animations. `prefers-reduced-motion: reduce` is the OS-level signal.

**Approach:** All animated components use Tailwind's `motion-reduce:` variant to disable motion:
- **Continuous animations** (`animate-pulse`, `animate-spin`): `motion-reduce:animate-none` stops the animation entirely.
- **One-shot transitions** (`transition-[clip-path]`, `transition-transform`): `motion-reduce:transition-none` makes state changes instant.

**Key files:** `skeleton.tsx`, `spinner.tsx`, `status-dot.tsx` (continuous); `checkbox.tsx`, `radio-group.tsx`, `switch.tsx`, `tooltip.tsx`, `table.tsx`, `tabs.tsx` (one-shot)

**Rule:** Every new component with animation must include the appropriate `motion-reduce:` variant. Continuous animations use `animate-none`; transitions use `transition-none`.

### Tailwind 4 Dynamic Class Names

**Context:** Tailwind CSS 4's `@theme` tree-shakes CSS custom properties not referenced by detected utility classes. Dynamic class names built via string interpolation (`` `bg-${color}-${stop}` ``) or inline `style={{ backgroundColor: 'var(--color-...)' }}` are invisible to the scanner.

**Approach:** Enumerate all possible class names in a static lookup object. Even though the values are looked up at runtime, the literal strings appear in source code — which is all the scanner needs.

**Key files:** `apps/preview/src/app/foundations/colors/page.tsx` (`SCALE_BG` map)

**Rule:** Never use dynamic Tailwind class construction or inline `var()` styles for `@theme` variables. Always use a static safelist or lookup map.

**Data-attribute selectors with `=`:** Tailwind 4's scanner also fails on classes like `group-data-[variant=pill]:text-sm` because the `=` breaks regex extraction. Use `@source inline("...")` in `tokens.css` to feed these classes directly into the candidate list. See the safelist block in `tokens.css` for the current list. Any new `data-[attr=value]:` classes that Tailwind can't detect must be added there.

### Radix UI Wrapper Pattern

**Context:** Form components need rich accessibility (keyboard navigation, ARIA states, focus management) that's expensive to build from scratch.

**Approach:** Wrap Radix UI primitives with `forwardRef`, apply CVA variants via `className`, style Radix `data-[state=*]` attributes with Tailwind classes. Consumers import the DS wrapper — Radix is an internal dependency they never touch directly.

**Key files:** `packages/ds/src/components/checkbox/checkbox.tsx`, `radio-group/radio-group.tsx`, `switch/switch.tsx`, `select/select.tsx`, `combobox/combobox.tsx`, `slider/slider.tsx`

**Pattern:**
```tsx
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ac/lib/cn";

const variants = cva(/* base + variants */);

type Props = Omit<ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, "size">
  & VariantProps<typeof variants>
  & { error?: boolean };

const Checkbox = forwardRef<HTMLButtonElement, Props>(
  ({ size, error, className, ...rest }, ref) => (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(variants({ size }), error && "...", className)}
      aria-invalid={error || undefined}
      {...rest}
    >
      <CheckboxPrimitive.Indicator>...</CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  ),
);
```

**Notes:**
- `Omit<..., "size">` removes Radix's native `size` to replace with CVA's typed version
- `data-[state=checked]:` Tailwind modifiers style Radix's state attributes
- `error` prop adds `aria-invalid` for accessibility and error border styling
- Select uses a flat `options` prop wrapping Radix's compound children pattern

### Radix forceMount + Clip-Path Animation

**Context:** Radix UI unmounts Indicator children when unchecked, making CSS transitions impossible. Need smooth reveal animations for check marks and radio dots.

**Approach:** Pass `forceMount` to `<Indicator>` so it stays in the DOM regardless of state. Radix still sets `data-state="checked"|"unchecked"` on force-mounted indicators, enabling pure CSS animation via `clip-path` transitions:

```tsx
<CheckboxPrimitive.Indicator
  forceMount
  className={cn(
    "[clip-path:circle(0%_at_0%_75%)]",
    "data-[state=checked]:[clip-path:circle(100%_at_50%_50%)]",
    "transition-[clip-path] duration-200 ease-in-out",
  )}
>
```

**Key insight:** The `circle()` origin matters — checkbox uses bottom-left (`0% 75%`) to follow the check stroke direction; radio uses center (`50% 50%`) for the symmetrical dot.

**Key files:** `packages/ds/src/components/checkbox/checkbox.tsx`, `packages/ds/src/components/radio-group/radio-group.tsx`

**Notes:** This pattern eliminates any need for JS animation libraries. The `data-state` attribute is the contract between Radix and CSS — no React state or refs needed for the animation itself.

### Test Environment for Radix Components

**Context:** Radix Select uses DOM APIs not available in jsdom (PointerEvent, ResizeObserver, DOMRect, scrollIntoView).

**Approach:** Polyfills are added at the top of `select.test.tsx` before any imports. The `vitest.setup.ts` file imports `@testing-library/jest-dom/vitest` for matchers like `toBeChecked()`, `toHaveAttribute()`, `toHaveClass()`.

**Key files:** `packages/ds/vitest.setup.ts`, `packages/ds/src/components/select/select.test.tsx`, `combobox/combobox.test.tsx`, `slider/slider.test.tsx`

**Note:** Radix Slider additionally requires a `setPointerCapture` polyfill (`window.HTMLElement.prototype.setPointerCapture = vi.fn()`) because it uses pointer capture for drag interactions.

### Generic Typed Table

**Context:** Dashboard pages need data tables with sortable columns, but pulling in TanStack Table or AG Grid for simple use cases adds unnecessary bundle size and API complexity.

**Approach:** A single `Table<T>` component accepts `Column<T>[]` and `T[]` data. Each column defines an `accessor` function for rendering and an optional `sortValue` function for sorting. Sorting is client-side, managed with React state (`useState` for column index and direction). Columns without `sortValue` are not sortable even if `sortable` is set.

**Key files:** `packages/ds/src/components/table/table.tsx`

**Pattern:**
```tsx
export type Column<T> = {
  header: string;
  accessor: (row: T) => ReactNode;   // Cell renderer
  sortable?: boolean;
  sortValue?: (row: T) => string | number;  // Sort comparator
  width?: string;
  align?: "left" | "center" | "right";
};

<Table<Node>
  columns={columns}
  data={nodes}
  keyExtractor={(r) => r.id}
  onRowClick={(row) => setSelected(row)}
/>
```

**Notes:** The generic type parameter flows from `columns` to `data` to `keyExtractor` to `onRowClick` — TypeScript enforces that all four agree on the row type. No `forwardRef` — the outermost element is a `<div>` wrapper for `overflow-x-auto`, not a single semantic element worth ref-forwarding.

**Sort-icon alignment on right-aligned headers:** The sort icon is always present in the DOM (with `opacity-0` when inactive) so that toggling sort never changes the column width. For a right-aligned column, an always-rendered icon at the inline tail would push the visible header text ~16px to the left of where right-aligned body cells end — a misalignment most visible at narrow widths. The fix wraps sortable header content in an `inline-flex` span with `flex-row-reverse` for `align === "right"`. The cell's `text-right` still positions the whole flex group at the right edge; row-reverse moves the icon to the visual left of the group so the text ends flush with the cell's right padding edge — matching body cells. `gap-1` on the flex container replaces the icon's previous `ml-1` so spacing works in both directions. Left and center alignment are unchanged.

**Controlled vs. uncontrolled sort:** By default the Table owns sort state internally — clicking a header cycles direction and the data is sorted in place. This is fine when `data` contains every row that should participate in the sort. But when the parent paginates outside the table and only passes the visible slice, an uncontrolled internal sort would only re-order the current page — rows with the highest/lowest sort values on later pages never bubble up. The `sortColumn`/`sortDirection`/`onSortChange` triple lets the parent take ownership: the table delegates header clicks via the callback and renders the indicator from the controlled props. Internal sorting is skipped when `onSortChange` is provided, so the parent is responsible for pre-sorting `data` (typically the filtered+sorted full dataset, then sliced to a page). The controlled mode activates only when `onSortChange` is provided — passing just the indicator props without the callback would create a soft lock where headers appear sorted but clicks do nothing. Identifying columns by `header` string (rather than index) keeps consumers stable across column re-orderings.

### Composable Radix Re-export

**Context:** Tooltip has a naturally composable API (trigger + content can wrap any element) where flattening into a single component would lose flexibility. Different tradeoff from Select, where flat `options` simplified the consumer API.

**Approach:** Re-export Radix primitives directly (`Provider`, `Root`, `Trigger`), only wrapping the `Content` part with DS styling and `forwardRef`. Consumers compose the pieces explicitly.

**Key files:** `packages/ds/src/components/tooltip/tooltip.tsx`, `packages/ds/src/components/tabs/tabs.tsx`

**When to use which pattern:**
- **Flat props wrapper** (Select, Checkbox): When the component has a single primary interaction and compound children add ceremony without flexibility.
- **Composable re-export** (Tooltip, Tabs): When the trigger can be any arbitrary element and the composition pattern is inherently flexible.

### Minimal forwardRef Wrapper

**Context:** Some components are thin wrappers that apply DS defaults (animation, colors, accessibility attributes) without any variant logic.

**Approach:** `forwardRef` + `cn()` to merge a base class string with consumer `className`. No CVA — there are no variants. Consumer controls sizing entirely via `className`.

**Key files:** `packages/ds/src/components/ui/skeleton.tsx`

**Notes:** Skeleton has no `size` or `variant` prop by design. Width and height are layout concerns that vary per usage context, so the consumer provides them. The DS only controls the visual treatment (pulse animation, muted background, rounded corners).

### Phosphor Icons Integration

**Context:** DS components need icons for UI chrome (dropdown indicators, checkmarks, close buttons). Previously used hand-drawn inline SVGs scattered across components.

**Approach:** `@phosphor-icons/react` is a regular dependency of the DS package. Components import specific icons (`CaretDown`, `Check`, `X`, `CaretUp`) and apply `weight="bold"` with Tailwind sizing via `className`. No wrapper component — Phosphor's API is already well-suited (accepts `className`, `weight`, `size`, `aria-hidden`).

**Key files:** `select.tsx`, `combobox.tsx`, `multi-select.tsx`, `table.tsx`

**Notes:** Consumers who need additional icons import directly from `@phosphor-icons/react` (transitive dependency). The DS does not re-export Phosphor icons. For Next.js Server Components, import from `@phosphor-icons/react/ssr` instead.

### cn() Utility

**Context:** Tailwind classes can conflict (e.g., `bg-red-500` and `bg-blue-500` both present). Need predictable overrides when merging conditional classes.

**Approach:** `cn(...inputs)` composes `clsx` (conditional joining) with `twMerge` (Tailwind-aware deduplication). Always use `cn()` instead of template literals for class composition in components.

**Key files:** `packages/ds/src/lib/cn.ts`

### Tabs Implementation Details

**Overflow collapse (`overflow="collapse"`):**
Hidden tabs stay in the DOM (Radix state machine intact). A `useOverflow` hook measures tab widths via `ResizeObserver` + `getBoundingClientRect` and applies `visibility: hidden` to overflowed tabs. The dropdown uses Radix `DropdownMenu` for arrow key navigation and proper `role="menu"`/`role="menuitem"` semantics. Items activate tabs via deferred `.focus()` (Radix auto-activation after menu closes). Container height is locked via `min-height` snapshot to prevent layout collapse when the tallest tab overflows.

**Count cap (`maxVisible`):**
Composes with the same `useOverflow` hook. The hook computes a width-based break index, then takes `min(widthBreakIndex, maxVisible)` so the stricter limit wins. Either prop alone activates the overflow trigger; passing both is supported. `maxVisible` does not change the layout (the pill container only drops `inline-flex` when `overflow="collapse"` is set, since width-based detection requires a full-width container).

**Sliding indicator:**
Absolutely-positioned element that slides between tabs via `MutationObserver` + `ResizeObserver`. Initial render positions without transition to avoid slide-in from 0,0. Pill variant uses `opacity-0` → `opacity-100` to prevent flash at width 0.

**Pill variant propagation:**
Variant is propagated to triggers via `data-variant` attribute + Tailwind `group-data-[variant=pill]:` utilities. All pill variant classes are safelisted via `@source inline(...)` in `tokens.css` — Tailwind 4's scanner can't extract `=` inside data-attribute brackets.

### Dual-Context Compound Component (Stepper)

**Context:** A compound component needs to propagate two independent pieces of state: an outer layout concern (orientation) and a per-item concern (step state), without prop drilling.

**Approach:** Two separate React contexts:
1. `StepperContext` — carries `orientation` from `Stepper` (nav root) down to `StepperList` and `StepperConnector` for layout decisions (flex direction, connector axis).
2. `StepperItemContext` — carries `state` (completed/active/inactive) from `StepperItem` down to its children (`StepperIndicator`, `StepperLabel`, `StepperDescription`) as `data-state` attributes.

The component is intentionally unstyled — no CVA variants, no opinionated colors. Consumers style via `data-state` and `data-orientation` attribute selectors in their own Tailwind classes (e.g., `data-[state=completed]:text-success-500`).

**Key files:** `packages/ds/src/components/stepper/stepper.tsx`

**When to use dual context:** When a compound component has orthogonal concerns at different nesting levels. Orientation applies at the container level; state applies at the item level. A single context would conflate the two, and prop drilling through intermediate components (`StepperList`) would be fragile.

### ProgressBar Description Pattern

**Context:** A ProgressBar optionally has a description below the track. When present, the component needs a wrapper div for layout, and the description must be linked to the progressbar via `aria-describedby`.

**Approach:** The component inspects its children for `ProgressBarDescription` via `Children.forEach` + `isValidElement` + type comparison. If found, it wraps the track and description in a flex column layout, and uses `cloneElement` to inject the auto-generated `id` into the description span. If no description, it renders the bare track div directly — no unnecessary wrapper.

**Key files:** `packages/ds/src/components/progress-bar/progress-bar.tsx`

**Notes:** `cloneElement` is used instead of spread (`{...child.props}`) because React 19's stricter types make `ReactElement.props` opaque (`Record<string, unknown>`), which TypeScript can't spread as JSX props. The `isValidElement<ProgressBarDescriptionProps>` generic parameter narrows the type for `cloneElement`.

### CopyableText Animation

Copy button uses a two-layer stack:
1. Default layer: Copy icon in muted color
2. Reveal layer: `bg-foreground` circle expanding via `clip-path: circle(0% → 50%)` with spring `cubic-bezier(0.34, 1.56, 0.64, 1)`, plus a Check icon that scales in with 75ms delay

Hover state uses `bg-foreground/10` for visibility in both light and dark themes.

### Rail-Hide Pattern (AppShellSidebar)

**Context:** `AppShellSidebar` has two modes — expanded (full width with labels and section titles) and collapsed (icon-only rail). The naive approach is to render two different trees of JSX or to conditionally render labels. Both create coordination problems: consumers configure their nav once but the same data has to flow through two branches, and accidental drift between the two branches is easy to introduce.

**Approach:** Single render tree. The root `<aside>` carries `data-collapsed="true" | "false"`. Elements that should disappear in rail mode (section title rows, NavItem text labels) carry a `rail-hide` class. A single CSS rule in `tokens.css` does the work:

```css
[data-collapsed="true"] .rail-hide {
  display: none;
}
```

Consumers configure once; the CSS rule swaps visibility on toggle. No state lives in the JSX; only the boolean `data-collapsed` attribute matters.

**Key files:** `packages/ds/src/components/app-shell-sidebar/app-shell-sidebar.tsx`, `packages/ds/src/styles/tokens.css` (rule near the bottom).

**Testing note:** jsdom doesn't load Tailwind/the DS stylesheet, so `expect(el).not.toBeVisible()` can't observe the rule at runtime. Tests assert the structural contract instead (`data-collapsed` attribute on the aside + `rail-hide` class on hidden elements). The visual outcome is verified in the preview app.

### SSR-Safe localStorage Hydration (null → boolean)

**Context:** `useSidebarCollapse` and `useAccordionState` both back persistent UI state with `localStorage`. The naive `useState(localStorage.getItem(...) === "true")` initializer crashes during SSR (no `window`) and, when used in a static export, makes the first client render disagree with the static HTML — React warns about a hydration mismatch.

**Approach:** Initial state is `null`. A `useEffect` reads `localStorage` on mount and replaces `null` with the actual boolean. Consumers treat `null` as "still hydrating" and pick a sensible default at render time (e.g. `collapsed === true` → false during hydration means the expanded layout shows during the first paint, matching the SSR output).

This pattern is portable: any hook that reads browser-only state at mount should return `T | null` rather than guess.

**Key files:** `packages/ds/src/components/app-shell-sidebar/use-sidebar-collapse.ts`, `packages/ds/src/components/app-shell-sidebar/use-accordion-state.ts`.

### Slot-Via-Context (PageHeader)

**Context:** The app shell renders a single header row at the top of the main column, but the contents of that row (title, actions, search, breadcrumb) belong to the current page. We need a way for each page to declaratively contribute its own slot content without each layout duplicating the header chrome.

**Approach:** A small context holds the current `PageHeaderConfig`; pages register their config via a hook; the shell mounts one `<PageHeader>` that reads from context and renders.

```tsx
const PageHeaderReadContext = createContext<PageHeaderConfig | null>(null);
const PageHeaderWriteContext = createContext<SetConfigFn | null>(null);

export function PageHeaderProvider({ children }) {
  const [config, setConfig] = useState<PageHeaderConfig | null>(null);
  return (
    <PageHeaderWriteContext.Provider value={setConfig}>
      <PageHeaderReadContext.Provider value={config}>
        {children}
      </PageHeaderReadContext.Provider>
    </PageHeaderWriteContext.Provider>
  );
}

export function usePageHeader(config: PageHeaderConfig) {
  const setConfig = useContext(PageHeaderWriteContext);
  const { title, actions, search, breadcrumb } = config;
  useEffect(() => {
    if (!setConfig) return;
    setConfig({ title, actions, search, breadcrumb });
    return () => setConfig(null);
  }, [setConfig, title, actions, search, breadcrumb]);
}
```

**Three design decisions worth calling out:**

1. **Split read/write contexts.** Pages that call `usePageHeader` subscribe only to `PageHeaderWriteContext`, whose value (`setConfig`) is identity-stable across renders. They do **not** subscribe to the read context, so when the header content changes the registering page does not re-render. This is what makes unstable inline JSX safe — e.g. `actions: <button onClick={...}>...</button>` creates a new React element every render, but only `<PageHeader>` re-renders to display the new element, not the page that registered it. A naive single-context implementation infinite-loops the moment a page passes inline JSX in `actions`.

2. **`useEffect` to commit, not setState during render.** Calling `setConfig` directly during render would warn (and in some cases crash). The `useEffect` defers the commit to after the render phase. Destructured deps (`title, actions, search, breadcrumb`) give per-field reactivity instead of object-identity reactivity.

3. **Last-mount-wins with unmount cleanup.** When only one page is mounted at a time (the common case for single-route apps), the cleanup return on the effect ensures the slot resets to empty between routes. Multiple simultaneous mounts give last-write-wins semantics — not because we explicitly resolve conflicts, but because each `setConfig` call replaces the previous value. This was a deliberate simplification — multi-source merging adds complexity for a case that doesn't exist in single-page-per-route apps.

**Key files:** `packages/ds/src/components/page-header/page-header.tsx`.

**Testing note:** Tests assert structural contract (rendered title text, presence of action buttons, slot clearing on unmount) — not implementation details like context value shape. The infinite-loop trap from unstable JSX in `actions` is verifiable in the preview app at `/components/page-header` (the "With reactive actions" demo), where the Refresh button updates header state without the page re-rendering.

---

## Testing Philosophy

**Test behavior and accessibility, not appearance.**

Design system components are visual by nature — most of their code maps props to CSS classes. Testing those class names creates brittle tests that break on every visual redesign without catching real bugs. The preview app is the right place to verify appearance.

**What to test:**

| Category | Example | Why |
|----------|---------|-----|
| Interactive behavior | Loading state shows spinner, hides icons | Logic that can silently break |
| Accessibility | `aria-busy` when loading, `disabled` attribute | Invisible to visual review |
| Polymorphism | `asChild` renders an `<a>` instead of `<button>` | Non-obvious DOM behavior |
| Prop forwarding | `aria-label`, `className` merging | Contract with consumers |
| Structural layout | Icon renders before/after label | DOM ordering affects UX |

**What NOT to test:**

| Category | Example | Why |
|----------|---------|-----|
| CSS class names | "contains `bg-primary-600`" | Coupled to implementation, breaks on redesign |
| Token values | "primary-500 is this OKLCH value" | Tokens are declarative — preview app is the test |
| Browser APIs | `classList.toggle` works | Testing the platform, not your code |
| Theme switching | Dark class toggles correctly | Too trivial; covered by manual preview |

**Colocate tests** with components as `<name>.test.tsx`. Run with `npm run test` (vitest).

---

## CI/CD

### CI Workflow (`.github/workflows/ci.yml`)

Runs on every push to `main` and every PR targeting `main`. Steps: lint, typecheck, test, build preview. Uses concurrency groups to cancel redundant runs.

### Publish Workflow (`.github/workflows/publish.yml`)

Triggered by GitHub Release creation (tag pattern `v*`). Extracts the version from the git tag, patches `packages/ds/package.json`, runs full checks, then publishes to npm.

**Version source of truth:** The git tag. `package.json` stays at `0.0.0` in the repo — the workflow patches it at publish time. This avoids version bump commits and merge conflicts.

**Release process:**
1. Merge PRs to `main`
2. Create a GitHub Release with tag `v<semver>` (e.g., `v0.1.0`)
3. The workflow validates semver, runs checks, publishes `@aleph-front/ds@<version>` to npm

**Required secrets:** `NPM_TOKEN` — a granular npm automation token with publish-only scope for the `@aleph-front` org.

### Package Contents

The published npm package contains raw TypeScript source (no build step). Consumers compile it with their bundler via `transpilePackages`. Test files are excluded via negation patterns in `"files"`.

---

## Recipes

### Adding a New Semantic Token

1. Add light value to `:root` block in `packages/ds/src/styles/tokens.css`
2. Add dark value to `.theme-dark` block
3. Add Tailwind mapping in `@theme inline` block (e.g., `--color-new-token: var(--new-token)`)
4. Use as Tailwind class: `bg-new-token`, `text-new-token`, etc.

### Adding a Gradient Border Class

1. Add `.border-gradient-<name>` in `packages/ds/src/styles/tokens.css` after the existing gradient border classes
2. Set `border-color: transparent` and the full `background` with `padding-box` / `border-box` clip
3. Add `:hover` and `:active` selectors with the appropriate fill color stops
4. In components, apply the class name — no hover overrides needed
5. Document in `docs/DESIGN-SYSTEM.md` § Gradient Border Utilities

### Adding a Gradient Fill Class

1. Add `.gradient-fill-<name>` in `packages/ds/src/styles/tokens.css` after the existing gradient fill classes
2. Set `background: var(--gradient-<name>) border-box` — inline `border-box` prevents sub-pixel artifacts at rounded corners
3. Add `:hover` with a semi-transparent overlay: `linear-gradient(oklch(... / opacity), oklch(... / opacity)) border-box, var(--gradient-<name>) border-box`. Use white overlay to lighten dark gradients, black overlay to darken light gradients.
4. Add `:active` with a stronger overlay opacity (same `border-box` per layer)
5. In components, apply the class name — hover/active states are built in
6. Document in `docs/DESIGN-SYSTEM.md` § Gradient Fill Utilities

### Adding a New Component

**Build:**
1. Create `packages/ds/src/components/<name>/<name>.tsx` (or `packages/ds/src/components/ui/<name>.tsx` for primitives)
2. Use CVA for variants, `cn()` for class merging, `forwardRef` for DOM access. For interactive controls (checkboxes, selects, etc.), wrap a Radix UI primitive — see "Radix UI Wrapper Pattern" above.
3. Colocate tests as `<name>.test.tsx` — test behavior and accessibility only (see Testing Philosophy above)
4. Export from the component file directly — no barrel `index.ts` files
5. Add subpath export to `packages/ds/package.json`: `"./<name>": "./src/components/<name>/<name>.tsx"`

**Preview:**
6. Create a preview page at `apps/preview/src/app/components/<name>/page.tsx`
7. Add sidebar entry in `apps/preview/src/components/sidebar.tsx` (use a `group` entry for related components like Forms)
8. Run `npm run dev` and verify the preview page renders correctly — ask the user to check before proceeding

**Verify:**
9. Run `npm run check` (lint + typecheck + test) — all must pass

**Document (all required — do not skip any):**
10. `docs/DESIGN-SYSTEM.md` § Components — usage examples, props, variants. Consumer-facing only: what to use, how to use it. No implementation internals (hooks, observers, animation curves).
11. `docs/ARCHITECTURE.md` — add new patterns if this component introduced one. Maintainer-facing: how it works internally, workarounds, implementation details.
12. `docs/DECISIONS.md` — log design decisions (why this API shape, why these variants, alternatives rejected)
13. `docs/BACKLOG.md` — move completed items to archive, add deferred ideas
14. `CLAUDE.md` Current Features list — add component with brief description, update preview page count

**This recipe is the single source of truth.** External projects that add DS components should reference it, not maintain their own copy.
