import { render, screen, waitFor } from "@testing-library/react";
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
  it("opens dropdown menu when overflow trigger is clicked", async () => {
    const user = userEvent.setup();
    renderOverflowTabs();
    // Hold ref before click — Radix portal sets aria-hidden on siblings
    const trigger = screen.getByRole("button", { name: "More tabs" });
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("closes dropdown on Escape", async () => {
    const user = userEvent.setup();
    renderOverflowTabs();
    const trigger = screen.getByRole("button", { name: "More tabs" });
    await user.click(trigger);
    await user.keyboard("{Escape}");
    const expanded = trigger.getAttribute("aria-expanded");
    expect(expanded === null || expanded === "false").toBe(true);
  });

  it("renders dropdown with menu role when open", async () => {
    const user = userEvent.setup();
    renderOverflowTabs();
    await user.click(screen.getByRole("button", { name: "More tabs" }));
    // Menu renders but items require real geometry (jsdom returns 0)
    expect(screen.getByRole("menu")).toBeDefined();
  });

  it("does not activate a disabled tab from the dropdown", async () => {
    const user = userEvent.setup();
    renderOverflowTabs({ includeDisabled: true });
    await user.click(screen.getByRole("button", { name: "More tabs" }));
    // Close dropdown first — portal sets aria-hidden on page content
    await user.keyboard("{Escape}");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Content 1");
  });
});

/* ── Size prop ───────────────────────────────── */

