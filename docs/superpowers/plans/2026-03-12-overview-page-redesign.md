# Overview Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the outdated overview page with an interactive showcase featuring a branded hero and 6 composed UI blocks demonstrating DS components in realistic contexts.

**Architecture:** Single-file rewrite of the overview page (`apps/preview/src/app/page.tsx`). The page is `"use client"` since most blocks need interactivity. All components imported from `@aleph-front/ds/*`. Static mock data defined inline — no API calls or external data.

**Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS 4, DS components, DS tokens (OKLCH color scales, gradient-fill-main, fx-grain-lg)

**Spec:** `docs/superpowers/specs/2026-03-12-overview-page-redesign-design.md`

---

## Chunk 1: Page Scaffold + Hero

### Task 1: Page scaffold with hero section

**Files:**
- Rewrite: `apps/preview/src/app/page.tsx`

The hero needs to escape the parent `max-w-4xl` constraint. The parent chain is: `main.px-4.sm:px-8.py-6.sm:py-8 > div.mx-auto.max-w-4xl > page`. Use negative margins to bleed to the main element edges.

- [ ] **Step 1: Rewrite page.tsx with hero + empty showcase grid**

```tsx
"use client";

import { useState } from "react";
import { LogoFull, Logo } from "@aleph-front/ds/logo";
import { Button } from "@aleph-front/ds/button";
import { Card } from "@aleph-front/ds/card";
import { Badge } from "@aleph-front/ds/badge";
import { StatusDot } from "@aleph-front/ds/status-dot";
import { Alert } from "@aleph-front/ds/alert";
import { Table, type Column } from "@aleph-front/ds/table";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@aleph-front/ds/tabs";
import { Input } from "@aleph-front/ds/input";
import { Select } from "@aleph-front/ds/select";
import { Switch } from "@aleph-front/ds/switch";
import { Slider } from "@aleph-front/ds/slider";
import { Checkbox } from "@aleph-front/ds/checkbox";
import { FormField } from "@aleph-front/ds/form-field";
import { CopyableText } from "@aleph-front/ds/copyable-text";
import { Pagination } from "@aleph-front/ds/pagination";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@aleph-front/ds/breadcrumb";

export default function OverviewPage() {
  return (
    <>
      {/* Hero — bleeds past max-w-4xl */}
      <div className="-mx-4 sm:-mx-8 -mt-6 sm:-mt-8 mb-12">
        <div className="gradient-fill-main fx-grain-lg px-6 py-16 sm:py-20 text-center">
          <LogoFull className="mx-auto h-10 sm:h-12 text-white mb-6" />
          <p className="font-heading text-2xl sm:text-3xl font-extrabold italic text-white mb-3">
            Build with confidence
          </p>
          <p className="text-white/70 max-w-lg mx-auto mb-6">
            Tokens-first design system with OKLCH color scales,
            semantic theming, and accessible components.
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            <Badge>Components</Badge>
            <Badge>Foundations</Badge>
            <Badge>Dark Mode</Badge>
          </div>
        </div>
      </div>

      {/* Showcase grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {/* Blocks will be added in subsequent tasks */}
      </div>
    </>
  );
}
```

- [ ] **Step 2: Verify hero renders**

Run: `npm run build 2>&1 | tail -5`
Expected: Build succeeds, `/` route listed in output.

- [ ] **Step 3: Commit**

```bash
git add apps/preview/src/app/page.tsx
git commit -m "feat(preview): scaffold overview page with hero section"
```

---

## Chunk 2: Blocks 1–3 (Node Dashboard, Settings, Auth)

### Task 2: Block 1 — Node Status Dashboard (full width)

**Files:**
- Modify: `apps/preview/src/app/page.tsx`

Add the Node Status Dashboard block inside the showcase grid. Uses static mock data for nodes.

- [ ] **Step 1: Add mock data and NodeDashboard block**

Add above the `OverviewPage` component:

