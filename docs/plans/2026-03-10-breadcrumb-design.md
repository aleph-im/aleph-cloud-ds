# Breadcrumb Component Design

## Overview

Navigational breadcrumb for the Aleph Cloud DS. Composable API (like Tabs/Tooltip), semantic HTML, links with `asChild` support for framework routing.

## Source

Figma: `IgJMbTgEnoJlJKQonQFBA6` node `555:7013`

## API

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

## Parts

| Part | Element | Purpose |
|------|---------|---------|
| `Breadcrumb` | `<nav aria-label="Breadcrumb">` | Semantic landmark wrapper |
| `BreadcrumbList` | `<ol>` | Ordered list with flex layout |
| `BreadcrumbItem` | `<li>` | List item wrapper |
| `BreadcrumbLink` | `<a>` | Navigational link, supports `asChild` via Radix Slot |
| `BreadcrumbSeparator` | `<li aria-hidden="true">` | Visual separator, defaults to `/`, accepts custom children |
| `BreadcrumbPage` | `<span aria-current="page">` | Current page label (no link) |

## Styling

- Font: `font-heading font-extrabold italic uppercase text-xs`
- Link color: `text-foreground` with `hover:text-primary-600 dark:hover:text-primary-400`
- Current page: `text-muted` (dimmer, not interactive)
- Separator: `text-muted`, same font treatment
- Layout: `flex flex-wrap items-center gap-1`
- Transition: `transition-colors duration-150` on links
- Motion: `motion-reduce:transition-none` on links

## Architecture

- No CVA — no variant combinations to manage
- No `"use client"` — no state or effects, works as server component
- `asChild` on `BreadcrumbLink` via Radix `Slot` for Next.js `<Link>` compatibility
- `forwardRef` on all parts for consumer ref access
- `className` merge via `cn()` on all parts

## Accessibility

- `<nav aria-label="Breadcrumb">` landmark
- `<ol>` for semantic ordering
- `aria-current="page"` on `BreadcrumbPage`
- `aria-hidden="true"` on separators
- Standard link keyboard behavior (tab, enter)

## Tests

- Renders `nav > ol > li` structure
- `BreadcrumbPage` has `aria-current="page"`
- `BreadcrumbSeparator` has `aria-hidden="true"`
- `BreadcrumbSeparator` renders `/` by default, custom children when provided
- `BreadcrumbLink` renders `<a>` with href
- `BreadcrumbLink` with `asChild` renders custom element
- `className` forwarding on all parts
- Custom `aria-label` on `Breadcrumb` overrides default

## Files

- `packages/ds/src/components/breadcrumb/breadcrumb.tsx`
- `packages/ds/src/components/breadcrumb/breadcrumb.test.tsx`
- `apps/preview/src/app/components/breadcrumb/page.tsx`
- Subpath export: `"./breadcrumb"` in `packages/ds/package.json`
- Sidebar entry in `apps/preview/src/components/sidebar.tsx`
