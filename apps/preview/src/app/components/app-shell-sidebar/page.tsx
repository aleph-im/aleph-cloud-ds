"use client";

import {
  AccordionSection,
  AppShellSidebar,
  NavItem,
} from "@aleph-front/ds/app-shell-sidebar";
import { useSidebarCollapse } from "@aleph-front/ds/use-sidebar-collapse";
import { Logo } from "@aleph-front/ds/logo";
import {
  Coins,
  Cpu,
  Graph,
  GridFour,
  HardDrives,
  Warning,
  WaveSawtooth,
} from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

function AppMark({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <Logo className="h-4 text-foreground shrink-0" />
      {!collapsed && (
        <span className="font-semibold text-sm">Network</span>
      )}
    </div>
  );
}

function DemoSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <AppShellSidebar
      appMark={<AppMark collapsed={collapsed} />}
      collapsed={collapsed}
      onToggle={onToggle}
    >
      <AccordionSection title="Dashboard" sectionId="demo-dashboard">
        <NavItem href="#" icon={<GridFour size={14} />} active>
          Overview
        </NavItem>
      </AccordionSection>
      <AccordionSection title="Resources" sectionId="demo-resources">
        <NavItem href="#" icon={<HardDrives size={14} />}>Nodes</NavItem>
        <NavItem href="#" icon={<Cpu size={14} />}>VMs</NavItem>
        <NavItem href="#" icon={<Coins size={14} />}>Credits</NavItem>
      </AccordionSection>
      <AccordionSection title="Network" sectionId="demo-network">
        <NavItem href="#" icon={<Graph size={14} />}>Graph</NavItem>
        <NavItem href="#" icon={<WaveSawtooth size={14} />}>Health</NavItem>
      </AccordionSection>
      <AccordionSection title="Operations" sectionId="demo-operations">
        <NavItem href="#" icon={<Warning size={14} />}>Issues</NavItem>
      </AccordionSection>
    </AppShellSidebar>
  );
}

export default function AppShellSidebarPage() {
  const { collapsed, toggle } = useSidebarCollapse();

  return (
    <>
      <PageHeader
        title="AppShellSidebar"
        description="Sidebar shell with expanded ↔ icon-rail collapse and accordion sections. Backed by useSidebarCollapse and useAccordionState hooks (localStorage). Built-in collapse toggle at the bottom of the sidebar."
      />

      <DemoSection title="Live (built-in toggle, persists in localStorage)">
        <div className="flex h-96 overflow-hidden rounded-md border border-edge">
          <DemoSidebar collapsed={collapsed === true} onToggle={toggle} />
          <div className="flex-1 bg-background p-4 text-sm text-muted-foreground">
            page content
          </div>
        </div>
      </DemoSection>

      <DemoSection title="Static — expanded">
        <div className="flex h-96 overflow-hidden rounded-md border border-edge">
          <DemoSidebar collapsed={false} onToggle={() => {}} />
          <div className="flex-1 bg-background p-4 text-sm text-muted-foreground">
            page content
          </div>
        </div>
      </DemoSection>

      <DemoSection title="Static — icon rail">
        <div className="flex h-96 overflow-hidden rounded-md border border-edge">
          <DemoSidebar collapsed={true} onToggle={() => {}} />
          <div className="flex-1 bg-background p-4 text-sm text-muted-foreground">
            page content
          </div>
        </div>
      </DemoSection>
    </>
  );
}