```tsx
/* ── Mock data ────────────────────────────────── */

type Node = {
  id: string;
  status: "healthy" | "degraded" | "error" | "offline";
  statusLabel: string;
  type: string;
  typeVariant: "default" | "info";
  region: string;
};

const NODES: Node[] = [
  {
    id: "0x7a3f8b2c1d4e5f60a9b8c7d6e5f4a3b2",
    status: "healthy",
    statusLabel: "Running",
    type: "GPU",
    typeVariant: "info",
    region: "EU West",
  },
  {
    id: "0x1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f",
    status: "healthy",
    statusLabel: "Running",
    type: "CPU",
    typeVariant: "default",
    region: "US East",
  },
  {
    id: "0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c",
    status: "degraded",
    statusLabel: "High Load",
    type: "GPU",
    typeVariant: "info",
    region: "AP South",
  },
  {
    id: "0x4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e",
    status: "error",
    statusLabel: "Offline",
    type: "CPU",
    typeVariant: "default",
    region: "US East",
  },
];

const NODE_COLUMNS: Column<Node>[] = [
  {
    header: "Node",
    accessor: (row) => <CopyableText text={row.id} size="sm" />,
  },
  {
    header: "Status",
    accessor: (row) => (
      <span className="inline-flex items-center gap-2">
        <StatusDot status={row.status} size="sm" />
        <span className="text-sm">{row.statusLabel}</span>
      </span>
    ),
  },
  {
    header: "Type",
    accessor: (row) => (
      <Badge variant={row.typeVariant} size="sm">
        {row.type}
      </Badge>
    ),
  },
  {
    header: "Region",
    accessor: (row) => row.region,
  },
];
```

Then inside the showcase grid, add as the first child:

```tsx
{/* Block 1: Node Status Dashboard */}
<Card className="md:col-span-2" padding="lg">
  <Tabs defaultValue="nodes">
    <TabsList>
      <TabsTrigger value="nodes">All Nodes</TabsTrigger>
      <TabsTrigger value="alerts">Alerts</TabsTrigger>
    </TabsList>
    <TabsContent value="nodes">
      <Table
        columns={NODE_COLUMNS}
        data={NODES}
        keyExtractor={(row) => row.id}
      />
    </TabsContent>
    <TabsContent value="alerts">
      <div className="space-y-3 py-2">
        <Alert variant="warning" title="High Load">
          Node 0x9f8e...5d4c CPU usage at 94%.
        </Alert>
        <Alert variant="error" title="Connection Lost">
          Node 0x4b5c...8d9e unreachable since 14:32 UTC.
        </Alert>
      </div>
    </TabsContent>
  </Tabs>
</Card>
```

- [ ] **Step 2: Verify build**

Run: `npm run build 2>&1 | tail -5`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add apps/preview/src/app/page.tsx
git commit -m "feat(preview): add node status dashboard block"
```

### Task 3: Block 2 — Settings Panel (half width)

**Files:**
- Modify: `apps/preview/src/app/page.tsx`

- [ ] **Step 1: Add Settings Panel block**

Add inside the showcase grid after Block 1:

```tsx
{/* Block 2: Settings Panel */}
<Card title="Instance Settings" padding="lg">
  <div className="space-y-4">
    <FormField label="Instance Name">
      <Input placeholder="my-instance" />
    </FormField>
    <FormField label="Region">
      <Select
        options={[
          { value: "eu-west", label: "EU West" },
          { value: "us-east", label: "US East" },
          { value: "ap-south", label: "AP South" },
        ]}
        placeholder="Select region"
      />
    </FormField>
    <FormField label="CPU Cores">
      <Slider
        defaultValue={[4]}
        min={1}
        max={16}
        step={1}
      />
    </FormField>
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">Auto-scaling</span>
      <Switch defaultChecked />
    </div>
    <div className="flex gap-2 pt-2">
      <Button variant="primary">Save</Button>
      <Button variant="outline">Cancel</Button>
    </div>
  </div>
