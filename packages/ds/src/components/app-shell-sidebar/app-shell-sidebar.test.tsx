import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  AccordionSection,
  AppShellSidebar,
  NavItem,
} from "./app-shell-sidebar";

const Mark = () => <div data-testid="mark">N</div>;

describe("AppShellSidebar", () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => window.localStorage.clear());

  it("renders the appMark slot", () => {
    render(
      <AppShellSidebar appMark={<Mark />} collapsed={false} onToggle={() => {}}>
        <div>content</div>
      </AppShellSidebar>,
    );
    expect(screen.getByTestId("mark")).toBeInTheDocument();
  });

  it("renders children in expanded mode", () => {
    render(
      <AppShellSidebar appMark={<Mark />} collapsed={false} onToggle={() => {}}>
        <AccordionSection title="Resources" sectionId="resources">
          <NavItem href="/nodes" icon={<span data-testid="icon" />}>
            Nodes
          </NavItem>
        </AccordionSection>
      </AppShellSidebar>,
    );
    expect(screen.getByText("Resources")).toBeInTheDocument();
    expect(screen.getByText("Nodes")).toBeInTheDocument();
  });

  it("applies rail-hide pattern to section title and item label in collapsed mode", () => {
    render(
      <AppShellSidebar appMark={<Mark />} collapsed={true} onToggle={() => {}}>
        <AccordionSection title="Resources" sectionId="resources">
          <NavItem href="/nodes" icon={<span data-testid="icon" />}>
            Nodes
          </NavItem>
        </AccordionSection>
      </AppShellSidebar>,
    );
    const aside = screen.getByRole("complementary");
    expect(aside).toHaveAttribute("data-collapsed", "true");
    // Icons stay rendered (no rail-hide class). The NavItem renders the
    // icon twice (band positions A and B), so both copies are present.
    expect(screen.getAllByTestId("icon")).toHaveLength(2);
    // Section title and nav-item label carry rail-hide; the global
    // `[data-collapsed="true"] .rail-hide { display: none }` rule
    // hides them at runtime (verified visually in the preview).
    expect(
      screen.getByRole("button", { name: /resources/i }),
    ).toHaveClass("rail-hide");
    expect(screen.getByText("Nodes")).toHaveClass("rail-hide");
  });

  it("NavItem renders the icon in both band slots, each aria-hidden", () => {
    render(
      <AppShellSidebar appMark={<Mark />} collapsed={false} onToggle={() => {}}>
        <AccordionSection title="Resources" sectionId="resources">
          <NavItem href="/nodes" icon={<span data-testid="icon" />}>
            Nodes
          </NavItem>
        </AccordionSection>
      </AppShellSidebar>,
    );
    const icons = screen.getAllByTestId("icon");
    expect(icons).toHaveLength(2);
    for (const icon of icons) {
      const wrapper = icon.parentElement;
      expect(wrapper).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("NavItem sets data-active on the link to drive the band transform", () => {
    const { rerender } = render(
      <AppShellSidebar appMark={<Mark />} collapsed={false} onToggle={() => {}}>
        <AccordionSection title="Resources" sectionId="resources">
          <NavItem href="/nodes" icon={<span data-testid="icon" />}>
            Nodes
          </NavItem>
        </AccordionSection>
      </AppShellSidebar>,
    );
    expect(screen.getByRole("link", { name: "Nodes" })).toHaveAttribute(
      "data-active",
      "false",
    );
    rerender(
      <AppShellSidebar appMark={<Mark />} collapsed={false} onToggle={() => {}}>
        <AccordionSection title="Resources" sectionId="resources">
          <NavItem href="/nodes" icon={<span data-testid="icon" />} active>
            Nodes
          </NavItem>
        </AccordionSection>
      </AppShellSidebar>,
    );
    expect(screen.getByRole("link", { name: "Nodes" })).toHaveAttribute(
      "data-active",
      "true",
    );
  });

  it("clicking section title toggles open/closed", () => {
    render(
      <AppShellSidebar appMark={<Mark />} collapsed={false} onToggle={() => {}}>
        <AccordionSection title="Resources" sectionId="resources">
          <NavItem href="/nodes" icon={<span data-testid="icon" />}>
            Nodes
          </NavItem>
        </AccordionSection>
      </AppShellSidebar>,
    );
    expect(screen.getByText("Nodes")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /resources/i }));
    expect(screen.queryByText("Nodes")).toBeNull();
  });

  it("NavItem forwards onMouseEnter and onFocus events", () => {
    const onMouseEnter = vi.fn();
    const onFocus = vi.fn();
    render(
      <AppShellSidebar appMark={<Mark />} collapsed={false} onToggle={() => {}}>
        <AccordionSection title="Resources" sectionId="resources">
          <NavItem
            href="/nodes"
            icon={<span data-testid="icon" />}
            onMouseEnter={onMouseEnter}
            onFocus={onFocus}
          >
            Nodes
          </NavItem>
        </AccordionSection>
      </AppShellSidebar>,
    );
    const link = screen.getByRole("link", { name: "Nodes" });
    fireEvent.mouseEnter(link);
    fireEvent.focus(link);
    expect(onMouseEnter).toHaveBeenCalledTimes(1);
    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  describe("NavItem asChild", () => {
    it("clones the child element instead of rendering an <a>", () => {
      render(
        <AppShellSidebar
          appMark={<Mark />}
          collapsed={false}
          onToggle={() => {}}
        >
          <AccordionSection title="Resources" sectionId="resources">
            <NavItem asChild icon={<span data-testid="icon" />}>
              <a href="/nodes" data-testid="custom-link">
                Nodes
              </a>
            </NavItem>
          </AccordionSection>
        </AppShellSidebar>,
      );
      const link = screen.getByTestId("custom-link");
      expect(link.tagName).toBe("A");
      expect(link.getAttribute("href")).toBe("/nodes");
      // Icon (twice, A + B slots) and label render inside the cloned child.
      expect(screen.getAllByTestId("icon")).toHaveLength(2);
      expect(screen.getByText("Nodes")).toBeInTheDocument();
    });

    it("applies active styling and aria-current to the cloned child", () => {
      render(
        <AppShellSidebar
          appMark={<Mark />}
          collapsed={false}
          onToggle={() => {}}
        >
          <AccordionSection title="Resources" sectionId="resources">
            <NavItem asChild active icon={<span data-testid="icon" />}>
              <a href="/nodes">Nodes</a>
            </NavItem>
          </AccordionSection>
        </AppShellSidebar>,
      );
      const link = screen.getByRole("link", { name: "Nodes" });
      expect(link).toHaveAttribute("aria-current", "page");
      expect(link.className).toContain("bg-primary-100");
    });

    it("forwards event handlers to the cloned child", () => {
      const onMouseEnter = vi.fn();
      render(
        <AppShellSidebar
          appMark={<Mark />}
          collapsed={false}
          onToggle={() => {}}
        >
          <AccordionSection title="Resources" sectionId="resources">
            <NavItem
              asChild
              icon={<span data-testid="icon" />}
              onMouseEnter={onMouseEnter}
            >
              <a href="/nodes">Nodes</a>
            </NavItem>
          </AccordionSection>
        </AppShellSidebar>,
      );
      fireEvent.mouseEnter(screen.getByRole("link", { name: "Nodes" }));
      expect(onMouseEnter).toHaveBeenCalledTimes(1);
    });
  });

  it("NavItem marks the active route with aria-current=page", () => {
    render(
      <AppShellSidebar appMark={<Mark />} collapsed={false} onToggle={() => {}}>
        <AccordionSection title="Resources" sectionId="resources">
          <NavItem
            href="/nodes"
            icon={<span data-testid="icon" />}
            active
          >
            Nodes
          </NavItem>
        </AccordionSection>
      </AppShellSidebar>,
    );
    const link = screen.getByRole("link", { name: "Nodes" });
    expect(link).toHaveAttribute("aria-current", "page");
  });

  it("renders a built-in collapse toggle that fires onToggle when clicked", () => {
    const onToggle = vi.fn();
    render(
      <AppShellSidebar
        appMark={<Mark />}
        collapsed={false}
        onToggle={onToggle}
      >
        <div>content</div>
      </AppShellSidebar>,
    );
    fireEvent.click(
      screen.getByRole("button", { name: /collapse sidebar/i }),
    );
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("collapse-toggle aria-label flips with collapsed state", () => {
    const { rerender } = render(
      <AppShellSidebar appMark={<Mark />} collapsed={false} onToggle={() => {}}>
        <div>content</div>
      </AppShellSidebar>,
    );
    expect(
      screen.getByRole("button", { name: /collapse sidebar/i }),
    ).toBeInTheDocument();
    rerender(
      <AppShellSidebar appMark={<Mark />} collapsed={true} onToggle={() => {}}>
        <div>content</div>
      </AppShellSidebar>,
    );
    expect(
      screen.getByRole("button", { name: /expand sidebar/i }),
    ).toBeInTheDocument();
  });

  it("renders the footer slot when expanded", () => {
    render(
      <AppShellSidebar
        appMark={<Mark />}
        collapsed={false}
        onToggle={() => {}}
        footer={<span data-testid="version">v1.2.3</span>}
      >
        <div>content</div>
      </AppShellSidebar>,
    );
    expect(screen.getByTestId("version")).toBeInTheDocument();
  });

  it("hides the footer slot when collapsed", () => {
    render(
      <AppShellSidebar
        appMark={<Mark />}
        collapsed={true}
        onToggle={() => {}}
        footer={<span data-testid="version">v1.2.3</span>}
      >
        <div>content</div>
      </AppShellSidebar>,
    );
    expect(screen.queryByTestId("version")).toBeNull();
    // Collapse toggle still reachable.
    expect(
      screen.getByRole("button", { name: /expand sidebar/i }),
    ).toBeInTheDocument();
  });
});
