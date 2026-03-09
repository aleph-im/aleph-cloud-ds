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

const TabsList = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, children, ...rest }, ref) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  // Merge forwarded ref with inner ref
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
      className={cn(
        "relative flex border-b-2 border-edge",
        className,
      )}
      {...rest}
    >
      {children}
      <div
        ref={indicatorRef}
        className={cn(
          "absolute bottom-0 left-0 h-0.5",
          "bg-primary-600 dark:bg-primary-400",
          ready
            ? "transition-[transform,width] duration-200 ease-out"
            : "",
          "motion-reduce:transition-none",
        )}
        aria-hidden
      />
    </TabsPrimitive.List>
  );
});

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
        "inline-flex items-center gap-2 px-3 py-3",
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

export { Tabs, TabsContent, TabsList, TabsTrigger };
