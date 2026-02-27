# Architecture

Technical patterns and decisions.

---

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, static export) |
| Language | TypeScript 5.9 (strict) |
| Styling | Tailwind CSS 4 + CSS custom properties |
| Database | None |
| Deployment | Static export (`out/` directory) |

---

## Project Structure

```
src/
├── app/
│   ├── globals.css       # Tailwind + token imports + @source
│   ├── layout.tsx        # Root layout with font loading
│   └── page.tsx          # Preview page
├── components/
│   ├── button/
│   │   ├── button.tsx    # Button component (CVA variants)
│   │   └── button.test.tsx
│   ├── ui/
│   │   └── spinner.tsx   # Animated loading spinner
│   ├── preview-tabs.tsx  # Tab navigation
│   ├── theme-switcher.tsx # Light/dark toggle
│   └── tabs/
│       ├── components-tab.tsx  # Button showcase
│       ├── colors-tab.tsx
│       ├── typography-tab.tsx
│       ├── spacing-tab.tsx
│       ├── effects-tab.tsx
│       └── icons-tab.tsx
├── lib/
│   └── cn.ts             # clsx + tailwind-merge utility
└── styles/
    └── tokens.css        # Three-layer token system + gradient border classes
docs/
├── DESIGN-SYSTEM.md      # Token & component reference (agent-optimized)
├── ARCHITECTURE.md       # Technical patterns (this file)
├── DECISIONS.md          # Decision log with rationale
├── BACKLOG.md            # Deferred work and ideas
└── plans/                # Design + implementation plans
```

---

## Import Alias

All source imports use the `@ac/*` prefix, resolved to `./src/*`.

| Configured in | Mechanism |
|---------------|-----------|
| `tsconfig.json` | `paths: { "@ac/*": ["./src/*"] }` |
| `vitest.config.ts` | `resolve.alias: { "@ac": "./src" }` |

**CSS imports are the exception** — PostCSS does not resolve tsconfig aliases, so `@import` paths in `.css` files must be relative (see Decision #5).

---

## Patterns

### Three-Layer Token Architecture

**Context:** Need design tokens that work with Tailwind utilities AND support theming.

**Approach:** Layer 1 (`@theme`) defines raw brand values. Layer 2 (`:root`/`.theme-dark`) defines semantic tokens as CSS custom properties. Layer 3 (`@theme inline`) maps semantic tokens to Tailwind's color system.

**Key files:** `src/styles/tokens.css`

**Notes:** `@theme inline` tells Tailwind to resolve at runtime (not compile time), enabling theme switching.

### Theme Switching

**Context:** Support light/dark themes without JS-based CSS-in-JS.

**Approach:** Toggle `.theme-dark` class on `<html>` element. CSS custom properties in `:root` vs `.theme-dark` swap automatically. A `@custom-variant dark` in `globals.css` registers the `dark:` Tailwind variant to match `.theme-dark`, enabling `dark:text-error-300` etc. in components.

**Key files:** `src/styles/tokens.css`, `src/app/globals.css`, `src/components/theme-switcher.tsx`

**Adding more themes:** Use the same `@custom-variant` pattern (e.g., `@custom-variant contrast (&:where(.theme-contrast, .theme-contrast *))`). Add corresponding CSS custom property blocks in `tokens.css`.

### CVA Variant Pattern

**Context:** Need type-safe component variants without CSS-in-JS or manual class string management.

**Approach:** Use Class Variance Authority (`cva`) to define variant maps. Each variant is an object key mapping to Tailwind class strings. `defaultVariants` sets fallbacks. The `cn()` utility (clsx + tailwind-merge) handles conditional classes and Tailwind conflict resolution.

**Key files:** `src/components/button/button.tsx`, `src/lib/cn.ts`

**Adding a new variant:** Add an entry to the `variants` object inside the `cva()` call. The variant key becomes the prop value (e.g., `variant="ghost"` → add `ghost: "..."` to the variant map). TypeScript infers the new prop value automatically.

### Custom CSS Classes for Complex Effects

**Context:** Some CSS effects (gradient borders, complex backgrounds) require multiple properties working together and can't be expressed as plain Tailwind utilities.

**Approach:** Define plain CSS classes in `tokens.css`, colocated with the tokens they consume. Include interactive states (`:hover`, `:active`) directly in the class so components just apply a single class name. Plain CSS avoids Tailwind's `@media (hover: hover)` wrapping, which causes Turbopack CSS parser issues with `var()` in nested hover contexts.

**Key files:** `src/styles/tokens.css` (after the Layer 3 Tailwind bridge block)

**Why not `@utility`?** Tailwind 4's `@utility` wraps `:hover` in `@media (hover: hover)`, and Turbopack's CSS optimizer can't parse `var()` in that nesting. Plain CSS classes avoid this.

**Decision framework — when a style can't be a plain Tailwind class:**

1. **First choice: Tailwind utility or arbitrary value** — if the effect can be a single `[property:value]` in a class string, use it inline.
2. **Second choice: plain CSS class in `tokens.css`** — if the effect requires multiple CSS properties working together (e.g., `background-clip` + `background` + `border-color`), extract to a CSS class with interactive states baked in.
3. **Never: custom classes in `globals.css`** — `globals.css` is for Tailwind imports, content sources, variant registrations, and base element styles only.

**Example:** `border-gradient-main` uses the background-clip trick for gradient borders with rounded corners. Each state has the full `background` declaration referencing color scale tokens.

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

```tsx
/* Component just applies the class — interactive states are built in */
"border-gradient-main text-primary-700",
```

### cn() Utility

**Context:** Tailwind classes can conflict (e.g., `bg-red-500` and `bg-blue-500` both present). Need predictable overrides when merging conditional classes.

**Approach:** `cn(...inputs)` composes `clsx` (conditional joining) with `twMerge` (Tailwind-aware deduplication). Always use `cn()` instead of template literals for class composition in components.

**Key files:** `src/lib/cn.ts`

---

## Recipes

### Adding a New Semantic Token

1. Add light value to `:root` block in `src/styles/tokens.css`
2. Add dark value to `.theme-dark` block
3. Add Tailwind mapping in `@theme inline` block (e.g., `--color-new-token: var(--new-token)`)
4. Use as Tailwind class: `bg-new-token`, `text-new-token`, etc.

### Adding a Gradient Border Class

1. Add `.border-gradient-<name>` in `src/styles/tokens.css` after the existing gradient border classes
2. Set `border-color: transparent` and the full `background` with `padding-box` / `border-box` clip
3. Add `:hover` and `:active` selectors with the appropriate fill color stops
4. In components, apply the class name — no hover overrides needed
5. Document in `docs/DESIGN-SYSTEM.md` § Gradient Border Utilities

### Adding a New Component

1. Create `src/components/<name>/<name>.tsx` (or `src/components/ui/<name>.tsx` for primitives)
2. Use CVA for variants, `cn()` for class merging, `forwardRef` for DOM access
3. Colocate tests as `<name>.test.tsx` in the same directory
4. Export from the component file directly — no barrel `index.ts` files
5. Add a showcase section in the relevant tab under `src/components/tabs/`
6. Document usage in `docs/DESIGN-SYSTEM.md` § Components
