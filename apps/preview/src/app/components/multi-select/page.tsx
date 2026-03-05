"use client";

import { useState } from "react";
import { MultiSelect } from "@aleph-front/ds/multi-select";
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
  { value: "ada", label: "Cardano" },
  { value: "deprecated", label: "Legacy Token", disabled: true },
];

const REGIONS = [
  { value: "us-east", label: "US East" },
  { value: "us-west", label: "US West" },
  { value: "eu-west", label: "EU West" },
  { value: "ap-south", label: "Asia Pacific" },
];

export default function MultiSelectPage() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <>
      <PageHeader
        title="MultiSelect"
        description="A searchable dropdown for choosing multiple items from a list."
      />

      <div className="space-y-12">
        <DemoSection title="Default">
          <div className="max-w-sm">
            <MultiSelect
              options={TOKENS}
              placeholder="Select tokens..."
            />
          </div>
        </DemoSection>

        <DemoSection title="With Pre-selected Values">
          <div className="max-w-sm">
            <MultiSelect
              options={TOKENS}
              value={["btc", "eth", "sol"]}
              onValueChange={() => {}}
              placeholder="Select tokens..."
            />
          </div>
        </DemoSection>

        <DemoSection title="Overflow (maxDisplayedTags=2)">
          <div className="max-w-sm">
            <MultiSelect
              options={TOKENS}
              value={["btc", "eth", "sol", "avax", "atom"]}
              onValueChange={() => {}}
              maxDisplayedTags={2}
              placeholder="Select tokens..."
            />
          </div>
        </DemoSection>

        <DemoSection title="Sizes">
          <div className="max-w-sm space-y-4">
            <MultiSelect
              options={REGIONS}
              placeholder="Small"
              size="sm"
            />
            <MultiSelect
              options={REGIONS}
              placeholder="Medium"
              size="md"
            />
          </div>
        </DemoSection>

        <DemoSection title="States">
          <div className="max-w-sm space-y-4">
            <MultiSelect
              options={REGIONS}
              disabled
              placeholder="Disabled"
            />
            <MultiSelect
              options={REGIONS}
              error
              placeholder="Error"
            />
          </div>
        </DemoSection>

        <DemoSection title="Controlled">
          <div className="max-w-sm space-y-2">
            <MultiSelect
              options={TOKENS}
              value={value}
              onValueChange={setValue}
              placeholder="Search tokens..."
            />
            <p className="text-sm text-muted-foreground">
              Selected: {value.length > 0 ? value.join(", ") : "(none)"}
            </p>
          </div>
        </DemoSection>

        <DemoSection title="With FormField">
          <div className="max-w-sm space-y-4">
            <FormField label="Tokens" required>
              <MultiSelect
                options={TOKENS}
                placeholder="Select tokens..."
              />
            </FormField>
            <FormField
              label="Regions"
              helperText="Choose deployment regions"
            >
              <MultiSelect
                options={REGIONS}
                placeholder="Select regions..."
              />
            </FormField>
            <FormField
              label="Tokens"
              required
              error="At least one token is required"
            >
              <MultiSelect
                options={TOKENS}
                error
                placeholder="Select tokens..."
              />
            </FormField>
          </div>
        </DemoSection>
      </div>
    </>
  );
}
