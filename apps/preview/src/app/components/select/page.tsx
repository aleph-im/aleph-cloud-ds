"use client";

import { useState } from "react";
import { Select } from "@aleph-front/ds/select";
import { FormField } from "@aleph-front/ds/form-field";
import { DocHeader } from "@preview/components/doc-header";
import { DemoSection } from "@preview/components/demo-section";

const REGIONS = [
  { value: "us-east", label: "US East" },
  { value: "us-west", label: "US West" },
  { value: "eu-west", label: "EU West" },
  { value: "ap-south", label: "Asia Pacific" },
  { value: "deprecated", label: "Legacy (deprecated)", disabled: true },
];

const PLANS = [
  { value: "starter", label: "Starter" },
  { value: "pro", label: "Pro" },
  { value: "enterprise", label: "Enterprise" },
];

const SHORT = [
  { value: "25", label: "25" },
  { value: "50", label: "50" },
  { value: "100", label: "100" },
];

export default function SelectPage() {
  const [value, setValue] = useState("");

  return (
    <>
      <DocHeader
        title="Select"
        description="A dropdown control for choosing from a list of options."
      />

      <div className="space-y-12">
        <DemoSection title="Default">
          <div className="max-w-xs">
            <Select options={REGIONS} placeholder="Select region..." />
          </div>
        </DemoSection>

        <DemoSection title="Sizes">
          <div className="max-w-xs space-y-4">
            <Select options={PLANS} placeholder="Small" size="sm" />
            <Select options={PLANS} placeholder="Medium" size="md" />
          </div>
        </DemoSection>

        <DemoSection title="Short Options">
          <div className="w-fit">
            <Select options={SHORT} placeholder="Count" />
          </div>
        </DemoSection>

        <DemoSection title="States">
          <div className="max-w-xs space-y-4">
            <Select options={PLANS} disabled placeholder="Disabled" />
            <Select options={PLANS} error placeholder="Error" />
          </div>
        </DemoSection>

        <DemoSection title="Controlled">
          <div className="max-w-xs space-y-2">
            <Select
              options={REGIONS}
              value={value}
              onValueChange={setValue}
              placeholder="Select..."
            />
            <p className="text-sm text-muted-foreground">
              Selected: {value || "(none)"}
            </p>
          </div>
        </DemoSection>

        <DemoSection title="With FormField">
          <div className="max-w-sm space-y-4">
            <FormField label="Region" required>
              <Select options={REGIONS} placeholder="Select region..." />
            </FormField>
            <FormField label="Plan" helperText="You can change this later">
              <Select options={PLANS} placeholder="Select plan..." />
            </FormField>
            <FormField label="Region" required error="Region is required">
              <Select
                options={REGIONS}
                error
                placeholder="Select region..."
              />
            </FormField>
          </div>
        </DemoSection>
      </div>
    </>
  );
}