</Card>
```

- [ ] **Step 2: Verify build**

Run: `npm run build 2>&1 | tail -5`

- [ ] **Step 3: Commit**

```bash
git add apps/preview/src/app/page.tsx
git commit -m "feat(preview): add settings panel block"
```

### Task 4: Block 3 — Auth Form (half width)

**Files:**
- Modify: `apps/preview/src/app/page.tsx`

- [ ] **Step 1: Add Auth Form block**

Add inside the showcase grid after Block 2:

```tsx
{/* Block 3: Auth Form */}
<Card padding="lg">
  <div className="flex flex-col items-center space-y-5">
    <Logo className="h-10 text-primary" />
    <h3 className="font-heading text-xl font-bold italic">
      Sign In
    </h3>
    <div className="w-full space-y-4">
      <FormField label="Email">
        <Input type="email" placeholder="you@aleph.cloud" />
      </FormField>
      <FormField label="Password">
        <Input type="password" placeholder="••••••••" />
      </FormField>
      <div className="flex items-center gap-2">
        <Checkbox id="remember" />
        <label htmlFor="remember" className="text-sm">
          Remember me
        </label>
      </div>
      <Button variant="primary" className="w-full">
        Sign In
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Forgot password?
      </p>
    </div>
  </div>
</Card>
```

- [ ] **Step 2: Verify build**

Run: `npm run build 2>&1 | tail -5`

- [ ] **Step 3: Commit**

```bash
git add apps/preview/src/app/page.tsx
git commit -m "feat(preview): add auth form block"
```

---

## Chunk 3: Blocks 4–6 (Data Table, Notifications, Resource Card)

### Task 5: Block 4 — Data Table with Controls (full width)

**Files:**
- Modify: `apps/preview/src/app/page.tsx`

- [ ] **Step 1: Add mock data for the data table**

Add to the mock data section at the top:

```tsx
type Project = {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  statusVariant: "success" | "default";
  created: string;
};

const PROJECTS: Project[] = [
  { id: "1", name: "aleph-api", status: "Active", statusVariant: "success", created: "2026-02-14" },
  { id: "2", name: "cloud-worker", status: "Active", statusVariant: "success", created: "2026-01-28" },
  { id: "3", name: "data-pipeline", status: "Inactive", statusVariant: "default", created: "2025-12-05" },
  { id: "4", name: "auth-service", status: "Active", statusVariant: "success", created: "2026-03-01" },
  { id: "5", name: "monitoring-hub", status: "Inactive", statusVariant: "default", created: "2025-11-18" },
];

