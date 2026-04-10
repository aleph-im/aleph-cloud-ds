import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useId,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ac/lib/cn";

/* ── Variants ──────────────────────────────────── */

const progressBarVariants = cva(
  "relative rounded-full bg-surface overflow-hidden",
  {
    variants: {
      size: {
        sm: "h-1",
        md: "h-1.5",
        lg: "h-2.5",
      },
    },
    defaultVariants: { size: "md" },
  },
);

/* ── ProgressBarDescription ────────────────────── */

type ProgressBarDescriptionProps = HTMLAttributes<HTMLSpanElement>;

const ProgressBarDescription = forwardRef<
  HTMLSpanElement,
  ProgressBarDescriptionProps
>(({ className, ...rest }, ref) => (
  <span
    ref={ref}
    data-description=""
    className={cn("text-xs text-muted-foreground", className)}
    {...rest}
  />
));

ProgressBarDescription.displayName = "ProgressBarDescription";

/* ── ProgressBar ───────────────────────────────── */

type ProgressBarProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof progressBarVariants> & {
    /** 0–max. Omit for indeterminate mode. */
    value?: number;
    /** Upper bound. Default 100. */
    max?: number;
    /** Accessible label (required). Becomes aria-label. */
    label: string;
    children?: ReactNode;
  };

const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ value, max = 100, label, size, className, children, ...rest }, ref) => {
    const descId = useId();
    const indeterminate = value === undefined;

    const clampedPercent = indeterminate
      ? 0
      : (Math.min(Math.max(value, 0), max) / max) * 100;

    let hasDescription = false;
    Children.forEach(children, (child) => {
      if (isValidElement(child) && child.type === ProgressBarDescription) {
        hasDescription = true;
      }
    });

    const track = (
      <div
        ref={hasDescription ? undefined : ref}
        role="progressbar"
        aria-label={label}
        aria-valuemin={indeterminate ? undefined : 0}
        aria-valuemax={indeterminate ? undefined : max}
        aria-valuenow={indeterminate ? undefined : Math.round(clampedPercent)}
        aria-describedby={hasDescription ? descId : undefined}
        className={cn(progressBarVariants({ size }), className)}
        {...(hasDescription ? {} : rest)}
      >
        <div
          data-fill=""
          data-indeterminate={indeterminate ? "" : undefined}
          className={cn(
            "h-full rounded-full bg-primary",
            indeterminate
              ? "animate-progress-indeterminate"
              : "transition-all",
            "motion-reduce:animate-none",
          )}
          style={indeterminate ? undefined : { width: `${clampedPercent}%` }}
        />
      </div>
    );

    if (!hasDescription) return track;

    const descChildren = Children.map(children, (child) => {
      if (
        isValidElement<ProgressBarDescriptionProps>(child) &&
        child.type === ProgressBarDescription
      ) {
        return cloneElement(child, { id: descId });
      }
      return child;
    });

    return (
      <div ref={ref} className="flex flex-col gap-1.5" {...rest}>
        {track}
        {descChildren}
      </div>
    );
  },
);

ProgressBar.displayName = "ProgressBar";

/* ── Exports ───────────────────────────────────── */

export {
  ProgressBar,
  ProgressBarDescription,
  progressBarVariants,
  type ProgressBarProps,
  type ProgressBarDescriptionProps,
};
