import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { createRef } from "react";
import {
  RadioGroup,
  RadioGroupItem,
} from "@ac/components/radio-group/radio-group";

describe("RadioGroup", () => {
  const renderGroup = (props = {}) =>
    render(
      <RadioGroup {...props}>
        <RadioGroupItem value="a" />
        <RadioGroupItem value="b" />
        <RadioGroupItem value="c" />
      </RadioGroup>,
    );

  it("renders all radio items", () => {
    renderGroup();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  it("selects defaultValue on mount", () => {
    renderGroup({ defaultValue: "b" });
    const radios = screen.getAllByRole("radio");
    expect(radios[1]!).toBeChecked();
  });

  it("selects item on click", async () => {
    const user = userEvent.setup();
    renderGroup();
    const radios = screen.getAllByRole("radio");
    await user.click(radios[0]!);
    expect(radios[0]!).toBeChecked();
  });

  it("only one item selected at a time", async () => {
    const user = userEvent.setup();
    renderGroup({ defaultValue: "a" });
    const radios = screen.getAllByRole("radio");
    await user.click(radios[1]!);
    expect(radios[0]!).not.toBeChecked();
    expect(radios[1]!).toBeChecked();
  });

  it("calls onValueChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderGroup({ onValueChange: onChange });
    await user.click(screen.getAllByRole("radio")[1]!);
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("disables all items when group is disabled", () => {
    renderGroup({ disabled: true });
    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).toBeDisabled();
    }
  });

  it("disables a single item", () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="a" />
        <RadioGroupItem value="b" disabled />
      </RadioGroup>,
    );
    const radios = screen.getAllByRole("radio");
    expect(radios[0]!).not.toBeDisabled();
    expect(radios[1]!).toBeDisabled();
  });

  it("forwards ref on RadioGroup", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <RadioGroup ref={ref}>
        <RadioGroupItem value="a" />
      </RadioGroup>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
