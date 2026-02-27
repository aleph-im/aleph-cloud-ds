// Polyfills for Radix Select in jsdom
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
import { Select } from "@ac/components/select/select";

const OPTIONS = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
  { value: "c", label: "Option C", disabled: true },
];

describe("Select", () => {
  it("renders a trigger with combobox role", () => {
    render(<Select options={OPTIONS} />);
    expect(screen.getByRole("combobox")).toBeDefined();
  });

  it("shows placeholder when no value", () => {
    render(<Select options={OPTIONS} placeholder="Choose..." />);
    expect(screen.getByText("Choose...")).toBeDefined();
  });

  it("opens dropdown on trigger click", async () => {
    const user = userEvent.setup();
    render(<Select options={OPTIONS} />);
    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeDefined();
  });

  it("shows all options when open", async () => {
    const user = userEvent.setup();
    render(<Select options={OPTIONS} />);
    await user.click(screen.getByRole("combobox"));
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("calls onValueChange when item selected", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select options={OPTIONS} onValueChange={onChange} />);
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("Option A"));
    expect(onChange).toHaveBeenCalledWith("a");
  });

  it("sets aria-invalid when error is true", () => {
    render(<Select options={OPTIONS} error />);
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("forwards ref to trigger", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Select ref={ref} options={OPTIONS} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
