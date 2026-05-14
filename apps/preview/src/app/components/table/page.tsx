"use client";

import { useState } from "react";
import { Badge } from "@aleph-front/ds/badge";
import { StatusDot } from "@aleph-front/ds/status-dot";
import { Table, type Column } from "@aleph-front/ds/table";
import { DocHeader } from "@preview/components/doc-header";
import { DemoSection } from "@preview/components/demo-section";

type Node = {
  id: string;
  name: string;
  status: "healthy" | "degraded" | "offline";
  cpu: number;
  vms: number;
};

const nodes: Node[] = [
  { id: "1", name: "node-01", status: "healthy", cpu: 45, vms: 5 },
  { id: "2", name: "node-02", status: "healthy", cpu: 28, vms: 8 },
  { id: "3", name: "node-03", status: "degraded", cpu: 92, vms: 3 },
  { id: "4", name: "node-04", status: "offline", cpu: 0, vms: 0 },
  { id: "5", name: "node-05", status: "healthy", cpu: 55, vms: 6 },
];

const columns: Column<Node>[] = [
  {
    header: "Status",
    accessor: (r) => <StatusDot status={r.status} aria-label={r.status} />,
    width: "60px",
    align: "center",
  },
  {
    header: "Name",
    accessor: (r) => <span className="font-mono text-sm">{r.name}</span>,
    sortable: true,
    sortValue: (r) => r.name,
  },
  {
    header: "CPU %",
    accessor: (r) => `${r.cpu}%`,
    sortable: true,
    sortValue: (r) => r.cpu,
    align: "right",
  },
  {
    header: "VMs",
    accessor: (r) => (
      <Badge size="sm" variant={r.vms > 0 ? "info" : "default"}>
        {r.vms}
      </Badge>
    ),
    sortable: true,
    sortValue: (r) => r.vms,
    align: "center",
  },
];

function ControlledSortDemo() {
  const [sortColumn, setSortColumn] = useState<string>("VMs");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    "desc",
  );

  const sorted = [...nodes].sort((a, b) => {
    const col = columns.find((c) => c.header === sortColumn);
    if (!col?.sortValue) return 0;
    const aVal = col.sortValue(a);
    const bVal = col.sortValue(b);
    const dir = sortDirection === "asc" ? 1 : -1;
    if (typeof aVal === "number" && typeof bVal === "number") {
      return (aVal - bVal) * dir;
    }
    return String(aVal).localeCompare(String(bVal)) * dir;
  });

  return (
    <Table
      columns={columns}
      data={sorted}
      keyExtractor={(r) => r.id}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      onSortChange={(col, dir) => {
        setSortColumn(col);
        setSortDirection(dir);
      }}
    />
  );
}

export default function TablePage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <>
      <DocHeader
        title="Table"
        description="Generic typed table with sortable columns, alternating rows, hover, and row click."
      />
      <DemoSection title="Basic with Sorting">
        <Table
          columns={columns}
          data={nodes}
          keyExtractor={(r) => r.id}
          onRowClick={(r) => setSelected(r.id)}
        />
        {selected && (
          <p className="mt-3 text-sm text-muted-foreground">
            Selected row: <strong>{selected}</strong>
          </p>
        )}
      </DemoSection>
      <DemoSection title="Without Row Click">
        <Table
          columns={columns.slice(0, 2)}
          data={nodes.slice(0, 3)}
          keyExtractor={(r) => r.id}
        />
      </DemoSection>
      <DemoSection title="Right-aligned sortable columns (narrow)">
        <p className="mb-3 text-sm text-muted-foreground">
          Right-aligned sortable header text must end flush with the right
          edge of body cells. Verify the CPU % header aligns with its values
          even at mobile width.
        </p>
        <div className="max-w-sm">
          <Table
            columns={columns.slice(1, 3)}
            data={nodes}
            keyExtractor={(r) => r.id}
          />
        </div>
      </DemoSection>
      <DemoSection title="Controlled sort">
        <p className="mb-3 text-sm text-muted-foreground">
          Use when sorting must apply to a larger dataset than the rows
          rendered (e.g. a paginated list). The parent owns sort state and
          pre-sorts the data; the table delegates header clicks via{" "}
          <code>onSortChange</code> and renders the indicator from{" "}
          <code>sortColumn</code>/<code>sortDirection</code>.
        </p>
        <ControlledSortDemo />
      </DemoSection>
    </>
  );
}
