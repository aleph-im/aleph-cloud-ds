import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductStrip, type ProductApp } from "./product-strip";

const APPS: ProductApp[] = [
  { id: "cloud", label: "Cloud", href: "https://app.aleph.cloud" },
  { id: "network", label: "Network", href: "https://network.aleph.cloud" },
  { id: "explorer", label: "Explorer", href: "https://explorer.aleph.cloud" },
  { id: "swap", label: "Swap", href: "https://swap.aleph.cloud" },
];

describe("ProductStrip", () => {
  it("renders one anchor per app", () => {
    render(
      <ProductStrip
        apps={APPS}
        activeId="network"
        logoHref="https://aleph.cloud"
      />,
    );
    APPS.forEach((app) => {
      const link = screen.getByRole("link", { name: app.label });
      expect(link).toHaveAttribute("href", app.href);
    });
  });

  it("marks the active app via aria-current=page", () => {
    render(
      <ProductStrip
        apps={APPS}
        activeId="network"
        logoHref="https://aleph.cloud"
      />,
    );
    const active = screen.getByRole("link", { name: "Network" });
    expect(active).toHaveAttribute("aria-current", "page");
    const inactive = screen.getByRole("link", { name: "Cloud" });
    expect(inactive).not.toHaveAttribute("aria-current");
  });

  it("renders the logomark as a link to logoHref", () => {
    render(
      <ProductStrip
        apps={APPS}
        activeId="network"
        logoHref="https://aleph.cloud"
      />,
    );
    const logo = screen.getByRole("link", { name: /aleph/i });
    expect(logo).toHaveAttribute("href", "https://aleph.cloud");
  });

  it("renders the right slot content", () => {
    render(
      <ProductStrip
        apps={APPS}
        activeId="network"
        logoHref="https://aleph.cloud"
        right={<span data-testid="right">controls</span>}
      />,
    );
    expect(screen.getByTestId("right")).toBeInTheDocument();
  });

  it("emits no active tab when activeId does not match any app", () => {
    render(
      <ProductStrip
        apps={APPS}
        activeId="unknown"
        logoHref="https://aleph.cloud"
      />,
    );
    expect(screen.queryByRole("link", { current: "page" })).toBeNull();
  });
});
