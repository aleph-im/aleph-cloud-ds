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
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

type StepState = "completed" | "active" | "inactive";

const INDICATOR =
  "flex size-8 items-center justify-center rounded-full text-sm font-bold " +
  "border-2 border-edge text-muted-foreground " +
  "data-[state=active]:border-primary-500 data-[state=active]:bg-primary-500 data-[state=active]:text-white " +
  "data-[state=completed]:border-primary-500 data-[state=completed]:bg-primary-500 data-[state=completed]:text-white " +
  "transition-colors";

const LABEL =
  "text-sm text-muted-foreground " +
  "data-[state=active]:text-foreground data-[state=active]:font-medium " +
  "data-[state=completed]:text-foreground " +
  "transition-colors";

const DESCRIPTION = "text-xs text-muted-foreground mt-0.5";

const CONNECTOR =
  "data-[orientation=horizontal]:h-0.5 data-[orientation=vertical]:w-0.5 " +
  "rounded-full bg-edge";

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
                <StepperIndicator className={INDICATOR}>
                  {i < step ? <Check size={14} weight="bold" /> : i + 1}
                </StepperIndicator>
                <div className="hidden sm:block">
                  <StepperLabel className={LABEL}>{s.label}</StepperLabel>
                  <StepperDescription className={DESCRIPTION}>
                    {s.description}
                  </StepperDescription>
                </div>
              </StepperItem>
              {i < DEPLOY_STEPS.length - 1 && (
                <StepperConnector className={CONNECTOR} />
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
      <PageHeader
        title="Stepper"
        description="A composable multi-step indicator with horizontal/vertical orientation, state propagation via context, and unstyled-by-default parts for full consumer control."
      />

      <div className="space-y-12">
        <DemoSection title="Horizontal (default)">
          <Stepper aria-label="Setup steps">
            <StepperList>
              <StepperItem state="completed">
                <StepperIndicator className={INDICATOR}>
                  <Check size={14} weight="bold" />
                </StepperIndicator>
                <StepperLabel className={LABEL}>Account</StepperLabel>
              </StepperItem>
              <StepperConnector className={CONNECTOR} />
              <StepperItem state="active">
                <StepperIndicator className={INDICATOR}>
                  2
                </StepperIndicator>
                <StepperLabel className={LABEL}>Profile</StepperLabel>
              </StepperItem>
              <StepperConnector className={CONNECTOR} />
              <StepperItem state="inactive">
                <StepperIndicator className={INDICATOR}>
                  3
                </StepperIndicator>
                <StepperLabel className={LABEL}>Complete</StepperLabel>
              </StepperItem>
            </StepperList>
          </Stepper>
        </DemoSection>

        <DemoSection title="Vertical">
          <Stepper orientation="vertical" aria-label="Deployment pipeline">
            <StepperList>
              <StepperItem state="completed">
                <StepperIndicator className={INDICATOR}>
                  <Check size={14} weight="bold" />
                </StepperIndicator>
                <div>
                  <StepperLabel className={LABEL}>Build</StepperLabel>
                  <StepperDescription className={DESCRIPTION}>
                    Compiled in 12s
                  </StepperDescription>
                </div>
              </StepperItem>
              <StepperConnector
                className={`${CONNECTOR} ml-4 my-1 min-h-6`}
              />
              <StepperItem state="completed">
                <StepperIndicator className={INDICATOR}>
                  <Check size={14} weight="bold" />
                </StepperIndicator>
                <div>
                  <StepperLabel className={LABEL}>Test</StepperLabel>
                  <StepperDescription className={DESCRIPTION}>
                    320 tests passed
                  </StepperDescription>
                </div>
              </StepperItem>
              <StepperConnector
                className={`${CONNECTOR} ml-4 my-1 min-h-6`}
              />
              <StepperItem state="active">
                <StepperIndicator className={INDICATOR}>
                  3
                </StepperIndicator>
                <div>
                  <StepperLabel className={LABEL}>Deploy</StepperLabel>
                  <StepperDescription className={DESCRIPTION}>
                    Deploying to production...
                  </StepperDescription>
                </div>
              </StepperItem>
              <StepperConnector
                className={`${CONNECTOR} ml-4 my-1 min-h-6`}
              />
              <StepperItem state="inactive">
                <StepperIndicator className={INDICATOR}>
                  4
                </StepperIndicator>
                <div>
                  <StepperLabel className={LABEL}>Verify</StepperLabel>
                  <StepperDescription className={DESCRIPTION}>
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
                    <StepperIndicator className={INDICATOR}>
                      {i < 1 ? (
                        <Check size={14} weight="bold" />
                      ) : (
                        i + 1
                      )}
                    </StepperIndicator>
                    <StepperLabel className={LABEL}>{label}</StepperLabel>
                  </StepperItem>
                  {i < 2 && <StepperConnector className={CONNECTOR} />}
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
                    <StepperIndicator className={INDICATOR}>
                      <Check size={14} weight="bold" />
                    </StepperIndicator>
                    <StepperLabel className={LABEL}>{label}</StepperLabel>
                  </StepperItem>
                  {i < 2 && <StepperConnector className={CONNECTOR} />}
                </Fragment>
              ))}
            </StepperList>
          </Stepper>
        </DemoSection>
      </div>
    </>
  );
}
