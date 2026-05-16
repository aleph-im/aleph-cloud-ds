"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";
import { Logo } from "@ac/components/logo/logo";
import { cn } from "@ac/lib/cn";

export type ProductApp = {
  id: string;
  label: string;
  href: string;
  external?: boolean;
};

export type ProductStripProps = {
  apps: ProductApp[];
  activeId: string;
  logoHref: string;
  right?: ReactNode;
  className?: string;
};

const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export function ProductStrip({
  apps,
  activeId,
  logoHref,
  right,
  className,
}: ProductStripProps) {
  const navRef = useRef<HTMLElement>(null);
  const trackRefs = useRef<Map<string, HTMLSpanElement>>(new Map());
  const indicatorRef = useRef<HTMLSpanElement>(null);

  const setIndicatorTo = (el: HTMLElement | null) => {
    const nav = navRef.current;
    const ind = indicatorRef.current;
    if (!nav || !ind) return;
    if (!el) {
      ind.style.width = "0px";
      ind.style.opacity = "0";
      return;
    }
    const navRect = nav.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    ind.style.left = `${r.left - navRect.left}px`;
    ind.style.width = `${r.width}px`;
    ind.style.opacity = "1";
  };

  const restToActive = () => {
    const activeTrack = trackRefs.current.get(activeId) ?? null;
    setIndicatorTo(activeTrack);
  };

  useIsoLayoutEffect(() => {
    restToActive();
    const nav = navRef.current;
    if (!nav) return;
    const ro = new ResizeObserver(() => restToActive());
    ro.observe(nav);
    return () => ro.disconnect();
    // restToActive depends on activeId; apps in deps catches list changes.
  }, [activeId, apps]);

  return (
    <div
      className={cn(
        "flex h-[54px] w-full items-center gap-[48px] border-b border-edge",
        "bg-muted/40 dark:bg-surface px-3",
        className,
      )}
    >
      <a
        href={logoHref}
        aria-label="Aleph"
        className="flex shrink-0 items-center"
      >
        <Logo className="h-4 text-foreground" />
      </a>
      <nav
        ref={navRef}
        aria-label="Aleph products"
        className="relative flex h-full items-center gap-[18px]"
        onMouseLeave={restToActive}
      >
        <span
          ref={indicatorRef}
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute top-0 left-0 h-[2px] rounded-b-[2px]",
            "transition-all duration-200 ease-out",
            "motion-reduce:transition-none",
          )}
          style={{
            width: 0,
            opacity: 0,
            background:
              "linear-gradient(90deg, var(--color-primary-300), var(--color-primary-500))",
            boxShadow: "0 4px 16px -4px var(--color-primary-500)",
          }}
        />
        {apps.map((app) => {
          const isActive = app.id === activeId;
          return (
            <a
              key={app.id}
              href={app.href}
              aria-current={isActive ? "page" : undefined}
              data-external={app.external ? "true" : undefined}
              onMouseEnter={() =>
                setIndicatorTo(trackRefs.current.get(app.id) ?? null)
              }
              className={cn(
                "group inline-flex h-full items-center gap-1.5 text-sm",
                "text-muted-foreground transition-colors motion-reduce:transition-none",
                "hover:text-foreground",
                "focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2",
                "dark:focus-visible:outline-primary-300",
                isActive && "text-foreground font-medium",
              )}
              style={{ transitionDuration: "var(--duration-fast)" }}
            >
              <span
                ref={(el) => {
                  if (el) trackRefs.current.set(app.id, el);
                  else trackRefs.current.delete(app.id);
                }}
                className="inline-flex items-center gap-1.5"
              >
                {app.label}
                {app.external && (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 10 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={cn(
                      "h-2.5 w-2.5 origin-bottom-left shrink-0",
                      "opacity-0 scale-0 -rotate-[25deg]",
                      "transition-[opacity,transform] duration-300",
                      "[transition-timing-function:cubic-bezier(.16,1,.3,1)]",
                      "group-hover:opacity-100 group-hover:scale-100 group-hover:rotate-0",
                      isActive && "opacity-100 scale-100 rotate-0",
                      "motion-reduce:transition-none",
                      "motion-reduce:group-hover:opacity-100",
                    )}
                  >
                    <path d="M2 8 L8 2 M4 2 L8 2 L8 6" />
                  </svg>
                )}
              </span>
              {!app.external && (
                <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0" />
              )}
            </a>
          );
        })}
      </nav>
      {right && (
        <div className="ml-auto flex shrink-0 items-center gap-2">{right}</div>
      )}
    </div>
  );
}
