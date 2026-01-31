"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Signal Design System -- Data Table
// ---------------------------------------------------------------------------
// A dense, sortable, selectable table for power-user data views.
//
// Usage:
//   <DataTable
//     columns={[
//       { key: "name", header: "Candidate", sortable: true },
//       { key: "stage", header: "Stage" },
//       { key: "date", header: "Applied", sortable: true, align: "right" },
//     ]}
//     data={candidates}
//     getRowId={(row) => row.id}
//     onRowClick={(row) => openDetail(row.id)}
//     selectable
//     emptyState={<p>No candidates yet.</p>}
//   />
// ---------------------------------------------------------------------------

export type SortDirection = "asc" | "desc";

export interface ColumnDef<T> {
  /** Unique key -- used to access row[key] by default */
  key: string;
  /** Column header text */
  header: React.ReactNode;
  /** Custom cell renderer. Falls back to row[key] */
  cell?: (row: T, index: number) => React.ReactNode;
  /** Allow sorting on this column */
  sortable?: boolean;
  /** Text alignment */
  align?: "left" | "center" | "right";
  /** Fixed width (CSS value) */
  width?: string | number;
  /** Additional className for the <th> and <td> */
  className?: string;
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  /** Unique row identifier -- required for selection & keying */
  getRowId?: (row: T, index: number) => string | number;
  /** Enable row checkbox selection */
  selectable?: boolean;
  /** Controlled selected row IDs */
  selectedIds?: Set<string | number>;
  /** Callback when selection changes */
  onSelectionChange?: (ids: Set<string | number>) => void;
  /** Callback on row click */
  onRowClick?: (row: T) => void;
  /** Controlled sort state */
  sortKey?: string;
  sortDirection?: SortDirection;
  onSort?: (key: string, direction: SortDirection) => void;
  /** Content to show when data is empty */
  emptyState?: React.ReactNode;
  /** Wrapper className */
  className?: string;
  /** Whether to render a loading state */
  loading?: boolean;
}

// -- Sort indicator icon -----------------------------------------------------

function SortIcon({
  direction,
  active,
}: {
  direction?: SortDirection;
  active: boolean;
}) {
  return (
    <span
      className={cn(
        "ml-1 inline-flex flex-col items-center justify-center",
        active ? "text-indigo-400" : "text-zinc-600"
      )}
    >
      <svg
        width="8"
        height="10"
        viewBox="0 0 8 10"
        fill="none"
        className="shrink-0"
      >
        <path
          d="M4 0.5L7 4H1L4 0.5Z"
          fill={active && direction === "asc" ? "currentColor" : "rgb(63 63 70)"}
        />
        <path
          d="M4 9.5L1 6H7L4 9.5Z"
          fill={active && direction === "desc" ? "currentColor" : "rgb(63 63 70)"}
        />
      </svg>
    </span>
  );
}

// -- Checkbox ----------------------------------------------------------------

function Checkbox({
  checked,
  indeterminate,
  onChange,
  className,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}) {
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = !!indeterminate;
    }
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className={cn(
        "h-3.5 w-3.5 rounded border border-zinc-600 bg-transparent",
        "text-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-0",
        "accent-indigo-500 cursor-pointer",
        className
      )}
    />
  );
}

// -- Main component ----------------------------------------------------------

