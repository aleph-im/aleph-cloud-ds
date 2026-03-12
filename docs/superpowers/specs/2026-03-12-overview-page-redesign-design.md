# Overview Page Redesign — Interactive Showcase

## Context

The preview app's overview page (`apps/preview/src/app/page.tsx`) is outdated: it lists only 5 of 6 foundations and 4 of 22 components in plain bordered cards. No branding, no visual hierarchy, and no sense of what the DS actually looks like in use.

We're redesigning it as an interactive showcase inspired by shadcn/ui — a bold hero section followed by composed UI blocks that show DS components working together in realistic contexts, not just individual demos.

## Design

### Hero Section

Full-width banner (bleeds past `max-w-4xl`) using:
- `gradient-fill-main` background
- `fx-grain-lg` texture overlay
- `LogoFull` component in white (`text-white`)
- Tagline in `font-heading italic`
- Subtitle in `text-white/70`
- Stats row: 3 `Badge` components (default variant) showing "Components", "Foundations", "Dark Mode" (no exact counts — avoids staleness)

The hero lives inside the page component but uses negative margins or a wrapper to escape the `max-w-4xl` content constraint.

### Showcase Blocks

Six composed blocks below the hero, inside `max-w-4xl`. Each block has a subtle label above it and is wrapped in a `Card`. Layout:

```
Row 1: [Node Status Dashboard ─────────────────── full width]
Row 2: [Settings Panel ──────────── 1/2] [Auth Form ────────── 1/2]
Row 3: [Data Table with Controls ──────────────── full width]
Row 4: [Notification Stack ──────── 1/2] [Resource Card ────── 1/2]
```

Grid: `grid grid-cols-1 md:grid-cols-2 gap-6` with full-width blocks using `md:col-span-2`.

#### Block 1: Node Status Dashboard (full width)

A `Card` containing:
- `TabsList` (underline is the default variant, no prop needed) with two `TabsTrigger`s: "All Nodes", "Alerts"
- "All Nodes" tab content: `Table` with columns:
  - Node: `CopyableText` with truncated hash (e.g., `0x7a3f...b2c1`)
  - Status: `StatusDot` + text label
  - Type: `Badge` (default for CPU, info for GPU)
  - Region: plain text
- "Alerts" tab content: 2-3 compact `Alert` components (warning/error)
- Static data — no state management needed beyond Tabs

Components used: Card, Tabs, TabsList, TabsTrigger, TabsContent, Table, CopyableText, StatusDot, Badge, Alert

#### Block 2: Settings Panel (half width)

A `Card` with title "Instance Settings" containing:
- `FormField` + `Input` (label: "Instance Name")
- `FormField` + `Select` (label: "Region", options: EU West, US East, AP South)
- `FormField` + `Slider` (label: "CPU Cores", range 1-16, default 4)
- A row with label + `Switch` ("Auto-scaling")
- Button row: `Button` variant="primary" "Save" + `Button` variant="outline" "Cancel"

Components used: Card, FormField, Input, Select, Slider, Switch, Button

#### Block 3: Auth Form (half width)

A `Card` (centered content) containing:
- `Logo` component at top (not LogoFull — just the mark)
- Heading "Sign In" in `font-heading`
- `FormField` + `Input` type="email" (label: "Email")
- `FormField` + `Input` type="password" (label: "Password")
- Row: `Checkbox` + label "Remember me"
- `Button` variant="primary" full width "Sign In"
- Subtle text link below: "Forgot password?"

Components used: Card, Logo, FormField, Input, Checkbox, Button

#### Block 4: Data Table with Controls (full width)

A `Card` containing:
- Filter row: `Input` (placeholder "Search...") + `Select` (Status filter: All, Active, Inactive)
- `Table` with sortable columns:
  - Name (sortable)
  - Status: `Badge` (success="Active", default="Inactive")
  - Created: date string (sortable)
  - Actions: `Button` variant="text" size="xs" "View"
- `Pagination` below the table: `page={page} totalPages={5} siblingCount={1} onPageChange={setPage}` — uses `useState` for interactive page switching (data stays the same, just demonstrates the component)

