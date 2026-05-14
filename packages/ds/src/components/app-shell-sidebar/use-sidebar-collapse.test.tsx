import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useSidebarCollapse } from "./use-sidebar-collapse";

const KEY = "sidebar.collapsed";

describe("useSidebarCollapse", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("returns null or boolean on initial render", () => {
    const { result } = renderHook(() => useSidebarCollapse());
    expect([null, true, false]).toContain(result.current.collapsed);
  });

  it("reads existing localStorage value on mount", () => {
    window.localStorage.setItem(KEY, "true");
    const { result } = renderHook(() => useSidebarCollapse());
    expect(result.current.collapsed).toBe(true);
  });

  it("persists setCollapsed to localStorage", () => {
    const { result } = renderHook(() => useSidebarCollapse());
    act(() => result.current.setCollapsed(true));
    expect(window.localStorage.getItem(KEY)).toBe("true");
    expect(result.current.collapsed).toBe(true);
  });

  it("toggle flips the value", () => {
    const { result } = renderHook(() => useSidebarCollapse());
    act(() => result.current.setCollapsed(false));
    act(() => result.current.toggle());
    expect(result.current.collapsed).toBe(true);
    act(() => result.current.toggle());
    expect(result.current.collapsed).toBe(false);
  });

  it("toggle treats null as expanded (next state = true / collapsed)", () => {
    const { result } = renderHook(() => useSidebarCollapse());
    act(() => {
      window.localStorage.removeItem(KEY);
    });
    act(() => result.current.toggle());
    expect(result.current.collapsed).toBe(true);
  });
});
