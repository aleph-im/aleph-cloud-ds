"use client";

import { useState, type KeyboardEvent, type ReactNode } from "react";
import { CaretUp } from "@phosphor-icons/react";
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
  activeKey?: string | undefined;
  emptyState?: ReactNode;
  className?: string;
  /**
   * Header of the column to indicate as sorted.
   * When provided alongside `onSortChange`, the table operates in
   * controlled mode: it does not sort `data` internally and assumes
   * the parent passes pre-sorted rows. Use this when sorting must
   * apply to a larger dataset than the rows currently rendered
   * (e.g. when paginating outside the table).
   */
  sortColumn?: string;
  sortDirection?: SortDirection;
  onSortChange?: (column: string, direction: SortDirection) => void;
};

function SortIcon({
  direction,
}: {
  direction: SortDirection | null;
}) {
  return (
    <CaretUp
      weight="bold"
      className={cn(
        "inline size-3 transition-transform motion-reduce:transition-none",
        direction === "desc" && "rotate-180",
        direction === null && "opacity-0",
      )}
      aria-hidden="true"
    />
  );
}

function ariaSortValue(
  colIndex: number,
  sortCol: number | null,
  sortDir: SortDirection,
): "ascending" | "descending" | "none" {
  if (colIndex !== sortCol) return "none";
  return sortDir === "asc" ? "ascending" : "descending";
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  activeKey,
  emptyState,
  className,
  sortColumn,
  sortDirection,
  onSortChange,
}: TableProps<T>) {
  const isControlled = onSortChange != null;

  const [internalSortCol, setInternalSortCol] = useState<number | null>(
    null,
  );
  const [internalSortDir, setInternalSortDir] =
    useState<SortDirection>("asc");

  const controlledSortCol =
    sortColumn != null
      ? columns.findIndex((c) => c.header === sortColumn)
      : -1;
  const activeSortCol = isControlled
    ? controlledSortCol >= 0
      ? controlledSortCol
      : null
    : internalSortCol;
  const activeSortDir = isControlled
    ? (sortDirection ?? "asc")
    : internalSortDir;

  function handleSort(colIndex: number) {
    const col = columns[colIndex];
    if (!col?.sortable) return;
    if (isControlled) {
      const isCurrent = activeSortCol === colIndex;
      const nextDir: SortDirection = isCurrent
        ? activeSortDir === "asc"
          ? "desc"
          : "asc"
        : "asc";
      onSortChange(col.header, nextDir);
    } else if (internalSortCol === colIndex) {
      setInternalSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setInternalSortCol(colIndex);
      setInternalSortDir("asc");
    }
  }

  function handleHeaderKeyDown(
    e: KeyboardEvent,
    colIndex: number,
  ) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSort(colIndex);
    }
  }

  function handleRowKeyDown(e: KeyboardEvent, row: T) {
    if (e.key === "Enter") {
      e.preventDefault();
      onRowClick?.(row);
    }
  }

  let sortedData = data;
  if (!isControlled) {
    const activeCol =
      activeSortCol !== null ? columns[activeSortCol] : undefined;
    if (activeCol?.sortValue) {
      const getValue = activeCol.sortValue;
      const dir = activeSortDir === "asc" ? 1 : -1;
      sortedData = [...data].sort((a, b) => {
        const aVal = getValue(a);
        const bVal = getValue(b);
        if (typeof aVal === "number" && typeof bVal === "number") {
          return (aVal - bVal) * dir;
        }
        return String(aVal).localeCompare(String(bVal)) * dir;
      });
    }
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
                tabIndex={col.sortable ? 0 : undefined}
                aria-sort={
                  col.sortable
                    ? ariaSortValue(i, activeSortCol, activeSortDir)
                    : undefined
                }
                onClick={col.sortable ? () => handleSort(i) : undefined}
                onKeyDown={
                  col.sortable
                    ? (e) => handleHeaderKeyDown(e, i)
                    : undefined
                }
              >
                {col.sortable ? (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1",
                      col.align === "right" && "flex-row-reverse",
                    )}
                  >
                    {col.header}
                    <SortIcon
                      direction={
                        activeSortCol === i ? activeSortDir : null
                      }
                    />
                  </span>
                ) : (
                  col.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 && emptyState ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-sm text-muted-foreground"
              >
                {emptyState}
              </td>
            </tr>
          ) : (
            sortedData.map((row) => (
              <tr
                key={keyExtractor(row)}
                className={cn(
                  "border-b border-edge transition-all",
                  activeKey === keyExtractor(row)
                    ? "bg-primary-600/10 shadow-[inset_3px_0_0_var(--color-primary-500)]"
                    : "even:bg-muted/30",
                  "hover:bg-muted/50",
                  onRowClick &&
                    "cursor-pointer hover:shadow-[inset_3px_0_0_var(--color-primary-500)]",
                )}
                aria-current={
                  activeKey === keyExtractor(row) ? "true" : undefined
                }
                style={{ transitionDuration: "var(--duration-fast)" }}
                tabIndex={onRowClick ? 0 : undefined}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                onKeyDown={
                  onRowClick
                    ? (e) => handleRowKeyDown(e, row)
                    : undefined
                }
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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
