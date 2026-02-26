import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";

describe("theme toggle logic", () => {
  let doc: Document;

  beforeEach(() => {
    const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
    doc = dom.window.document;
  });

  it("toggles theme-dark class on html element", () => {
    const html = doc.documentElement;
    expect(html.classList.contains("theme-dark")).toBe(false);
    html.classList.toggle("theme-dark");
    expect(html.classList.contains("theme-dark")).toBe(true);
    html.classList.toggle("theme-dark");
    expect(html.classList.contains("theme-dark")).toBe(false);
  });
});
