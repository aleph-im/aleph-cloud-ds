# Badge Redesign

Redesign the Badge component to match the Figma spec: two types (primary gradient fill, secondary outlined), icon slots, uppercase heading font, and updated sizing.

**Figma source:** `ALEPH-CLOUD-TW-UIKIT` node `4259:11447`

## Context

The current Badge has 5 color variants (`default`, `success`, `warning`, `error`, `info`), 2 sizes, and solid background fills. The Figma introduces:

- **Primary type** with gradient fills using existing DS gradient tokens
- **Secondary type** with colored borders and subtle solid backgrounds
- Optional left/right icon slots
- Uppercase bold italic heading font
- Updated rounding and padding

## Approach

**CVA compound variants** (Approach A). Add `type` as a new CVA variant axis. Gradient fills go in CSS utility classes in tokens.css following the existing `gradient-fill-main` / `gradient-fill-lime` pattern. This keeps the established CVA pattern used across all DS components and preserves the `badgeVariants` export.

## Changes

### 1. tokens.css — New gradient-fill utility classes

Add four classes using existing CSS custom properties (`--gradient-success`, `--gradient-warning`, `--gradient-error`, `--gradient-info` are already defined):

```css
.gradient-fill-success { background: var(--gradient-success); }
.gradient-fill-warning { background: var(--gradient-warning); }
.gradient-fill-error   { background: var(--gradient-error); }
.gradient-fill-info    { background: var(--gradient-info); }
```

No hover/active states — badges are not interactive.

### 2. badge.tsx — Component redesign

#### New props

```ts
type: "primary" | "secondary"  // default: "primary"
iconLeft?: React.ReactNode      // optional icon before text
iconRight?: React.ReactNode     // optional icon after text
```

#### Base styles

| Property | Current | New |
|----------|---------|-----|
| Font | `font-sans font-semibold` | `font-heading font-extrabold italic uppercase` |
| Rounding | `rounded` (4px) | `rounded-md` (6px) |
| Padding (sm) | `px-2 py-0.5` | `px-3 py-0.5` |
| Padding (md) | `px-2.5 py-0.5` | `px-4 py-1` |
| Font size (sm) | `text-xs` | `text-[10px]` |
| Font size (md) | `text-sm` | `text-xs` |
| Layout | (none) | `gap-1.5` (for icon slots) |

#### Primary type — gradient fill, dark text

| Variant | Fill class | Text |
|---------|-----------|------|
| default | `gradient-fill-info` | `text-base-950` |
| success | `gradient-fill-success` | `text-base-950` |
| warning | `gradient-fill-warning` | `text-base-950` |
| error | `gradient-fill-error` | `text-base-950` |
| info | `bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300` | (unchanged neutral) |

#### Secondary type — border + subtle background

| Variant | Border | Background | Text |
|---------|--------|------------|------|
| default | `border-primary-300` | `bg-primary-100 dark:bg-primary-900/20` | `text-base-950` |
| success | `border-success-400` | `bg-success-100 dark:bg-success-900/20` | `text-base-950` |
| warning | `border-warning-400` | `bg-warning-100 dark:bg-warning-900/20` | `text-base-950` |
| error | `border-error-400` | `bg-error-100 dark:bg-error-900/20` | `text-base-950` |
| info | `border-neutral-300 dark:border-neutral-700` | `bg-neutral-100 dark:bg-neutral-800` | `text-neutral-700 dark:text-neutral-300` |

Secondary type gets a `border` base class. All borders are 1px.

#### Dark theme

- **Primary**: no `dark:` overrides needed — gradient fills are vivid on both backgrounds, `text-base-950` contrasts well
- **Secondary**: only background needs dark adjustment (the `/20` opacity values above), borders stay the same

#### Icon slots

Rendered as `<span className="size-3 shrink-0">` wrappers. Consumer passes any `ReactNode`, typically a Phosphor icon at `size={12}`:

```tsx
<Badge variant="success" iconLeft={<CheckCircle size={12} />}>
  Active
</Badge>
```

#### CVA structure

```ts
const badgeVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-md font-heading font-extrabold italic uppercase whitespace-nowrap select-none",
  {
    variants: {
      variant: { default: "", success: "", warning: "", error: "", info: "" },
      type: { primary: "", secondary: "border" },
      size: {
        sm: "px-3 py-0.5 text-[10px]",
        md: "px-4 py-1 text-xs",
      },
    },
    compoundVariants: [
      // Primary
      { type: "primary", variant: "default", className: "gradient-fill-info text-base-950" },
      { type: "primary", variant: "success", className: "gradient-fill-success text-base-950" },
      { type: "primary", variant: "warning", className: "gradient-fill-warning text-base-950" },
      { type: "primary", variant: "error", className: "gradient-fill-error text-base-950" },
      { type: "primary", variant: "info", className: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300" },
      // Secondary
      { type: "secondary", variant: "default", className: "border-primary-300 bg-primary-100 dark:bg-primary-900/20 text-base-950" },
      { type: "secondary", variant: "success", className: "border-success-400 bg-success-100 dark:bg-success-900/20 text-base-950" },
      { type: "secondary", variant: "warning", className: "border-warning-400 bg-warning-100 dark:bg-warning-900/20 text-base-950" },
      { type: "secondary", variant: "error", className: "border-error-400 bg-error-100 dark:bg-error-900/20 text-base-950" },
      { type: "secondary", variant: "info", className: "border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300" },
    ],
    defaultVariants: {
      variant: "default",
      type: "primary",
      size: "md",
    },
  },
);
```

#### Component render

```tsx
const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant, type, size, iconLeft, iconRight, className, children, ...rest }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant, type, size }), className)}
      {...rest}
    >
      {iconLeft && <span className="size-3 shrink-0">{iconLeft}</span>}
      {children}
      {iconRight && <span className="size-3 shrink-0">{iconRight}</span>}
    </span>
  ),
);
```

### 3. badge.test.tsx — Test updates

- Test `type="primary"` renders gradient-fill class
- Test `type="secondary"` renders border class
- Test `iconLeft` / `iconRight` render icon wrapper spans
- Test default type is `"primary"`
- Existing variant/size tests updated for new class names

### 4. Preview page — Updated examples

Update `apps/preview/src/app/components/badge/page.tsx` to showcase:
- Primary variants (all 5)
- Secondary variants (all 5)
- Icon left / icon right examples
- Both sizes

### 5. DESIGN-SYSTEM.md — Doc updates

Update badge section with new `type` prop, icon props, updated styling details, and code examples.
