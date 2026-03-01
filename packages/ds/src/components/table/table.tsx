"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@ac/lib/cn";

type SortDirection = "asc" | "desc";

export type Column<T> = {
  header: string;
  accessor: (row: T) => ReactNode;
  sortable?: boolean;
  sortValue?: (row: T) => string | number;
  width?: string;
  align?: "left" | "center" | "right";
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  className?: string;
};

function ChevronIcon({
  direction,
}: {
  direction: SortDirection | null;
}) {
  return (
    <svg
      className={cn(
        "ml-1 inline size-3 transition-transform",
        direction === "desc" && "rotate-180",
        direction === null && "opacity-0",
      )}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  );
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  className,
}: TableProps<T>) {
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>("asc");

  function handleSort(colIndex: number) {
    if (sortCol === colIndex) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(colIndex);
      setSortDir("asc");
    }
  }

  let sortedData = data;
  const activeCol = sortCol !== null ? columns[sortCol] : undefined;
  if (activeCol?.sortValue) {
    const getValue = activeCol.sortValue;
    const dir = sortDir === "asc" ? 1 : -1;
    sortedData = [...data].sort((a, b) => {
      const aVal = getValue(a);
      const bVal = getValue(b);
      if (typeof aVal === "number" && typeof bVal === "number") {
        return (aVal - bVal) * dir;
      }
      return String(aVal).localeCompare(String(bVal)) * dir;
    });
  }

  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  } as const;

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-muted/50">
            {columns.map((col, i) => (
              <th
                key={col.header}
                className={cn(
                  "px-4 py-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground",
                  alignClass[col.align ?? "left"],
                  col.sortable && "cursor-pointer select-none",
                )}
                style={col.width ? { width: col.width } : undefined}
                onClick={col.sortable ? () => handleSort(i) : undefined}
              >
                {col.header}
                {col.sortable && (
                  <ChevronIcon
                    direction={sortCol === i ? sortDir : null}
                  />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row) => (
            <tr
              key={keyExtractor(row)}
              className={cn(
                "border-b border-edge transition-colors",
                "even:bg-muted/30",
                "hover:bg-muted/50",
                onRowClick && "cursor-pointer",
              )}
              style={{ transitionDuration: "var(--duration-fast)" }}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((col) => (
                <td
                  key={col.header}
                  className={cn(
                    "px-4 py-3 text-sm",
                    alignClass[col.align ?? "left"],
                  )}
                >
                  {col.accessor(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