const PROJECT_COLUMNS: Column<Project>[] = [
  {
    header: "Name",
    accessor: (row) => (
      <span className="font-medium">{row.name}</span>
    ),
    sortable: true,
    sortValue: (row) => row.name,
  },
  {
    header: "Status",
    accessor: (row) => (
      <Badge variant={row.statusVariant} size="sm">
        {row.status}
      </Badge>
    ),
  },
  {
    header: "Created",
    accessor: (row) => row.created,
    sortable: true,
    sortValue: (row) => row.created,
  },
  {
    header: "Actions",
    accessor: () => (
      <Button variant="text" size="xs">
        View
      </Button>
    ),
    align: "right",
  },
];
```

- [ ] **Step 2: Add the DataTable block with Pagination state**

Add a `page` state at the top of the `OverviewPage` component:

```tsx
const [page, setPage] = useState(1);
```

Then add inside the grid after Block 3:

```tsx
{/* Block 4: Data Table with Controls */}
<Card className="md:col-span-2" padding="lg">
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-4">
    <Input placeholder="Search..." className="sm:max-w-xs" />
    <Select
      options={[
        { value: "all", label: "All" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ]}
      placeholder="Status"
      className="sm:max-w-[160px]"
    />
  </div>
  <Table
    columns={PROJECT_COLUMNS}
    data={PROJECTS}
    keyExtractor={(row) => row.id}
  />
  <div className="mt-4 flex justify-center">
    <Pagination
      page={page}
      totalPages={5}
      siblingCount={1}
      onPageChange={setPage}
    />
  </div>
</Card>
```

- [ ] **Step 3: Verify build**

Run: `npm run build 2>&1 | tail -5`

- [ ] **Step 4: Commit**

```bash
git add apps/preview/src/app/page.tsx
git commit -m "feat(preview): add data table block with pagination"
```

### Task 6: Block 5 — Notification Stack (half width)

**Files:**
- Modify: `apps/preview/src/app/page.tsx`

- [ ] **Step 1: Add notification state and block**

Add state at the top of `OverviewPage`:

```tsx
const [visibleAlerts, setVisibleAlerts] = useState({
  error: true,
  info: true,
});
```

Add inside the grid after Block 4:

```tsx
{/* Block 5: Notification Stack */}
<div className="space-y-3">
  <Alert variant="success" title="Deployment Complete">
    Instance xyz deployed to EU West.
  </Alert>
  <Alert variant="warning" title="Storage Warning">
    Usage at 85%. Consider upgrading your plan.
  </Alert>
  {visibleAlerts.error && (
    <Alert
      variant="error"
      title="Node Offline"
      onDismiss={() =>
        setVisibleAlerts((s) => ({ ...s, error: false }))
      }
    >
      Node 0x7a3f lost connectivity.
    </Alert>
  )}
  {visibleAlerts.info && (
    <Alert
      variant="info"
      onDismiss={() =>
        setVisibleAlerts((s) => ({ ...s, info: false }))
      }
      dismissAfter={10000}
    >
      Scheduled maintenance on March 15.
    </Alert>
  )}
</div>
```

- [ ] **Step 2: Verify build**

Run: `npm run build 2>&1 | tail -5`

- [ ] **Step 3: Commit**

```bash
git add apps/preview/src/app/page.tsx
git commit -m "feat(preview): add notification stack block"
```

### Task 7: Block 6 — Resource Overview Card (half width)

**Files:**
- Modify: `apps/preview/src/app/page.tsx`

- [ ] **Step 1: Add Resource Card block**

Add inside the grid after Block 5:

```tsx
{/* Block 6: Resource Overview Card */}
<Card variant="noise" padding="lg">
  <Breadcrumb className="mb-4">
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Resources</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Compute</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
  <div className="flex items-center gap-3 mb-5">
    <h3 className="font-heading text-lg font-bold italic">
      Compute Resources
    </h3>
    <Badge variant="info" size="sm">
      Pro Plan
    </Badge>
  </div>
  <div className="space-y-4 mb-6">
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>CPU</span>
        <span className="text-muted-foreground">65%</span>
      </div>
      <Slider value={[65]} max={100} disabled />
    </div>
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>Memory</span>
        <span className="text-muted-foreground">42%</span>
      </div>
      <Slider value={[42]} max={100} disabled />
    </div>
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>Storage</span>
        <span className="text-muted-foreground">78%</span>
      </div>
      <Slider value={[78]} max={100} disabled />
    </div>
  </div>
  <div className="flex gap-2">
    <Button variant="primary">Upgrade</Button>
    <Button variant="outline">Details</Button>
  </div>
</Card>
```

- [ ] **Step 2: Verify build**

Run: `npm run build 2>&1 | tail -5`

- [ ] **Step 3: Commit**

```bash
git add apps/preview/src/app/page.tsx
git commit -m "feat(preview): add resource overview card block"
```

---

## Chunk 4: Quick Links Footer + Final Verification

### Task 8: Quick Links Footer

**Files:**
- Modify: `apps/preview/src/app/page.tsx`

- [ ] **Step 1: Add Link import and quick links data**

Add the `Link` import at the top of the file (with the other imports):

```tsx
import Link from "next/link";
```

Add to the data section at the top:

```tsx
type QuickLink = { label: string; href: string; description: string };
type QuickLinkGroup = { group: string; items: QuickLink[] };

const QUICK_LINKS: QuickLinkGroup[] = [
  {
    group: "Foundations",
    items: [
      { label: "Colors", href: "/foundations/colors", description: "OKLCH scales and semantic tokens" },
      { label: "Typography", href: "/foundations/typography", description: "Heading scale, body styles" },
      { label: "Spacing", href: "/foundations/spacing", description: "Spacing scale and breakpoints" },
      { label: "Effects", href: "/foundations/effects", description: "Shadows, gradients, transitions" },
      { label: "Icons", href: "/foundations/icons", description: "Phosphor Icons integration" },
      { label: "Logo", href: "/foundations/logo", description: "Brand mark and wordmark" },
    ],
  },
  {
    group: "Actions",
    items: [
      { label: "Button", href: "/components/button", description: "6 variants, 4 sizes, loading" },
    ],
  },
  {
    group: "Data Display",
    items: [
      { label: "Badge", href: "/components/badge", description: "5 variants, 2 sizes" },
      { label: "Card", href: "/components/card", description: "3 variants with grain texture" },
      { label: "CopyableText", href: "/components/copyable-text", description: "Truncated text with copy" },
      { label: "StatusDot", href: "/components/status-dot", description: "5 health status indicators" },
      { label: "Table", href: "/components/table", description: "Sortable, clickable, generic" },
    ],
  },
  {
    group: "Feedback",
    items: [
      { label: "Alert", href: "/components/alert", description: "4 variants, dismissible" },
      { label: "Skeleton", href: "/components/skeleton", description: "Loading placeholder" },
      { label: "Tooltip", href: "/components/tooltip", description: "Radix-based tooltip" },
    ],
  },
  {
    group: "Navigation",
    items: [
      { label: "Breadcrumb", href: "/components/breadcrumb", description: "Composable breadcrumb trail" },
      { label: "Pagination", href: "/components/pagination", description: "Fixed-slot page navigation" },
      { label: "Tabs", href: "/components/tabs", description: "Underline and pill variants" },
    ],
  },
  {
    group: "Forms",
    items: [
      { label: "Checkbox", href: "/components/checkbox", description: "3 sizes, clip-path animation" },
      { label: "Combobox", href: "/components/combobox", description: "Searchable dropdown" },
      { label: "FormField", href: "/components/form-field", description: "Label + error wrapper" },
      { label: "Input", href: "/components/input", description: "2 sizes, shadow-brand style" },
      { label: "MultiSelect", href: "/components/multi-select", description: "Tags with overflow" },
      { label: "Radio Group", href: "/components/radio-group", description: "3 sizes, group disabled" },
      { label: "Select", href: "/components/select", description: "Flat options, portal dropdown" },
      { label: "Slider", href: "/components/slider", description: "Single or range, tooltip" },
      { label: "Switch", href: "/components/switch", description: "Animated sliding thumb" },
      { label: "Textarea", href: "/components/textarea", description: "Vertical resize, shadow-brand" },
    ],
  },
];
```

Add after the showcase grid closing `</div>`:

```tsx
{/* Quick Links */}
<section>
  <h2 className="text-2xl font-heading font-extrabold italic mb-6">
    Explore
  </h2>
  {QUICK_LINKS.map((group) => (
    <div key={group.group} className="mb-8">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
        {group.group}
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {group.items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-lg border border-edge p-3
                       hover:border-primary hover:shadow-brand-sm
                       transition-all"
            style={{ transitionDuration: "var(--duration-fast)" }}
          >
            <p className="font-bold text-sm mb-0.5">
              {item.label}
            </p>
            <p className="text-xs text-muted-foreground">
              {item.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  ))}
</section>
```

- [ ] **Step 2: Verify build**

Run: `npm run build 2>&1 | tail -5`

- [ ] **Step 3: Commit**

```bash
git add apps/preview/src/app/page.tsx
git commit -m "feat(preview): add quick links footer with all pages"
```

### Task 9: Final verification

- [ ] **Step 1: Run full check suite**

Run: `npm run check`
Expected: lint + typecheck + test all pass.

- [ ] **Step 2: Visual verification**

Run: `npm run dev`
Manually verify in browser:
- Hero renders with gradient + grain + LogoFull
- All 6 blocks render with correct components
- Tabs switch between "All Nodes" and "Alerts"
- Error alert dismisses on click
- Info alert auto-dismisses after 10s
- Pagination buttons work
- Light/dark theme toggle works on all blocks
- Responsive: blocks stack on mobile, pair on desktop

- [ ] **Step 3: Fix any issues found, then commit**

### Task 10: Update docs

- [ ] DESIGN-SYSTEM.md — no new tokens or components (skip)
- [ ] ARCHITECTURE.md — note the overview page structure if architecture docs cover preview app pages
- [ ] DECISIONS.md — log decision to use composed showcase blocks (shadcn-inspired) over individual component demos
- [ ] BACKLOG.md — no completed items; no deferred ideas
- [ ] CLAUDE.md — no user-facing behavior change to the DS package (skip)