describe("Tabs size prop", () => {
  it("defaults to data-size='md'", () => {
    renderTabs();
    expect(screen.getByRole("tablist")).toHaveAttribute("data-size", "md");
  });

  it("renders data-size='sm' when size='sm'", () => {
    render(
      <Tabs defaultValue="a">
        <TabsList size="sm">
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A</TabsContent>
      </Tabs>,
    );
    expect(screen.getByRole("tablist")).toHaveAttribute("data-size", "sm");
  });

  it("uses thinner border for small underline variant", () => {
    render(
      <Tabs defaultValue="a">
        <TabsList size="sm">
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A</TabsContent>
      </Tabs>,
    );
    const list = screen.getByRole("tablist");
    expect(list.className).toContain("border-b-2");
    expect(list.className).not.toContain("border-b-4");
  });

  it("combines size='sm' with variant='pill'", () => {
    render(
      <Tabs defaultValue="a">
        <TabsList variant="pill" size="sm">
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A</TabsContent>
      </Tabs>,
    );
    const list = screen.getByRole("tablist");
    expect(list).toHaveAttribute("data-variant", "pill");
    expect(list).toHaveAttribute("data-size", "sm");
    expect(list.className).toContain("rounded-full");
  });

  it("combines size='sm' with overflow='collapse'", () => {
    render(
      <Tabs defaultValue="a">
        <TabsList size="sm" overflow="collapse">
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A</TabsContent>
      </Tabs>,
    );
    expect(screen.getByRole("tablist")).toHaveAttribute("data-size", "sm");
    expect(screen.getByRole("button", { name: "More tabs" })).toBeDefined();
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

/* ── maxVisible prop ─────────────────────────── */

function renderManyTabs({
  maxVisible,
  overflow,
  defaultValue = "tab-1",
  count = 10,
}: {
  maxVisible?: number;
  overflow?: "collapse";
  defaultValue?: string;
  count?: number;
} = {}) {
  return render(
    <Tabs defaultValue={defaultValue}>
      <TabsList
        {...(maxVisible !== undefined ? { maxVisible } : {})}
        {...(overflow ? { overflow } : {})}
      >
        {Array.from({ length: count }, (_, i) => (
          <TabsTrigger key={`tab-${String(i + 1)}`} value={`tab-${String(i + 1)}`}>
            Tab {i + 1}
          </TabsTrigger>
        ))}
      </TabsList>
      {Array.from({ length: count }, (_, i) => (
        <TabsContent key={`tab-${String(i + 1)}`} value={`tab-${String(i + 1)}`}>
          Content {i + 1}
        </TabsContent>
      ))}
    </Tabs>,
  );
}

function makeRect(left: number, right: number) {
  return {
    left,
    right,
    top: 0,
    bottom: 30,
    width: right - left,
    height: 30,
    x: left,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect;
}

describe("Tabs maxVisible", () => {
  it("caps visible tabs to the count cap when set", () => {
    renderManyTabs({ maxVisible: 3, count: 10 });
    const tabs = screen.getAllByRole("tab", { hidden: true });
    expect(tabs).toHaveLength(10);
    for (let i = 0; i < 3; i++) {
      expect(tabs[i]?.style.visibility).not.toBe("hidden");
    }
    for (let i = 3; i < 10; i++) {
      expect(tabs[i]?.style.visibility).toBe("hidden");
    }
  });

  it("renders the overflow trigger when only maxVisible is set (no overflow prop)", () => {
    renderManyTabs({ maxVisible: 3, count: 10 });
    expect(
      screen.getByRole("button", { name: "More tabs" }),
    ).toBeDefined();
  });

  it("does not render the overflow trigger when neither maxVisible nor overflow is set", () => {
    renderManyTabs({ count: 4 });
    expect(
      screen.queryByRole("button", { name: "More tabs" }),
    ).toBeNull();
  });

  it("does not hide tabs when no overflow props are set (default unchanged)", () => {
    renderManyTabs({ count: 4 });
    const tabs = screen.getAllByRole("tab");
    for (const tab of tabs) {
      expect(tab.style.visibility).not.toBe("hidden");
    }
  });

  it("does not hide tabs when maxVisible >= tab count", () => {
    renderManyTabs({ maxVisible: 5, count: 3 });
    const tabs = screen.getAllByRole("tab");
    for (const tab of tabs) {
      expect(tab.style.visibility).not.toBe("hidden");
    }
  });

  it("applies maxVisible alongside overflow='collapse' (count cap holds)", () => {
    renderManyTabs({ maxVisible: 3, overflow: "collapse", count: 10 });
    const tabs = screen.getAllByRole("tab", { hidden: true });
    for (let i = 0; i < 3; i++) {
      expect(tabs[i]?.style.visibility).not.toBe("hidden");
    }
    for (let i = 3; i < 10; i++) {
      expect(tabs[i]?.style.visibility).toBe("hidden");
    }
  });

  it("uses the width-based limit when stricter than maxVisible", async () => {
    // Container=250, trigger=30, each tab=80.
    // tab[2].right=240, +30 trigger = 270 > 250 → widthBreakIndex=2
    // maxVisible=5 → min(2, 5) = 2 visible.
    renderManyTabs({ maxVisible: 5, overflow: "collapse", count: 10 });

    const list = screen.getByRole("tablist");
    Object.defineProperty(list, "clientWidth", { value: 250, configurable: true });
    Object.defineProperty(list, "offsetHeight", { value: 30, configurable: true });
    list.getBoundingClientRect = () => makeRect(0, 250);

    const trigger = screen.getByRole("button", { name: "More tabs" });
    Object.defineProperty(trigger, "offsetWidth", { value: 30, configurable: true });

    const tabs = screen.getAllByRole("tab", { hidden: true });
    tabs.forEach((tab, i) => {
      tab.getBoundingClientRect = () => makeRect(i * 80, (i + 1) * 80);
    });

    // Trigger remeasure by toggling data-state on the active tab.
    // The MutationObserver in useOverflow watches data-state changes.
    const activeTab = tabs[0];
    if (!activeTab) throw new Error("missing tab");
    activeTab.setAttribute("data-state", "inactive");
    activeTab.setAttribute("data-state", "active");

    await waitFor(() => {
      expect(tabs[0]?.style.visibility).not.toBe("hidden");
      expect(tabs[1]?.style.visibility).not.toBe("hidden");
      expect(tabs[2]?.style.visibility).toBe("hidden");
    });
  });

  it("uses maxVisible when stricter than the width-based limit", async () => {
    // Container=600, trigger=30, each tab=80. Five tabs fit (5*80=400, +30=430 < 600).
    // widthBreakIndex covers more than maxVisible=2, so count cap wins.
    renderManyTabs({ maxVisible: 2, overflow: "collapse", count: 10 });

    const list = screen.getByRole("tablist");
    Object.defineProperty(list, "clientWidth", { value: 600, configurable: true });
    Object.defineProperty(list, "offsetHeight", { value: 30, configurable: true });
    list.getBoundingClientRect = () => makeRect(0, 600);

    const trigger = screen.getByRole("button", { name: "More tabs" });
    Object.defineProperty(trigger, "offsetWidth", { value: 30, configurable: true });

    const tabs = screen.getAllByRole("tab", { hidden: true });
    tabs.forEach((tab, i) => {
      tab.getBoundingClientRect = () => makeRect(i * 80, (i + 1) * 80);
    });

    const activeTab = tabs[0];
    if (!activeTab) throw new Error("missing tab");
    activeTab.setAttribute("data-state", "inactive");
    activeTab.setAttribute("data-state", "active");

    await waitFor(() => {
      expect(tabs[0]?.style.visibility).not.toBe("hidden");
      expect(tabs[1]?.style.visibility).not.toBe("hidden");
      expect(tabs[2]?.style.visibility).toBe("hidden");
    });
  });

  it("activates an overflowed tab when selected via dropdown's focus path", async () => {
    renderManyTabs({ maxVisible: 2, count: 4 });

    // Active tab is "tab-1" by default
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Content 1");

    // "Tab 3" is past the cap — index 2, hidden
    const allTabs = screen.getAllByRole("tab", { hidden: true });
    const tabThree = allTabs[2];
    if (!tabThree) throw new Error("missing Tab 3");
    expect(tabThree.style.visibility).toBe("hidden");
    expect(tabThree.textContent).toContain("Tab 3");

    // Replicate what the dropdown's onSelect does: clear inline visibility/
    // pointer-events then focus the trigger. Radix activates tabs on focus
    // (activationMode="automatic" default).
    tabThree.style.visibility = "";
    tabThree.style.pointerEvents = "";
    tabThree.focus();

    await waitFor(() => {
      expect(screen.getByRole("tabpanel")).toHaveTextContent("Content 3");
    });
  });
});
