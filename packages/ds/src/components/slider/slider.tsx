import { forwardRef, useState, type ComponentPropsWithoutRef } from "react";
import { Slider as SliderPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ac/lib/cn";

const trackVariants = cva(
  [
    "relative w-full grow overflow-hidden rounded-full",
    "bg-base-200 dark:bg-base-700",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-1.5",
        md: "h-2",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const thumbVariants = cva(
  [
    "block rounded-full bg-white shadow-sm",
    "border-2 border-primary-500",
    "focus-visible:outline-none focus-visible:ring-3",
    "focus-visible:ring-primary-500",
    "disabled:pointer-events-none",
    "transition-[box-shadow] motion-reduce:transition-none",
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

type SliderProps = Omit<
  ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
  "size"
> &
  VariantProps<typeof trackVariants> & {
    error?: boolean;
    showTooltip?: boolean;
  };

const Slider = forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    {
      size,
      error = false,
      showTooltip = false,
      className,
      disabled,
      onValueChange: onValueChangeProp,
      ...rootProps
    },
    ref,
  ) => {
    const [hovering, setHovering] = useState(false);
    const [internalValue, setInternalValue] = useState(
      rootProps.defaultValue ?? rootProps.value ?? [0],
    );

    const displayValue = rootProps.value ?? internalValue;

    return (
      <SliderPrimitive.Root
        ref={ref}
        {...(disabled ? { disabled: true } : {})}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          disabled && "opacity-50 pointer-events-none",
          className,
        )}
        onValueChange={(val) => {
          setInternalValue(val);
          onValueChangeProp?.(val);
        }}
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => setHovering(false)}
        {...rootProps}
      >
        <SliderPrimitive.Track
          className={cn(
            trackVariants({ size }),
            error && "ring-2 ring-error-400",
          )}
        >
          <SliderPrimitive.Range className="absolute h-full bg-primary-500 rounded-full" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          className={cn(thumbVariants({ size }), "relative")}
        >
          {showTooltip && hovering && (
            <span
              className={cn(
                "absolute bottom-full left-1/2 -translate-x-1/2 mb-2",
                "rounded-md bg-neutral-900 dark:bg-base-700 px-2 py-1",
                "text-xs text-white whitespace-nowrap pointer-events-none",
              )}
            >
              {displayValue[0]}
            </span>
          )}
        </SliderPrimitive.Thumb>
      </SliderPrimitive.Root>
    );
  },
);

Slider.displayName = "Slider";

export { Slider, trackVariants, thumbVariants, type SliderProps };
