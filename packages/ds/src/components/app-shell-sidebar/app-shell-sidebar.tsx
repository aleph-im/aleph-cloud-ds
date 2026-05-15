"use client";

import {
  CaretDown,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react/dist/ssr";
import {
  cloneElement,
  createContext,
  isValidElement,
  type AnchorHTMLAttributes,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@ac/lib/cn";
import { useAccordionState } from "./use-accordion-state";

const SectionContext = createContext<{ isOpen: boolean; title: string } | null>(
  null,
);

export type AppShellSidebarProps = {
  appMark: ReactNode;
  collapsed: boolean | null;
  onToggle: () => void;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function AppShellSidebar({
  appMark,
  collapsed,
  onToggle,
  children,
  footer,
  className,
}: AppShellSidebarProps) {
  const isCollapsed = collapsed === true;
  return (
    <aside
      data-collapsed={isCollapsed ? "true" : "false"}
      className={cn(
        "flex flex-col bg-muted/40 dark:bg-surface",
        "transition-[width] duration-200 ease-out",
        isCollapsed ? "w-13" : "w-58",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-14 shrink-0 items-center px-3",
          isCollapsed && "justify-center",
        )}
        data-slot="app-mark"
      >
        {appMark}
      </div>
      <nav className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
        {children}
      </nav>
      <CollapseToggle
        collapsed={isCollapsed}
        onToggle={onToggle}
        footer={footer}
      />
    </aside>
  );
}

function CollapseToggle({
  collapsed,
  onToggle,
  footer,
}: {
  collapsed: boolean;
  onToggle: () => void;
  footer?: ReactNode;
}) {
  const showFooter = !collapsed && footer != null;
  return (
    <div
      className={cn(
        "flex shrink-0 items-center border-t border-edge px-2 py-2",
        collapsed
          ? "justify-center"
          : showFooter
            ? "justify-between"
            : "justify-end",
      )}
    >
      {showFooter && (
        <div
          data-slot="sidebar-footer"
          className="min-w-0 px-1 text-xs text-muted-foreground"
        >
          {footer}
        </div>
      )}
      <button
        type="button"
        onClick={onToggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className={cn(
          "flex size-7 items-center justify-center rounded-md",
          "text-muted-foreground hover:text-foreground hover:bg-muted",
          "transition-colors",
        )}
        style={{ transitionDuration: "var(--duration-fast)" }}
      >
        {collapsed ? (
          <CaretRight size={14} weight="bold" />
        ) : (
          <CaretLeft size={14} weight="bold" />
        )}
      </button>
    </div>
  );
}

export type AccordionSectionProps = {
  title: string;
  sectionId: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

export function AccordionSection({
  title,
  sectionId,
  defaultOpen = true,
  children,
}: AccordionSectionProps) {
  const { open, toggle } = useAccordionState(sectionId, defaultOpen);
  const isOpen = open ?? defaultOpen;

  return (
    <SectionContext.Provider value={{ isOpen, title }}>
      <div className="mb-3" data-section-id={sectionId}>
        <SectionTitleRow title={title} isOpen={isOpen} onToggle={toggle} />
        {isOpen && <ul className="space-y-0.5">{children}</ul>}
      </div>
    </SectionContext.Provider>
  );
}

function SectionTitleRow({
  title,
  isOpen,
  onToggle,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className={cn(
        "group flex w-full items-center justify-between rounded px-2 py-1",
        "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground",
        "hover:text-foreground hover:bg-muted",
        "transition-colors",
        "rail-hide",
      )}
      style={{ transitionDuration: "var(--duration-fast)" }}
    >
      <span>{title}</span>
      {isOpen ? (
        <CaretDown size={10} weight="bold" />
      ) : (
        <CaretRight size={10} weight="bold" />
      )}
    </button>
  );
}

export type NavItemProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "children"
> & {
  href?: string;
  icon: ReactNode;
  children: ReactNode;
  active?: boolean;
  asChild?: boolean;
};

export function NavItem({
  asChild = false,
  href,
  icon,
  children,
  active,
  className,
  style,
  ...rest
}: NavItemProps) {
  const classes = cn(
    "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
    active
      ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200 font-medium"
      : "text-muted-foreground hover:text-foreground hover:bg-muted",
    className,
  );
  const mergedStyle: CSSProperties = {
    transitionDuration: "var(--duration-fast)",
    ...style,
  };
  const ariaCurrent = active ? "page" : undefined;

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{
      className?: string;
      style?: CSSProperties;
      children?: ReactNode;
    }>;
    return (
      <li>
        {cloneElement(
          child,
          {
            className: classes,
            style: mergedStyle,
            "aria-current": ariaCurrent,
            ...rest,
          },
          <>
            <span className="shrink-0">{icon}</span>
            <span className="rail-hide">{child.props.children}</span>
          </>,
        )}
      </li>
    );
  }

  return (
    <li>
      <a
        href={href}
        aria-current={ariaCurrent}
        className={classes}
        style={mergedStyle}
        {...rest}
      >
        <span className="shrink-0">{icon}</span>
        <span className="rail-hide">{children}</span>
      </a>
    </li>
  );
}
