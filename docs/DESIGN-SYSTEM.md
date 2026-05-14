# Aleph Cloud Design System

A design system built with Tailwind CSS 4 + CSS custom properties + OKLCH colors. Includes design tokens, fonts, reusable components, and a preview app.

## Component Index

Quick reference for all DS exports. Click component name to jump to its full documentation below.

| Component | Purpose | Import |
|-----------|---------|--------|
| [Alert](#alert) | Dismissible status banner with auto-dismiss timer | `@aleph-front/ds/alert` |
| [AppShellSidebar](#appshellsidebar) | Sidebar shell with expanded ↔ icon-rail collapse, accordion sections, hooks | `@aleph-front/ds/app-shell-sidebar` |
| [Badge](#badge) | Semantic label for status, counts, categories | `@aleph-front/ds/badge` |
| [Breadcrumb](#breadcrumb) | Navigation trail with composable 6-part API | `@aleph-front/ds/breadcrumb` |
| [Button](#button) | Action trigger with 6 variants, 4 sizes, gradient fills | `@aleph-front/ds/button` |
| [Card](#card) | Content container with 3 variants (default/noise/ghost) | `@aleph-front/ds/card` |
| [Checkbox](#checkbox) | Boolean toggle with 3 sizes, clip-path animation | `@aleph-front/ds/checkbox` |
| [Combobox](#combobox) | Searchable dropdown selector | `@aleph-front/ds/combobox` |
| [CopyableText](#copyabletext) | Truncated text with copy-to-clipboard | `@aleph-front/ds/copyable-text` |
| [Dialog](#dialog) | Modal with composable 8-part API, lock mode | `@aleph-front/ds/dialog` |
| [FormField](#formfield) | Label + helper + error wrapper with auto-wired a11y | `@aleph-front/ds/form-field` |
| [Input](#input) | Text input with 2 sizes, borderless flat styling | `@aleph-front/ds/input` |
| [Logo](#logo) | Brand mark (icon + full wordmark variants) | `@aleph-front/ds/logo` |
| [MultiSelect](#multiselect) | Searchable multi-selection with tags | `@aleph-front/ds/multi-select` |
| [Pagination](#pagination) | Controlled page navigation with fixed-slot layout | `@aleph-front/ds/pagination` |
| [ProductStrip](#productstrip) | Top bar listing the Aleph product family as tabs | `@aleph-front/ds/product-strip` |
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
| Determinate/indeterminate progress | **ProgressBar** — 3 sizes, optional description, value clamping | Spinner — ProgressBar shows measurable progress, Spinner is for unknown duration |

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
| Content section | **Card** `variant="default"` — `bg-surface`, borderless | Plain div — Card provides consistent surface fill and theming |
| Textured decorative panel | **Card** `variant="noise"` — grain SVG overlay | Card default — noise adds visual interest for hero/feature cards |
| Transparent grouping (no chrome) | **Card** `variant="ghost"` — no border, no background | Card default — ghost avoids visual nesting when cards are inside cards |
| Location in page hierarchy | **Breadcrumb** — semantic nav/ol, `asChild` for router links | Plain text links — Breadcrumb handles separators and aria |
| Switching between content panels | **Tabs** — underline or pill variant, keyboard navigation | Buttons + conditional rendering — Tabs manages state, a11y, and indicators |
| Paginated data navigation | **Pagination** — fixed-slot layout, no layout shift | Custom prev/next buttons — Pagination handles ellipsis, boundaries, and aria |
| Multi-step workflow indicator | **Stepper** — composable 7-part compound, horizontal/vertical, unstyled | Breadcrumb — Stepper tracks progress state, Breadcrumb tracks location |

## Design Methodology

### Principles

1. **Tokens first, components second.** Every visual decision (color, spacing, shadow, gradient) is a token before it's a component style. Components consume tokens — they never hardcode visual values. This means a rebrand changes one file (`tokens.css`), not every component.

2. **CSS-native theming.** Themes are CSS custom property swaps, not JS runtime logic. The browser handles theme transitions for free. No React context, no provider wrappers, no hydration mismatch. Toggle a class on `<html>` and every token resolves to its new value instantly.

3. **Tailwind as the utility layer, not the design language.** Tailwind classes are the delivery mechanism — the actual design lives in the token system. Components use Tailwind utilities to apply tokens, but the tokens define the visual language. This keeps the design system portable: if Tailwind is replaced, only the delivery layer changes.

4. **Accessibility is structural, not decorative.** Interactive components wrap Radix UI primitives that provide keyboard navigation, ARIA attributes, and focus management by default. Accessibility isn't added after the fact — it's the foundation the visual layer is painted on.

5. **No phantom features.** If a class, prop, or token doesn't resolve to working behavior, it's deleted. Dead code misleads both developers and tools. Better to have less that works than more that doesn't.

### Three-Layer Token Architecture

The token system has three layers, each with a distinct role:

| Layer | CSS Construct | Role | Example |
|-------|--------------|------|---------|
| **1. Brand** | `@theme { }` | Raw brand values — colors, gradients, fonts, shadows. Same in all themes. | `--color-primary-600: oklch(0.44 0.28 285.48)` |
| **2. Semantic** | `:root { }` / `.theme-dark { }` | Purpose-driven aliases that swap per theme. | `--primary: var(--color-primary-600)` (light) / `var(--color-primary-400)` (dark) |
| **3. Tailwind Bridge** | `@theme inline { }` | Maps semantic tokens into Tailwind's `--color-*` namespace so utilities like `bg-primary` resolve at runtime. | `--color-primary: var(--primary)` |

**Why three layers?** Layer 1 is the brand source of truth — it never changes between themes. Layer 2 is where theme-awareness lives — it decides which brand value to use in each context. Layer 3 is mechanical plumbing — it makes Tailwind utilities work with runtime CSS variables (via `inline`, which tells Tailwind to resolve at runtime instead of compile time).

**Promotion rule:** If a Layer 1 value needs to change per theme, it must be promoted to Layer 2. Example: `--gradient-main` has a dark endpoint that blends into the dark mode background, so it was promoted to a semantic token with per-theme variants.

### Component Architecture

Components follow a consistent pattern:

1. **CVA (Class Variance Authority)** defines variant maps — each variant is a key mapping to Tailwind class strings. TypeScript infers prop types from the variant keys automatically.

2. **`forwardRef`** on every component — consumers can attach refs for focus management, measurements, or integration with form libraries.

3. **`cn()` utility** (clsx + tailwind-merge) handles class composition. Always use `cn()` instead of template literals to ensure Tailwind conflict resolution.

4. **Radix UI wrappers** for interactive controls. The DS component is the public API; Radix is an internal implementation detail consumers never import directly.

5. **Flat props over compound children.** Where Radix uses nested `<Item>` components (like Select), the DS wrapper accepts a flat `options` array. This simplifies the consumer API at the cost of flexibility — a tradeoff that's right for most use cases.

### Color Space

All color scales use **OKLCH** — a perceptually uniform color space where equal numeric steps produce equal visual contrast steps. This means a 100-unit jump from `primary-400` to `primary-500` looks the same as from `primary-700` to `primary-800`, unlike HSL where lightness perception varies by hue.

OKLCH also enables Tailwind's `/opacity` modifier (`bg-primary-600/50`) because the color components are expressed independently.

### Testing Philosophy

Test **behavior and accessibility**, not appearance. The preview app is the visual test suite. Automated tests verify:

- Interactive logic (loading state shows spinner, hides icons)
- Accessibility attributes (`aria-invalid`, `aria-busy`, `disabled`)
- DOM structure (polymorphic rendering, prop forwarding)
- Edge cases (empty states, disabled interactions)

Tests never assert CSS class names — those are implementation details that break on every visual redesign without catching real bugs.

---

## Installation

Install the DS package in your app:

```bash
npm install @aleph-front/ds
```

Import tokens in your CSS and components via subpath exports:

```css
@import "tailwindcss";
@import "@aleph-front/ds/styles/tokens.css";

@custom-variant dark (&:where(.theme-dark, .theme-dark *));
```

```tsx
import { Button } from "@aleph-front/ds/button";
import { Input } from "@aleph-front/ds/input";
import { cn } from "@aleph-front/ds/lib/cn";
```

Consumer apps need `transpilePackages: ["@aleph-front/ds"]` in their Next.js config (DS exports raw `.tsx` source).

## Themes

Two themes applied via class on `<html>`. Default: light (no class). Dark: `.theme-dark`.

| Theme | Class | Aesthetic |
|-------|-------|-----------|
| Light | (none) | Violet-tinted whites, dark text |
| Dark | `.theme-dark` | Deep purple-black, light text |

Toggle theme in JS:

```ts
document.documentElement.classList.toggle("theme-dark");
```

---

## Color Tokens

Use as Tailwind classes. Semantic tokens resolve to different values per theme.

### Color Scales

Full OKLCH 50–950 scales. Each scale has 11 stops, available as Tailwind classes like `bg-primary-600`, `text-error-500`, etc. Supports `/opacity` modifier: `bg-primary-600/50`.

| Scale | Hue | Anchor | Use for |
|-------|-----|--------|---------|
| `primary` | 285.48 (purple) | 600 = brand #5100CD | Brand identity, primary actions |
| `accent` | 121.30 (lime) | 300 = brand #D4FF00 | Accents, highlights, CTAs |
| `success` | 145 (green) | 500 = #36D846 | Success states |
| `warning` | 75 (amber) | 500 = #FBAE18 | Warning states |
| `error` | 12 (red) | 600 = #DE3668 | Error states |
| `destructive` | (alias → `error`) | — | Convenience alias for shadcn/Tailwind convention |
| `neutral` | 280 (brand indigo tint) | — | Borders, backgrounds, text, dark surfaces |

### Semantic Colors

Swap automatically between light and dark themes.

| Token | Tailwind class | Light | Dark | Use for |
|-------|---------------|-------|------|---------|
| `background` | `bg-background` | `#F9F4FF` | `#141421` | Page background |
| `foreground` | `text-foreground` | `#141421` | `#F9F4FF` | Primary text |
| `primary` | `bg-primary`, `text-primary` | primary-600 | primary-400 | Interactive elements |
| `primary-foreground` | `text-primary-foreground` | `#ffffff` | `#ffffff` | Text on primary backgrounds |
| `accent` | `bg-accent`, `text-accent` | accent-300 | accent-300 | Highlights, emphasis |
| `accent-foreground` | `text-accent-foreground` | `#141421` | `#141421` | Text on accent backgrounds |
| `muted` | `bg-muted` | primary-100 | neutral-900 | Subdued backgrounds |
| `muted-foreground` | `text-muted-foreground` | neutral-500 | neutral-400 | Subdued text, labels |
| `surface` | `bg-surface` | primary-50 | neutral-900 | Elevated/interactive surface backgrounds (cards, form fields) |
| `surface-foreground` | `text-surface-foreground` | `#141421` | `#F9F4FF` | Text on elevated surfaces |
| `edge` | `border-edge` | primary-200 | neutral-800 | Borders, dividers |
| `edge-hover` | `border-edge-hover` | primary-300 | neutral-700 | Hover state borders |

### Usage Examples

```tsx
{/* Scale colors — use specific stops for fine control */}
<div className="bg-primary-100 text-primary-800 p-4 rounded">Light tint</div>
<div className="bg-error-600 text-white p-4 rounded">Error</div>
<div className="bg-neutral-50 border border-neutral-200 p-4 rounded">Subtle</div>

{/* Opacity modifier */}
<div className="bg-primary-600/20 text-primary-700 p-4 rounded">20% opacity</div>

{/* Semantic colors — theme-aware */}
<div className="bg-surface text-surface-foreground rounded-lg border border-edge p-6">
  <h3 className="text-foreground font-bold">Title</h3>
  <p className="text-muted-foreground">Description text</p>
</div>
```

---

## Fonts

| Tailwind class | Font | Source | Use for |
|----------------|------|--------|---------|
| `font-heading` | rigid-square | Adobe Typekit (`acb7qvn`) | Headings, hero text |
| `font-sans` | Titillium Web | Google Fonts | Body text |
| `font-mono` | Source Code Pro | Google Fonts | Code blocks |

### Heading Scale

All headings use `font-heading`, weight 800, italic.

| Style | Size | Tailwind equivalent |
|-------|------|-------------------|
| Header | 128px (8rem) | `text-[8rem]` |
| H1 | 72px (4.5rem) | `text-[4.5rem]` |
| H2 | 64px (4rem) | `text-[4rem]` |
| H3 | 48px (3rem) | `text-5xl` |
| H4 | 40px (2.5rem) | `text-[2.5rem]` |
| H5 | 36px (2.25rem) | `text-4xl` |
| H6 | 32px (2rem) | `text-[2rem]` |
| H7 | 24px (1.5rem) | `text-2xl` |

### Body Styles

| Style | Class combination |
|-------|------------------|
| Body | `font-sans text-base leading-relaxed` |
| Body bold | `font-sans text-base font-bold leading-relaxed` |
| Body italic | `font-sans text-base italic leading-relaxed` |
| Code | `font-mono text-base leading-relaxed` |

### Usage Examples

```tsx
{/* Page heading */}
<h1 className="font-heading text-[4.5rem] font-extrabold italic">
  Aleph Cloud
</h1>

{/* Section heading */}
<h2 className="font-heading text-[2rem] font-extrabold italic">
  Features
</h2>

{/* Body text */}
<p className="font-sans text-base leading-relaxed">
  Decentralized computing for everyone.
</p>

{/* Code block */}
<pre className="font-mono text-base leading-relaxed bg-muted p-4 rounded-lg">
  const node = await aleph.create({ channel: "main" });
</pre>
```

---

## Gradients

Available as CSS custom properties. Use via `style` attribute.

| Name | CSS variable | Colors | Use for |
|------|-------------|--------|---------|
| `main` | `var(--gradient-main)` | `#141421` → `#5100CD` (light) / `#1C1C32` → `#5100CD` (dark) | Primary gradient, hero sections. Theme-aware — promoted to semantic layer. |
| `lime` | `var(--gradient-lime)` | `#D6FF00` → `#F5F7DB` | Accent gradient, CTAs |
| `success` | `var(--gradient-success)` | `#36D846` → `#63E570` | Success states |
| `warning` | `var(--gradient-warning)` | `#FFE814` → `#FBAE18` | Warning states |
| `error` | `var(--gradient-error)` | `#FFAC89` → `#DE3668` | Error states |
| `destructive` | `var(--gradient-destructive)` | (alias → `error`) | Convenience alias |
| `info` | `var(--gradient-info)` | `#C8ADF0` → `#5100CD` | Info states |

### Gradient Border Utilities

CSS `border-color` doesn't support gradients. These classes (defined in `tokens.css`) use the background-clip trick to render gradient borders with rounded corners. Interactive states (hover, active) are built into the class.

| Class | Gradient | Fill (default → hover → active) |
|-------|----------|--------------------------------|
| `border-gradient-main` | `--gradient-main` | primary-100 → 200 → 300 |

```tsx
{/* Just apply the class — hover/active fills are built in */}
<button className="border-gradient-main border-3 rounded-full">
  Outline Action
</button>
```

### Gradient Fill Utilities

CSS classes for gradient backgrounds with interactive hover/active states. Hover uses a semi-transparent overlay to lighten or darken the gradient without defining new color stops.

| Class | Gradient | Hover | Active |
|-------|----------|-------|--------|
| `gradient-fill-main` | `--gradient-main` | White overlay (lighten) | Black overlay (darken) |
| `gradient-fill-lime` | `--gradient-lime` | Black overlay (subtle darken) | Black overlay (darken) |
| `gradient-fill-success` | `--gradient-success` | — | — |
| `gradient-fill-warning` | `--gradient-warning` | — | — |
| `gradient-fill-error` | `--gradient-error` | — | — |
| `gradient-fill-info` | `--gradient-info` | — | — |

```tsx
{/* Gradient fills with built-in hover/active states */}
<button className="gradient-fill-main text-white px-6 py-3 rounded-full">
  Primary Action
</button>
<button className="gradient-fill-lime text-neutral-950 px-6 py-3 rounded-full">
  Secondary Action
</button>
```

### FX Grain Textures

CSS utility classes that apply a radial gradient background with an SVG `feTurbulence` noise overlay via `::after`. The element gets `position: relative` and `isolation: isolate` automatically. The overlay inherits `border-radius` from the parent.

| Class | Effect | Light overlay | Dark overlay |
|-------|--------|--------------|-------------|
| `fx-grain-xs` | Subtle dots | 0.1 | 0.2 |
| `fx-grain-sm` | Fading edge dots | 0.2 | 0.2 |
| `fx-grain-md` | Sparse dots | 0.35 | 0.35 |
| `fx-grain-lg` | Strong dots | 0.5 | 0.5 |

**Light mode:** Radial gradients from `primary-100`/`primary-50` center to `primary-50` edge.
**Dark mode:** Radial gradients from `var(--surface)` center to transparent edge. All colors derived from DS tokens — no hardcoded hex values.

```tsx
{/* Grain background on any element */}
<div className="fx-grain-lg rounded-xl p-6">
  Content with strong grain texture
</div>

{/* Card component uses fx-grain-lg for its noise variant */}
<Card variant="noise">Card with grain</Card>
```

### Usage Examples

```tsx
{/* Hero section with main gradient */}
<div style={{ background: "var(--gradient-main)" }} className="text-white p-12 rounded-lg">
  <h1 className="font-heading text-4xl font-extrabold italic">Welcome</h1>
</div>

{/* CTA button with lime gradient */}
<button
  style={{ background: "var(--gradient-lime)" }}
  className="text-black px-6 py-3 rounded-md font-bold"
>
  Get Started
</button>

{/* Status banner */}
<div style={{ background: "var(--gradient-success)" }} className="text-white px-4 py-2 rounded">
  All systems operational
</div>
```

---

## Shadows

Available as Tailwind utility classes.

| Name | Tailwind class | Value | Use for |
|------|---------------|-------|---------|
| `brand-sm` | `shadow-brand-sm` | `0px 4px 4px` (15% brand) | Tight elements (tooltips, hover accents) |
| `brand` | `shadow-brand` | `0px 4px 24px` (10% brand) | Elevated surfaces (dropdowns, popovers) |
| `brand-lg` | `shadow-brand-lg` | `0px 4px 48px` (25% brand) | Emphasized elements, modals |

### Usage Examples

```tsx
{/* Card with subtle shadow */}
<div className="bg-surface rounded-lg p-6 shadow-brand-sm">
  Subtle card
</div>

{/* Elevated card */}
<div className="bg-surface rounded-lg p-6 shadow-brand">
  Default elevation
</div>

{/* Modal or hero element */}
<div className="bg-surface rounded-lg p-8 shadow-brand-lg">
  High emphasis
</div>

{/* Interactive shadow on hover */}
<div className="bg-surface rounded-lg p-6 shadow-brand-sm hover:shadow-brand transition-shadow">
  Hover for more shadow
</div>
```

---

## Transitions

Available as CSS custom properties.

| Name | CSS variable | Duration | Use for |
|------|-------------|----------|---------|
| Fast | `var(--duration-fast)` | 200ms | Hover states, micro-interactions |
| Normal | `var(--duration-normal)` | 500ms | Panel transitions, reveals |
| Slow | `var(--duration-slow)` | 700ms | Page transitions, complex animations |

Timing function: `var(--timing)` = `ease-in-out`

### Usage Examples

```tsx
{/* Fast hover transition */}
<button
  className="border border-edge hover:border-edge-hover transition-colors"
  style={{ transitionDuration: "var(--duration-fast)" }}
>
  Hover me
</button>

{/* Animated panel */}
<div
  className="transition-all"
  style={{
    transitionDuration: "var(--duration-normal)",
    transitionTimingFunction: "var(--timing)",
  }}
>
  Animated content
</div>
```

---

## Icons

The DS uses [Phosphor Icons](https://phosphoricons.com/) — 7,000+ icons in 6 weights (Thin, Light, Regular, Bold, Fill, Duotone), MIT licensed.

### Installation

Phosphor is a regular dependency of `@aleph-front/ds`. Consumers who need additional icons beyond what the DS uses internally can import directly from `@phosphor-icons/react` (installed transitively).

### Usage

```tsx
import { Star, CaretDown, Check } from "@phosphor-icons/react";

<Star weight="bold" className="size-5" />
<CaretDown weight="bold" className="size-4 text-muted-foreground" />
<Check weight="bold" className="size-4" />
```

### Weight Recommendations

| Weight | Use for |
|--------|---------|
| `bold` | DS internal icons (chevrons, checkmarks, close). Default for UI controls. |
| `regular` | Body content icons, navigation items |
| `light` / `thin` | Decorative, large display icons |
| `fill` | Filled state indicators, active states |
| `duotone` | Branded illustrations, feature highlights |

### Size Tokens

Control icon size via Tailwind's `size-*` utilities or `className`:

| Name | Size | Tailwind |
|------|------|----------|
| `2xl` | 36px | `size-9` |
| `xl` | 24px | `size-6` |
| `lg` | 16px | `size-4` |
| `md` | 14px | `size-3.5` |
| `sm` | 12px | `size-3` |
| `xs` | 8px | `size-2` |

### Internal Usage

DS components use Phosphor icons internally for UI chrome:

| Icon | Component | Purpose |
|------|-----------|---------|
| `CaretDown` (bold) | Select, Combobox, MultiSelect | Dropdown indicator |
| `CaretUp` (bold) | Table | Sort direction indicator |
| `Check` (bold) | Select, Combobox, MultiSelect | Selected item indicator |
| `X` (bold) | MultiSelect | Tag dismiss, clear all |

---

## Logo

Two SVG components for the Aleph Cloud brand mark. Both use `fill="currentColor"` to inherit color from the parent, adapting to any theme or background automatically.

### Usage

```tsx
import { Logo, LogoFull } from "@aleph-front/ds/logo";

{/* Icon mark only */}
<Logo className="size-10" aria-label="Aleph Cloud" />

{/* Icon + "Aleph Cloud" wordmark */}
<LogoFull className="h-8 w-auto" aria-label="Aleph Cloud" />
```

### Variants

| Component | Content | Aspect ratio |
|-----------|---------|-------------|
| `Logo` | Icon mark (two circles + two arcs) | 1:1 — size with `size-*` |
| `LogoFull` | Icon mark + "Aleph Cloud" wordmark | ~6:1 — set height with `h-*`, use `w-auto` |

### Theming

The logos use `currentColor`, so they respond to the parent's text color:

```tsx
{/* Inherits default foreground color */}
<Logo className="size-10" />

{/* On a dark surface */}
<div className="bg-neutral-900 text-white">
  <LogoFull className="h-8 w-auto" />
</div>

{/* Brand tint */}
<Logo className="size-10 text-primary-600" />
```

### Props

Both components accept all standard SVG attributes (`className`, `aria-label`, `aria-hidden`, etc.) and forward refs.

---

## Patterns

### Adding a New Semantic Token

1. Add light value to `:root` block in `packages/ds/src/styles/tokens.css`
2. Add dark value to `.theme-dark` block
3. Add Tailwind mapping in `@theme inline` block: `--color-my-token: var(--my-token);`
4. Use as Tailwind class: `bg-my-token`, `text-my-token`, `border-my-token`

### Composing a Card

```tsx
<div className="bg-surface text-surface-foreground rounded-lg border border-edge
                shadow-brand-sm hover:shadow-brand p-6"
     style={{ transitionDuration: "var(--duration-fast)" }}>
  <h3 className="font-heading text-xl font-extrabold italic mb-2">
    Card Title
  </h3>
  <p className="text-muted-foreground leading-relaxed">
    Card description with muted text.
  </p>
  <button className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-md">
    Action
  </button>
</div>
```

### Hero Section

```tsx
<section style={{ background: "var(--gradient-main)" }} className="py-24 px-6">
  <div className="mx-auto max-w-5xl">
    <h1 className="font-heading text-[4.5rem] font-extrabold italic text-white">
      Aleph Cloud
    </h1>
    <p className="font-sans text-xl text-white/80 mt-4 max-w-2xl leading-relaxed">
      Decentralized computing, storage, and networking.
    </p>
    <button
      style={{ background: "var(--gradient-lime)" }}
      className="mt-8 text-black px-8 py-3 rounded-md font-bold text-lg shadow-brand-lg"
    >
      Get Started
    </button>
  </div>
</section>
```

### Status Indicator

```tsx
<div className="flex items-center gap-2">
  <div className="w-2 h-2 rounded-full bg-success-500" />
  <span className="text-sm text-muted-foreground">All systems operational</span>
</div>
```

---

## Components

### Alert

Dismissible status banner with 4 semantic variants, optional title, auto-dismiss timer with progress bar, and exit animation.

```tsx
import { Alert } from "@aleph-front/ds/alert";
```

**Visual style:** Full 1px variant-colored border, gradient background at 10% opacity over page background, `font-heading` uppercase label.

#### Variants

```tsx
<Alert variant="warning">Warning message</Alert>
<Alert variant="error">Error message</Alert>
<Alert variant="info">Info message</Alert>
<Alert variant="success">Success message</Alert>
```

#### With Title

```tsx
<Alert variant="error" title="Instance Paused">
  Something went wrong with your instance.
</Alert>
```

#### Dismissible

```tsx
<Alert variant="info" onDismiss={() => setVisible(false)}>
  Click the X to dismiss.
</Alert>
```

#### Auto-Dismiss with Timer

```tsx
<Alert variant="success" onDismiss={() => setVisible(false)} dismissAfter={5000}>
  This alert will dismiss in 5 seconds.
</Alert>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"warning" \| "error" \| "info" \| "success"` | `"warning"` | Determines colors, border, gradient, and label |
| `title` | `string` | — | Optional bold heading below the label |
| `onDismiss` | `() => void` | — | Shows XCircle dismiss button; called after exit animation |
| `dismissAfter` | `number` | — | Auto-dismiss timer in ms. Requires `onDismiss`. Shows progress bar. |
| `children` | `ReactNode` | — | Message body. Links (`<a>`) are auto-styled (bold, underline, ↗ icon). |
| `className` | `string` | — | Merged via `cn()` |

### Breadcrumb

Composable navigation breadcrumb trail with semantic `<nav>` + `<ol>` + `<li>` markup, `asChild` support via Radix Slot for framework routing, and hover states.

```tsx
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@aleph-front/ds/breadcrumb";
```

#### Default

```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/nodes">Nodes</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Node Details</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

#### With Framework Router (asChild)

```tsx
<BreadcrumbLink asChild>
  <Link href="/dashboard">Dashboard</Link>
</BreadcrumbLink>
```

#### Parts

| Part | Element | Role |
|------|---------|------|
| `Breadcrumb` | `<nav>` | Wrapper with `aria-label="Breadcrumb"` |
| `BreadcrumbList` | `<ol>` | Ordered list with flex layout, font-heading uppercase styling |
| `BreadcrumbItem` | `<li>` | List item wrapper |
| `BreadcrumbLink` | `<a>` / Slot | Navigation link with hover color transition |
| `BreadcrumbSeparator` | `<li>` | Visual separator (`/` default), `aria-hidden="true"` |
| `BreadcrumbPage` | `<span>` | Current page with `aria-current="page"`, muted color |

**Visual style:** `font-heading font-extrabold italic uppercase text-xs` on the list. Links use `text-foreground` with `hover:text-primary-600` (dark: `primary-400`). Separators and current page use `text-muted`. No CVA — no variants.

### Button

CVA-based button with 6 variants, 4 sizes, icon slots, loading/disabled states, and `asChild` polymorphism.

```tsx
import { Button } from "@aleph-front/ds/button";
```

**Visual style:** Pill shape (`rounded-full`), 3px border, `font-heading` at weight 700.

#### Variants

```tsx
<Button variant="primary">Primary</Button>     {/* gradient-main fill, white text, no border */}
<Button variant="secondary">Secondary</Button> {/* gradient-lime fill, black text, black border */}
<Button variant="outline">Outline</Button>     {/* gradient-main border, primary-100 fill */}
<Button variant="text">Text</Button>           {/* transparent, no visible border */}
<Button variant="destructive">Delete</Button>  {/* 20% error fill, dark text (light in dark mode) */}
<Button variant="warning">Careful</Button>     {/* 20% warning fill, dark text (light in dark mode) */}
```

#### Sizes

```tsx
<Button size="xs">Extra Small</Button>  {/* py-1, text-sm */}
<Button size="sm">Small</Button>        {/* py-1.5, text-base */}
<Button size="md">Medium</Button>       {/* py-2, text-base (default) */}
<Button size="lg">Large</Button>        {/* py-2.5, text-lg */}
```

#### Icons

```tsx
<Button iconLeft={<PlusIcon />}>Add Item</Button>
<Button iconRight={<ArrowIcon />}>Next</Button>
<Button iconLeft={<PlusIcon />} iconRight={<ArrowIcon />}>Both</Button>
```

#### Loading and Disabled

```tsx
<Button loading>Saving...</Button>   {/* Shows spinner, hides icons, aria-busy */}
<Button disabled>Unavailable</Button> {/* 50% opacity, pointer-events-none */}
```

#### As Link (asChild)

Renders button styles on a child element instead of `<button>`:

```tsx
<Button asChild variant="primary">
  <a href="/dashboard">Go to Dashboard</a>
</Button>

{/* Works with Next.js Link */}
<Button asChild variant="text">
  <Link href="/settings">Settings</Link>
</Button>
```

#### Custom Composition with buttonVariants

```tsx
import { buttonVariants } from "@aleph-front/ds/button";

<a href="/docs" className={buttonVariants({ variant: "outline", size: "sm" })}>
  Documentation
</a>
```

### Input

Styled text input with CVA sizing and error state.

```tsx
import { Input } from "@aleph-front/ds/input";

<Input size="md" placeholder="Enter text" />
<Input size="sm" placeholder="Small" />
<Input error placeholder="Invalid" />
<Input disabled placeholder="Disabled" />
```

**Sizes:** `sm` (py-1.5, text-sm) · `md` (py-2, text-base, default)

**Visuals:** Borderless flat fill (`bg-primary-100 dark:bg-base-700`). `rounded-full` pill shape. Distinguishes from page background via fill contrast alone.

**Error:** `error={true}` adds 3px `border-error-400` border, sets `aria-invalid`.

**Focus ring:** Flush `ring-3` in `primary-500`, animated via `box-shadow` transition. No offset.

### Textarea

Multi-line text input. Same API as Input, `rounded-2xl`, borderless flat fill, vertical resize.

```tsx
import { Textarea } from "@aleph-front/ds/textarea";

<Textarea placeholder="Enter message" />
<Textarea size="sm" rows={6} />
<Textarea error placeholder="Invalid" />
```

**Defaults:** `rows={4}`, `resize-y`, `size="md"`

### FormField

Layout wrapper that wires label, helper text, and error message to a child input with proper accessibility attributes.

```tsx
import { FormField } from "@aleph-front/ds/form-field";
import { Input } from "@aleph-front/ds/input";

<FormField label="Email" required helperText="We'll never share it">
  <Input type="email" placeholder="you@example.com" />
</FormField>

<FormField label="Email" required error="Invalid email">
  <Input type="email" error />
</FormField>
```

**Props:** `label` (required), `required`, `helperText`, `error`, `className`

**Accessibility:** Auto-generates `id`, wires `htmlFor`, `aria-describedby`, and `role="alert"` on errors. When `error` is present, auto-injects `error={true}` and `aria-invalid={true}` into the child input via `cloneElement` — no need to pass `error` to both FormField and Input.

### Checkbox

Toggle control for boolean values. Wraps Radix UI Checkbox with CVA styling.

```tsx
import { Checkbox } from "@aleph-front/ds/checkbox";

<Checkbox />
<Checkbox defaultChecked />
<Checkbox checked={value} onCheckedChange={setValue} />
<Checkbox disabled />
<Checkbox error />
<Checkbox size="sm" />

<FormField label="Accept terms" required>
  <Checkbox />
</FormField>
```

**Props:** `checked`, `defaultChecked`, `onCheckedChange`, `disabled`, `error`, `size` (xs/sm/md), `className`. Forwards ref to `<button>`.

**Sizes:** `xs` (16px, rounded 4px) · `sm` (20px, rounded-md 6px) · `md` (24px, rounded-md 6px, default)

**Animation:** Check icon reveals with a clip-path circle transition (200ms, bottom-left origin following stroke direction). Uses Radix `forceMount` to keep indicator in DOM.

**Error:** `error={true}` switches to 3px `border-error-400` border, sets `aria-invalid`.

### RadioGroup

Mutually exclusive option set. Wraps Radix UI RadioGroup with CVA styling.

```tsx
import { RadioGroup, RadioGroupItem } from "@aleph-front/ds/radio-group";

<RadioGroup defaultValue="a" onValueChange={setValue}>
  <RadioGroupItem value="a" />
  <RadioGroupItem value="b" />
  <RadioGroupItem value="c" disabled />
</RadioGroup>

<FormField label="Plan" required>
  <RadioGroup defaultValue="starter">
    <RadioGroupItem value="starter" />
    <RadioGroupItem value="pro" />
  </RadioGroup>
</FormField>
```

**RadioGroup props:** `value`, `defaultValue`, `onValueChange`, `disabled`, `className`. Forwards ref to `<div>`.

**RadioGroupItem props:** `value`, `disabled`, `size` (xs/sm/md), `className`. Forwards ref to `<button>`.

**Sizes:** `xs` (16px) · `sm` (20px) · `md` (24px, default)

**Animation:** Dot reveals with a clip-path circle transition (200ms, centered origin). Uses Radix `forceMount` to keep indicator in DOM.

### Switch

Toggle control for on/off states. Wraps Radix UI Switch with CVA styling and animated thumb.

```tsx
import { Switch } from "@aleph-front/ds/switch";

<Switch />
<Switch defaultChecked />
<Switch checked={value} onCheckedChange={setValue} />
<Switch disabled />
<Switch size="sm" />

<FormField label="Email notifications">
  <Switch />
</FormField>
```

**Props:** `checked`, `defaultChecked`, `onCheckedChange`, `disabled`, `size` (xs/sm/md), `className`. Forwards ref to `<button>`.

**Sizes:** `xs` (36×20px track, 12px thumb) · `sm` (48×26px track, 18px thumb) · `md` (60×32px track, 24px thumb, default)

**Visuals:** Pill track, sliding white thumb with `transition-transform`, 2px gap from track edges. Off = `bg-muted border-edge`, on = `bg-primary`.

### Select

Dropdown selector. Wraps Radix UI Select with flat `options` prop API.

```tsx
import { Select } from "@aleph-front/ds/select";

<Select
  placeholder="Choose..."
  options={[
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
    { value: "c", label: "Option C", disabled: true },
  ]}
/>
<Select value={value} onValueChange={setValue} options={options} />
<Select disabled options={options} />
<Select error options={options} />

<FormField label="Region" required error="Required">
  <Select error placeholder="Select region" options={regions} />
</FormField>
```

**Props:** `value`, `defaultValue`, `onValueChange`, `placeholder`, `options` (array of `{ value, label, disabled? }`), `disabled`, `error`, `size` (sm/md), `className`, `id`, `aria-describedby`. Forwards ref to trigger `<button>`.

**Sizes:** `sm` (Input sm padding) · `md` (Input md padding, default)

**Visuals:** Borderless flat fill, matching Input/Textarea. `rounded-full` pill shape.

**Error:** `error={true}` adds 3px `border-error-400` border, sets `aria-invalid`.

**Dropdown:** `rounded-2xl`, `bg-surface`, `border border-edge`, `shadow-brand`. Items highlight with `bg-muted`. Selected shows check icon.

### Badge

Semantic label for status, counts, and categories. Two fill modes (solid gradient, outline), optional icon slots, uppercase heading font.

```tsx
import { Badge } from "@aleph-front/ds/badge";
```

#### Fill Modes

**Solid (default):** gradient background with dark text.

```tsx
<Badge variant="default">Informational</Badge>  {/* gradient-fill-info */}
<Badge variant="success">Healthy</Badge>         {/* gradient-fill-success */}
<Badge variant="warning">In Progress</Badge>     {/* gradient-fill-warning */}
<Badge variant="error">Failed</Badge>            {/* gradient-fill-error */}
<Badge variant="info">3 VMs</Badge>              {/* neutral solid fill */}
```

**Outline:** colored border with subtle background.

```tsx
<Badge fill="outline" variant="success">Healthy</Badge>
<Badge fill="outline" variant="error">Failed</Badge>
```

#### Icons

```tsx
<Badge variant="success" iconLeft={<CheckCircle size={12} weight="bold" />}>Active</Badge>
<Badge variant="error" iconRight={<XCircle size={12} weight="bold" />}>Offline</Badge>
```

Icon wrappers scale with badge size: 10px (`size-2.5`) for sm, 12px (`size-3`) for md.

#### Sizes

```tsx
<Badge size="sm">Small</Badge>  {/* px-3, text-[10px] */}
<Badge size="md">Medium</Badge> {/* px-4, text-xs (default) */}
```

#### Custom Composition with badgeVariants

```tsx
import { badgeVariants } from "@aleph-front/ds/badge";

<span className={badgeVariants({ fill: "outline", variant: "success", size: "sm" })}>Active</span>
```

**Visual style:** `font-heading font-extrabold italic uppercase`, `rounded-md` (6px). Solid fill uses gradient CSS utility classes (`gradient-fill-success`, etc.) from tokens.css. Outline fill uses `border` + token-scale border colors + subtle `/20` opacity backgrounds in dark mode. `default` variant uses `dark:text-white` for contrast on the dark `gradient-info` endpoint.

### Card

Content container with semantic background and border. Used for stat cards, panels, and layout grouping.

```tsx
import { Card } from "@aleph-front/ds/card";
```

#### Variants

```tsx
<Card variant="default">Default card</Card>  {/* bg-surface, borderless, rounded-md */}
<Card variant="noise">Grain texture</Card>    {/* purple grain SVG overlay */}
<Card variant="ghost">No border</Card>        {/* transparent, no border */}
```

#### Padding

```tsx
<Card padding="sm">Compact</Card>  {/* p-4 */}
<Card padding="md">Medium</Card>   {/* p-6 (default) */}
<Card padding="lg">Spacious</Card> {/* p-8 */}
```

#### With Title

```tsx
<Card title="Node Health">
  <p>Card content below the heading.</p>
</Card>
```

Renders an `<h3>` heading with `font-heading` and `mb-4` spacing.

### CopyableText

Truncated text display with copy-to-clipboard and optional external link. Designed for hashes, wallet addresses, API keys, and other long strings that need to be copiable but not fully visible. Uses a stroke-draw micro-animation on copy (Copy fades out, SVG checkmark draws its stroke via `stroke-dashoffset`).

```tsx
import { CopyableText } from "@aleph-front/ds/copyable-text";
```

#### Sizes

```tsx
<CopyableText text={hash} size="sm" />  {/* text-xs, gap-1 */}
<CopyableText text={hash} size="md" />  {/* text-sm, gap-1.5 (default) */}
```

#### Custom Truncation

```tsx
{/* Default: startChars=6, endChars=4 → "0x1234...5678" */}
<CopyableText text={hash} />

{/* Custom: startChars=8, endChars=6 → "0x123456...345678" */}
<CopyableText text={hash} startChars={8} endChars={6} />

{/* Short text (no truncation when text.length <= startChars + endChars) */}
<CopyableText text="0x1a2b3c" />
```

#### With External Link

```tsx
<CopyableText
  text={walletAddress}
  href="https://etherscan.io/address/..."
/>
```

When `href` is provided, the truncated text itself becomes a clickable link (opens in new tab), plus an ArrowUpRight icon button. Both use `target="_blank"` and `rel="noopener noreferrer"`. Text color automatically switches to `text-primary-500` (light) / `text-primary-300` (dark) to indicate a navigable link. Override with `className` if needed.

**Animation:** Copy button plays a reveal animation (circle expand + check icon) on click. Respects `prefers-reduced-motion`.

### Dialog

Modal dialog wrapping Radix UI Dialog with composable API, frosted overlay (`bg-black/60 backdrop-blur-sm`), entry/exit animations (`fade-in/out` + `zoom-in/out-95`), and configurable dismiss locking. Uses the composable re-export pattern (like Tooltip/Tabs).

```tsx
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@aleph-front/ds/dialog";

{/* Uncontrolled */}
<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline" size="sm">Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description text.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline" size="sm">Cancel</Button>
      </DialogClose>
      <Button variant="primary" size="sm">Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

{/* Controlled + locked (no overlay click, no Escape, no close button) */}
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent locked>
    <DialogHeader>
      <DialogTitle>Confirm action</DialogTitle>
      <DialogDescription>You must choose an action.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="primary" size="sm" onClick={() => setOpen(false)}>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Exports:** `Dialog`, `DialogTrigger`, `DialogContent`, `DialogClose`, `DialogTitle`, `DialogDescription`, `DialogHeader`, `DialogFooter`, `DialogContentProps`

**Props (DialogContent):**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `locked` | `boolean` | `false` | Prevents overlay click, Escape dismiss, and hides the close button |
| `className` | `string` | — | Merged onto the content panel |

Plus all Radix `Dialog.Content` props (`onOpenAutoFocus`, `onCloseAutoFocus`, etc.).

### Pagination

Controlled pagination with fixed-slot layout, configurable sibling count, first/last jump buttons, and ellipsis logic. Pure `buildPageRange()` function always produces `2*siblingCount+5` items when `showFirstLast` is true, eliminating layout shift. Slots are keyed by position so the DOM stays stable during navigation.

```tsx
import { Pagination } from "@aleph-front/ds/pagination";
```

**Visual style:** Rounded page buttons (`size-8 rounded-full`), `font-heading font-bold`, active page highlighted with `bg-primary-400` (dark: `bg-primary-600`). Caret icons from Phosphor.

#### Usage

```tsx
<Pagination page={page} totalPages={20} onPageChange={setPage} />
```

#### Compact (no first/last)

```tsx
<Pagination page={page} totalPages={10} onPageChange={setPage} showFirstLast={false} />
```

#### Desktop Max (wider sibling range)

```tsx
<Pagination page={page} totalPages={10} onPageChange={setPage} siblingCount={2} />
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `page` | `number` | — | Current active page (1-indexed, controlled) |
| `totalPages` | `number` | — | Total number of pages |
| `onPageChange` | `(page: number) => void` | — | Called with new page number on click |
| `siblingCount` | `number` | `1` | Pages shown on each side of current page |
| `showFirstLast` | `boolean` | `true` | Show first/last jump buttons and anchored page numbers |
| `className` | `string` | — | Merged via `cn()` onto the `<nav>` |
| `ref` | `Ref<HTMLElement>` | — | Forwarded to the `<nav>` element |

#### Accessibility

- `<nav aria-label="Pagination">` landmark
- `aria-current="page"` on active page button
- `aria-disabled="true"` on boundary nav buttons (keeps them in tab order for discoverability)
- `aria-label` on all nav buttons ("First page", "Previous page", "Next page", "Last page", "Page N")
- Ellipsis rendered as `aria-hidden="true"` spans

### StatusDot

Small colored circle indicating health status. Used inline with text labels in tables and lists. Accessible by default — includes `role="status"` and auto-derived `aria-label` from the status prop.

```tsx
import { StatusDot } from "@aleph-front/ds/status-dot";
```

#### Statuses

```tsx
<StatusDot status="healthy" />   {/* success-500, pulse animation */}
<StatusDot status="degraded" />  {/* warning-500 */}
<StatusDot status="error" />     {/* error-500 */}
<StatusDot status="offline" />   {/* neutral-400 */}
<StatusDot status="unknown" />   {/* neutral-300 */}
```

#### Sizes

```tsx
<StatusDot status="healthy" size="sm" />  {/* 8px (size-2) */}
<StatusDot status="healthy" size="md" />  {/* 12px (size-3, default) */}
```

**Accessibility:** Built-in `role="status"` and auto-derived `aria-label` (e.g., `status="healthy"` → `aria-label="Healthy"`). Override with a custom label when more context is needed:

```tsx
<StatusDot status="healthy" aria-label="Node is healthy" />
```

### Table

Generic typed table with sortable columns, alternating rows, hover highlight, row click, keyboard accessibility, and empty state.

```tsx
import { Table, type Column } from "@aleph-front/ds/table";
```

#### Column Definition

```tsx
type Column<T> = {
  header: string;            // Column header text
  accessor: (row: T) => ReactNode;  // Cell renderer
  sortable?: boolean;        // Enable sort on this column
  sortValue?: (row: T) => string | number;  // Sort comparator
  width?: string;            // CSS width
  align?: "left" | "center" | "right";
};
```

#### Usage

```tsx
const columns: Column<Node>[] = [
  { header: "Name", accessor: (r) => r.name, sortable: true, sortValue: (r) => r.name },
  { header: "CPU", accessor: (r) => `${r.cpu}%`, sortable: true, sortValue: (r) => r.cpu, align: "right" },
];

<Table
  columns={columns}
  data={nodes}
  keyExtractor={(r) => r.id}
  onRowClick={(row) => setSelected(row)}
  emptyState="No nodes found"
/>
```

**Active row:** Pass `activeKey` matching a `keyExtractor` value to highlight the selected row with a primary-tinted background and left inset border. Sets `aria-current="true"` for screen readers.

```tsx
<Table columns={columns} data={nodes} keyExtractor={(r) => r.id} activeKey={selectedId} />
```

**Visual style:** Alternating rows (`even:bg-muted/30`), hover highlight (`hover:bg-muted/50`), clickable rows with `cursor-pointer` and left inset border on hover. Header row `bg-muted/50 text-muted-foreground text-sm font-semibold uppercase tracking-wide`.

**Keyboard accessibility:** Sortable headers are focusable (`tabIndex={0}`) and respond to Enter/Space. Clickable rows are focusable and respond to Enter. Headers include `aria-sort` (`ascending`/`descending`/`none`). Active row has `aria-current="true"`.

**Sort-icon alignment on right-aligned columns:** Sortable headers always render the sort icon (opacity-0 when inactive) so toggling sort doesn't shift column width. For `align: "right"`, the header content is wrapped in an inline-flex with `flex-row-reverse` so the icon sits to the left of the header text — keeping the text's right edge flush with the right edge of body cells at any width.

**Controlled sort:** By default, the table sorts the `data` array internally — fine when `data` contains every row that should participate in the sort. When the rows passed to `data` are a subset of a larger dataset (for example, the current page of an externally paginated list), pass `sortColumn`, `sortDirection`, and `onSortChange` to operate in controlled mode. The table delegates header clicks via `onSortChange(column, direction)` and renders the indicator from the controlled props; the parent owns the sort state and pre-sorts the full dataset before passing the visible slice.

```tsx
const [sortColumn, setSortColumn] = useState("VMs");
const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
const sorted = applySort(filteredRows, columns, sortColumn, sortDirection);
const pageItems = paginate(sorted);

<Table
  columns={columns}
  data={pageItems}
  keyExtractor={(r) => r.id}
  sortColumn={sortColumn}
  sortDirection={sortDirection}
  onSortChange={(col, dir) => {
    setSortColumn(col);
    setSortDirection(dir);
  }}
/>
```

**Empty state:** Pass `emptyState` (ReactNode) to render a centered message spanning all columns when `data` is empty.

### Tooltip

Radix UI tooltip wrapper with DS styling. Composable API with four exports.

```tsx
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@aleph-front/ds/tooltip";
```

#### Usage

Wrap your app (or a subtree) with `TooltipProvider`, then compose tooltips:

```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <button>Hover me</button>
    </TooltipTrigger>
    <TooltipContent>Tooltip text</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

#### Placement

```tsx
<TooltipContent side="top" />     {/* default */}
<TooltipContent side="right" />
<TooltipContent side="bottom" />
<TooltipContent side="left" />
```

**Styling:** `bg-neutral-900 text-white text-sm rounded-lg px-3 py-1.5 shadow-brand-sm` with Radix animation attributes. Dark mode uses `bg-base-800` for contrast against the dark page background.

### Tabs

Radix UI Tabs with DS styling, sliding active indicator, and text nudge micro-animation. Composable API — Radix Root is re-exported directly; List wraps the indicator logic. Underline variant uses a 4px baseline at 40% `edge` opacity with a 4px solid primary indicator that slides to the active tab.

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@aleph-front/ds/tabs";
```

#### Usage

```tsx
<Tabs defaultValue="compute">
  <TabsList>
    <TabsTrigger value="compute">Compute</TabsTrigger>
    <TabsTrigger value="storage">Storage</TabsTrigger>
    <TabsTrigger value="network">Network</TabsTrigger>
  </TabsList>
  <TabsContent value="compute">...</TabsContent>
  <TabsContent value="storage">...</TabsContent>
  <TabsContent value="network">...</TabsContent>
</Tabs>
```

#### With Badges

Tab triggers accept arbitrary children — badges, subscripts, icons:

```tsx
<TabsTrigger value="vms">
  VMs <Badge size="sm" variant="info">12</Badge>
</TabsTrigger>
```

#### Disabled Tab

```tsx
<TabsTrigger value="upcoming" disabled>Upcoming</TabsTrigger>
```

#### Pill Variant

A segmented-control style with a sliding solid pill indicator. Pass `variant="pill"` to `TabsList`:

```tsx
<Tabs defaultValue="nodes">
  <TabsList variant="pill">
    <TabsTrigger value="vms">VMs</TabsTrigger>
    <TabsTrigger value="nodes">Nodes</TabsTrigger>
  </TabsList>
  <TabsContent value="vms">...</TabsContent>
  <TabsContent value="nodes">...</TabsContent>
</Tabs>
```

#### Small Size

Pass `size="sm"` to `TabsList` for a compact variant. Works with both underline and pill:

```tsx
<Tabs defaultValue="compute">
  <TabsList size="sm">
    <TabsTrigger value="compute">Compute</TabsTrigger>
    <TabsTrigger value="storage">Storage</TabsTrigger>
  </TabsList>
  <TabsContent value="compute">...</TabsContent>
  <TabsContent value="storage">...</TabsContent>
</Tabs>
```

| | md (default) | sm |
|---|---|---|
| **Underline trigger** | `px-4 py-3 text-lg` | `px-3 py-1.5 text-sm` |
| **Underline border** | `border-b-4`, indicator `h-1` | `border-b-2`, indicator `h-0.5` |
| **Pill trigger** | `px-5 py-1.5 text-sm` | `px-3 py-1 text-xs` |
| **Pill container** | `p-1` | `p-0.5` |

#### Overflow Collapse

When many tabs exceed the available width, `overflow="collapse"` on `TabsList` auto-hides trailing tabs into a "..." dropdown menu. Works with both underline and pill variants. The sliding indicator moves behind the "..." trigger when a hidden tab is active.

```tsx
<Tabs defaultValue="compute">
  <TabsList overflow="collapse">
    <TabsTrigger value="compute">Compute</TabsTrigger>
    <TabsTrigger value="storage">Storage</TabsTrigger>
    <TabsTrigger value="network">Network</TabsTrigger>
    <TabsTrigger value="domains">Domains</TabsTrigger>
    <TabsTrigger value="functions">Functions</TabsTrigger>
    <TabsTrigger value="volumes">Volumes</TabsTrigger>
  </TabsList>
  <TabsContent value="compute">...</TabsContent>
  {/* ... */}
</Tabs>
```

**Overflow behavior:** Hidden tabs remain functional (Radix state intact). The dropdown uses `role="menu"` with arrow key navigation. Disabled tabs appear muted in the dropdown. Container height is locked to prevent layout collapse.

#### Max Visible (count cap)

`maxVisible?: number` on `TabsList` hard-caps the number of visible tabs regardless of available width. Trailing tabs collapse into the same overflow dropdown as `overflow="collapse"`. Use this when you need a deterministic count cap (e.g., always show the 3 primary status tabs, send the rest to the dropdown).

```tsx
<Tabs defaultValue="all">
  <TabsList maxVisible={3}>
    <TabsTrigger value="all">All</TabsTrigger>
    <TabsTrigger value="dispatched">Dispatched</TabsTrigger>
    <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
    <TabsTrigger value="running">Running</TabsTrigger>
    <TabsTrigger value="stopped">Stopped</TabsTrigger>
    {/* ...more tabs collapse into the "..." dropdown */}
  </TabsList>
  {/* TabsContent panels */}
</Tabs>
```

`maxVisible` activates the same overflow code path as `overflow="collapse"` — passing it alone is enough; you don't need to also pass `overflow`. When both are set, the **stricter** limit wins: visible = `min(widthFit, maxVisible)`. Hidden tabs go into the dropdown either way.

**Styling (underline):** `font-heading font-bold text-lg` triggers. 4px baseline at 40% `edge` opacity, 4px solid primary sliding indicator. Active/hover text uses `primary-600` / `dark:primary-400`.

**Styling (pill):** Rounded container `bg-muted` (brand-tinted). Active indicator `bg-primary-600` / `dark:bg-primary-500`. Triggers `text-muted-foreground` inactive, `text-white` active, compact `px-5 py-1.5 text-sm`.

**Exports:** `Tabs` (Root), `TabsList`, `TabsTrigger`, `TabsContent`, `TabsListProps`, `TabsSize`, `TabsVariant`

**Variants:** `TabsList` accepts `variant?: "underline" | "pill"` (default `"underline"`), `size?: "sm" | "md"` (default `"md"`), `overflow?: "collapse"`, and `maxVisible?: number`. All four props compose freely. `overflow` and `maxVisible` both activate the overflow dropdown; when both are set, the stricter limit wins.

**Animations:**
- **Sliding indicator** — slides between tabs on selection change. Initial render positions instantly (no slide-in from origin).
- **Text nudge** — active trigger shifts up 2px (`-translate-y-0.5`) in underline variant only
- All animations respect `prefers-reduced-motion` via `motion-reduce:transition-none`

### Skeleton

Animated loading placeholder. No width/height props — sizing is controlled by the consumer via `className`.

```tsx
import { Skeleton } from "@aleph-front/ds/ui/skeleton";

<Skeleton className="h-4 w-32" />           {/* Text line */}
<Skeleton className="h-10 w-full" />         {/* Input field */}
<Skeleton className="size-12 rounded-full" /> {/* Avatar */}
```

Uses `animate-pulse bg-muted rounded-md`. Hidden from accessibility tree via `aria-hidden="true"`. Respects `prefers-reduced-motion` via `motion-reduce:animate-none`.

### Combobox

Searchable dropdown selector. Wraps cmdk + Radix Popover with flat `options` prop API.

```tsx
import { Combobox } from "@aleph-front/ds/combobox";

<Combobox
  placeholder="Search tokens..."
  options={[
    { value: "btc", label: "Bitcoin" },
    { value: "eth", label: "Ethereum" },
    { value: "sol", label: "Solana" },
    { value: "dot", label: "Polkadot", disabled: true },
  ]}
/>
<Combobox value={value} onValueChange={setValue} options={options} />
<Combobox disabled options={options} />
<Combobox error options={options} />

<FormField label="Token" required error="Required">
  <Combobox error placeholder="Select a token..." options={tokens} />
</FormField>
```

**Props:** `value`, `onValueChange`, `placeholder`, `searchPlaceholder`, `emptyMessage`, `options` (array of `{ value, label, disabled? }`), `disabled`, `error`, `size` (sm/md), `className`, `id`, `aria-describedby`. Forwards ref to trigger `<button>`.

**Sizes:** `sm` (Input sm padding) · `md` (Input md padding, default)

**Visuals:** Borderless flat fill, matching Input/Textarea/Select. `rounded-full` pill shape. Chevron rotates on open.

**Search:** Type to filter options by label. `emptyMessage` shown when no options match (default: "No results found.").

**Error:** `error={true}` adds 3px `border-error-400` border, sets `aria-invalid`.

**Dropdown:** `rounded-2xl`, `bg-surface`, `border border-edge`, `shadow-brand`. Items highlight with `bg-muted`. Selected shows check icon.

### Slider

Range input for selecting numeric values. Wraps Radix Slider primitive with CVA track/thumb variants. Supports single-value and range (two-thumb) modes.

```tsx
import { Slider } from "@aleph-front/ds/slider";

{/* Single thumb */}
<Slider defaultValue={[50]} />
<Slider min={0} max={1000} step={10} defaultValue={[500]} />
<Slider value={value} onValueChange={setValue} showTooltip />

{/* Range (two thumbs) */}
<Slider defaultValue={[25, 75]} />
<Slider min={0} max={1000} step={10} value={range} onValueChange={setRange} showTooltip />

{/* States */}
<Slider disabled defaultValue={[50]} />
<Slider error defaultValue={[50]} />

<FormField label="Volume" helperText="Adjust the volume level">
  <Slider defaultValue={[50]} showTooltip />
</FormField>
```

**Props:** All Radix Slider Root props (`defaultValue`, `value`, `onValueChange`, `min`, `max`, `step`, `disabled`) plus `size` (sm/md), `error`, `showTooltip`, `className`. Forwards ref to root `<span>`.

**Range mode:** Pass a two-element array (e.g., `defaultValue={[25, 75]}`) to render two thumbs. The filled range spans between the thumbs. Radix prevents thumbs from crossing each other.

**Sizes:** `sm` (1.5px track, 16px thumb) · `md` (2px track, 20px thumb, default)

**Tooltip:** `showTooltip` shows each thumb's current value on hover. Styled as a dark pill.

**Error:** `error={true}` adds `ring-2 ring-error-400` to the track.

**Keyboard:** Arrow left/right adjusts by `step`. Tab between thumbs in range mode. Fully accessible via Radix.

### MultiSelect

Searchable multi-selection dropdown with tag display, checkbox indicators, and clear-all action. Wraps cmdk + Radix Popover (same stack as Combobox).

```tsx
import { MultiSelect } from "@aleph-front/ds/multi-select";

<MultiSelect
  placeholder="Select tokens..."
  options={[
    { value: "btc", label: "Bitcoin" },
    { value: "eth", label: "Ethereum" },
    { value: "sol", label: "Solana" },
    { value: "dot", label: "Polkadot", disabled: true },
  ]}
/>
<MultiSelect value={value} onValueChange={setValue} options={options} />
<MultiSelect disabled options={options} />
<MultiSelect error options={options} />

<FormField label="Tokens" required error="Required">
  <MultiSelect error placeholder="Select tokens..." options={tokens} />
</FormField>
```

**Props:** `value` (string[]), `onValueChange`, `placeholder`, `searchPlaceholder`, `emptyMessage`, `options` (array of `{ value, label, disabled? }`), `maxDisplayedTags` (default: 2), `disabled`, `error`, `size` (sm/md), `className`, `id`, `aria-describedby`. Forwards ref to trigger `<div>`.

**Sizes:** `sm` (Input sm padding) · `md` (Input md padding, default)

**Trigger:** Shows selected items as tags (pills) with per-tag dismiss buttons. When more items are selected than `maxDisplayedTags`, shows "+N more" overflow text. Clear-all button appears when any items are selected; chevron shows when empty. Single-row layout — tags overflow-clip rather than growing trigger height.

**Search:** Type to filter options by label. `emptyMessage` shown when no options match (default: "No results found."). Search clears after each selection.

**Selection:** Clicking an item toggles it (adds or removes). Dropdown stays open after selection for multi-toggle. Checkbox visuals on each item indicate selected state.

**Visuals:** Borderless flat fill, `rounded-2xl`. Trigger uses `<div role="button">` (not `<button>`) to allow nested dismiss buttons without HTML nesting violations.

**Error:** `error={true}` adds 3px `border-error-400` border, sets `aria-invalid`.

**Dropdown:** `rounded-2xl`, `bg-surface`, `border border-edge`, `shadow-brand`. Items highlight with `bg-muted`. Selected items show filled checkbox with check icon.

### ProgressBar

Determinate or indeterminate progress indicator with 3 sizes and optional description.

```tsx
import { ProgressBar, ProgressBarDescription } from "@aleph-front/ds/progress-bar";

// Determinate — value out of max (default 100)
<ProgressBar value={35} label="Upload progress" />

// Indeterminate — omit value
<ProgressBar label="Loading data" />

// With description (linked via aria-describedby)
<ProgressBar value={75} label="Deployment">
  <ProgressBarDescription>Deploying 3 of 4 services...</ProgressBarDescription>
</ProgressBar>

// Custom max
<ProgressBar value={3} max={5} label="Step progress" />

// Custom fill color via data-fill selector
<ProgressBar value={90} label="Critical" className="[&_[data-fill]]:bg-error-500" />
```

**Props:** `value` (number, omit for indeterminate), `max` (number, default 100), `label` (string, required — becomes `aria-label`), `size` (`"sm"` | `"md"` | `"lg"`, default `"md"`).

**Sizes:** `sm` = 4px, `md` = 6px (default), `lg` = 10px track height.

**Indeterminate mode:** Omit `value`. The fill bar animates a sliding loop. `aria-valuenow` is omitted per WAI-ARIA spec.

**Custom colors:** Target the fill via `[&_[data-fill]]` selector in className. Works with any Tailwind `bg-*` class.

### Stepper

Composable multi-step indicator with horizontal/vertical orientation. Unstyled by default — consumers apply visual treatment via `data-state` and `data-orientation` attribute selectors.

```tsx
import {
  Stepper, StepperList, StepperItem, StepperIndicator,
  StepperLabel, StepperDescription, StepperConnector,
} from "@aleph-front/ds/stepper";

<Stepper aria-label="Deployment wizard">
  <StepperList>
    <StepperItem state="completed">
      <StepperIndicator className="...">1</StepperIndicator>
      <StepperLabel className="...">Select</StepperLabel>
    </StepperItem>
    <StepperConnector />
    <StepperItem state="active">
      <StepperIndicator className="...">2</StepperIndicator>
      <StepperLabel className="...">Configure</StepperLabel>
      <StepperDescription className="...">Setting up...</StepperDescription>
    </StepperItem>
    <StepperConnector />
    <StepperItem state="inactive">
      <StepperIndicator className="...">3</StepperIndicator>
      <StepperLabel className="...">Deploy</StepperLabel>
    </StepperItem>
  </StepperList>
</Stepper>

// Vertical
<Stepper orientation="vertical" aria-label="Pipeline">
  ...
</Stepper>
```

**Parts:**

| Part | Element | Purpose |
|------|---------|---------|
| `Stepper` | `<nav>` | Root, carries `orientation` context |
| `StepperList` | `<ol>` | Ordered list container |
| `StepperItem` | `<li>` | Step, carries `state` context, sets `data-state` and `aria-current="step"` |
| `StepperIndicator` | `<div>` | Number/icon circle, inherits `data-state` |
| `StepperLabel` | `<span>` | Step title, inherits `data-state` |
| `StepperDescription` | `<span>` | Step subtitle, inherits `data-state` |
| `StepperConnector` | `<li>` | Line between steps, `aria-hidden`, inherits `data-orientation` |

**State:** `StepperItem` accepts `state` prop (`"completed"` | `"active"` | `"inactive"`, default `"inactive"`). State propagates as `data-state` to all child parts via React context. Style with `data-[state=completed]:`, `data-[state=active]:`, etc.

**Orientation:** `Stepper` accepts `orientation` (`"horizontal"` | `"vertical"`, default `"horizontal"`). Propagates as `data-orientation` to `StepperConnector` and layout classes on `StepperList`.

**Connectors are siblings:** `StepperConnector` must be a sibling of `StepperItem` in the list — not a child. Both render as `<li>`.

### Spinner

Animated loading indicator. Used internally by Button but available standalone.

```tsx
import { Spinner } from "@aleph-front/ds/ui/spinner";

<Spinner className="size-5 text-primary-600" />
```

### AppShellSidebar

Sidebar shell with expanded ↔ icon-rail collapse, accordion sections that persist their open/closed state, and a built-in collapse toggle at the bottom of the sidebar. Backed by two hooks for state.

```tsx
"use client";

import {
  AccordionSection,
  AppShellSidebar,
  NavItem,
} from "@aleph-front/ds/app-shell-sidebar";
import { useSidebarCollapse } from "@aleph-front/ds/use-sidebar-collapse";
import { Logo } from "@aleph-front/ds/logo";
import { Cpu, GridFour, HardDrives } from "@phosphor-icons/react/dist/ssr";

function Shell() {
  const { collapsed, toggle } = useSidebarCollapse();
  const isCollapsed = collapsed === true;

  return (
    <AppShellSidebar
      collapsed={collapsed}
      onToggle={toggle}
      appMark={
        <div className="flex items-center gap-2">
          <Logo className="h-4 text-foreground shrink-0" />
          {!isCollapsed && <span className="font-semibold text-sm">Network</span>}
        </div>
      }
    >
      <AccordionSection title="Dashboard" sectionId="dashboard">
        <NavItem href="/" icon={<GridFour size={14} />} active>Overview</NavItem>
      </AccordionSection>
      <AccordionSection title="Resources" sectionId="resources">
        <NavItem href="/nodes" icon={<HardDrives size={14} />}>Nodes</NavItem>
        <NavItem href="/vms" icon={<Cpu size={14} />}>VMs</NavItem>
      </AccordionSection>
    </AppShellSidebar>
  );
}
```

**Parts:**

| Part | Purpose |
|------|---------|
| `AppShellSidebar` | Root `<aside>` with collapse-aware width and a built-in CollapseToggle at the bottom |
| `AccordionSection` | Section with a clickable title row; persists open/closed under `sidebar.section.<sectionId>` |
| `NavItem` | Single nav row; icon + label, optional `active` (announces `aria-current="page"`) |

**`AppShellSidebar` props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `appMark` | `ReactNode` | yes | Slot for the logomark / app-name area at the top |
| `collapsed` | `boolean \| null` | yes | `true` = rail mode, `false` = expanded, `null` = hydrating (treated as expanded) |
| `onToggle` | `() => void` | yes | Called when the built-in collapse toggle is clicked |
| `children` | `ReactNode` | yes | `AccordionSection`s (and/or bare `NavItem`s) |
| `className` | `string` | no | Extra classes merged onto the `<aside>` |

**`AccordionSection` props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | yes | Title shown above the items |
| `sectionId` | `string` | yes | Storage key suffix — `sidebar.section.<sectionId>` |
| `defaultOpen` | `boolean` | no (default `true`) | Initial state when no value is in localStorage |
| `children` | `ReactNode` | yes | `NavItem`s |

**`NavItem` props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `href` | `string` | yes | Anchor target |
| `icon` | `ReactNode` | yes | Leading icon (visible in both expanded and rail mode) |
| `children` | `ReactNode` | yes | Label (hidden in rail mode via `rail-hide`) |
| `active` | `boolean` | no | Marks the current route; sets `aria-current="page"` and applies active styling |
| `onClick` | `() => void` | no | Optional handler (useful for closing mobile drawers) |

**Rail-hide pattern:** Section titles and item labels carry a `rail-hide` class; a single global CSS rule `[data-collapsed="true"] .rail-hide { display: none }` hides them when the root has `data-collapsed="true"`. Consumers configure one tree; the CSS rule handles the visual swap. See `docs/ARCHITECTURE.md` for the full pattern.

#### useSidebarCollapse()

```tsx
const { collapsed, setCollapsed, toggle } = useSidebarCollapse();
```

| Return field | Type | Description |
|------|------|-------------|
| `collapsed` | `boolean \| null` | `null` while hydrating (SSR-safe), then `true`/`false` |
| `setCollapsed` | `(next: boolean) => void` | Set explicitly |
| `toggle` | `() => void` | Flip the value |

State is persisted in `localStorage` under the key `sidebar.collapsed`. First render returns `null` so SSR / static-export output and client-hydrated render match.

#### useAccordionState(sectionId, defaultOpen?)

```tsx
const { open, setOpen, toggle } = useAccordionState("resources", true);
```

Same shape and SSR-safety as `useSidebarCollapse`. Storage key is `sidebar.section.<sectionId>`, so each section's open/closed state is keyed independently. `defaultOpen` (default `true`) is the value used when nothing is in localStorage yet.

`AccordionSection` already calls this hook internally; consumers only call it directly when they need to wire custom section UI outside the bundled `AccordionSection`.

### ProductStrip

Top bar listing the Aleph product family as tabs. Apps live on separate subdomains, so navigation is via full-page `<a>` (no SPA router). Declarative: consumers pass the current app via `activeId`.

```tsx
import { ProductStrip, type ProductApp } from "@aleph-front/ds/product-strip";

const APPS: ProductApp[] = [
  { id: "cloud",    label: "Cloud",    href: "https://app.aleph.cloud" },
  { id: "network",  label: "Network",  href: "https://network.aleph.cloud" },
  { id: "explorer", label: "Explorer", href: "https://explorer.aleph.cloud" },
  { id: "swap",     label: "Swap",     href: "https://swap.aleph.cloud" },
];

<ProductStrip apps={APPS} activeId="network" logoHref="https://aleph.cloud" />
```

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `apps` | `ProductApp[]` | yes | App definitions: `{ id, label, href }` |
| `activeId` | `string` | yes | `id` of the currently active app. Pass anything that does not match an entry (e.g. `""`) to render no active tab. |
| `logoHref` | `string` | yes | Anchor target for the logomark |
| `right` | `ReactNode` | no | Slot rendered flush-right (theme toggle, profile, etc.) |
| `className` | `string` | no | Extra classes merged onto the root container |

The active tab is announced via `aria-current="page"`; the nav element carries `aria-label="Aleph products"`.

---

## Token File Reference

All tokens live in `packages/ds/src/styles/tokens.css`. Three layers:

| Layer | CSS construct | Purpose |
|-------|--------------|---------|
| 1. Brand | `@theme { }` | Raw brand values (colors, gradients, shadows, fonts) — extends Tailwind |
| 2. Semantic | `:root { }` / `.theme-dark { }` | Purpose-driven tokens that swap per theme |
| 3. Tailwind bridge | `@theme inline { }` | Maps semantic tokens to Tailwind's `--color-*` namespace |

To modify tokens, edit `packages/ds/src/styles/tokens.css` directly. Changes propagate to all Tailwind classes automatically.

---

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
| `/components/progress-bar` | Determinate, indeterminate, sizes, description, custom max, animated, custom colors |
| `/components/skeleton` | Basic shapes, card loading, table row loading |
| `/components/tooltip` | Basic, sides, placement |

**Navigation**

| Route | Content |
|-------|---------|
| `/components/breadcrumb` | Default, custom separator, asChild routing |
| `/components/pagination` | Default, compact, sibling count |
| `/components/stepper` | Horizontal, vertical, interactive, minimal, all-completed |
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

**Application Shell**

| Route | Content |
|-------|---------|
| `/components/app-shell-sidebar` | Live (built-in collapse toggle, localStorage-persisted) + static expanded + static rail |
| `/components/product-strip` | Active states, right slot, unknown activeId |

Theme switcher in the sticky header toggles light/dark. Responsive layout with mobile drawer navigation (below `lg` breakpoint) and fixed desktop sidebar (`lg+`).

### Motion Sensitivity

All animated components respect `prefers-reduced-motion: reduce` via Tailwind's `motion-reduce:` variant:
- **Continuous animations** (pulse, spin): Disabled entirely with `motion-reduce:animate-none` (Skeleton, Spinner, StatusDot healthy pulse)
- **One-shot transitions** (clip-path, transform): Disabled with `motion-reduce:transition-none` (Checkbox, RadioGroup, Switch, Tooltip, Table sort chevron)
