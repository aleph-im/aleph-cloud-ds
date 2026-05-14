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
    // Icons stay rendered (no rail-hide class).
    expect(screen.getByTestId("icon")).toBeInTheDocument();
    // Section title and nav-item label carry rail-hide; the global
    // `[data-collapsed="true"] .rail-hide { display: none }` rule
    // hides them at runtime (verified visually in the preview).
    expect(
      screen.getByRole("button", { name: /resources/i }),
    ).toHaveClass("rail-hide");
    expect(screen.getByText("Nodes")).toHaveClass("rail-hide");
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
});
