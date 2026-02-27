import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ac/lib/cn";

const radioItemVariants = cva(
  [
    "peer shrink-0 rounded-full bg-card",
    "border-2 border-edge",
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
        sm: "size-4",
        md: "size-5",
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
  size?: "sm" | "md";
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
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <span className="block size-1/2 rounded-full bg-primary" />
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
