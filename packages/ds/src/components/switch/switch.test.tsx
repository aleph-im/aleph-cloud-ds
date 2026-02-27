import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { createRef } from "react";
import { Switch } from "@ac/components/switch/switch";

describe("Switch", () => {
  it("renders with switch role", () => {
    render(<Switch />);
    expect(screen.getByRole("switch")).toBeDefined();
  });

  it("is unchecked by default", () => {
    render(<Switch />);
    expect(screen.getByRole("switch")).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("respects defaultChecked", () => {
    render(<Switch defaultChecked />);
    expect(screen.getByRole("switch")).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("toggles on click", async () => {
    const user = userEvent.setup();
    render(<Switch />);
    const sw = screen.getByRole("switch");
    expect(sw).toHaveAttribute("aria-checked", "false");
    await user.click(sw);
    expect(sw).toHaveAttribute("aria-checked", "true");
  });

  it("calls onCheckedChange when toggled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch onCheckedChange={onChange} />);
    await user.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch disabled onCheckedChange={onChange} />);
    await user.click(screen.getByRole("switch"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Switch ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("merges custom className", () => {
    render(<Switch className="custom-class" />);
    expect(screen.getByRole("switch")).toHaveClass("custom-class");
  });
});