Components used: Card, Input, Select, Table, Badge, Button, Pagination

#### Block 5: Notification Stack (half width)

Vertical stack (no Card wrapper — alerts are self-contained). Uses `useState` to track visible alerts, with `onDismiss` callbacks that remove alerts from state:
- `Alert` variant="success" title="Deployment Complete" — "Instance xyz deployed to EU West." (static, no dismiss)
- `Alert` variant="warning" title="Storage Warning" — "Usage at 85%. Consider upgrading." (static, no dismiss)
- `Alert` variant="error" title="Node Offline" onDismiss={remove from state} — "Node 0x7a3f lost connectivity."
- `Alert` variant="info" onDismiss={remove from state} dismissAfter={10000} — "Scheduled maintenance on March 15."

Components used: Alert (all 4 variants). Requires client state for dismissable alerts.

#### Block 6: Resource Overview Card (half width)

A `Card` variant="noise" (grain texture) containing:
- `Breadcrumb` at top: Dashboard > Resources > Compute
- Heading "Compute Resources" in `font-heading`
- `Badge` variant="info" "Pro Plan"
- Resource bars (3 rows, each a label + `Slider` disabled with value set). The disabled Slider renders with reduced opacity and non-interactive thumbs — acceptable for a showcase. Not a semantic progress bar, but visually communicates usage:
  - CPU: 65% (value={[65]} max={100} disabled)
  - Memory: 42% (value={[42]} max={100} disabled)
  - Storage: 78% (value={[78]} max={100} disabled)
- Button row: `Button` variant="primary" "Upgrade" + `Button` variant="outline" "Details"

Components used: Card (noise), Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage, Badge, Slider, Button

### Quick Links Footer

Below the showcase, a section with heading "Explore" containing card links grouped by category:

- **Foundations**: Colors, Typography, Spacing, Effects, Icons, Logo
- **Components** by group: Actions, Data Display, Feedback, Navigation, Forms

Each link is a small card (`rounded-lg border border-edge p-3 hover:border-primary hover:shadow-brand-sm transition-all`) with the component name and a one-line description. Grid layout: `grid gap-3 sm:grid-cols-2 lg:grid-cols-3`.

Groups are separated by a group heading label.

## File Changes

- `apps/preview/src/app/page.tsx` — complete rewrite (single file, all blocks inline)

No new files needed. All components are imported from `@aleph-front/ds/*`. The entire page is marked `"use client"` since 5 of 6 blocks require client interactivity (Tabs, Pagination, Switch, Slider, dismissible Alerts). Splitting into many small client wrappers would add complexity for no benefit.

## Component Import Paths

```typescript
import { LogoFull, Logo } from "@aleph-front/ds/logo";
import { Button } from "@aleph-front/ds/button";
import { Card } from "@aleph-front/ds/card";
import { Badge } from "@aleph-front/ds/badge";
import { StatusDot } from "@aleph-front/ds/status-dot";
import { Alert } from "@aleph-front/ds/alert";
import { Table, type Column } from "@aleph-front/ds/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@aleph-front/ds/tabs";
import { Input } from "@aleph-front/ds/input";
import { Select } from "@aleph-front/ds/select";
import { Switch } from "@aleph-front/ds/switch";
import { Slider } from "@aleph-front/ds/slider";
import { Checkbox } from "@aleph-front/ds/checkbox";
import { FormField } from "@aleph-front/ds/form-field";
import { CopyableText } from "@aleph-front/ds/copyable-text";
import { Pagination } from "@aleph-front/ds/pagination";
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem,
  BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage,
} from "@aleph-front/ds/breadcrumb";
```

## Verification

1. `npm run build` — static export succeeds
2. `npm run dev` — visually confirm:
   - Hero renders with gradient + grain + logo
   - All 6 blocks render correctly with live components
   - Tabs switch between content
   - Alerts dismiss
   - Pagination clicks work
   - Theme toggle (light/dark) works correctly on all blocks
3. `npm run check` — lint + typecheck + test pass
