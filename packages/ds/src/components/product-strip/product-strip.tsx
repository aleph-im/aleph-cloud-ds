import { type ReactNode } from "react";
import { Logo } from "@ac/components/logo/logo";
import { cn } from "@ac/lib/cn";

export type ProductApp = {
  id: string;
  label: string;
  href: string;
};

export type ProductStripProps = {
  apps: ProductApp[];
  activeId: string;
  logoHref: string;
  right?: ReactNode;
  className?: string;
};

export function ProductStrip({
  apps,
  activeId,
  logoHref,
  right,
  className,
}: ProductStripProps) {
  return (
    <div
      className={cn(
        "flex h-9 w-full items-center gap-3 border-b border-edge",
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
      <nav aria-label="Aleph products" className="flex items-center gap-1">
        {apps.map((app) => {
          const isActive = app.id === activeId;
          return (
            <a
              key={app.id}
              href={app.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "rounded-md px-2 py-1 text-sm transition-colors",
                "text-muted-foreground hover:text-foreground hover:bg-muted",
                isActive &&
                  "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200 font-medium",
              )}
              style={{ transitionDuration: "var(--duration-fast)" }}
            >
              {app.label}
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
