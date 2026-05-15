"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@ac/lib/cn";

export type PageHeaderConfig = {
  title: ReactNode;
  actions?: ReactNode;
  search?: ReactNode;
  breadcrumb?: ReactNode;
};

type SetConfigFn = (config: PageHeaderConfig | null) => void;

// Split read and write contexts so usePageHeader only subscribes to the
// (identity-stable) setter. Pages that register via usePageHeader do not
// re-render when the header content changes — otherwise unstable ReactNode
// props (e.g. inline JSX in `actions`) trigger an infinite render loop.
const PageHeaderReadContext = createContext<PageHeaderConfig | null>(null);
const PageHeaderWriteContext = createContext<SetConfigFn | null>(null);

export function PageHeaderProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<PageHeaderConfig | null>(null);
  return (
    <PageHeaderWriteContext.Provider value={setConfig}>
      <PageHeaderReadContext.Provider value={config}>
        {children}
      </PageHeaderReadContext.Provider>
    </PageHeaderWriteContext.Provider>
  );
}

export function usePageHeader(config: PageHeaderConfig): void {
  const setConfig = useContext(PageHeaderWriteContext);
  const { title, actions, search, breadcrumb } = config;
  useEffect(() => {
    if (!setConfig) return;
    setConfig({ title, actions, search, breadcrumb });
    return () => setConfig(null);
  }, [setConfig, title, actions, search, breadcrumb]);
}

export type PageHeaderProps = {
  leading?: ReactNode;
  fallbackTitle?: ReactNode;
  className?: string;
};

export function PageHeader({
  leading,
  fallbackTitle,
  className,
}: PageHeaderProps) {
  const config = useContext(PageHeaderReadContext);
  const title = config?.title ?? fallbackTitle;
  if (!title && !leading) {
    return null;
  }
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-12 shrink-0 items-center gap-3 border-b border-edge bg-background/95 backdrop-blur px-4 md:px-6",
        className,
      )}
    >
      {leading && <div className="shrink-0">{leading}</div>}
      <div className="min-w-0 flex items-center gap-2">
        {config?.breadcrumb && (
          <div className="text-sm text-muted-foreground shrink-0">
            {config.breadcrumb}
          </div>
        )}
        {title && (
          <div className="truncate text-sm font-medium text-foreground">
            {title}
          </div>
        )}
      </div>
      <div className="ml-auto flex items-center gap-2">
        {config?.search}
        {config?.actions}
      </div>
    </header>
  );
}
