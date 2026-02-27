import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { createRef } from "react";
import { Checkbox } from "@ac/components/checkbox/checkbox";

describe("Checkbox", () => {
  it("renders as unchecked by default", () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  it("renders as checked when defaultChecked", () => {
    render(<Checkbox defaultChecked />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("toggles on click", async () => {
    const user = userEvent.setup();
    render(<Checkbox />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it("calls onCheckedChange when toggled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox onCheckedChange={onChange} />);
    await user.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox disabled onCheckedChange={onChange} />);
    await user.click(screen.getByRole("checkbox"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("sets aria-invalid when error is true", () => {
    render(<Checkbox error />);
    expect(screen.getByRole("checkbox")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Checkbox ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("merges custom className", () => {
    render(<Checkbox className="custom-class" />);
    expect(screen.getByRole("checkbox")).toHaveClass("custom-class");
  });
});
