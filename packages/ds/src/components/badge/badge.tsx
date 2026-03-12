import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ac/lib/cn";

const badgeVariants = cva(
  [
    "inline-flex items-center justify-center gap-1.5",
    "rounded-md font-heading font-extrabold italic uppercase",
    "whitespace-nowrap select-none",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "",
        success: "",
        warning: "",
        error: "",
        info: "",
      },
      fill: {
        solid: "",
        outline: "border",
      },
      size: {
        sm: "px-3 py-0.5 text-[10px]",
        md: "px-4 py-1 text-xs",
      },
    },
    compoundVariants: [
      {
        fill: "solid",
        variant: "default",
        className: "gradient-fill-info text-neutral-950 dark:text-white",
      },
      {
        fill: "solid",
        variant: "success",
        className: "gradient-fill-success text-neutral-950",
      },
      {
        fill: "solid",
        variant: "warning",
        className: "gradient-fill-warning text-neutral-950",
      },
      {
        fill: "solid",
        variant: "error",
        className: "gradient-fill-error text-neutral-950",
      },
      {
        fill: "solid",
        variant: "info",
        className: [
          "bg-neutral-100 text-neutral-700",
          "dark:bg-neutral-800 dark:text-neutral-300",
        ].join(" "),
      },
      {
        fill: "outline",
        variant: "default",
        className: [
          "border-primary-300 bg-primary-100 text-neutral-950",
          "dark:bg-primary-900/20 dark:text-white",
        ].join(" "),
      },
      {
        fill: "outline",
        variant: "success",
        className: [
          "border-success-400 bg-success-100 text-neutral-950",
          "dark:bg-success-900/20 dark:text-neutral-100",
        ].join(" "),
      },
      {
        fill: "outline",
        variant: "warning",
        className: [
          "border-warning-400 bg-warning-100 text-neutral-950",
          "dark:bg-warning-900/20 dark:text-neutral-100",
        ].join(" "),
      },
      {
        fill: "outline",
        variant: "error",
        className: [
          "border-error-400 bg-error-100 text-neutral-950",
          "dark:bg-error-900/20 dark:text-neutral-100",
        ].join(" "),
      },
      {
        fill: "outline",
        variant: "info",
        className: [
          "border-neutral-300 bg-neutral-100 text-neutral-700",
          "dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
        ].join(" "),
      },
    ],
    defaultVariants: {
      variant: "default",
      fill: "solid",
      size: "md",
    },
  },
);

type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants> & {
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
  };

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { variant, fill, size, iconLeft, iconRight, className, children, ...rest },
    ref,
  ) => {
    const iconSize = size === "sm" ? "size-2.5" : "size-3";
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, fill, size }), className)}
        {...rest}
      >
        {iconLeft && (
          <span className={cn(iconSize, "shrink-0")}>{iconLeft}</span>
        )}
        {children}
        {iconRight && (
          <span className={cn(iconSize, "shrink-0")}>{iconRight}</span>
        )}
      </span>
    );
  },
);

Badge.displayName = "Badge";

export { Badge, badgeVariants, type BadgeProps };
