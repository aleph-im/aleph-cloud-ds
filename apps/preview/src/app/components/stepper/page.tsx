"use client";

import { Fragment, useState } from "react";
import { Check } from "@phosphor-icons/react";
import { Button } from "@aleph-front/ds/button";
import {
  Stepper,
  StepperConnector,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperLabel,
  StepperList,
} from "@aleph-front/ds/stepper";
import { DocHeader } from "@preview/components/doc-header";
import { DemoSection } from "@preview/components/demo-section";

type StepState = "completed" | "active" | "inactive";

/* ── Preview-only enhancement (not part of DS) ─── */

function ConnectorFill({
  filled,
  vertical = false,
}: {
  filled: boolean;
  vertical?: boolean;
}) {
  return (
    <span
      className={
        "absolute inset-0 rounded-full bg-primary-500/70 " +
        "transition-transform duration-500 ease-out motion-reduce:transition-none " +
        (vertical
          ? `origin-top ${filled ? "scale-y-100" : "scale-y-0"}`
          : `origin-left ${filled ? "scale-x-100" : "scale-x-0"}`)
      }
    />
  );
}

/* ── Helpers ──────────────────────────────────── */

function getStepState(index: number, activeStep: number): StepState {
  if (index < activeStep) return "completed";
  if (index === activeStep) return "active";
  return "inactive";
}

const DEPLOY_STEPS = [
  { label: "Select", description: "Choose resource type" },
  { label: "Configure", description: "Set parameters" },
  { label: "Review", description: "Confirm settings" },
  { label: "Deploy", description: "Launch instance" },
];

function InteractiveStepper() {
  const [step, setStep] = useState(1);

  return (
    <div className="space-y-6">
      <Stepper aria-label="Deployment wizard">
        <StepperList>
          {DEPLOY_STEPS.map((s, i) => (
            <Fragment key={s.label}>
              <StepperItem state={getStepState(i, step)}>
                <StepperIndicator>
                  {i < step ? <Check size={14} weight="bold" /> : i + 1}
                </StepperIndicator>
                <div className="hidden sm:block">
                  <StepperLabel>{s.label}</StepperLabel>
                  <StepperDescription>{s.description}</StepperDescription>
                </div>
              </StepperItem>
              {i < DEPLOY_STEPS.length - 1 && (
                <StepperConnector>
                  <ConnectorFill filled={i < step} />
                </StepperConnector>
              )}
            </Fragment>
          ))}
        </StepperList>
      </Stepper>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          Back
        </Button>
        <Button
          size="sm"
          onClick={() =>
            setStep((s) => Math.min(DEPLOY_STEPS.length, s + 1))
          }
          disabled={step === DEPLOY_STEPS.length}
        >
          {step === DEPLOY_STEPS.length - 1 ? "Deploy" : "Next"}
        </Button>
        {step === DEPLOY_STEPS.length && (
          <Button variant="text" size="sm" onClick={() => setStep(0)}>
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}

export default function StepperPage() {
  return (
    <>
      <DocHeader
        title="Stepper"
        description="A composable multi-step indicator with horizontal/vertical orientation, state propagation via context, and default styling that works out of the box."
      />

      <div className="space-y-12">
        <DemoSection title="Horizontal (default)">
          <Stepper aria-label="Setup steps">
            <StepperList>
              <StepperItem state="completed">
                <StepperIndicator>
                  <Check size={14} weight="bold" />
                </StepperIndicator>
                <StepperLabel>Account</StepperLabel>
              </StepperItem>
              <StepperConnector>
                <ConnectorFill filled />
              </StepperConnector>
              <StepperItem state="active">
                <StepperIndicator>2</StepperIndicator>
                <StepperLabel>Profile</StepperLabel>
              </StepperItem>
              <StepperConnector>
                <ConnectorFill filled={false} />
              </StepperConnector>
              <StepperItem state="inactive">
                <StepperIndicator>3</StepperIndicator>
                <StepperLabel>Complete</StepperLabel>
              </StepperItem>
            </StepperList>
          </Stepper>
        </DemoSection>

        <DemoSection title="Vertical">
          <Stepper orientation="vertical" aria-label="Deployment pipeline">
            <StepperList>
              <StepperItem state="completed">
                <StepperIndicator>
                  <Check size={14} weight="bold" />
                </StepperIndicator>
                <div>
                  <StepperLabel>Build</StepperLabel>
                  <StepperDescription>Compiled in 12s</StepperDescription>
                </div>
              </StepperItem>
              <StepperConnector className="ml-4 my-1 min-h-6">
                <ConnectorFill filled vertical />
              </StepperConnector>
              <StepperItem state="completed">
                <StepperIndicator>
                  <Check size={14} weight="bold" />
                </StepperIndicator>
                <div>
                  <StepperLabel>Test</StepperLabel>
                  <StepperDescription>320 tests passed</StepperDescription>
                </div>
              </StepperItem>
              <StepperConnector className="ml-4 my-1 min-h-6">
                <ConnectorFill filled vertical />
              </StepperConnector>
              <StepperItem state="active">
                <StepperIndicator>3</StepperIndicator>
                <div>
                  <StepperLabel>Deploy</StepperLabel>
                  <StepperDescription>
                    Deploying to production...
                  </StepperDescription>
                </div>
              </StepperItem>
              <StepperConnector className="ml-4 my-1 min-h-6">
                <ConnectorFill filled={false} vertical />
              </StepperConnector>
              <StepperItem state="inactive">
                <StepperIndicator>4</StepperIndicator>
                <div>
                  <StepperLabel>Verify</StepperLabel>
                  <StepperDescription>
                    Health checks pending
                  </StepperDescription>
                </div>
              </StepperItem>
            </StepperList>
          </Stepper>
        </DemoSection>

        <DemoSection title="Interactive">
          <InteractiveStepper />
        </DemoSection>

        <DemoSection title="Minimal (no descriptions)">
          <Stepper aria-label="Progress">
            <StepperList>
              {["Select", "Configure", "Deploy"].map((label, i) => (
                <Fragment key={label}>
                  <StepperItem state={getStepState(i, 1)}>
                    <StepperIndicator>
                      {i < 1 ? (
                        <Check size={14} weight="bold" />
                      ) : (
                        i + 1
                      )}
                    </StepperIndicator>
                    <StepperLabel>{label}</StepperLabel>
                  </StepperItem>
                  {i < 2 && (
                    <StepperConnector>
                      <ConnectorFill filled={i < 1} />
                    </StepperConnector>
                  )}
                </Fragment>
              ))}
            </StepperList>
          </Stepper>
        </DemoSection>

        <DemoSection title="All completed">
          <Stepper aria-label="All done">
            <StepperList>
              {["Upload", "Process", "Complete"].map((label, i) => (
                <Fragment key={label}>
                  <StepperItem state="completed">
                    <StepperIndicator>
                      <Check size={14} weight="bold" />
                    </StepperIndicator>
                    <StepperLabel>{label}</StepperLabel>
                  </StepperItem>
                  {i < 2 && (
                    <StepperConnector>
                      <ConnectorFill filled />
                    </StepperConnector>
                  )}
                </Fragment>
              ))}
            </StepperList>
          </Stepper>
        </DemoSection>
      </div>
    </>
  );
}
