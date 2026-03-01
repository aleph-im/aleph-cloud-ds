import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

function TestTooltip({ content = "Tooltip text" }: { content?: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button">Hover me</button>
        </TooltipTrigger>
        <TooltipContent>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

describe("Tooltip", () => {
  it("renders the trigger", () => {
    render(<TestTooltip />);
    expect(screen.getByText("Hover me")).toBeTruthy();
  });

  it("does not show content by default", () => {
    render(<TestTooltip />);
    expect(screen.queryByText("Tooltip text")).toBeNull();
  });

  it("shows content on hover", async () => {
    const user = userEvent.setup();
    render(<TestTooltip />);

    await user.hover(screen.getByText("Hover me"));
    expect(await screen.findByRole("tooltip")).toBeTruthy();
  });
});
