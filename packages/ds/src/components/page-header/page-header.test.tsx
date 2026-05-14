import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  PageHeader,
  PageHeaderProvider,
  usePageHeader,
} from "./page-header";

function TestPage({
  title,
  actions,
}: {
  title: string;
  actions?: React.ReactNode;
}) {
  usePageHeader({ title, ...(actions !== undefined && { actions }) });
  return <div data-testid="body">page body</div>;
}

describe("PageHeader", () => {
  it("renders nothing when no provider and no fallback are supplied", () => {
    render(<PageHeader />);
    expect(screen.queryByText(/./)).toBeNull();
  });

  it("renders fallbackTitle when context has no config", () => {
    render(
      <PageHeaderProvider>
        <PageHeader fallbackTitle="Overview" />
      </PageHeaderProvider>,
    );
    expect(screen.getByText("Overview")).toBeInTheDocument();
  });

  it("context title takes precedence over fallbackTitle", () => {
    render(
      <PageHeaderProvider>
        <PageHeader fallbackTitle="Default" />
        <TestPage title="Real" />
      </PageHeaderProvider>,
    );
    expect(screen.getByText("Real")).toBeInTheDocument();
    expect(screen.queryByText("Default")).toBeNull();
  });

  it("renders the title set by a page via usePageHeader", () => {
    render(
      <PageHeaderProvider>
        <PageHeader />
        <TestPage title="Nodes" />
      </PageHeaderProvider>,
    );
    expect(screen.getByText("Nodes")).toBeInTheDocument();
  });

  it("renders actions on the right side", () => {
    render(
      <PageHeaderProvider>
        <PageHeader />
        <TestPage title="Nodes" actions={<button>Refresh</button>} />
      </PageHeaderProvider>,
    );
    expect(
      screen.getByRole("button", { name: "Refresh" }),
    ).toBeInTheDocument();
  });

  it("last-mounted hook call wins when multiple components call usePageHeader", () => {
    function PageA() {
      usePageHeader({ title: "A" });
      return null;
    }
    function PageB() {
      usePageHeader({ title: "B" });
      return null;
    }
    render(
      <PageHeaderProvider>
        <PageHeader />
        <PageA />
        <PageB />
      </PageHeaderProvider>,
    );
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.queryByText("A")).toBeNull();
  });

  it("clears slot on unmount", () => {
    function Wrapper({ show }: { show: boolean }) {
      return (
        <PageHeaderProvider>
          <PageHeader />
          {show && <TestPage title="Nodes" />}
        </PageHeaderProvider>
      );
    }
    const { rerender } = render(<Wrapper show={true} />);
    expect(screen.getByText("Nodes")).toBeInTheDocument();
    rerender(<Wrapper show={false} />);
    expect(screen.queryByText("Nodes")).toBeNull();
  });
});
