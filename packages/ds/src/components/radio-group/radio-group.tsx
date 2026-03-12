import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ac/lib/cn";

const radioItemVariants = cva(
  [
    "peer shrink-0 rounded-full bg-surface",
    "border-3 border-edge",
    "hover:border-edge-hover",
    "focus-visible:outline-none focus-visible:ring-3",
    "focus-visible:ring-primary-500",
    "disabled:opacity-50 disabled:pointer-events-none",
    "data-[state=checked]:border-primary",
    "transition-colors",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "size-4",
        sm: "size-5",
        md: "size-6",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type RadioGroupProps = ComponentPropsWithoutRef<
  typeof RadioGroupPrimitive.Root
> & {
  size?: "xs" | "sm" | "md";
};

const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, ...rest }, ref) => {
    return (
      <RadioGroupPrimitive.Root
        ref={ref}
        className={cn("flex flex-col gap-2", className)}
        {...rest}
      />
    );
  },
);
RadioGroup.displayName = "RadioGroup";

type RadioGroupItemProps = Omit<
  ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
  "size"
> &
  VariantProps<typeof radioItemVariants>;

const RadioGroupItem = forwardRef<HTMLButtonElement, RadioGroupItemProps>(
  ({ size, className, ...rest }, ref) => {
    return (
      <RadioGroupPrimitive.Item
        ref={ref}
        className={cn(radioItemVariants({ size }), className)}
        {...rest}
      >
        <RadioGroupPrimitive.Indicator
          forceMount
          className={cn(
            "flex size-full items-center justify-center",
            "[clip-path:circle(0%_at_50%_50%)]",
            "data-[state=checked]:[clip-path:circle(100%_at_50%_50%)]",
            "transition-[clip-path] duration-200 ease-in-out motion-reduce:transition-none",
          )}
        >
          <span className="block size-[80%] rounded-full bg-primary" />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
    );
  },
);
RadioGroupItem.displayName = "RadioGroupItem";

export {
  RadioGroup,
  RadioGroupItem,
  radioItemVariants,
  type RadioGroupProps,
  type RadioGroupItemProps,
};
