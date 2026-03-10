import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Alert } from "./alert";

describe("Alert", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders children", () => {
    render(<Alert variant="warning">Something happened</Alert>);
    expect(screen.getByText("Something happened")).toBeTruthy();
  });

  it("renders the variant label in uppercase", () => {
    render(<Alert variant="error">Message</Alert>);
    expect(screen.getByText("Error")).toBeTruthy();
  });

  it("renders title when provided", () => {
    render(
      <Alert variant="info" title="Heads up">
        Details here
      </Alert>,
    );
    const title = screen.getByText("Heads up");
    expect(title).toBeTruthy();
    expect(title.tagName).toBe("P");
  });

  it("omits title when not provided", () => {
    const { container } = render(
      <Alert variant="success">No title here</Alert>,
    );
    const titleEl = container.querySelector("[data-alert-title]");
    expect(titleEl).toBeNull();
  });

  it("has role=alert", () => {
    render(<Alert variant="warning">Msg</Alert>);
    expect(screen.getByRole("alert")).toBeTruthy();
  });

  it("does not render dismiss button when onDismiss is not set", () => {
    render(<Alert variant="warning">Msg</Alert>);
    expect(screen.queryByLabelText("Dismiss")).toBeNull();
  });

  it("renders dismiss button when onDismiss is set", () => {
    render(
      <Alert variant="warning" onDismiss={() => {}}>
        Msg
      </Alert>,
    );
    expect(screen.getByLabelText("Dismiss")).toBeTruthy();
  });

  it("calls onDismiss after clicking dismiss button", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    const { container } = render(
      <Alert variant="warning" onDismiss={onDismiss}>
        Msg
      </Alert>,
    );

    await user.click(screen.getByLabelText("Dismiss"));

    // Simulate transitionend since jsdom doesn't fire it
    const root = container.firstElementChild as HTMLElement;
    root.dispatchEvent(new Event("transitionend", { bubbles: true }));

    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it("calls onDismiss after dismissAfter timer expires", () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    const { container } = render(
      <Alert variant="warning" onDismiss={onDismiss} dismissAfter={3000}>
        Msg
      </Alert>,
    );

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Simulate transitionend for exit animation
    const root = container.firstElementChild as HTMLElement;
    root.dispatchEvent(new Event("transitionend", { bubbles: true }));

    expect(onDismiss).toHaveBeenCalledOnce();
    vi.useRealTimers();
  });

  it("does not render progress bar without dismissAfter", () => {
    const { container } = render(
      <Alert variant="warning" onDismiss={() => {}}>
        Msg
      </Alert>,
    );
    expect(container.querySelector("[data-alert-progress]")).toBeNull();
  });

  it("renders progress bar when dismissAfter is set", () => {
    const { container } = render(
      <Alert variant="warning" onDismiss={() => {}} dismissAfter={5000}>
        Msg
      </Alert>,
    );
    expect(container.querySelector("[data-alert-progress]")).toBeTruthy();
  });

  it("merges custom className", () => {
    const { container } = render(
      <Alert variant="warning" className="custom-class">
        Msg
      </Alert>,
    );
    expect(container.firstElementChild?.className).toContain("custom-class");
  });

  it("renders inline links in children", () => {
    render(
      <Alert variant="info">
        Check <a href="https://example.com">settings</a> page
      </Alert>,
    );
    const link = screen.getByRole("link", { name: "settings" });
    expect(link).toHaveAttribute("href", "https://example.com");
  });

  it("cleans up timer on unmount", () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    const { unmount } = render(
      <Alert variant="warning" onDismiss={onDismiss} dismissAfter={5000}>
        Msg
      </Alert>,
    );

    unmount();
    vi.advanceTimersByTime(5000);

    expect(onDismiss).not.toHaveBeenCalled();
    vi.useRealTimers();
  });
});
