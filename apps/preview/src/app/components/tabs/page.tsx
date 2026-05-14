"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@aleph-front/ds/tabs";
import { Badge } from "@aleph-front/ds/badge";
import { DocHeader } from "@preview/components/doc-header";
import { DemoSection } from "@preview/components/demo-section";

export default function TabsPage() {
  return (
    <>
      <DocHeader
        title="Tabs"
        description="Radix UI Tabs with DS styling, sliding active indicator, and text nudge animation. Composable API: Tabs, TabsList, TabsTrigger, TabsContent."
      />

      <DemoSection title="Basic">
        <Tabs defaultValue="compute">
          <TabsList>
            <TabsTrigger value="compute">Compute</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
          </TabsList>
          <TabsContent value="compute">
            <p className="text-muted-foreground">Manage your compute resources and virtual machines.</p>
          </TabsContent>
          <TabsContent value="storage">
            <p className="text-muted-foreground">Configure persistent and immutable storage volumes.</p>
          </TabsContent>
          <TabsContent value="network">
            <p className="text-muted-foreground">Set up custom domains and network policies.</p>
          </TabsContent>
        </Tabs>
      </DemoSection>

      <DemoSection title="With Badge">
        <Tabs defaultValue="vms">
          <TabsList>
            <TabsTrigger value="vms">
              VMs <Badge size="sm" variant="info">12</Badge>
            </TabsTrigger>
            <TabsTrigger value="programs">
              Programs <Badge size="sm" variant="info">3</Badge>
            </TabsTrigger>
            <TabsTrigger value="volumes">
              Volumes <Badge size="sm" variant="default">0</Badge>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="vms">
            <p className="text-muted-foreground">Active virtual machines with resource allocation details.</p>
          </TabsContent>
          <TabsContent value="programs">
            <p className="text-muted-foreground">Deployed programs and their execution status.</p>
          </TabsContent>
          <TabsContent value="volumes">
            <p className="text-muted-foreground">No volumes attached.</p>
          </TabsContent>
        </Tabs>
      </DemoSection>

      <DemoSection title="Small Underline">
        <Tabs defaultValue="compute">
          <TabsList size="sm">
            <TabsTrigger value="compute">Compute</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
          </TabsList>
          <TabsContent value="compute">
            <p className="text-muted-foreground">Manage your compute resources and virtual machines.</p>
          </TabsContent>
          <TabsContent value="storage">
            <p className="text-muted-foreground">Configure persistent and immutable storage volumes.</p>
          </TabsContent>
          <TabsContent value="network">
            <p className="text-muted-foreground">Set up custom domains and network policies.</p>
          </TabsContent>
        </Tabs>
      </DemoSection>

      <DemoSection title="Small Pill">
        <Tabs defaultValue="vms">
          <TabsList variant="pill" size="sm">
            <TabsTrigger value="vms">VMs</TabsTrigger>
            <TabsTrigger value="nodes">Nodes</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
          </TabsList>
          <TabsContent value="vms">
            <p className="text-muted-foreground">Virtual machines overview.</p>
          </TabsContent>
          <TabsContent value="nodes">
            <p className="text-muted-foreground">Compute nodes overview.</p>
          </TabsContent>
          <TabsContent value="network">
            <p className="text-muted-foreground">Network configuration.</p>
          </TabsContent>
        </Tabs>
      </DemoSection>

      <DemoSection title="Disabled Tab">
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="upcoming" disabled>
              Upcoming
            </TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <p className="text-muted-foreground">Currently active resources.</p>
          </TabsContent>
          <TabsContent value="pending">
            <p className="text-muted-foreground">Resources awaiting deployment.</p>
          </TabsContent>
        </Tabs>
      </DemoSection>

      <DemoSection title="With Subscript and Superscript">
        <Tabs defaultValue="nodes">
          <TabsList>
            <TabsTrigger value="nodes">
              Nodes
              <span className="self-end text-[10px] font-body font-bold leading-none text-muted-foreground">
                (7)
              </span>
            </TabsTrigger>
            <TabsTrigger value="staking">Staking</TabsTrigger>
            <TabsTrigger value="rewards" disabled>
              Rewards
              <span className="self-start text-[10px] font-heading font-extrabold italic uppercase leading-none text-muted-foreground opacity-40">
                soon
              </span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="nodes">
            <p className="text-muted-foreground">Your 7 active compute nodes.</p>
          </TabsContent>
          <TabsContent value="staking">
            <p className="text-muted-foreground">Staking positions and rewards.</p>
          </TabsContent>
        </Tabs>
      </DemoSection>

      <DemoSection title="Pill Variant">
        <Tabs defaultValue="vms">
          <TabsList variant="pill">
            <TabsTrigger value="vms">VMs</TabsTrigger>
            <TabsTrigger value="nodes">Nodes</TabsTrigger>
          </TabsList>
          <TabsContent value="vms">
            <p className="text-muted-foreground">Virtual machines overview.</p>
          </TabsContent>
          <TabsContent value="nodes">
            <p className="text-muted-foreground">Compute nodes overview.</p>
          </TabsContent>
        </Tabs>
      </DemoSection>

      <DemoSection title="Pill Variant (3 Options)">
        <Tabs defaultValue="compute">
          <TabsList variant="pill">
            <TabsTrigger value="compute">Compute</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
          </TabsList>
          <TabsContent value="compute">
            <p className="text-muted-foreground">Compute resources and allocation.</p>
          </TabsContent>
          <TabsContent value="storage">
            <p className="text-muted-foreground">Persistent storage volumes.</p>
          </TabsContent>
          <TabsContent value="network">
            <p className="text-muted-foreground">Network configuration and policies.</p>
          </TabsContent>
        </Tabs>
      </DemoSection>

      <DemoSection title="Overflow Collapse (Underline)">
        <div className="max-w-md">
          <Tabs defaultValue="compute">
            <TabsList overflow="collapse">
              <TabsTrigger value="compute">Compute</TabsTrigger>
              <TabsTrigger value="storage">Storage</TabsTrigger>
              <TabsTrigger value="network">Network</TabsTrigger>
              <TabsTrigger value="domains">Domains</TabsTrigger>
              <TabsTrigger value="functions">Functions</TabsTrigger>
              <TabsTrigger value="volumes">Volumes</TabsTrigger>
              <TabsTrigger value="secrets">Secrets</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
            </TabsList>
            <TabsContent value="compute">
              <p className="text-muted-foreground">Compute resources and VMs.</p>
            </TabsContent>
            <TabsContent value="storage">
              <p className="text-muted-foreground">Persistent storage volumes.</p>
            </TabsContent>
            <TabsContent value="network">
              <p className="text-muted-foreground">Network policies.</p>
            </TabsContent>
            <TabsContent value="domains">
              <p className="text-muted-foreground">Custom domains.</p>
            </TabsContent>
            <TabsContent value="functions">
              <p className="text-muted-foreground">Serverless functions.</p>
            </TabsContent>
            <TabsContent value="volumes">
              <p className="text-muted-foreground">Volume management.</p>
            </TabsContent>
            <TabsContent value="secrets">
              <p className="text-muted-foreground">Secret management.</p>
            </TabsContent>
            <TabsContent value="logs">
              <p className="text-muted-foreground">Application logs.</p>
            </TabsContent>
          </Tabs>
        </div>
      </DemoSection>

      <DemoSection title="Max Visible (count cap)">
        <p className="text-sm text-muted-foreground mb-3">
          <code>maxVisible={"{3}"}</code> hard-caps the visible tab count. Trailing tabs collapse into the same overflow dropdown as
          <code> overflow=&quot;collapse&quot;</code>. Use this when you want a deterministic cap regardless of available width.
        </p>
        <Tabs defaultValue="all">
          <TabsList maxVisible={3}>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="dispatched">Dispatched</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="running">Running</TabsTrigger>
            <TabsTrigger value="stopped">Stopped</TabsTrigger>
            <TabsTrigger value="errored">Errored</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
            <TabsTrigger value="paused">Paused</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <p className="text-muted-foreground">All VMs across every status.</p>
          </TabsContent>
          <TabsContent value="dispatched">
            <p className="text-muted-foreground">VMs that have been dispatched to a worker.</p>
          </TabsContent>
          <TabsContent value="scheduled">
            <p className="text-muted-foreground">VMs awaiting dispatch.</p>
          </TabsContent>
          <TabsContent value="running">
            <p className="text-muted-foreground">VMs currently running.</p>
          </TabsContent>
          <TabsContent value="stopped">
            <p className="text-muted-foreground">VMs that have been stopped.</p>
          </TabsContent>
          <TabsContent value="errored">
            <p className="text-muted-foreground">VMs that errored during execution.</p>
          </TabsContent>
          <TabsContent value="archived">
            <p className="text-muted-foreground">Archived VMs.</p>
          </TabsContent>
          <TabsContent value="paused">
            <p className="text-muted-foreground">Paused VMs.</p>
          </TabsContent>
          <TabsContent value="failed">
            <p className="text-muted-foreground">Failed VMs.</p>
          </TabsContent>
          <TabsContent value="completed">
            <p className="text-muted-foreground">Completed VMs.</p>
          </TabsContent>
        </Tabs>
      </DemoSection>

      <DemoSection title="Max Visible + Pill">
        <Tabs defaultValue="all">
          <TabsList variant="pill" maxVisible={3}>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="stopped">Stopped</TabsTrigger>
            <TabsTrigger value="errored">Errored</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <p className="text-muted-foreground">All resources.</p>
          </TabsContent>
          <TabsContent value="active">
            <p className="text-muted-foreground">Active resources.</p>
          </TabsContent>
          <TabsContent value="pending">
            <p className="text-muted-foreground">Pending resources.</p>
          </TabsContent>
          <TabsContent value="stopped">
            <p className="text-muted-foreground">Stopped resources.</p>
          </TabsContent>
          <TabsContent value="errored">
            <p className="text-muted-foreground">Errored resources.</p>
          </TabsContent>
          <TabsContent value="archived">
            <p className="text-muted-foreground">Archived resources.</p>
          </TabsContent>
        </Tabs>
      </DemoSection>

      <DemoSection title="Overflow Collapse (Pill)">
        <div className="max-w-sm">
          <Tabs defaultValue="all">
            <TabsList variant="pill" overflow="collapse">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="stopped">Stopped</TabsTrigger>
              <TabsTrigger value="errored">Errored</TabsTrigger>
              <TabsTrigger value="archived" disabled>Archived</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <p className="text-muted-foreground">All resources.</p>
            </TabsContent>
            <TabsContent value="active">
              <p className="text-muted-foreground">Active resources.</p>
            </TabsContent>
            <TabsContent value="pending">
              <p className="text-muted-foreground">Pending resources.</p>
            </TabsContent>
            <TabsContent value="stopped">
              <p className="text-muted-foreground">Stopped resources.</p>
            </TabsContent>
            <TabsContent value="errored">
              <p className="text-muted-foreground">Errored resources.</p>
            </TabsContent>
            <TabsContent value="archived">
              <p className="text-muted-foreground">Archived resources.</p>
            </TabsContent>
          </Tabs>
        </div>
      </DemoSection>
    </>
  );
}
