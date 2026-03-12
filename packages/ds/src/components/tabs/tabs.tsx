"use client";

import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from "react";
import { Tabs as TabsPrimitive } from "radix-ui";
import { cn } from "@ac/lib/cn";

/* ── Root (direct re-export) ─────────────────── */

const Tabs = TabsPrimitive.Root;

/* ── List (with sliding indicator) ───────────── */

type TabsVariant = "underline" | "pill";

type TabsListProps = ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
  variant?: TabsVariant;
};

const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, variant = "underline", ...rest }, ref) => {
    const innerRef = useRef<HTMLDivElement>(null);
    const indicatorRef = useRef<HTMLDivElement>(null);
    const [ready, setReady] = useState(false);
    const isPill = variant === "pill";

    const setRefs = (node: HTMLDivElement | null) => {
      innerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    useEffect(() => {
      const list = innerRef.current;
      const indicator = indicatorRef.current;
      if (!list || !indicator) return;

      function updateIndicator() {
        const activeTab = list!.querySelector<HTMLElement>(
          '[data-state="active"]',
        );
        if (!activeTab || !indicator) return;
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
            ? "group inline-flex rounded-full bg-neutral-200 p-1 dark:bg-neutral-800/50"
            : "border-b-4 border-edge/40",
          className,
        )}
        {...rest}
      >
        {children}
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
