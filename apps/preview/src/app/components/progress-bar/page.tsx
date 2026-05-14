"use client";

import { useState, useEffect } from "react";
import {
  ProgressBar,
  ProgressBarDescription,
} from "@aleph-front/ds/progress-bar";
import { DocHeader } from "@preview/components/doc-header";
import { DemoSection } from "@preview/components/demo-section";

function AnimatedProgress() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((v) => (v >= 100 ? 0 : v + 2));
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-2">
      <ProgressBar value={value} label="Upload progress" />
      <p className="text-sm text-muted-foreground">{value}%</p>
    </div>
  );
}

export default function ProgressBarPage() {
  return (
    <>
      <DocHeader
        title="ProgressBar"
        description="A visual indicator of completion progress with determinate and indeterminate modes, 3 sizes, and optional description."
      />

      <div className="space-y-12">
        <DemoSection title="Determinate">
          <div className="max-w-md space-y-4">
            <ProgressBar value={0} label="Empty" />
            <ProgressBar value={25} label="Quarter" />
            <ProgressBar value={50} label="Half" />
            <ProgressBar value={75} label="Three quarters" />
            <ProgressBar value={100} label="Complete" />
          </div>
        </DemoSection>

        <DemoSection title="Indeterminate">
          <div className="max-w-md">
            <ProgressBar label="Loading data" />
          </div>
        </DemoSection>

        <DemoSection title="Sizes">
          <div className="max-w-md space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Small</p>
              <ProgressBar value={60} size="sm" label="Small" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Medium (default)
              </p>
              <ProgressBar value={60} size="md" label="Medium" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Large</p>
              <ProgressBar value={60} size="lg" label="Large" />
            </div>
          </div>
        </DemoSection>

        <DemoSection title="With Description">
          <div className="max-w-md space-y-6">
            <ProgressBar value={35} label="Upload progress">
              <ProgressBarDescription>
                Uploading 7 of 20 files...
              </ProgressBarDescription>
            </ProgressBar>
            <ProgressBar value={100} label="Deployment complete">
              <ProgressBarDescription>
                All resources deployed successfully.
              </ProgressBarDescription>
            </ProgressBar>
          </div>
        </DemoSection>

        <DemoSection title="Custom max">
          <div className="max-w-md space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                3 of 5 steps
              </p>
              <ProgressBar value={3} max={5} label="Step progress" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                750 MB of 1024 MB
              </p>
              <ProgressBar value={750} max={1024} label="Storage usage" />
            </div>
          </div>
        </DemoSection>

        <DemoSection title="Animated">
          <div className="max-w-md">
            <AnimatedProgress />
          </div>
        </DemoSection>

        <DemoSection title="Custom Colors">
          <div className="max-w-md space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Success</p>
              <ProgressBar
                value={100}
                label="Complete"
                className="[&_[data-fill]]:bg-success-500"
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Warning</p>
              <ProgressBar
                value={65}
                label="Storage warning"
                className="[&_[data-fill]]:bg-warning-500"
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Error</p>
              <ProgressBar
                value={90}
                label="Critical"
                className="[&_[data-fill]]:bg-error-500"
              />
            </div>
          </div>
        </DemoSection>
      </div>
    </>
  );
}
