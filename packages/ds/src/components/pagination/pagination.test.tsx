import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { buildPageRange, Pagination } from "./pagination";

describe("buildPageRange", () => {
  it("returns all pages when totalPages <= siblingCount * 2 + 3", () => {
    expect(
      buildPageRange({
        page: 3,
        totalPages: 5,
        siblingCount: 1,
        showFirstLast: true,
      }),
    ).toEqual([1, 2, 3, 4, 5]);
  });

  it("shows right ellipsis when current is near start", () => {
    expect(
      buildPageRange({
        page: 2,
        totalPages: 10,
        siblingCount: 1,
        showFirstLast: true,
      }),
    ).toEqual([1, 2, 3, 4, 5, "ellipsis", 10]);
  });

  it("shows left ellipsis when current is near end", () => {
    expect(
      buildPageRange({
        page: 9,
        totalPages: 10,
        siblingCount: 1,
        showFirstLast: true,
      }),
    ).toEqual([1, "ellipsis", 6, 7, 8, 9, 10]);
  });

  it("shows both ellipses when current is in the middle", () => {
    expect(
      buildPageRange({
        page: 5,
        totalPages: 10,
        siblingCount: 1,
        showFirstLast: true,
      }),
    ).toEqual([1, "ellipsis", 4, 5, 6, "ellipsis", 10]);
  });

  it("keeps fixed slot count when near start boundary", () => {
    expect(
      buildPageRange({
        page: 3,
        totalPages: 10,
        siblingCount: 1,
        showFirstLast: true,
      }),
    ).toEqual([1, 2, 3, 4, 5, "ellipsis", 10]);
  });

  it("works with siblingCount=0 and showFirstLast=false (minimal)", () => {
    expect(
      buildPageRange({
        page: 3,
        totalPages: 10,
        siblingCount: 0,
        showFirstLast: false,
      }),
    ).toEqual([3]);
  });

  it("works with siblingCount=1 and showFirstLast=false", () => {
    expect(
      buildPageRange({
        page: 3,
        totalPages: 10,
        siblingCount: 1,
        showFirstLast: false,
      }),
    ).toEqual([2, 3, 4]);
  });

  it("works with siblingCount=2 and showFirstLast=true (desktop max)", () => {
    expect(
      buildPageRange({
        page: 5,
        totalPages: 10,
        siblingCount: 2,
        showFirstLast: true,
      }),
    ).toEqual([1, 2, 3, 4, 5, 6, 7, "ellipsis", 10]);
  });

  it("clamps siblings at page boundaries", () => {
    expect(
      buildPageRange({
        page: 1,
        totalPages: 10,
        siblingCount: 1,
        showFirstLast: true,
      }),
    ).toEqual([1, 2, 3, 4, 5, "ellipsis", 10]);
  });

  it("produces fixed slot count across all pages", () => {
    for (let page = 1; page <= 20; page++) {
      const items = buildPageRange({
        page,
        totalPages: 20,
        siblingCount: 1,
        showFirstLast: true,
      });
      expect(items).toHaveLength(7);
    }
  });

  it("handles single page", () => {
    expect(
      buildPageRange({
        page: 1,
        totalPages: 1,
        siblingCount: 1,
        showFirstLast: true,
      }),
    ).toEqual([1]);
  });
});

describe("Pagination", () => {
  it("renders a nav with aria-label", () => {
    render(<Pagination page={1} totalPages={5} onPageChange={() => {}} />);
    expect(
      screen.getByRole("navigation", { name: "Pagination" }),
    ).toBeTruthy();
  });

  it("marks the active page with aria-current", () => {
    render(<Pagination page={3} totalPages={5} onPageChange={() => {}} />);
    const active = screen.getByRole("button", { name: "Page 3" });
    expect(active).toHaveAttribute("aria-current", "page");
  });

  it("does not mark inactive pages with aria-current", () => {
    render(<Pagination page={3} totalPages={5} onPageChange={() => {}} />);
    const inactive = screen.getByRole("button", { name: "Page 1" });
    expect(inactive).not.toHaveAttribute("aria-current");
  });

  it("calls onPageChange when clicking a page button", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination page={3} totalPages={10} onPageChange={onPageChange} />,
    );

    await user.click(screen.getByRole("button", { name: "Page 4" }));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("calls onPageChange when clicking next", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination page={3} totalPages={10} onPageChange={onPageChange} />,
    );

    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("calls onPageChange when clicking previous", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination page={3} totalPages={10} onPageChange={onPageChange} />,
    );

    await user.click(screen.getByRole("button", { name: "Previous page" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("disables previous and first on page 1", () => {
    render(<Pagination page={1} totalPages={5} onPageChange={() => {}} />);
    expect(
      screen.getByRole("button", { name: "Previous page" }),
    ).toHaveAttribute("aria-disabled", "true");
    expect(
      screen.getByRole("button", { name: "First page" }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("disables next and last on last page", () => {
    render(<Pagination page={5} totalPages={5} onPageChange={() => {}} />);
    expect(
      screen.getByRole("button", { name: "Next page" }),
    ).toHaveAttribute("aria-disabled", "true");
    expect(
      screen.getByRole("button", { name: "Last page" }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("does not call onPageChange when clicking disabled previous", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination page={1} totalPages={5} onPageChange={onPageChange} />,
    );

    await user.click(screen.getByRole("button", { name: "Previous page" }));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("hides first/last buttons when showFirstLast is false", () => {
    render(
      <Pagination
        page={3}
        totalPages={10}
        onPageChange={() => {}}
        showFirstLast={false}
      />,
    );
    expect(screen.queryByRole("button", { name: "First page" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Last page" })).toBeNull();
  });

  it("renders ellipsis as non-interactive spans", () => {
    render(<Pagination page={5} totalPages={10} onPageChange={() => {}} />);
    const ellipses = screen.getAllByText("\u2026");
    for (const el of ellipses) {
      expect(el.tagName).not.toBe("BUTTON");
    }
  });

  it("forwards ref to the nav element", () => {
    const ref = { current: null } as React.RefObject<HTMLElement | null>;
    render(
      <Pagination
        ref={ref}
        page={1}
        totalPages={5}
        onPageChange={() => {}}
      />,
    );
    expect(ref.current?.tagName).toBe("NAV");
  });

  it("merges custom className onto the nav", () => {
    render(
      <Pagination
        page={1}
        totalPages={5}
        onPageChange={() => {}}
        className="custom"
      />,
    );
    const nav = screen.getByRole("navigation", { name: "Pagination" });
    expect(nav.className).toContain("custom");
  });
});
