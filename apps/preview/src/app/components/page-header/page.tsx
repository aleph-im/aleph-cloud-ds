"use client";

import { useState } from "react";
import {
  PageHeader,
  PageHeaderProvider,
  usePageHeader,
} from "@aleph-front/ds/page-header";
import { ArrowClockwise, List } from "@phosphor-icons/react/dist/ssr";
import { DocHeader } from "@preview/components/doc-header";
import { DemoSection } from "@preview/components/demo-section";

function FakePage({
  title,
  withActions,
}: {
  title: string;
  withActions?: boolean;
}) {
  const [fetching, setFetching] = useState(false);
  usePageHeader({
    title,
    ...(withActions && {
      actions: (
        <button
          type="button"
          onClick={() => setFetching((v) => !v)}
          disabled={fetching}
          className="rounded border border-edge px-2 py-1 text-xs"
        >
          <ArrowClockwise size={12} className="inline mr-1" />
          {fetching ? "Refreshing…" : "Refresh"}
        </button>
      ),
    }),
  });
  return (
    <div className="p-4 text-sm text-muted-foreground">
      Body of <code>{title}</code>. The header above is rendered by the shell;
      this page only declared its title and (optionally) actions via{" "}
      <code>usePageHeader</code>.
    </div>
  );
}

export default function PageHeaderPage() {
  return (
    <>
      <DocHeader
        title="PageHeader"
        description="Slot rendered by the app shell. Pages fill it via the usePageHeader hook. Backed by PageHeaderContext."
      />

      <DemoSection title="Title only">
        <div className="rounded border border-edge overflow-hidden">
          <PageHeaderProvider>
            <PageHeader leading={<List size={16} />} />
            <FakePage title="Overview" />
          </PageHeaderProvider>
        </div>
      </DemoSection>

      <DemoSection title="With reactive actions">
        <div className="rounded border border-edge overflow-hidden">
          <PageHeaderProvider>
            <PageHeader leading={<List size={16} />} />
            <FakePage title="Nodes · 542 total" withActions />
          </PageHeaderProvider>
        </div>
      </DemoSection>
    </>
  );
}