function DataTable<T extends object>({
  columns,
  data,
  getRowId = ((_row: T, i: number) => String(i)) as (row: T, index: number) => string | number,
  selectable = false,
  selectedIds: controlledSelectedIds,
  onSelectionChange,
  onRowClick,
  sortKey: controlledSortKey,
  sortDirection: controlledSortDir,
  onSort,
  emptyState,
  className,
  loading = false,
}: DataTableProps<T> & { getRowId?: (row: T, index: number) => string | number }) {
  // Internal sort state (uncontrolled mode)
  const [internalSortKey, setInternalSortKey] = React.useState<string | null>(null);
  const [internalSortDir, setInternalSortDir] = React.useState<SortDirection>("asc");

  const sortKey = controlledSortKey ?? internalSortKey;
  const sortDirection = controlledSortDir ?? internalSortDir;

  // Internal selection state (uncontrolled mode)
  const [internalSelected, setInternalSelected] = React.useState<Set<string | number>>(new Set());
  const selectedIds = controlledSelectedIds ?? internalSelected;

  const setSelectedIds = React.useCallback(
    (next: Set<string | number>) => {
      if (onSelectionChange) {
        onSelectionChange(next);
      } else {
        setInternalSelected(next);
      }
    },
    [onSelectionChange]
  );

  // Sort handler
  const handleSort = (key: string) => {
    const nextDir: SortDirection =
      sortKey === key && sortDirection === "asc" ? "desc" : "asc";

    if (onSort) {
      onSort(key, nextDir);
    } else {
      setInternalSortKey(key);
      setInternalSortDir(nextDir);
    }
  };

  // Select all
  const allRowIds = data.map((row, i) => getRowId(row, i));
  const allSelected = data.length > 0 && allRowIds.every((id) => selectedIds.has(id));
  const someSelected = !allSelected && allRowIds.some((id) => selectedIds.has(id));

  const toggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(allRowIds));
    } else {
      setSelectedIds(new Set());
    }
  };

  const toggleRow = (id: string | number) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  // Alignment utility
  const alignClass = (align?: string) => {
    if (align === "center") return "text-center";
    if (align === "right") return "text-right";
    return "text-left";
  };

  const isEmpty = data.length === 0 && !loading;

  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-lg border border-zinc-800/80",
        "bg-zinc-900/50",
        className
      )}
    >
      <table className="w-full border-collapse text-sm">
        {/* Header */}
        <thead className="sticky top-0 z-10">
          <tr className="border-b border-zinc-800 bg-zinc-900/95 backdrop-blur-sm">
            {/* Selection checkbox header */}
            {selectable && (
              <th className="w-10 px-3 py-2.5">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={toggleAll}
                />
              </th>
            )}

            {columns.map((col) => {
              const isActive = sortKey === col.key;
              return (
                <th
                  key={col.key}
                  className={cn(
                    "px-3 py-2.5 font-semibold text-[11px] uppercase tracking-wider text-zinc-500",
                    alignClass(col.align),
                    col.sortable && "cursor-pointer select-none hover:text-zinc-300 transition-colors",
                    col.className
                  )}
                  style={{ width: col.width }}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <span className="inline-flex items-center gap-0.5">
                    {col.header}
                    {col.sortable && (
                      <SortIcon
                        direction={isActive ? sortDirection : undefined}
                        active={isActive}
                      />
                    )}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {loading && (
            <>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={`skel-${i}`} className="border-b border-zinc-800/50">
                  {selectable && (
                    <td className="px-3 py-2.5">
                      <div className="h-3.5 w-3.5 rounded bg-zinc-800 animate-pulse" />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className="px-3 py-2.5">
                      <div
                        className="h-4 rounded bg-zinc-800 animate-pulse"
                        style={{
                          width: `${50 + Math.random() * 40}%`,
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </>
          )}

          {!loading &&
            data.map((row, rowIndex) => {
              const rowId = getRowId(row, rowIndex);
              const isSelected = selectedIds.has(rowId);

              return (
                <tr
                  key={String(rowId)}
                  className={cn(
                    "border-b border-zinc-800/40 transition-colors duration-75",
                    "hover:bg-zinc-800/40",
                    isSelected && "bg-indigo-500/[0.06]",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={
                    onRowClick
                      ? (e) => {
                          // Don't trigger row click if clicking the checkbox
                          if ((e.target as HTMLElement).closest('input[type="checkbox"]')) return;
                          onRowClick(row);
                        }
                      : undefined
                  }
                >
                  {selectable && (
                    <td className="w-10 px-3 py-2">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => toggleRow(rowId)}
                      />
                    </td>
                  )}

                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-3 py-2 text-zinc-300",
                        alignClass(col.align),
                        col.className
                      )}
                      style={{ width: col.width }}
                    >
                      {col.cell
                        ? col.cell(row, rowIndex)
                        : ((row as Record<string, unknown>)[col.key] as React.ReactNode) ?? "\u2014"}
                    </td>
                  ))}
                </tr>
              );
            })}
        </tbody>
      </table>

      {/* Empty state */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <svg
            className="h-10 w-10 text-zinc-700 mb-3"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
            <polyline points="13 2 13 9 20 9" />
            <line x1="9" y1="13" x2="15" y2="13" />
            <line x1="9" y1="17" x2="15" y2="17" />
          </svg>
          {emptyState ?? (
            <p className="text-sm text-zinc-500">No data to display.</p>
          )}
        </div>
      )}
    </div>
  );
}

DataTable.displayName = "DataTable";

export { DataTable };
