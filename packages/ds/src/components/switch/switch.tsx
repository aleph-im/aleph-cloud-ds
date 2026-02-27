import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Switch as SwitchPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ac/lib/cn";

const switchVariants = cva(
  [
    "peer inline-flex shrink-0 cursor-pointer",
    "items-center rounded-full",
    "border-2 border-edge bg-muted",
    "hover:border-edge-hover",
    "focus-visible:outline-none focus-visible:ring-3",
    "focus-visible:ring-primary-500",
    "disabled:opacity-50 disabled:pointer-events-none",
    "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
    "transition-colors",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-[18px] w-8",
        md: "h-[22px] w-10",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const thumbVariants = cva(
  [
    "pointer-events-none block rounded-full bg-white",
    "shadow-sm transition-transform",
    "data-[state=unchecked]:translate-x-0.5",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "size-3 data-[state=checked]:translate-x-3.5",
        md: "size-4 data-[state=checked]:translate-x-[18px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type SwitchProps = Omit<
  ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
  "size"
> &
  VariantProps<typeof switchVariants>;

const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ size, className, ...rest }, ref) => {
    return (
      <SwitchPrimitive.Root
        ref={ref}
        className={cn(switchVariants({ size }), className)}
        {...rest}
      >
        <SwitchPrimitive.Thumb className={thumbVariants({ size })} />
      </SwitchPrimitive.Root>
    );
  },
);

Switch.displayName = "Switch";

export { Switch, switchVariants, type SwitchProps };
