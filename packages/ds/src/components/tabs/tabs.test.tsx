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

/* ── Overflow collapse ───────────────────────── */

function renderOverflowTabs({
  defaultValue = "tab-1",
  containerWidth = 300,
  includeDisabled = false,
}: {
  defaultValue?: string;
  containerWidth?: number;
  includeDisabled?: boolean;
} = {}) {
  return render(
    <div style={{ width: containerWidth }}>
      <Tabs defaultValue={defaultValue}>
        <TabsList overflow="collapse">
          <TabsTrigger value="tab-1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab-2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab-3">Tab 3</TabsTrigger>
          <TabsTrigger value="tab-4">Tab 4</TabsTrigger>
          <TabsTrigger value="tab-5">Tab 5</TabsTrigger>
          <TabsTrigger value="tab-6">Tab 6</TabsTrigger>
          <TabsTrigger value="tab-7">Tab 7</TabsTrigger>
          <TabsTrigger value="tab-8" {...(includeDisabled ? { disabled: true } : {})}>
            Tab 8
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab-1">Content 1</TabsContent>
        <TabsContent value="tab-2">Content 2</TabsContent>
        <TabsContent value="tab-3">Content 3</TabsContent>
        <TabsContent value="tab-4">Content 4</TabsContent>
        <TabsContent value="tab-5">Content 5</TabsContent>
        <TabsContent value="tab-6">Content 6</TabsContent>
        <TabsContent value="tab-7">Content 7</TabsContent>
        <TabsContent value="tab-8">Content 8</TabsContent>
      </Tabs>
    </div>,
  );
}

describe("Tabs overflow collapse", () => {
  it("renders overflow trigger when overflow='collapse' is set", () => {
    renderOverflowTabs();
    expect(
      screen.getByRole("button", { name: "More tabs" }),
    ).toBeDefined();
  });

  it("does not render overflow trigger without overflow prop", () => {
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A</TabsContent>
      </Tabs>,
    );
    expect(
      screen.queryByRole("button", { name: "More tabs" }),
    ).toBeNull();
  });

  it("accepts overflow prop on TabsList without type error", () => {
    const { container } = render(
      <Tabs defaultValue="a">
        <TabsList overflow="collapse">
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A</TabsContent>
      </Tabs>,
    );
    expect(container).toBeDefined();
  });

  it("renders all TabsTrigger elements in the DOM even when overflowed", () => {
    renderOverflowTabs();
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(8);
  });

  it("shows default tab content when overflow is enabled", () => {
    renderOverflowTabs({ defaultValue: "tab-1" });
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Content 1");
  });

  it("preserves variant prop alongside overflow prop", () => {
    render(
      <Tabs defaultValue="a">
        <TabsList variant="pill" overflow="collapse">
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A</TabsContent>
      </Tabs>,
    );
    expect(screen.getByRole("tablist")).toHaveAttribute(
      "data-variant",
      "pill",
    );
    expect(
      screen.getByRole("button", { name: "More tabs" }),
    ).toBeDefined();
  });
});

describe("Tabs overflow dropdown", () => {
  it("opens popover when overflow trigger is clicked", async () => {
    const user = userEvent.setup();
    renderOverflowTabs();
    await user.click(screen.getByRole("button", { name: "More tabs" }));
    expect(
      screen.getByRole("button", { name: "More tabs" }),
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("closes popover on Escape", async () => {
    const user = userEvent.setup();
    renderOverflowTabs();
    await user.click(screen.getByRole("button", { name: "More tabs" }));
    await user.keyboard("{Escape}");
    const trigger = screen.getByRole("button", { name: "More tabs" });
    const expanded = trigger.getAttribute("aria-expanded");
    expect(expanded === null || expanded === "false").toBe(true);
  });

  it("does not activate a disabled tab from the dropdown", async () => {
    const user = userEvent.setup();
    renderOverflowTabs({ includeDisabled: true });
    await user.click(screen.getByRole("button", { name: "More tabs" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Content 1");
  });
});

/* ── Pill variant ────────────────────────────── */

function renderPillTabs({
  defaultValue = "one",
}: {
  defaultValue?: string;
} = {}) {
  return render(
    <Tabs defaultValue={defaultValue}>
      <TabsList variant="pill">
        <TabsTrigger value="one">Tab One</TabsTrigger>
        <TabsTrigger value="two">Tab Two</TabsTrigger>
      </TabsList>
      <TabsContent value="one">Content One</TabsContent>
      <TabsContent value="two">Content Two</TabsContent>
    </Tabs>,
  );
}

describe("Tabs pill variant", () => {
  it("renders tablist with data-variant='pill'", () => {
    renderPillTabs();
    expect(screen.getByRole("tablist")).toHaveAttribute(
      "data-variant",
      "pill",
    );
  });

  it("applies pill container styles (no border-b)", () => {
    renderPillTabs();
    const list = screen.getByRole("tablist");
    expect(list.className).not.toContain("border-b");
    expect(list.className).toContain("rounded-full");
  });

  it("renders tablist with group class for pill variant", () => {
    renderPillTabs();
    expect(screen.getByRole("tablist")).toHaveClass("group");
  });

  it("defaults to underline variant when no variant prop", () => {
    renderTabs();
    const list = screen.getByRole("tablist");
    expect(list).toHaveAttribute("data-variant", "underline");
    expect(list.className).toContain("border-b");
  });

  it("switches content on tab click in pill variant", async () => {
    const user = userEvent.setup();
    renderPillTabs();
    await user.click(screen.getByRole("tab", { name: "Tab Two" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Content Two");
  });

  it("merges custom className on pill TabsList", () => {
    render(
      <Tabs defaultValue="a">
        <TabsList variant="pill" className="custom-pill">
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A</TabsContent>
      </Tabs>,
    );
    const list = screen.getByRole("tablist");
    expect(list).toHaveClass("custom-pill");
    expect(list).toHaveClass("rounded-full");
  });
});
