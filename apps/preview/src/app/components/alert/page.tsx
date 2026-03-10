"use client";

import { useState } from "react";
import { Alert } from "@aleph-front/ds/alert";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

const variants = ["warning", "error", "info", "success"] as const;

export default function AlertPage() {
  const [showDismissible, setShowDismissible] = useState(true);
  const [showTimed, setShowTimed] = useState(true);

  return (
    <>
      <PageHeader
        title="Alert"
        description="Dismissible status banners with 4 semantic variants. Supports optional title, auto-dismiss timer with progress bar, and exit animation."
      />

      <DemoSection title="Variants">
        <div className="space-y-3">
          {variants.map((v) => (
            <Alert key={v} variant={v}>
              This is a {v} alert — check your{" "}
              <a href="#">
                settings
              </a>{" "}
              for more details.
            </Alert>
          ))}
        </div>
      </DemoSection>

      <DemoSection title="With Title">
        <div className="space-y-3">
          <Alert variant="error" title="Instance Paused">
            Something went wrong with your instance. It has been
            automatically paused to prevent data loss.
          </Alert>
          <Alert variant="warning" title="Configuration Issue">
            Need to check your network settings — your instance might be
            malfunctioning.
          </Alert>
        </div>
      </DemoSection>

      <DemoSection title="Dismissible">
        <div className="space-y-3">
          {showDismissible ? (
            <Alert
              variant="info"
              onDismiss={() => setShowDismissible(false)}
            >
              Click the X button to dismiss this alert.
            </Alert>
          ) : (
            <button
              type="button"
              onClick={() => setShowDismissible(true)}
              className="text-sm text-primary-600 underline"
            >
              Show alert again
            </button>
          )}
        </div>
      </DemoSection>

      <DemoSection title="Auto-Dismiss with Timer">
        <div className="space-y-3">
          {showTimed ? (
            <Alert
              variant="success"
              title="Saved"
              onDismiss={() => setShowTimed(false)}
              dismissAfter={5000}
            >
              Your changes have been saved. This alert will dismiss in 5
              seconds.
            </Alert>
          ) : (
            <button
              type="button"
              onClick={() => setShowTimed(true)}
              className="text-sm text-primary-600 underline"
            >
              Show timed alert again
            </button>
          )}
        </div>
      </DemoSection>

      <DemoSection title="With Inline Links">
        <Alert variant="warning">
          Need to check{" "}
          <a href="#">
            [6489065788] setting
          </a>
          , your instance might be malfunctioning. See the{" "}
          <a href="#">
            documentation
          </a>{" "}
          for troubleshooting steps.
        </Alert>
      </DemoSection>
    </>
  );
}
