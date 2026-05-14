import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useAccordionState } from "./use-accordion-state";

const KEY = (id: string) => `sidebar.section.${id}`;

describe("useAccordionState", () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => window.localStorage.clear());

  it("reads existing localStorage value on mount", () => {
    window.localStorage.setItem(KEY("resources"), "false");
    const { result } = renderHook(() => useAccordionState("resources"));
    expect(result.current.open).toBe(false);
  });

  it("defaults open=true when localStorage is empty", () => {
    const { result } = renderHook(() => useAccordionState("resources"));
    expect(result.current.open).toBe(true);
  });

  it("respects defaultOpen=false when localStorage is empty", () => {
    const { result } = renderHook(() => useAccordionState("resources", false));
    expect(result.current.open).toBe(false);
  });

  it("persists setOpen to localStorage under per-section key", () => {
    const { result } = renderHook(() => useAccordionState("resources"));
    act(() => result.current.setOpen(false));
    expect(window.localStorage.getItem(KEY("resources"))).toBe("false");
    expect(result.current.open).toBe(false);
  });

  it("toggle flips the value", () => {
    const { result } = renderHook(() => useAccordionState("resources"));
    act(() => result.current.toggle());
    expect(result.current.open).toBe(false);
    act(() => result.current.toggle());
    expect(result.current.open).toBe(true);
  });

  it("keys state separately per sectionId", () => {
    const { result: a } = renderHook(() => useAccordionState("dashboard"));
    const { result: b } = renderHook(() => useAccordionState("operations"));
    act(() => a.current.setOpen(false));
    expect(b.current.open).toBe(true);
  });
});
