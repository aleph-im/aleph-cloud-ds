"use client";

import { ProductStrip, type ProductApp } from "@aleph-front/ds/product-strip";
import { DocHeader } from "@preview/components/doc-header";
import { DemoSection } from "@preview/components/demo-section";

const APPS: ProductApp[] = [
  {
    id: "cloud",
    label: "Cloud",
    href: "https://app.aleph.cloud",
    external: true,
  },
  { id: "network", label: "Network", href: "https://network.aleph.cloud" },
  {
    id: "explorer",
    label: "Explorer",
    href: "https://explorer.aleph.cloud",
    external: true,
  },
  {
    id: "swap",
    label: "Swap",
    href: "https://swap.aleph.cloud",
    external: true,
  },
];

export default function ProductStripPage() {
  return (
    <>
      <DocHeader
        title="ProductStrip"
        description="Top bar listing the Aleph product family as tabs. Each app links to its subdomain. Declarative — consumers pass the current app via activeId."
      />

      <DemoSection title="Network active">
        <ProductStrip
          apps={APPS}
          activeId="network"
          logoHref="https://aleph.cloud"
        />
      </DemoSection>

      <DemoSection title="Cloud active">
        <ProductStrip
          apps={APPS}
          activeId="cloud"
          logoHref="https://aleph.cloud"
        />
      </DemoSection>

      <DemoSection title="With right slot (theme toggle placeholder)">
        <ProductStrip
          apps={APPS}
          activeId="network"
          logoHref="https://aleph.cloud"
          right={
            <span className="text-xs text-muted-foreground">◐ theme</span>
          }
        />
      </DemoSection>

      <DemoSection title="No active app (unknown activeId)">
        <ProductStrip
          apps={APPS}
          activeId="unknown"
          logoHref="https://aleph.cloud"
        />
      </DemoSection>
    </>
  );
}
