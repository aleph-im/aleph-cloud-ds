import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Stepper,
  StepperConnector,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperLabel,
  StepperList,
} from "./stepper";

describe("Stepper", () => {
  it("renders a nav element", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem>
            <StepperLabel>One</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByRole("navigation")).toBeTruthy();
  });

  it("sets aria-label on nav", () => {
    render(
      <Stepper aria-label="Wizard">
        <StepperList>
          <StepperItem>
            <StepperLabel>One</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByRole("navigation")).toHaveAttribute(
      "aria-label",
      "Wizard",
    );
  });

  it("defaults to horizontal orientation", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem>
            <StepperLabel>One</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByRole("navigation")).toHaveAttribute(
      "data-orientation",
      "horizontal",
    );
  });

  it("accepts vertical orientation", () => {
    render(
      <Stepper orientation="vertical" aria-label="Steps">
        <StepperList>
          <StepperItem>
            <StepperLabel>One</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByRole("navigation")).toHaveAttribute(
      "data-orientation",
      "vertical",
    );
  });

  it("merges className on nav", () => {
    render(
      <Stepper aria-label="Steps" className="custom">
        <StepperList>
          <StepperItem>
            <StepperLabel>One</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByRole("navigation").className).toContain("custom");
  });

  it("forwards ref to nav element", () => {
    const ref = { current: null } as React.RefObject<HTMLElement | null>;
    render(
      <Stepper ref={ref} aria-label="Steps">
        <StepperList>
          <StepperItem>
            <StepperLabel>One</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(ref.current?.tagName).toBe("NAV");
  });
});

describe("StepperList", () => {
  it("renders an ol element", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem>
            <StepperLabel>One</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByRole("list")).toBeTruthy();
  });

  it("applies horizontal flex by default", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem>
            <StepperLabel>One</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    const list = screen.getByRole("list");
    expect(list.className).toContain("flex");
    expect(list.className).not.toContain("flex-col");
  });

  it("applies vertical flex-col when orientation is vertical", () => {
    render(
      <Stepper orientation="vertical" aria-label="Steps">
        <StepperList>
          <StepperItem>
            <StepperLabel>One</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    const list = screen.getByRole("list");
    expect(list.className).toContain("flex-col");
  });
});

describe("StepperItem", () => {
  it("renders an li element", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem>
            <StepperLabel>One</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByRole("listitem")).toBeTruthy();
  });

  it("sets data-state from state prop", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem state="completed">
            <StepperLabel>One</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByRole("listitem")).toHaveAttribute(
      "data-state",
      "completed",
    );
  });

  it("defaults to inactive state", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem>
            <StepperLabel>One</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByRole("listitem")).toHaveAttribute(
      "data-state",
      "inactive",
    );
  });

  it("sets aria-current=step when active", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem state="active">
            <StepperLabel>One</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByRole("listitem")).toHaveAttribute(
      "aria-current",
      "step",
    );
  });

  it("does not set aria-current when completed", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem state="completed">
            <StepperLabel>One</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByRole("listitem")).not.toHaveAttribute("aria-current");
  });

  it("does not set aria-current when inactive", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem state="inactive">
            <StepperLabel>One</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByRole("listitem")).not.toHaveAttribute("aria-current");
  });
});

describe("StepperIndicator", () => {
  it("renders children", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem state="active">
            <StepperIndicator>2</StepperIndicator>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByText("2")).toBeTruthy();
  });

  it("inherits data-state from StepperItem", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem state="completed">
            <StepperIndicator data-testid="indicator">
              1
            </StepperIndicator>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByTestId("indicator")).toHaveAttribute(
      "data-state",
      "completed",
    );
  });
});

describe("StepperLabel", () => {
  it("renders label text", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem>
            <StepperLabel>Configure</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByText("Configure")).toBeTruthy();
  });

  it("inherits data-state from StepperItem", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem state="active">
            <StepperLabel data-testid="label">Configure</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByTestId("label")).toHaveAttribute(
      "data-state",
      "active",
    );
  });
});

describe("StepperDescription", () => {
  it("renders description text", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem state="active">
            <StepperLabel>Build</StepperLabel>
            <StepperDescription>Installing...</StepperDescription>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByText("Installing...")).toBeTruthy();
  });

  it("inherits data-state from StepperItem", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem state="active">
            <StepperLabel>Build</StepperLabel>
            <StepperDescription data-testid="desc">
              Installing...
            </StepperDescription>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByTestId("desc")).toHaveAttribute(
      "data-state",
      "active",
    );
  });
});

describe("StepperConnector", () => {
  it("renders with aria-hidden", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem>
            <StepperLabel>One</StepperLabel>
          </StepperItem>
          <StepperConnector data-testid="conn" />
          <StepperItem>
            <StepperLabel>Two</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    const conn = screen.getByTestId("conn");
    expect(conn).toHaveAttribute("aria-hidden", "true");
  });

  it("sets data-orientation=horizontal by default", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem>
            <StepperLabel>One</StepperLabel>
          </StepperItem>
          <StepperConnector data-testid="conn" />
          <StepperItem>
            <StepperLabel>Two</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByTestId("conn")).toHaveAttribute(
      "data-orientation",
      "horizontal",
    );
  });

  it("sets data-orientation=vertical when Stepper is vertical", () => {
    render(
      <Stepper orientation="vertical" aria-label="Steps">
        <StepperList>
          <StepperItem>
            <StepperLabel>One</StepperLabel>
          </StepperItem>
          <StepperConnector data-testid="conn" />
          <StepperItem>
            <StepperLabel>Two</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByTestId("conn")).toHaveAttribute(
      "data-orientation",
      "vertical",
    );
  });

  it("applies h-1 for horizontal and w-1 for vertical", () => {
    const { rerender } = render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem>
            <StepperLabel>One</StepperLabel>
          </StepperItem>
          <StepperConnector data-testid="conn" />
          <StepperItem>
            <StepperLabel>Two</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByTestId("conn").className).toContain("h-1");

    rerender(
      <Stepper orientation="vertical" aria-label="Steps">
        <StepperList>
          <StepperItem>
            <StepperLabel>One</StepperLabel>
          </StepperItem>
          <StepperConnector data-testid="conn" />
          <StepperItem>
            <StepperLabel>Two</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByTestId("conn").className).toContain("w-1");
  });
});

describe("integration", () => {
  it("renders a complete horizontal stepper", () => {
    render(
      <Stepper aria-label="Wizard">
        <StepperList>
          <StepperItem state="completed">
            <StepperIndicator>1</StepperIndicator>
            <StepperLabel>Select</StepperLabel>
          </StepperItem>
          <StepperConnector />
          <StepperItem state="active">
            <StepperIndicator>2</StepperIndicator>
            <StepperLabel>Configure</StepperLabel>
            <StepperDescription>Editing settings...</StepperDescription>
          </StepperItem>
          <StepperConnector />
          <StepperItem state="inactive">
            <StepperIndicator>3</StepperIndicator>
            <StepperLabel>Deploy</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );

    const items = screen.getAllByRole("listitem");
    // 3 StepperItems visible (connectors are aria-hidden)
    expect(items).toHaveLength(3);
    expect(screen.getByText("Select")).toBeTruthy();
    expect(screen.getByText("Configure")).toBeTruthy();
    expect(screen.getByText("Deploy")).toBeTruthy();
    expect(screen.getByText("Editing settings...")).toBeTruthy();
  });
});
