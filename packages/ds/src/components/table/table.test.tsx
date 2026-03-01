import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Table } from "./table";

type Row = { id: string; name: string; value: number };

const columns = [
  { header: "Name", accessor: (r: Row) => r.name },
  { header: "Value", accessor: (r: Row) => r.value },
];

const data: Row[] = [
  { id: "1", name: "Alpha", value: 10 },
  { id: "2", name: "Beta", value: 20 },
  { id: "3", name: "Gamma", value: 30 },
];

describe("Table", () => {
  it("renders correct number of rows", () => {
    render(
      <Table columns={columns} data={data} keyExtractor={(r) => r.id} />,
    );
    const rows = screen.getAllByRole("row");
    // 1 header + 3 data rows
    expect(rows.length).toBe(4);
  });

  it("renders column headers", () => {
    render(
      <Table columns={columns} data={data} keyExtractor={(r) => r.id} />,
    );
    expect(screen.getByText("Name")).toBeTruthy();
    expect(screen.getByText("Value")).toBeTruthy();
  });

  it("renders cell content", () => {
    render(
      <Table columns={columns} data={data} keyExtractor={(r) => r.id} />,
    );
    expect(screen.getByText("Alpha")).toBeTruthy();
    expect(screen.getByText("20")).toBeTruthy();
  });

  it("calls onRowClick when a row is clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Table
        columns={columns}
        data={data}
        keyExtractor={(r) => r.id}
        onRowClick={onClick}
      />,
    );
    await user.click(screen.getByText("Beta"));
    expect(onClick).toHaveBeenCalledWith(data[1]);
  });

  it("merges custom className", () => {
    const { container } = render(
      <Table
        columns={columns}
        data={data}
        keyExtractor={(r) => r.id}
        className="custom"
      />,
    );
    expect(container.firstElementChild?.className).toContain("custom");
  });
});
