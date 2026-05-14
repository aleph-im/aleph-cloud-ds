"use client";

import { useState } from "react";
import { Slider } from "@aleph-front/ds/slider";
import { FormField } from "@aleph-front/ds/form-field";
import { DocHeader } from "@preview/components/doc-header";
import { DemoSection } from "@preview/components/demo-section";

export default function SliderPage() {
  const [volume, setVolume] = useState([50]);
  const [price, setPrice] = useState([250]);
  const [range, setRange] = useState([200, 800]);

  return (
    <>
      <DocHeader
        title="Slider"
        description="A range input for selecting a numeric value by dragging a thumb along a track."
      />

      <div className="space-y-12">
        <DemoSection title="Default">
          <div className="max-w-sm">
            <Slider defaultValue={[50]} />
          </div>
        </DemoSection>

        <DemoSection title="Sizes">
          <div className="max-w-sm space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Small</p>
              <Slider defaultValue={[30]} size="sm" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Medium</p>
              <Slider defaultValue={[70]} size="md" />
            </div>
          </div>
        </DemoSection>

        <DemoSection title="With tooltip">
          <div className="max-w-sm pt-6">
            <Slider defaultValue={[50]} showTooltip />
          </div>
        </DemoSection>

        <DemoSection title="Custom range & step">
          <div className="max-w-sm space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Step: 10 (0–100)
              </p>
              <Slider
                defaultValue={[50]}
                min={0}
                max={100}
                step={10}
                showTooltip
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Step: 50 (0–1000)
              </p>
              <Slider
                defaultValue={[500]}
                min={0}
                max={1000}
                step={50}
                showTooltip
              />
            </div>
          </div>
        </DemoSection>

        <DemoSection title="Range (two thumbs)">
          <div className="max-w-sm space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Default range
              </p>
              <Slider defaultValue={[25, 75]} />
            </div>
            <div>
              <Slider
                min={0}
                max={1000}
                step={10}
                value={range}
                onValueChange={setRange}
                showTooltip
              />
              <p className="text-sm text-muted-foreground mt-2">
                Price: ${range[0]} – ${range[1]}
              </p>
            </div>
          </div>
        </DemoSection>

        <DemoSection title="States">
          <div className="max-w-sm space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Disabled</p>
              <Slider defaultValue={[50]} disabled />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Error</p>
              <Slider defaultValue={[50]} error />
            </div>
          </div>
        </DemoSection>

        <DemoSection title="Controlled">
          <div className="max-w-sm space-y-6">
            <div>
              <Slider
                value={volume}
                onValueChange={setVolume}
                showTooltip
              />
              <p className="text-sm text-muted-foreground mt-2">
                Volume: {volume[0]}
              </p>
            </div>
            <div>
              <Slider
                min={0}
                max={1000}
                step={10}
                value={price}
                onValueChange={setPrice}
                showTooltip
              />
              <p className="text-sm text-muted-foreground mt-2">
                Price: ${price[0]}
              </p>
            </div>
          </div>
        </DemoSection>

        <DemoSection title="With FormField">
          <div className="max-w-sm space-y-4">
            <FormField label="Volume" helperText="Adjust the volume level">
              <Slider defaultValue={[50]} showTooltip />
            </FormField>
            <FormField label="Budget" error="Budget must be at least $100">
              <Slider
                min={0}
                max={1000}
                step={10}
                defaultValue={[50]}
                error
                showTooltip
              />
            </FormField>
          </div>
        </DemoSection>
      </div>
    </>
  );
}
