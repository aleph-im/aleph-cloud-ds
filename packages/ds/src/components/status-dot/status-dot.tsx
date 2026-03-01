import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ac/lib/cn";

const statusDotVariants = cva("inline-block rounded-full shrink-0", {
  variants: {
    status: {
      healthy: "bg-success-500 animate-pulse",
      degraded: "bg-warning-500",
      error: "bg-error-500",
      offline: "bg-neutral-400",
      unknown: "bg-neutral-300",
    },
    size: {
      sm: "size-2",
      md: "size-3",
    },
  },
  defaultVariants: {
    status: "unknown",
    size: "md",
  },
});

type StatusDotProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof statusDotVariants>;

const StatusDot = forwardRef<HTMLSpanElement, StatusDotProps>(
  ({ status, size, className, ...rest }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(statusDotVariants({ status, size }), className)}
        {...rest}
      />
    );
  },
);

StatusDot.displayName = "StatusDot";

export { StatusDot, statusDotVariants, type StatusDotProps };
