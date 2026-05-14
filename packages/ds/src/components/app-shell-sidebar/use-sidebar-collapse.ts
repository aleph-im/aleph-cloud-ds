"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "sidebar.collapsed";

export type UseSidebarCollapse = {
  collapsed: boolean | null;
  setCollapsed: (next: boolean) => void;
  toggle: () => void;
};

export function useSidebarCollapse(): UseSidebarCollapse {
  const [collapsed, setCollapsedState] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    setCollapsedState(stored === "true");
  }, []);

  const setCollapsed = useCallback((next: boolean) => {
    setCollapsedState(next);
    window.localStorage.setItem(STORAGE_KEY, String(next));
  }, []);

  const toggle = useCallback(() => {
    setCollapsedState((prev) => {
      const next = !(prev ?? false);
      window.localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  return { collapsed, setCollapsed, toggle };
}
