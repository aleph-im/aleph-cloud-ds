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
  "relative flex size-8 items-center justify-center rounded-full font-heading text-sm font-bold " +
  "border-2 border-edge text-muted-foreground " +
  "data-[state=active]:border-primary-500 data-[state=active]:bg-primary-500 data-[state=active]:text-white " +
  "data-[state=completed]:border-primary-500 data-[state=completed]:bg-primary-500 data-[state=completed]:text-white " +
  "transition-all duration-300 motion-reduce:transition-colors";

function ActiveRipple({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <>
      <span className="absolute -inset-1 rounded-full border-2 border-primary-400/35 animate-[ring-wave_2.4s_ease-in-out_infinite] motion-reduce:animate-none" />
      <span className="absolute -inset-1.5 rounded-full border border-primary-300/25 animate-[ring-wave_2.4s_ease-in-out_-1.2s_infinite] motion-reduce:animate-none" />
    </>
  );
}

const LABEL =
  "block text-sm text-muted-foreground " +
  "data-[state=active]:text-foreground data-[state=active]:font-medium " +
  "data-[state=completed]:text-foreground " +
  "transition-colors";

const DESCRIPTION = "block text-xs text-muted-foreground mt-0.5";

const CONNECTOR =
  "relative overflow-hidden " +
  "data-[orientation=horizontal]:h-1 data-[orientation=vertical]:w-1 " +
  "rounded-full bg-edge/50";

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
                  <ActiveRipple active={i === step} />
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
                <StepperConnector className={CONNECTOR}>
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
      <style>{`
        @keyframes ring-wave {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
      `}</style>
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
              <StepperConnector className={CONNECTOR}>
                <ConnectorFill filled />
              </StepperConnector>
              <StepperItem state="active">
                <StepperIndicator className={INDICATOR}>
                  <ActiveRipple active />
                  2
                </StepperIndicator>
                <StepperLabel className={LABEL}>Profile</StepperLabel>
              </StepperItem>
              <StepperConnector className={CONNECTOR}>
                <ConnectorFill filled={false} />
              </StepperConnector>
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
              <StepperConnector className={`${CONNECTOR} ml-4 my-1 min-h-6`}>
                <ConnectorFill filled vertical />
              </StepperConnector>
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
              <StepperConnector className={`${CONNECTOR} ml-4 my-1 min-h-6`}>
                <ConnectorFill filled vertical />
              </StepperConnector>
              <StepperItem state="active">
                <StepperIndicator className={INDICATOR}>
                  <ActiveRipple active />
                  3
                </StepperIndicator>
                <div>
                  <StepperLabel className={LABEL}>Deploy</StepperLabel>
                  <StepperDescription className={DESCRIPTION}>
                    Deploying to production...
                  </StepperDescription>
                </div>
              </StepperItem>
              <StepperConnector className={`${CONNECTOR} ml-4 my-1 min-h-6`}>
                <ConnectorFill filled={false} vertical />
              </StepperConnector>
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
                      <ActiveRipple active={i === 1} />
                      {i < 1 ? (
                        <Check size={14} weight="bold" />
                      ) : (
                        i + 1
                      )}
                    </StepperIndicator>
                    <StepperLabel className={LABEL}>{label}</StepperLabel>
                  </StepperItem>
                  {i < 2 && (
                    <StepperConnector className={CONNECTOR}>
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
                    <StepperIndicator className={INDICATOR}>
                      <Check size={14} weight="bold" />
                    </StepperIndicator>
                    <StepperLabel className={LABEL}>{label}</StepperLabel>
                  </StepperItem>
                  {i < 2 && (
                    <StepperConnector className={CONNECTOR}>
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
