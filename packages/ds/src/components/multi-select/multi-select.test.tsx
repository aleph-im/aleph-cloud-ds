// Polyfills for Radix Popover in jsdom — same as combobox.test.tsx
import { vi } from "vitest";

class MockPointerEvent extends Event {
  button: number;
  ctrlKey: boolean;
  pointerType: string;
  constructor(
    type: string,
    props: PointerEventInit & { pointerType?: string } = {},
  ) {
    super(type, props);
    this.button = props.button ?? 0;
    this.ctrlKey = props.ctrlKey ?? false;
    this.pointerType = props.pointerType ?? "mouse";
  }
}
window.PointerEvent = MockPointerEvent as unknown as typeof PointerEvent;
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}

if (typeof globalThis.DOMRect === "undefined") {
  globalThis.DOMRect = class DOMRect {
    x = 0;
    y = 0;
    width = 0;
    height = 0;
    top = 0;
    right = 0;
    bottom = 0;
    left = 0;
    constructor(x = 0, y = 0, width = 0, height = 0) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.top = y;
      this.right = x + width;
      this.bottom = y + height;
      this.left = x;
    }
    toJSON() {
      return JSON.stringify(this);
    }
    static fromRect() {
      return new DOMRect();
    }
  } as unknown as typeof DOMRect;
}

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { createRef } from "react";
import { MultiSelect } from "@ac/components/multi-select/multi-select";

const OPTIONS = [
  { value: "btc", label: "Bitcoin" },
  { value: "eth", label: "Ethereum" },
  { value: "sol", label: "Solana" },
  { value: "dot", label: "Polkadot", disabled: true },
  { value: "avax", label: "Avalanche" },
  { value: "atom", label: "Cosmos" },
];

describe("MultiSelect", () => {
  it("renders a trigger button", () => {
    render(<MultiSelect options={OPTIONS} />);
    expect(screen.getByRole("button")).toBeDefined();
  });

  it("shows placeholder when no values selected", () => {
    render(<MultiSelect options={OPTIONS} placeholder="Pick tokens..." />);
    expect(screen.getByText("Pick tokens...")).toBeDefined();
  });

  it("shows tags for selected values", () => {
    render(
      <MultiSelect
        options={OPTIONS}
        value={["btc", "eth"]}
        onValueChange={() => {}}
      />,
    );
    expect(screen.getByText("Bitcoin")).toBeDefined();
    expect(screen.getByText("Ethereum")).toBeDefined();
  });

  it("shows overflow count when more tags than maxDisplayedTags", () => {
    render(
      <MultiSelect
        options={OPTIONS}
        value={["btc", "eth", "sol", "avax", "atom"]}
        onValueChange={() => {}}
        maxDisplayedTags={2}
      />,
    );
    expect(screen.getByText("Bitcoin")).toBeDefined();
    expect(screen.getByText("Ethereum")).toBeDefined();
    expect(screen.getByText("+3 more")).toBeDefined();
    expect(screen.queryByText("Solana")).toBeNull();
  });

  it("opens popover on trigger click and shows search input", async () => {
    const user = userEvent.setup();
    render(<MultiSelect options={OPTIONS} />);
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("combobox")).toBeDefined();
  });

  it("filters options when typing in search", async () => {
    const user = userEvent.setup();
    render(<MultiSelect options={OPTIONS} />);
    await user.click(screen.getByRole("button"));
    const input = screen.getByRole("combobox");
    await user.type(input, "bit");
    expect(screen.getByText("Bitcoin")).toBeDefined();
    expect(screen.queryByText("Solana")).toBeNull();
  });

  it("toggles selection when item is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <MultiSelect options={OPTIONS} value={[]} onValueChange={onChange} />,
    );
    await user.click(screen.getByRole("button"));
    await user.click(screen.getByText("Solana"));
    expect(onChange).toHaveBeenCalledWith(["sol"]);
  });

  it("removes item when toggling an already-selected item", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <MultiSelect
        options={OPTIONS}
        value={["btc", "sol"]}
        onValueChange={onChange}
      />,
    );
    // Multiple buttons exist (trigger + tag dismiss + clear-all)
    await user.click(screen.getAllByRole("button")[0]!);
    // "Solana" exists in both the tag and dropdown — target the option
    await user.click(screen.getByRole("option", { name: /Solana/ }));
    expect(onChange).toHaveBeenCalledWith(["btc"]);
  });

  it("keeps dropdown open after selection", async () => {
    const user = userEvent.setup();
    render(
      <MultiSelect
        options={OPTIONS}
        value={[]}
        onValueChange={() => {}}
      />,
    );
    await user.click(screen.getByRole("button"));
    await user.click(screen.getByText("Solana"));
    // Dropdown should still be open — search input still visible
    expect(screen.getByRole("combobox")).toBeDefined();
  });

  it("removes individual tag via dismiss button", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <MultiSelect
        options={OPTIONS}
        value={["btc", "eth"]}
        onValueChange={onChange}
      />,
    );
    const removeBtn = screen.getByLabelText("Remove Bitcoin");
    await user.click(removeBtn);
    expect(onChange).toHaveBeenCalledWith(["eth"]);
  });

  it("clears all selections via clear-all button", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <MultiSelect
        options={OPTIONS}
        value={["btc", "eth", "sol"]}
        onValueChange={onChange}
      />,
    );
    const clearBtn = screen.getByLabelText("Clear all");
    await user.click(clearBtn);
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("shows chevron when empty, clear-all when items selected", () => {
    const { rerender } = render(
      <MultiSelect options={OPTIONS} value={[]} onValueChange={() => {}} />,
    );
    expect(screen.queryByLabelText("Clear all")).toBeNull();

    rerender(
      <MultiSelect
        options={OPTIONS}
        value={["btc"]}
        onValueChange={() => {}}
      />,
    );
    expect(screen.getByLabelText("Clear all")).toBeDefined();
  });

  it("shows empty message when no options match", async () => {
    const user = userEvent.setup();
    render(
      <MultiSelect options={OPTIONS} emptyMessage="Nothing found" />,
    );
    await user.click(screen.getByRole("button"));
    await user.type(screen.getByRole("combobox"), "zzzzz");
    expect(screen.getByText("Nothing found")).toBeDefined();
  });

  it("sets aria-invalid when error is true", () => {
    render(<MultiSelect options={OPTIONS} error />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("is disabled when disabled prop is true", () => {
    render(<MultiSelect options={OPTIONS} disabled />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("forwards ref to trigger element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<MultiSelect ref={ref} options={OPTIONS} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
