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
│   ├── globals.css       # Tailwind + token imports
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
    └── tokens.css        # Three-layer token system (OKLCH scales)
docs/
├── plans/                # Design + implementation plans
├── ARCHITECTURE.md
├── DECISIONS.md
└── BACKLOG.md
```

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
