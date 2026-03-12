# Badge Redesign

Redesign the Badge component to match the Figma spec: two fill modes (solid gradient fill, outlined), icon slots, uppercase heading font, and updated sizing.

**Figma source:** `ALEPH-CLOUD-TW-UIKIT` node `4259:11447`

**Breaking change:** The `default` variant changes from a subtle solid purple background to a vivid info gradient. All existing `<Badge>` and `<Badge variant="default">` usages will look different. This is intentional to match the Figma spec.

## Context

The current Badge has 5 color variants (`default`, `success`, `warning`, `error`, `info`), 2 sizes, and solid background fills. The Figma introduces:

- **Solid fill** with gradient backgrounds using existing DS gradient tokens
- **Outline fill** with colored borders and subtle solid backgrounds
- Optional left/right icon slots
- Uppercase bold italic heading font
- Updated rounding and padding

## Approach

**CVA compound variants** (Approach A). Add `fill` as a new CVA variant axis. Gradient fills go in CSS utility classes in tokens.css following the existing `gradient-fill-main` / `gradient-fill-lime` pattern. This keeps the established CVA pattern used across all DS components and preserves the `badgeVariants` export.

## Changes

### 1. tokens.css — New gradient-fill utility classes

Add four classes using existing CSS custom properties (`--gradient-success`, `--gradient-warning`, `--gradient-error`, `--gradient-info` are already defined):

```css
/* No hover/active states — badges are not interactive */
.gradient-fill-success { background: var(--gradient-success); }
.gradient-fill-warning { background: var(--gradient-warning); }
.gradient-fill-error   { background: var(--gradient-error); }
.gradient-fill-info    { background: var(--gradient-info); }
```

### 2. badge.tsx — Component redesign

#### New props

```ts
fill: "solid" | "outline"       // default: "solid"
iconLeft?: React.ReactNode       // optional icon before text
iconRight?: React.ReactNode      // optional icon after text
```

`fill` is used instead of `type` to avoid shadowing the HTML `type` attribute in `HTMLAttributes<HTMLSpanElement>`.

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

#### Solid fill — gradient backgrounds

| Variant | Fill class | Text |
|---------|-----------|------|
| default | `gradient-fill-info` | `text-neutral-950` |
| success | `gradient-fill-success` | `text-neutral-950` |
| warning | `gradient-fill-warning` | `text-neutral-950` |
| error | `gradient-fill-error` | `text-neutral-950` |
| info | `bg-neutral-100 dark:bg-neutral-800` | `text-neutral-700 dark:text-neutral-300` |

The `default` variant uses `gradient-fill-info` (the brand purple gradient) because the brand gradient IS the default visual identity. The `info` variant stays as a neutral/grey non-semantic badge.

The `gradient-info` endpoint is `#5100CD` (very dark purple, low luminance). Dark text has poor contrast on it. Use `text-white` for the info/default gradient variant specifically:

| Variant | Text override |
|---------|--------------|
| default | `text-neutral-950 dark:text-white` |
| success | `text-neutral-950` (bright gradient, dark text works) |
| warning | `text-neutral-950` (bright gradient, dark text works) |
| error | `text-neutral-950` (gradient light end is bright enough) |

#### Outline fill — border + subtle background

| Variant | Border | Background | Text |
|---------|--------|------------|------|
| default | `border-primary-300` | `bg-primary-100 dark:bg-primary-900/20` | `text-neutral-950 dark:text-white` |
| success | `border-success-400` | `bg-success-100 dark:bg-success-900/20` | `text-neutral-950 dark:text-neutral-100` |
| warning | `border-warning-400` | `bg-warning-100 dark:bg-warning-900/20` | `text-neutral-950 dark:text-neutral-100` |
| error | `border-error-400` | `bg-error-100 dark:bg-error-900/20` | `text-neutral-950 dark:text-neutral-100` |
| info | `border-neutral-300 dark:border-neutral-700` | `bg-neutral-100 dark:bg-neutral-800` | `text-neutral-700 dark:text-neutral-300` |

Outline fill gets a `border` base class. All borders are 1px.

#### Dark theme

- **Solid**: gradient fills are vivid on both backgrounds. Most use `text-neutral-950`; `default` variant uses `dark:text-white` for contrast on the dark `gradient-info` endpoint.
- **Outline**: backgrounds use `/20` opacity tokens for a faint colored wash. Borders stay the same on both themes. Text flips to light via `dark:text-neutral-100` (or `dark:text-white` for default).

#### Icon slots

Icon wrapper size varies with badge size for proportional scaling:
- **sm**: `size-2.5 shrink-0` (10px)
- **md**: `size-3 shrink-0` (12px)

Consumer passes any `ReactNode`, typically a Phosphor icon:

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
      fill: { solid: "", outline: "border" },
      size: {
        sm: "px-3 py-0.5 text-[10px]",
        md: "px-4 py-1 text-xs",
      },
    },
    compoundVariants: [
      // Solid — gradient fills with dark text
      { fill: "solid", variant: "default", className: "gradient-fill-info text-neutral-950 dark:text-white" },
      { fill: "solid", variant: "success", className: "gradient-fill-success text-neutral-950" },
      { fill: "solid", variant: "warning", className: "gradient-fill-warning text-neutral-950" },
      { fill: "solid", variant: "error", className: "gradient-fill-error text-neutral-950" },
      { fill: "solid", variant: "info", className: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300" },
      // Outline — border + subtle bg
      { fill: "outline", variant: "default", className: "border-primary-300 bg-primary-100 dark:bg-primary-900/20 text-neutral-950 dark:text-white" },
      { fill: "outline", variant: "success", className: "border-success-400 bg-success-100 dark:bg-success-900/20 text-neutral-950 dark:text-neutral-100" },
      { fill: "outline", variant: "warning", className: "border-warning-400 bg-warning-100 dark:bg-warning-900/20 text-neutral-950 dark:text-neutral-100" },
      { fill: "outline", variant: "error", className: "border-error-400 bg-error-100 dark:bg-error-900/20 text-neutral-950 dark:text-neutral-100" },
      { fill: "outline", variant: "info", className: "border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300" },
    ],
    defaultVariants: {
      variant: "default",
      fill: "solid",
      size: "md",
    },
  },
);
```

#### Component render

```tsx
const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant, fill, size, iconLeft, iconRight, className, children, ...rest }, ref) => {
    const iconSize = size === "sm" ? "size-2.5" : "size-3";
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, fill, size }), className)}
        {...rest}
      >
        {iconLeft && <span className={cn(iconSize, "shrink-0")}>{iconLeft}</span>}
        {children}
        {iconRight && <span className={cn(iconSize, "shrink-0")}>{iconRight}</span>}
      </span>
    );
  },
);

Badge.displayName = "Badge";
```

### 3. badge.test.tsx — Test updates

- Test `fill="solid"` renders gradient-fill class for each variant
- Test `fill="outline"` renders border class for each variant
- Test default fill is `"solid"` (no explicit fill prop)
- Test `iconLeft` renders icon wrapper span before children
- Test `iconRight` renders icon wrapper span after children
- Test both icons together
- Test icon wrapper has `size-2.5` for sm and `size-3` for md
- Test className merging still works
- Test `badgeVariants` export includes `fill` axis

### 4. Preview page — Updated examples

Update `apps/preview/src/app/components/badge/page.tsx` to showcase:
- Solid variants (all 5)
- Outline variants (all 5)
- Icon left / icon right examples
- Both sizes
- Dark mode rendering

### 5. DESIGN-SYSTEM.md — Doc updates

Update badge section with new `fill` prop, icon props, updated styling details, and code examples for both fill modes.
