import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { createRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ac/components/tabs/tabs";

/* ── Polyfills for jsdom ─────────────────────── */

if (typeof window.ResizeObserver === "undefined") {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}

/* ── Helpers ─────────────────────────────────── */

function renderTabs({
  defaultValue = "one",
  onValueChange,
  disabledTab,
}: {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabledTab?: boolean;
} = {}) {
  return render(
    <Tabs defaultValue={defaultValue} {...(onValueChange ? { onValueChange } : {})}>
      <TabsList>
        <TabsTrigger value="one">Tab One</TabsTrigger>
        <TabsTrigger value="two">Tab Two</TabsTrigger>
        <TabsTrigger value="three" {...(disabledTab ? { disabled: true } : {})}>
          Tab Three
        </TabsTrigger>
      </TabsList>
      <TabsContent value="one">Content One</TabsContent>
      <TabsContent value="two">Content Two</TabsContent>
      <TabsContent value="three">Content Three</TabsContent>
    </Tabs>,
  );
}

/* ── Tests ────────────────────────────────────── */

describe("Tabs", () => {
  it("renders all tab triggers", () => {
    renderTabs();
    expect(screen.getByRole("tab", { name: "Tab One" })).toBeDefined();
    expect(screen.getByRole("tab", { name: "Tab Two" })).toBeDefined();
    expect(screen.getByRole("tab", { name: "Tab Three" })).toBeDefined();
  });

  it("shows the default tab content", () => {
    renderTabs({ defaultValue: "one" });
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Content One");
  });

  it("switches content on tab click", async () => {
    const user = userEvent.setup();
    renderTabs();
    await user.click(screen.getByRole("tab", { name: "Tab Two" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Content Two");
  });

  it("calls onValueChange when tab changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderTabs({ onValueChange: onChange });
    await user.click(screen.getByRole("tab", { name: "Tab Two" }));
    expect(onChange).toHaveBeenCalledWith("two");
  });

  it("navigates tabs with arrow keys", async () => {
    const user = userEvent.setup();
    renderTabs();
    const tabOne = screen.getByRole("tab", { name: "Tab One" });
    tabOne.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Tab Two" })).toHaveFocus();
  });

  it("does not activate disabled tab on click", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderTabs({ onValueChange: onChange, disabledTab: true });
    await user.click(screen.getByRole("tab", { name: "Tab Three" }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("sets aria-selected on active tab", () => {
    renderTabs({ defaultValue: "two" });
    expect(screen.getByRole("tab", { name: "Tab Two" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: "Tab One" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  it("forwards ref on TabsList", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Tabs defaultValue="a">
        <TabsList ref={ref}>
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A</TabsContent>
      </Tabs>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("forwards ref on TabsTrigger", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger ref={ref} value="a">A</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A</TabsContent>
      </Tabs>,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("merges custom className on TabsList", () => {
    render(
      <Tabs defaultValue="a">
        <TabsList className="custom-list">
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A</TabsContent>
      </Tabs>,
    );
    expect(screen.getByRole("tablist")).toHaveClass("custom-list");
  });

  it("merges custom className on TabsTrigger", () => {
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a" className="custom-trigger">A</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A</TabsContent>
      </Tabs>,
    );
    expect(screen.getByRole("tab", { name: "A" })).toHaveClass(
      "custom-trigger",
    );
  });
});
