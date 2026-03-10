import { describe, expect, it } from "vitest";
import { buildPageRange } from "./pagination";

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
    ).toEqual([1, 2, 3, "ellipsis", 10]);
  });

  it("shows left ellipsis when current is near end", () => {
    expect(
      buildPageRange({
        page: 9,
        totalPages: 10,
        siblingCount: 1,
        showFirstLast: true,
      }),
    ).toEqual([1, "ellipsis", 8, 9, 10]);
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

  it("shows page instead of ellipsis when gap is exactly 1", () => {
    expect(
      buildPageRange({
        page: 3,
        totalPages: 10,
        siblingCount: 1,
        showFirstLast: true,
      }),
    ).toEqual([1, 2, 3, 4, "ellipsis", 10]);
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
    ).toEqual([1, "ellipsis", 3, 4, 5, 6, 7, "ellipsis", 10]);
  });

  it("clamps siblings at page boundaries", () => {
    expect(
      buildPageRange({
        page: 1,
        totalPages: 10,
        siblingCount: 1,
        showFirstLast: true,
      }),
    ).toEqual([1, 2, "ellipsis", 10]);
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
