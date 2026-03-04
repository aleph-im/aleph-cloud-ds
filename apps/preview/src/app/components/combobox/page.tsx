"use client";

import { useState } from "react";
import { Combobox } from "@aleph-front/ds/combobox";
import { FormField } from "@aleph-front/ds/form-field";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

const TOKENS = [
  { value: "btc", label: "Bitcoin" },
  { value: "eth", label: "Ethereum" },
  { value: "sol", label: "Solana" },
  { value: "dot", label: "Polkadot" },
  { value: "avax", label: "Avalanche" },
  { value: "atom", label: "Cosmos" },
  { value: "deprecated", label: "Legacy Token", disabled: true },
];

const REGIONS = [
  { value: "us-east", label: "US East" },
  { value: "us-west", label: "US West" },
  { value: "eu-west", label: "EU West" },
  { value: "ap-south", label: "Asia Pacific" },
];

export default function ComboboxPage() {
  const [value, setValue] = useState("");

  return (
    <>
      <PageHeader
        title="Combobox"
        description="A searchable dropdown for choosing from a list of options."
      />

      <div className="space-y-12">
        <DemoSection title="Default">
          <div className="max-w-xs">
            <Combobox options={TOKENS} placeholder="Select a token..." />
          </div>
        </DemoSection>

        <DemoSection title="Sizes">
          <div className="max-w-xs space-y-4">
            <Combobox options={REGIONS} placeholder="Small" size="sm" />
            <Combobox options={REGIONS} placeholder="Medium" size="md" />
          </div>
        </DemoSection>

        <DemoSection title="States">
          <div className="max-w-xs space-y-4">
            <Combobox options={REGIONS} disabled placeholder="Disabled" />
            <Combobox options={REGIONS} error placeholder="Error" />
          </div>
        </DemoSection>

        <DemoSection title="Controlled">
          <div className="max-w-xs space-y-2">
            <Combobox
              options={TOKENS}
              value={value}
              onValueChange={setValue}
              placeholder="Search tokens..."
            />
            <p className="text-sm text-muted-foreground">
              Selected: {value || "(none)"}
            </p>
          </div>
        </DemoSection>

        <DemoSection title="With FormField">
          <div className="max-w-sm space-y-4">
            <FormField label="Token" required>
              <Combobox options={TOKENS} placeholder="Select a token..." />
            </FormField>
            <FormField
              label="Region"
              helperText="Choose the closest region"
            >
              <Combobox options={REGIONS} placeholder="Select region..." />
            </FormField>
            <FormField label="Token" required error="Token is required">
              <Combobox options={TOKENS} error placeholder="Select a token..." />
            </FormField>
          </div>
        </DemoSection>
      </div>
    </>
  );
}
