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

export default function OverviewPage() {
  const [page, setPage] = useState(1);
  const [visibleAlerts, setVisibleAlerts] = useState({
    error: true,
    info: true,
  });

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
      </div>
    </>
  );
}
