"use client";

import { Badge } from "@aleph-front/ds/badge";
import {
  CheckCircle,
  Warning,
  XCircle,
  Info,
} from "@phosphor-icons/react";
import { DocHeader } from "@preview/components/doc-header";
import { DemoSection } from "@preview/components/demo-section";

const variants = ["default", "success", "warning", "error", "info"] as const;

export default function BadgePage() {
  return (
    <>
      <DocHeader
        title="Badge"
        description="Semantic labels with gradient fill or outline modes, optional icons, and 2 sizes."
      />

      <DemoSection title="Solid Fill (default)">
        <div className="flex flex-wrap items-center gap-3">
          {variants.map((v) => (
            <Badge key={v} variant={v}>
              {v}
            </Badge>
          ))}
        </div>
      </DemoSection>

      <DemoSection title="Outline Fill">
        <div className="flex flex-wrap items-center gap-3">
          {variants.map((v) => (
            <Badge key={v} variant={v} fill="outline">
              {v}
            </Badge>
          ))}
        </div>
      </DemoSection>

      <DemoSection title="With Icons">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="success" iconLeft={<CheckCircle size={12} weight="bold" />}>
            Healthy
          </Badge>
          <Badge variant="warning" iconLeft={<Warning size={12} weight="bold" />}>
            Degraded
          </Badge>
          <Badge variant="error" iconRight={<XCircle size={12} weight="bold" />}>
            Offline
          </Badge>
          <Badge variant="default" iconLeft={<Info size={12} weight="bold" />}>
            Scheduled
          </Badge>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Badge
            variant="success"
            fill="outline"
            iconLeft={<CheckCircle size={12} weight="bold" />}
          >
            Healthy
          </Badge>
          <Badge
            variant="warning"
            fill="outline"
            iconLeft={<Warning size={12} weight="bold" />}
          >
            Degraded
          </Badge>
          <Badge
            variant="error"
            fill="outline"
            iconRight={<XCircle size={12} weight="bold" />}
          >
            Offline
          </Badge>
        </div>
      </DemoSection>

      <DemoSection title="Sizes">
        <div className="flex flex-wrap items-center gap-3">
          <Badge size="sm">Small</Badge>
          <Badge size="md">Medium</Badge>
          <Badge size="sm" iconLeft={<CheckCircle size={10} weight="bold" />}>
            Small + icon
          </Badge>
          <Badge size="md" iconLeft={<CheckCircle size={12} weight="bold" />}>
            Medium + icon
          </Badge>
        </div>
      </DemoSection>

      <DemoSection title="Real-World Examples">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="success">Active</Badge>
          <Badge variant="warning">In Progress</Badge>
          <Badge variant="error">Failed</Badge>
          <Badge variant="default">Informational</Badge>
          <Badge variant="info">3 VMs</Badge>
        </div>
      </DemoSection>
    </>
  );
}
