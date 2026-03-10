import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";

function TestBreadcrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/nodes">Nodes</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Node Details</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

describe("Breadcrumb", () => {
  it("renders nav with aria-label", () => {
    render(<TestBreadcrumb />);
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveAttribute("aria-label", "Breadcrumb");
  });

  it("allows custom aria-label", () => {
    render(
      <Breadcrumb aria-label="Custom trail">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Home</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    expect(screen.getByRole("navigation")).toHaveAttribute(
      "aria-label",
      "Custom trail",
    );
  });

  it("renders ol > li structure", () => {
    render(<TestBreadcrumb />);
    const nav = screen.getByRole("navigation");
    const list = within(nav).getByRole("list");
    expect(list.tagName).toBe("OL");
    const items = within(list).getAllByRole("listitem");
    expect(items.length).toBeGreaterThanOrEqual(3);
  });

  it("renders links with href", () => {
    render(<TestBreadcrumb />);
    const dashboardLink = screen.getByRole("link", { name: "Dashboard" });
    expect(dashboardLink).toHaveAttribute("href", "/dashboard");
    const nodesLink = screen.getByRole("link", { name: "Nodes" });
    expect(nodesLink).toHaveAttribute("href", "/nodes");
  });

  it("renders current page with aria-current", () => {
    render(<TestBreadcrumb />);
    const page = screen.getByText("Node Details");
    expect(page).toHaveAttribute("aria-current", "page");
    expect(page.tagName).toBe("SPAN");
  });

  it("renders separator with aria-hidden", () => {
    render(<TestBreadcrumb />);
    const separators = screen
      .getAllByRole("listitem", { hidden: true })
      .filter((li) => li.getAttribute("aria-hidden") === "true");
    expect(separators).toHaveLength(2);
    expect(separators[0]!.textContent).toBe("/");
  });

  it("renders custom separator children", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <span data-testid="custom-sep">&gt;</span>
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Page</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    expect(screen.getByTestId("custom-sep")).toBeTruthy();
  });

  it("supports asChild on BreadcrumbLink", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <a href="/custom" data-testid="custom-link">
                Custom
              </a>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    const link = screen.getByTestId("custom-link");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/custom");
  });

  it("forwards className on Breadcrumb", () => {
    render(
      <Breadcrumb className="custom-nav" data-testid="bc-nav">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Home</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    expect(screen.getByTestId("bc-nav").className).toContain("custom-nav");
  });

  it("forwards className on BreadcrumbList", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList className="custom-list" data-testid="bc-list">
          <BreadcrumbItem>
            <BreadcrumbPage>Home</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    expect(screen.getByTestId("bc-list").className).toContain("custom-list");
  });
});
