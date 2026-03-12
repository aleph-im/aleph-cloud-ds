import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ac/lib/cn";

const badgeVariants = cva(
  [
    "inline-flex items-center justify-center",
    "rounded font-sans font-semibold",
    "whitespace-nowrap select-none",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-primary-100 text-primary-700",
          "dark:bg-primary-700 dark:text-primary-300",
        ].join(" "),
        success: [
          "bg-success-100 text-success-700",
          "dark:bg-success-900 dark:text-success-300",
        ].join(" "),
        warning: [
          "bg-warning-100 text-warning-800",
          "dark:bg-warning-900 dark:text-warning-200",
        ].join(" "),
        error: [
          "bg-error-100 text-error-700",
          "dark:bg-error-900 dark:text-error-300",
        ].join(" "),
        info: [
          "bg-neutral-100 text-neutral-700",
          "dark:bg-neutral-800 dark:text-neutral-300",
        ].join(" "),
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-0.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant, size, className, ...rest }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...rest}
      />
    );
  },
);

Badge.displayName = "Badge";

export { Badge, badgeVariants, type BadgeProps };
