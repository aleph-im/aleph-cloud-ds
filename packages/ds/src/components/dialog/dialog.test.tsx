import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

function TestDialog({
  locked,
  onOpenChange,
  defaultOpen = true,
}: {
  locked?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
}) {
  return (
    <Dialog
      defaultOpen={defaultOpen}
      {...(onOpenChange ? { onOpenChange } : {})}
    >
      <DialogTrigger asChild>
        <button type="button">Open</button>
      </DialogTrigger>
      <DialogContent {...(locked ? { locked } : {})}>
        <DialogHeader>
          <DialogTitle>Test title</DialogTitle>
          <DialogDescription>Test description</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <button type="button">Cancel</button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

describe("Dialog", () => {
  it("links title via aria-labelledby", () => {
    render(<TestDialog />);
    const dialog = screen.getByRole("dialog");
    const labelId = dialog.getAttribute("aria-labelledby");
    expect(labelId).toBeTruthy();
    expect(document.getElementById(labelId!)).toBe(
      screen.getByText("Test title"),
    );
  });

  it("links description via aria-describedby", () => {
    render(<TestDialog />);
    const dialog = screen.getByRole("dialog");
    const descId = dialog.getAttribute("aria-describedby");
    expect(descId).toBeTruthy();
    expect(document.getElementById(descId!)).toBe(
      screen.getByText("Test description"),
    );
  });

  it("closes on Escape by default", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<TestDialog onOpenChange={onOpenChange} />);

    expect(screen.getByRole("dialog")).toBeTruthy();
    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("blocks Escape when locked", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<TestDialog locked onOpenChange={onOpenChange} />);

    expect(screen.getByRole("dialog")).toBeTruthy();
    await user.keyboard("{Escape}");
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("renders close button by default", () => {
    render(<TestDialog />);
    expect(screen.getByLabelText("Close")).toBeTruthy();
  });

  it("hides close button when locked", () => {
    render(<TestDialog locked />);
    expect(screen.queryByLabelText("Close")).toBeNull();
  });

  it("merges className on content panel", () => {
    render(
      <Dialog defaultOpen>
        <DialogContent className="custom-test-class">
          <DialogTitle>T</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog.className).toContain("custom-test-class");
  });

  it("forwards ref to content panel", () => {
    let refNode: HTMLDivElement | null = null;
    render(
      <Dialog defaultOpen>
        <DialogContent
          ref={(node) => {
            refNode = node;
          }}
        >
          <DialogTitle>T</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    expect(refNode).not.toBeNull();
    expect(refNode!.getAttribute("role")).toBe("dialog");
  });
});
