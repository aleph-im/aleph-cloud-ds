import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Tooltip as TooltipPrimitive } from "radix-ui";
import { cn } from "@ac/lib/cn";

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, ...rest }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        [
          "z-50 rounded-lg bg-neutral-900 dark:bg-base-700 px-3 py-1.5",
          "text-sm text-white shadow-brand-sm",
          "animate-in fade-in-0 zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
          "data-[state=closed]:zoom-out-95",
          "motion-reduce:animate-none",
        ].join(" "),
        className,
      )}
      {...rest}
    />
  </TooltipPrimitive.Portal>
));

TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
