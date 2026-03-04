// Polyfills for Radix Popover in jsdom — same as select.test.tsx
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
import { Combobox } from "@ac/components/combobox/combobox";

const OPTIONS = [
  { value: "btc", label: "Bitcoin" },
  { value: "eth", label: "Ethereum" },
  { value: "sol", label: "Solana" },
  { value: "dot", label: "Polkadot", disabled: true },
];

describe("Combobox", () => {
  it("renders a trigger button", () => {
    render(<Combobox options={OPTIONS} />);
    expect(screen.getByRole("button")).toBeDefined();
  });

  it("shows placeholder when no value selected", () => {
    render(<Combobox options={OPTIONS} placeholder="Pick a token..." />);
    expect(screen.getByText("Pick a token...")).toBeDefined();
  });

  it("shows selected label when value is set", () => {
    render(
      <Combobox options={OPTIONS} value="eth" onValueChange={() => {}} />,
    );
    expect(screen.getByText("Ethereum")).toBeDefined();
  });

  it("opens popover on trigger click and shows search input", async () => {
    const user = userEvent.setup();
    render(<Combobox options={OPTIONS} />);
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("combobox")).toBeDefined();
  });

  it("filters options when typing in search", async () => {
    const user = userEvent.setup();
    render(<Combobox options={OPTIONS} />);
    await user.click(screen.getByRole("button"));
    const input = screen.getByRole("combobox");
    await user.type(input, "bit");
    expect(screen.getByText("Bitcoin")).toBeDefined();
    expect(screen.queryByText("Solana")).toBeNull();
  });

  it("calls onValueChange when item is selected", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Combobox options={OPTIONS} onValueChange={onChange} />);
    await user.click(screen.getByRole("button"));
    await user.click(screen.getByText("Solana"));
    expect(onChange).toHaveBeenCalledWith("sol");
  });

  it("shows empty message when no options match", async () => {
    const user = userEvent.setup();
    render(
      <Combobox options={OPTIONS} emptyMessage="Nothing found" />,
    );
    await user.click(screen.getByRole("button"));
    await user.type(screen.getByRole("combobox"), "zzzzz");
    expect(screen.getByText("Nothing found")).toBeDefined();
  });

  it("sets aria-invalid when error is true", () => {
    render(<Combobox options={OPTIONS} error />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("is disabled when disabled prop is true", () => {
    render(<Combobox options={OPTIONS} disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("forwards ref to trigger button", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Combobox ref={ref} options={OPTIONS} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
