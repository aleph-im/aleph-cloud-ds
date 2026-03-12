import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Slot } from "radix-ui";
import { cn } from "@ac/lib/cn";

/* ── Breadcrumb (nav wrapper) ────────────────── */

const Breadcrumb = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  ({ className, ...rest }, ref) => (
    <nav
      ref={ref}
      aria-label="Breadcrumb"
      className={cn(className)}
      {...rest}
    />
  ),
);

Breadcrumb.displayName = "Breadcrumb";

/* ── BreadcrumbList (ol) ─────────────────────── */

const BreadcrumbList = forwardRef<
  HTMLOListElement,
  HTMLAttributes<HTMLOListElement>
>(({ className, ...rest }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-1",
      "font-heading font-extrabold italic uppercase text-xs",
      className,
    )}
    {...rest}
  />
));

BreadcrumbList.displayName = "BreadcrumbList";

/* ── BreadcrumbItem (li) ─────────────────────── */

const BreadcrumbItem = forwardRef<
  HTMLLIElement,
  HTMLAttributes<HTMLLIElement>
>(({ className, ...rest }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center", className)}
    {...rest}
  />
));

BreadcrumbItem.displayName = "BreadcrumbItem";

/* ── BreadcrumbLink (a, with asChild) ────────── */

type BreadcrumbLinkProps = HTMLAttributes<HTMLAnchorElement> & {
  asChild?: boolean;
  href?: string;
};

const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ asChild, className, ...rest }, ref) => {
    const Comp = asChild ? Slot.Root : "a";
    return (
      <Comp
        ref={ref}
        className={cn(
          "text-foreground",
          "transition-colors duration-150",
          "hover:text-primary-600 dark:hover:text-primary-400",
          "motion-reduce:transition-none",
          className,
        )}
        {...rest}
      />
    );
  },
);

BreadcrumbLink.displayName = "BreadcrumbLink";

/* ── BreadcrumbSeparator (li, visual only) ───── */

type BreadcrumbSeparatorProps = HTMLAttributes<HTMLLIElement> & {
  children?: ReactNode;
};

const BreadcrumbSeparator = forwardRef<
  HTMLLIElement,
  BreadcrumbSeparatorProps
>(({ children, className, ...rest }, ref) => (
  <li
    ref={ref}
    aria-hidden="true"
    className={cn("text-primary opacity-40", className)}
    {...rest}
  >
    {children ?? "/"}
  </li>
));

BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

/* ── BreadcrumbPage (current page) ───────────── */

const BreadcrumbPage = forwardRef<
  HTMLSpanElement,
  HTMLAttributes<HTMLSpanElement>
>(({ className, ...rest }, ref) => (
  <span
    ref={ref}
    aria-current="page"
    className={cn("text-neutral opacity-40", className)}
    {...rest}
  />
));

BreadcrumbPage.displayName = "BreadcrumbPage";

/* ── Exports ─────────────────────────────────── */

export {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  type BreadcrumbLinkProps,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
