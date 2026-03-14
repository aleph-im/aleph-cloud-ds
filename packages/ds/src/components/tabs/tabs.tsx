"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from "react";
import { Tabs as TabsPrimitive, Popover } from "radix-ui";
import { DotsThree } from "@phosphor-icons/react";
import { cn } from "@ac/lib/cn";

/* ── Root (direct re-export) ─────────────────── */

const Tabs = TabsPrimitive.Root;

/* ── List (with sliding indicator) ───────────── */

type TabsVariant = "underline" | "pill";

type TabsListProps = ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
  variant?: TabsVariant;
  overflow?: "collapse";
};

/* ── Overflow hook ───────────────────────────── */

function useOverflow(
  listRef: React.RefObject<HTMLElement | null>,
  overflowTriggerRef: React.RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const [hiddenTabs, setHiddenTabs] = useState<HiddenTab[]>([]);
  const [hasActiveHidden, setHasActiveHidden] = useState(false);

  const measure = useCallback(() => {
    const list = listRef.current;
    const trigger = overflowTriggerRef.current;
    if (!list || !trigger || !enabled) {
      setHiddenTabs([]);
      setHasActiveHidden(false);
      return;
    }

    const tabs = Array.from(
      list.querySelectorAll<HTMLElement>('[role="tab"]'),
    );

    // Reset all tabs to normal flow for measurement
    for (const tab of tabs) {
      tab.style.visibility = "";
      tab.style.position = "";
      tab.style.pointerEvents = "";
    }

    const containerLeft = list.getBoundingClientRect().left;
    const containerWidth = list.clientWidth;
    const triggerWidth = trigger.offsetWidth;

    let newBreakIndex: number | null = null;

    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i] as HTMLElement;
      const tabRight = tab.getBoundingClientRect().right - containerLeft;
      if (tabRight + triggerWidth > containerWidth) {
        newBreakIndex = i;
        break;
      }
    }

    // All tabs fit — no overflow needed
    if (newBreakIndex === null) {
      const lastTab = tabs[tabs.length - 1];
      if (lastTab) {
        const lastRight =
          lastTab.getBoundingClientRect().right - containerLeft;
        if (lastRight <= containerWidth) {
          setHiddenTabs([]);
          setHasActiveHidden(false);
          return;
        }
      }
      setHiddenTabs([]);
      setHasActiveHidden(false);
      return;
    }

    // Hide overflowed tabs
    for (let i = newBreakIndex; i < tabs.length; i++) {
      const tab = tabs[i] as HTMLElement;
      tab.style.visibility = "hidden";
      tab.style.position = "absolute";
      tab.style.pointerEvents = "none";
    }

    // Focus management: move focus to trigger if focused tab overflowed
    const focused = document.activeElement;
    if (focused instanceof HTMLElement) {
      for (let i = newBreakIndex; i < tabs.length; i++) {
        const tab = tabs[i] as HTMLElement;
        if (tab === focused || tab.contains(focused)) {
          trigger.focus();
          break;
        }
      }
    }

    // Build hiddenTabs array
    const newHidden: HiddenTab[] = [];
    let activeHidden = false;
    for (let i = newBreakIndex; i < tabs.length; i++) {
      const tab = tabs[i] as HTMLElement;
      newHidden.push({
        value: tab.getAttribute("data-value") ?? tab.id ?? "",
        label: tab.textContent ?? "",
        disabled: tab.hasAttribute("disabled"),
        triggerEl: tab,
      });
      if (tab.dataset["state"] === "active") activeHidden = true;
    }

    setHiddenTabs(newHidden);
    setHasActiveHidden(activeHidden);
  }, [listRef, overflowTriggerRef, enabled]);

  useEffect(() => {
    const list = listRef.current;
    if (!list || !enabled) return;

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(list);

    const mutationObserver = new MutationObserver(measure);
    mutationObserver.observe(list, {
      attributes: true,
      subtree: true,
      attributeFilter: ["data-state"],
    });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [enabled, measure]);

  return { hiddenTabs, hasActiveHidden };
}

/* ── Overflow types & trigger ────────────────── */

type HiddenTab = {
  value: string;
  label: string;
  disabled: boolean;
  triggerEl: HTMLElement;
};

type OverflowTriggerProps = {
  isPill: boolean;
  hiddenTabs: HiddenTab[];
  hasActiveHidden: boolean;
  visible: boolean;
};

const OverflowTrigger = forwardRef<HTMLButtonElement, OverflowTriggerProps>(
  ({ isPill, hiddenTabs, hasActiveHidden, visible }, ref) => {
    const [open, setOpen] = useState(false);

    return (
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            ref={ref}
            type="button"
            aria-label="More tabs"
            className={cn(
              "inline-flex items-center justify-center shrink-0",
              "font-heading font-bold",
              hasActiveHidden
                ? "text-primary-600 dark:text-primary-400"
                : "text-muted-foreground",
              "transition-colors duration-200",
              "hover:text-primary-600 dark:hover:text-primary-400",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-primary-400 focus-visible:ring-offset-2",
              "motion-reduce:transition-none",
              isPill
                ? "relative z-10 rounded-full px-3 py-1.5 text-sm"
                : "px-4 py-3 text-lg",
              !visible && "invisible",
            )}
          >
            <DotsThree weight="bold" className="size-5" aria-hidden="true" />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className={cn(
              "z-50 min-w-[8rem]",
              "rounded-md bg-surface border border-edge shadow-brand",
              "p-1",
              "motion-reduce:transition-none",
            )}
            sideOffset={4}
            align="end"
          >
            {hiddenTabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                disabled={tab.disabled}
                onClick={() => {
                  const el = tab.triggerEl;
                  // Restore visibility so the trigger can receive focus.
                  // Radix auto-activation changes the value on focus.
                  // measure() re-hides via MutationObserver after
                  // data-state updates.
                  el.style.visibility = "";
                  el.style.pointerEvents = "";
                  el.focus();
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center rounded-sm px-3 py-2",
                  "text-sm text-foreground cursor-pointer select-none",
                  "outline-none",
                  "hover:bg-muted focus-visible:bg-muted",
                  "disabled:opacity-50 disabled:pointer-events-none",
                  tab.triggerEl.dataset["state"] === "active" &&
                    "text-primary-600 dark:text-primary-400 font-bold",
                )}
              >
                {tab.label}
              </button>
            ))}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
  },
);

