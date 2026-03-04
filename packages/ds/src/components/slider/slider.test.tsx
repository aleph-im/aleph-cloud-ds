// Polyfills for Radix Slider in jsdom
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
import { Slider } from "@ac/components/slider/slider";

describe("Slider", () => {
  it("renders a slider role element", () => {
    render(<Slider defaultValue={[50]} />);
    expect(screen.getByRole("slider")).toBeDefined();
  });

  it("has correct min/max/value attributes", () => {
    render(<Slider min={0} max={200} defaultValue={[75]} />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("aria-valuemin", "0");
    expect(slider).toHaveAttribute("aria-valuemax", "200");
    expect(slider).toHaveAttribute("aria-valuenow", "75");
  });

  it("responds to keyboard arrow right", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Slider
        min={0}
        max={100}
        step={10}
        defaultValue={[50]}
        onValueChange={onChange}
      />,
    );
    const slider = screen.getByRole("slider");
    await user.click(slider);
    await user.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenCalledWith([60]);
  });

  it("responds to keyboard arrow left", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Slider
        min={0}
        max={100}
        step={10}
        defaultValue={[50]}
        onValueChange={onChange}
      />,
    );
    const slider = screen.getByRole("slider");
    await user.click(slider);
    await user.keyboard("{ArrowLeft}");
    expect(onChange).toHaveBeenCalledWith([40]);
  });

  it("sets aria-disabled when disabled", () => {
    render(<Slider defaultValue={[50]} disabled />);
    expect(screen.getByRole("slider")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("forwards ref to the root element", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Slider ref={ref} defaultValue={[50]} />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});
