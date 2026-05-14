"use client";

import { DocHeader } from "@preview/components/doc-header";
import { Logo, LogoFull } from "@aleph-front/ds/logo";

const SIZES = [
  { label: "xs", className: "size-6" },
  { label: "sm", className: "size-8" },
  { label: "md", className: "size-10" },
  { label: "lg", className: "size-14" },
  { label: "xl", className: "size-20" },
] as const;

const FULL_SIZES = [
  { label: "sm", className: "h-6 w-auto" },
  { label: "md", className: "h-8 w-auto" },
  { label: "lg", className: "h-10 w-auto" },
  { label: "xl", className: "h-14 w-auto" },
] as const;

export default function LogoPage() {
  return (
    <div>
      <DocHeader
        title="Logo"
        description="Aleph Cloud brand mark and full logo. Uses currentColor — adapts to any text color or theme."
      />
      <div className="space-y-12">
        {/* Icon mark */}
        <section>
          <h3 className="text-lg font-bold mb-2">Icon Mark</h3>
          <p className="text-sm text-muted-foreground mb-6">
            The standalone icon mark. Size it with Tailwind utilities like{" "}
            <code>size-10</code>.
          </p>
          <div className="flex items-end gap-6">
            {SIZES.map(({ label, className }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <Logo className={className} aria-hidden="true" />
                <span className="text-xs text-muted-foreground font-mono">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Full logo */}
        <section>
          <h3 className="text-lg font-bold mb-2">Full Logo</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Icon mark + &quot;Aleph Cloud&quot; wordmark. Set the height and use{" "}
            <code>w-auto</code> for the correct aspect ratio.
          </p>
          <div className="space-y-6">
            {FULL_SIZES.map(({ label, className }) => (
              <div key={label} className="flex items-center gap-4">
                <span className="w-8 text-xs text-muted-foreground font-mono text-right">
                  {label}
                </span>
                <LogoFull className={className} aria-hidden="true" />
              </div>
            ))}
          </div>
        </section>

        {/* On dark surface */}
        <section>
          <h3 className="text-lg font-bold mb-2">On Dark Surface</h3>
          <p className="text-sm text-muted-foreground mb-6">
            The logo inherits <code>currentColor</code>, so it works on any
            background by setting the parent text color.
          </p>
          <div className="rounded-2xl bg-neutral-900 p-8 flex items-center gap-8 text-white">
            <Logo className="size-12" aria-hidden="true" />
            <LogoFull className="h-10 w-auto" aria-hidden="true" />
          </div>
        </section>

        {/* Colored */}
        <section>
          <h3 className="text-lg font-bold mb-2">Brand Color</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Apply any text color to tint the logo.
          </p>
          <div className="flex items-center gap-8">
            <Logo className="size-12 text-primary-600" aria-hidden="true" />
            <LogoFull
              className="h-10 w-auto text-primary-600"
              aria-hidden="true"
            />
          </div>
        </section>

        {/* Usage */}
        <section>
          <h3 className="text-lg font-bold mb-2">Usage</h3>
          <div className="rounded-2xl bg-muted/50 p-6 font-mono text-sm space-y-1.5 text-muted-foreground">
            <p>
              <span className="text-primary-400">import</span>
              {" { Logo, LogoFull } "}
              <span className="text-primary-400">from</span>
              {' "@aleph-front/ds/logo"'}
            </p>
            <p className="mt-3">
              {'<Logo className="size-10" aria-label="Aleph Cloud" />'}
            </p>
            <p>
              {'<LogoFull className="h-8 w-auto" aria-label="Aleph Cloud" />'}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
