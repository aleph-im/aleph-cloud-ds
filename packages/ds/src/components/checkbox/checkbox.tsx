import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ac/lib/cn";

const checkboxVariants = cva(
  [
    "peer shrink-0 bg-card",
    "border-2 border-edge rounded-md",
    "hover:border-edge-hover",
    "focus-visible:outline-none focus-visible:ring-3",
    "focus-visible:ring-primary-500",
    "disabled:opacity-50 disabled:pointer-events-none",
    "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
    "data-[state=checked]:text-primary-foreground",
    "transition-colors",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "size-4",
        md: "size-5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type CheckboxProps = Omit<
  ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
  "size"
> &
  VariantProps<typeof checkboxVariants> & {
    error?: boolean;
  };

const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ size, error = false, className, ...rest }, ref) => {
    return (
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
          checkboxVariants({ size }),
          error && "border-3 border-error-400 hover:border-error-500",
          className,
        )}
        aria-invalid={error || undefined}
        {...rest}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-3/4"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );
  },
);

Checkbox.displayName = "Checkbox";

export { Checkbox, checkboxVariants, type CheckboxProps };