OverflowTrigger.displayName = "OverflowTrigger";

const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, variant = "underline", overflow, ...rest }, ref) => {
    const innerRef = useRef<HTMLDivElement>(null);
    const indicatorRef = useRef<HTMLDivElement>(null);
    const overflowTriggerRef = useRef<HTMLButtonElement>(null);
    const [ready, setReady] = useState(false);
    const isPill = variant === "pill";
    const isCollapse = overflow === "collapse";

    const setRefs = (node: HTMLDivElement | null) => {
      innerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    const { hiddenTabs, hasActiveHidden } = useOverflow(
      innerRef,
      overflowTriggerRef,
      isCollapse,
    );

    useEffect(() => {
      const list = innerRef.current;
      const indicator = indicatorRef.current;
      if (!list || !indicator) return;

      function updateIndicator() {
        const activeTab = list!.querySelector<HTMLElement>(
          '[data-state="active"]',
        );
        if (!activeTab || !indicator) return;

        // Hide indicator when the active tab is visually hidden (overflowed)
        if (activeTab.style.visibility === "hidden") {
          indicator.style.opacity = "0";
          return;
        }
        indicator.style.opacity = "";

        const left = activeTab.offsetLeft;
        const width = activeTab.offsetWidth;
        indicator.style.transform = `translateX(${String(left)}px)`;
        indicator.style.width = `${String(width)}px`;
        if (!ready) setReady(true);
      }

      updateIndicator();

      const observer = new MutationObserver(updateIndicator);
      observer.observe(list, {
        attributes: true,
        subtree: true,
        attributeFilter: ["data-state"],
      });

      const resizeObserver = new ResizeObserver(updateIndicator);
      resizeObserver.observe(list);

      return () => {
        observer.disconnect();
        resizeObserver.disconnect();
      };
    }, [ready]);

    return (
      <TabsPrimitive.List
        ref={setRefs}
        data-variant={variant}
        className={cn(
          "relative flex",
          isPill
            ? [
                "group rounded-full bg-neutral-200 p-1 dark:bg-neutral-800/50",
                !isCollapse && "inline-flex",
              ]
            : "border-b-4 border-edge/40",
          className,
        )}
        {...rest}
      >
        {children}
        {isCollapse && (
          <OverflowTrigger
            ref={overflowTriggerRef}
            isPill={isPill}
            hiddenTabs={hiddenTabs}
            hasActiveHidden={hasActiveHidden}
            visible={hiddenTabs.length > 0}
          />
        )}
        <div
          ref={indicatorRef}
          className={cn(
            "absolute left-0",
            isPill
              ? [
                  "inset-y-1 rounded-full bg-primary-600 dark:bg-primary-500",
                  ready ? "opacity-100" : "opacity-0",
                  ready
                    ? "transition-[transform,width,opacity] duration-200 ease-out"
                    : "",
                ]
              : [
                  "-bottom-1 h-1",
                  "bg-primary-600 dark:bg-primary-400",
                  ready
                    ? "transition-[transform,width] duration-200 ease-out"
                    : "",
                ],
            "motion-reduce:transition-none",
          )}
          aria-hidden
        />
      </TabsPrimitive.List>
    );
  },
);

TabsList.displayName = "TabsList";

/* ── Trigger ─────────────────────────────────── */

const TabsTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...rest }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      [
        "inline-flex items-center gap-2 px-4 py-3",
        "font-heading font-bold text-lg",
        "text-foreground",
        "transition-[color,transform] duration-200 ease-out",
        "hover:text-primary-600 dark:hover:text-primary-400",
        "data-[state=active]:text-primary-600",
        "dark:data-[state=active]:text-primary-400",
        "data-[state=active]:-translate-y-0.5",
        "disabled:opacity-20 disabled:pointer-events-none",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-primary-400 focus-visible:ring-offset-2",
        "motion-reduce:transition-none",
        // Pill variant overrides (via group data attribute on TabsList)
        "group-data-[variant=pill]:relative group-data-[variant=pill]:z-10",
        "group-data-[variant=pill]:rounded-full",
        "group-data-[variant=pill]:px-5 group-data-[variant=pill]:py-1.5",
        "group-data-[variant=pill]:text-sm",
        "group-data-[variant=pill]:text-muted-foreground",
        "group-data-[variant=pill]:translate-y-0",
        "group-data-[variant=pill]:hover:text-foreground",
        "group-data-[variant=pill]:data-[state=active]:text-white",
        "group-data-[variant=pill]:data-[state=active]:translate-y-0",
        "group-data-[variant=pill]:focus-visible:ring-offset-0",
      ].join(" "),
      className,
    )}
    {...rest}
  />
));

TabsTrigger.displayName = "TabsTrigger";

/* ── Content ─────────────────────────────────── */

const TabsContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...rest }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn("mt-4", className)}
    {...rest}
  />
));

TabsContent.displayName = "TabsContent";

/* ── Exports ─────────────────────────────────── */

export {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  type TabsListProps,
  type TabsVariant,
};
