import { forwardRef, useState } from "react";
import { Popover } from "radix-ui";
import { Command } from "cmdk";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ac/lib/cn";

const triggerVariants = cva(
  [
    "inline-flex items-center gap-1.5",
    "w-full font-sans text-foreground bg-surface dark:bg-neutral-800",
    "border-0 shadow-brand rounded-2xl",
    "focus-visible:outline-none focus-visible:ring-3",
    "focus-visible:ring-primary-500",
    "aria-disabled:opacity-50 aria-disabled:pointer-events-none",
    "ring-0 transition-[color,box-shadow]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "min-h-9 py-1 px-3 text-sm",
        md: "min-h-11 py-1.5 px-4 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const tagVariants = cva(
  [
    "inline-flex items-center gap-1 rounded-full bg-muted",
    "text-foreground max-w-32 select-none",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-0.5 text-sm",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type MultiSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type MultiSelectProps = VariantProps<typeof triggerVariants> & {
  options: MultiSelectOption[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  maxDisplayedTags?: number;
  size?: "sm" | "md";
  error?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
};

const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      options,
      value = [],
      onValueChange,
      placeholder = "Select...",
      searchPlaceholder = "Search...",
      emptyMessage = "No results found.",
      maxDisplayedTags = 3,
      size,
      error = false,
      disabled = false,
      className,
      id,
      "aria-describedby": ariaDescribedBy,
      ...rest
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const hasSelection = value.length > 0;

    const selectedOptions = options.filter((o) =>
      value.includes(o.value),
    );
    const displayedTags = selectedOptions.slice(0, maxDisplayedTags);
    const overflowCount =
      selectedOptions.length - displayedTags.length;

    function toggle(optionValue: string) {
      if (!onValueChange) return;
      const next = value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue];
      onValueChange(next);
      setSearch("");
    }

    function removeTag(
      e: React.MouseEvent,
      optionValue: string,
    ) {
      e.stopPropagation();
      onValueChange?.(value.filter((v) => v !== optionValue));
    }

    function clearAll(e: React.MouseEvent) {
      e.stopPropagation();
      onValueChange?.([]);
    }

    return (
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <div
            ref={ref}
            id={id}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-disabled={disabled || undefined}
            aria-describedby={ariaDescribedBy}
            aria-invalid={error || undefined}
            className={cn(
              triggerVariants({ size }),
              "flex-wrap cursor-pointer",
              error &&
                "border-3 border-error-400 hover:border-error-500",
              !hasSelection && "text-muted-foreground",
              className,
            )}
            {...rest}
          >
          {hasSelection ? (
            <>
              {displayedTags.map((opt) => (
                <span
                  key={opt.value}
                  className={tagVariants({ size })}
                >
                  <span className="truncate">{opt.label}</span>
                  <button
                    type="button"
                    aria-label={`Remove ${opt.label}`}
                    onClick={(e) => removeTag(e, opt.value)}
                    className={cn(
                      "shrink-0 rounded-full",
                      "hover:bg-foreground/10 transition-colors",
                      size === "sm" ? "size-3.5" : "size-4",
                    )}
                    tabIndex={-1}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-full"
                      aria-hidden="true"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </span>
              ))}
              {overflowCount > 0 && (
                <span
                  className={cn(
                    "text-muted-foreground shrink-0",
                    size === "sm" ? "text-xs" : "text-sm",
                  )}
                >
                  +{overflowCount} more
                </span>
              )}
              <button
                type="button"
                aria-label="Clear all"
                onClick={clearAll}
                className={cn(
                  "ml-auto shrink-0 rounded-full",
                  "text-muted-foreground",
                  "hover:text-foreground transition-colors",
                  size === "sm" ? "size-4" : "size-5",
                )}
                tabIndex={-1}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-full"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </>
          ) : (
            <>
              <span className="truncate flex-1 text-left">
                {placeholder}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn(
                  "ml-auto size-4 shrink-0 text-muted-foreground",
                  "transition-transform",
                  "motion-reduce:transition-none",
                  open && "rotate-180",
                )}
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </>
          )}
          </div>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className={cn(
              "z-50 w-[var(--radix-popover-trigger-width)]",
              "overflow-hidden rounded-2xl",
              "bg-surface border border-edge shadow-brand",
            )}
            sideOffset={4}
            align="start"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <Command shouldFilter>
              <Command.Input
                placeholder={searchPlaceholder}
                value={search}
                onValueChange={setSearch}
                className={cn(
                  "w-full border-b border-edge bg-transparent",
                  "px-4 py-2.5",
                  "text-sm text-foreground",
                  "placeholder:text-muted-foreground",
                  "outline-none",
                )}
              />
              <Command.List className="max-h-60 overflow-y-auto p-1">
                <Command.Empty className="px-4 py-6 text-center text-sm text-muted-foreground">
                  {emptyMessage}
                </Command.Empty>
                {options.map((option) => {
                  const selected = value.includes(option.value);
                  return (
                    <Command.Item
                      key={option.value}
                      value={option.label}
                      {...(option.disabled
                        ? { disabled: true }
                        : {})}
                      onSelect={() => toggle(option.value)}
                      className={cn(
                        "relative flex items-center gap-2",
                        "rounded-xl px-3 py-2",
                        "text-sm text-foreground",
                        "cursor-pointer select-none",
                        "outline-none",
                        "data-[selected=true]:bg-muted",
                        "data-[disabled=true]:opacity-50",
                        "data-[disabled=true]:pointer-events-none",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-4 shrink-0 items-center",
                          "justify-center",
                          "rounded border-2 transition-colors",
                          selected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-edge bg-surface",
                        )}
                        aria-hidden="true"
                      >
                        {selected && (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={3}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="size-3"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </span>
                      <span className="flex-1">
                        {option.label}
                      </span>
                    </Command.Item>
                  );
                })}
              </Command.List>
            </Command>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
  },
);

MultiSelect.displayName = "MultiSelect";

export {
  MultiSelect,
  triggerVariants,
  type MultiSelectProps,
  type MultiSelectOption,
};
