import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Select as SelectPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { CaretDown, Check } from "@phosphor-icons/react";
import { cn } from "@ac/lib/cn";

const triggerVariants = cva(
  [
    "inline-flex items-center justify-between",
    "w-full font-sans text-foreground bg-surface dark:bg-base-800",
    "border-0 shadow-brand rounded-full",
    "focus-visible:outline-none focus-visible:ring-3",
    "focus-visible:ring-primary-500",
    "disabled:opacity-50 disabled:pointer-events-none",
    "ring-0 transition-[color,box-shadow]",
    "data-[placeholder]:text-muted-foreground",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "py-1.5 px-4 text-sm",
        md: "py-2 px-5 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SelectProps = Omit<
  ComponentPropsWithoutRef<typeof SelectPrimitive.Root>,
  "children"
> &
  VariantProps<typeof triggerVariants> & {
    options: SelectOption[];
    placeholder?: string;
    error?: boolean;
    className?: string;
    id?: string;
    "aria-describedby"?: string;
  };

const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      options,
      placeholder,
      size,
      error = false,
      className,
      id,
      "aria-describedby": ariaDescribedBy,
      ...rest
    },
    ref,
  ) => {
    return (
      <SelectPrimitive.Root {...rest}>
        <SelectPrimitive.Trigger
          ref={ref}
          id={id}
          aria-describedby={ariaDescribedBy}
          aria-invalid={error || undefined}
          className={cn(
            triggerVariants({ size }),
            error && "border-3 border-error-400 hover:border-error-500",
            className,
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon className="ml-2 shrink-0 text-muted-foreground">
            <CaretDown weight="bold" className="size-4" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className={cn(
              "z-50 overflow-hidden rounded-2xl",
              "bg-surface border border-edge shadow-brand",
            )}
            position="popper"
            sideOffset={4}
          >
            <SelectPrimitive.Viewport className="p-1">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled ?? false}
                  className={cn(
                    "relative flex items-center rounded-xl px-4 py-2",
                    "text-sm text-foreground cursor-pointer select-none",
                    "outline-none",
                    "data-[highlighted]:bg-muted",
                    "data-[disabled]:opacity-50",
                    "data-[disabled]:pointer-events-none",
                  )}
                >
                  <SelectPrimitive.ItemText>
                    {option.label}
                  </SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="ml-auto">
                    <Check weight="bold" className="size-4" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    );
  },
);

Select.displayName = "Select";

export { Select, triggerVariants, type SelectProps, type SelectOption };
