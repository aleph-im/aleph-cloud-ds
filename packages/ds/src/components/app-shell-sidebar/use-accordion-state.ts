"use client";

import { useCallback, useEffect, useState } from "react";

const storageKey = (sectionId: string) => `sidebar.section.${sectionId}`;

export type UseAccordionState = {
  open: boolean | null;
  setOpen: (next: boolean) => void;
  toggle: () => void;
};

export function useAccordionState(
  sectionId: string,
  defaultOpen = true,
): UseAccordionState {
  const [open, setOpenState] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey(sectionId));
    if (stored === null) {
      setOpenState(defaultOpen);
    } else {
      setOpenState(stored === "true");
    }
  }, [sectionId, defaultOpen]);

  const setOpen = useCallback(
    (next: boolean) => {
      setOpenState(next);
      window.localStorage.setItem(storageKey(sectionId), String(next));
    },
    [sectionId],
  );

  const toggle = useCallback(() => {
    setOpenState((prev) => {
      const next = !(prev ?? defaultOpen);
      window.localStorage.setItem(storageKey(sectionId), String(next));
      return next;
    });
  }, [sectionId, defaultOpen]);

  return { open, setOpen, toggle };
}
