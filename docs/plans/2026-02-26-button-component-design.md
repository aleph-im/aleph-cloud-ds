# Button Component Design

Date: 2026-02-26

## Overview

First component in the Aleph Cloud design system. Clean, modern button with CVA-based variant system, OKLCH color scales, and no legacy Neon/glow effects.

## Color Scales

Full OKLCH 50–950 scales for all semantic colors. Replace existing bare semantic tokens (`--primary`, `--background`, etc.) — no backward compatibility layer.

### Scales

| Color | Base hex | Use |
|-------|----------|-----|
| `primary` | `#5100CD` (brand purple) | Primary actions, brand UI |
| `accent` | `#D4FF00` (brand lime) | Highlights, CTAs |
| `success` | `#36D846` | Success states |
| `warning` | `#FBAE18` | Warning states |
| `error` | `#DE3668` | Danger/destructive |
| `neutral` | `#6B7280` | Borders, muted text, secondary |

Each gets 11 stops: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950.

- 50 — lightest tint (backgrounds)
- 500 — close to base color
- 950 — near-black

All defined in OKLCH for Tailwind `/opacity` modifier support (`bg-primary-100/20`).

### Token Architecture

Scales go in Layer 1 (`@theme`) of `tokens.css`. Layer 2 (`:root`/`.theme-dark`) keeps theme-switching tokens like `--background`, `--foreground`, `--card`, etc. but individual color tokens like `--primary` get replaced by the scale. Layer 3 (`@theme inline`) maps all scale stops to Tailwind.

## Button API

```tsx
import { Button } from "@ac/components/button";

<Button variant="primary" size="md">Deploy</Button>

<Button variant="outline" size="lg" iconLeft={<PlusIcon />}>
  Add Node
</Button>

<Button variant="primary" loading>Deploying...</Button>

<Button variant="text" asChild>
  <a href="/docs">Documentation</a>
</Button>

<Button variant="destructive" disabled>Delete</Button>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"primary" \| "secondary" \| "outline" \| "text" \| "destructive" \| "warning"` | `"primary"` | Visual style |
| `size` | `"xs" \| "sm" \| "md" \| "lg"` | `"md"` | Size |
| `iconLeft` | `ReactNode` | — | Icon before label |
| `iconRight` | `ReactNode` | — | Icon after label |
| `loading` | `boolean` | `false` | Shows spinner, disables button |
| `disabled` | `boolean` | `false` | Disabled state |
| `asChild` | `boolean` | `false` | Render as child element (for links) |
| `className` | `string` | — | Additional classes |

Plus all native `ButtonHTMLAttributes`.

### asChild Pattern

Instead of a polymorphic `as` prop, `asChild` merges button styles onto the child element. Works with `<a>`, Next.js `<Link>`, router links, etc. Implemented with `React.cloneElement` — no Radix dependency.

## Variants

### Primary — high emphasis, solid fill

| State | Background | Text | Border |
|-------|-----------|------|--------|
| Default | `primary-600` | `white` | none |
| Hover | `primary-700` | `white` | none |
| Active | `primary-800` | `white` | none |
| Disabled | `primary-600/50` | `white/50` | none |

### Secondary — medium emphasis, tinted fill

| State | Background | Text | Border |
|-------|-----------|------|--------|
| Default | `primary-100` | `primary-700` | none |
| Hover | `primary-200` | `primary-800` | none |
| Active | `primary-300` | `primary-800` | none |
| Disabled | `primary-100/50` | `primary-700/50` | none |

### Outline — low emphasis, border only

| State | Background | Text | Border |
|-------|-----------|------|--------|
| Default | `transparent` | `foreground` | `neutral-300` |
| Hover | `neutral-50` | `foreground` | `neutral-400` |
| Active | `neutral-100` | `foreground` | `neutral-400` |
| Disabled | `transparent` | `foreground/50` | `neutral-300/50` |

### Text — minimal, text only

| State | Background | Text | Border |
|-------|-----------|------|--------|
| Default | `transparent` | `primary-600` | none |
| Hover | `primary-50` | `primary-700` | none |
| Active | `primary-100` | `primary-800` | none |
| Disabled | `transparent` | `primary-600/50` | none |

### Destructive — danger actions

| State | Background | Text | Border |
|-------|-----------|------|--------|
| Default | `error-600` | `white` | none |
| Hover | `error-700` | `white` | none |
| Active | `error-800` | `white` | none |
| Disabled | `error-600/50` | `white/50` | none |

### Warning — caution actions

| State | Background | Text | Border |
|-------|-----------|------|--------|
| Default | `warning-500` | `warning-950` | none |
| Hover | `warning-600` | `warning-950` | none |
| Active | `warning-700` | `warning-950` | none |
| Disabled | `warning-500/50` | `warning-950/50` | none |

### Focus Ring (all variants)

`ring-2 ring-primary-400 ring-offset-2`

## Sizes

| Size | Height | Padding X | Font | Icon size | Gap |
|------|--------|-----------|------|-----------|-----|
| `xs` | `h-7` (28px) | `px-2` | `font-heading text-xs font-extrabold` | 14px | `gap-1` |
| `sm` | `h-8` (32px) | `px-3` | `font-heading text-sm font-extrabold` | 16px | `gap-1.5` |
| `md` | `h-9` (36px) | `px-4` | `font-heading text-sm font-extrabold` | 16px | `gap-2` |
| `lg` | `h-10` (40px) | `px-5` | `font-heading text-base font-extrabold` | 20px | `gap-2` |

All sizes: `font-heading font-extrabold`, no italic.

## Component Architecture

### File Structure

```
src/components/
├── button/
│   ├── button.tsx          # Component + CVA variants
│   └── button.test.ts      # Tests
└── ui/
    └── spinner.tsx          # Loading spinner (shared)
```

### Dependencies

| Package | Purpose | Size |
|---------|---------|------|
| `class-variance-authority` | Variant class maps | ~1KB |
| `clsx` | Class merging (CVA peer dep) | ~0.3KB |
| `tailwind-merge` | Resolve Tailwind class conflicts from className | ~3KB |

### CVA Pattern

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center font-heading font-extrabold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 disabled:bg-primary-600/50 disabled:text-white/50",
        secondary: "bg-primary-100 text-primary-700 hover:bg-primary-200 ...",
        // ... etc
      },
      size: {
        xs: "h-7 px-2 text-xs gap-1",
        sm: "h-8 px-3 text-sm gap-1.5",
        md: "h-9 px-4 text-sm gap-2",
        lg: "h-10 px-5 text-base gap-2",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);
```

### Preview App

New "Components" tab in the preview app to showcase all button variants, sizes, and states.

## Out of Scope

- Icon animations (deferred to backlog)
- Icon library (slots accept any ReactNode)
- Storybook (preview app serves this purpose)
- Full-skin tokenization of structural values (radii, heights, padding) — use plain Tailwind, tokenize later if needed
- Neon/glow effects (dropped from new brand)
- Color prop (variant determines color)
- fullWidth prop (layout concern for parent)
