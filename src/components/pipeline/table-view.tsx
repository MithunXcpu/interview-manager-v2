"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { FiMoreVertical, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { DataTable, type ColumnDef, type SortDirection } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/lib/utils";
import { usePipelineStore } from "@/stores/pipeline-store";
import type { CompanyWithRelations } from "@/types";

// ---------------------------------------------------------------------------
// Table View -- Sortable data table for the pipeline
// ---------------------------------------------------------------------------

interface TableViewProps {
  companies: CompanyWithRelations[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
}

const priorityConfig = {
  HIGH: { variant: "danger" as const, label: "High" },
  MEDIUM: { variant: "warning" as const, label: "Medium" },
  LOW: { variant: "success" as const, label: "Low" },
} as const;

// Map our store sort fields to data table column keys
const sortFieldToColumnKey: Record<string, string> = {
  name: "name",
  date: "appliedDate",
  priority: "priority",
  salary: "salary",
};

const columnKeyToSortField: Record<string, string> = {
  name: "name",
  appliedDate: "date",
  priority: "priority",
  salary: "salary",
};

export function TableView({ companies, isLoading, onDelete }: TableViewProps) {
  const router = useRouter();
  const sortBy = usePipelineStore((s) => s.sortBy);
  const setSortBy = usePipelineStore((s) => s.setSortBy);
  const sortOrder = usePipelineStore((s) => s.sortOrder);
  const toggleSortOrder = usePipelineStore((s) => s.toggleSortOrder);
  const selectedCompanyIds = usePipelineStore((s) => s.selectedCompanyIds);
  const addSelectedCompany = usePipelineStore((s) => s.addSelectedCompany);
  const removeSelectedCompany = usePipelineStore((s) => s.removeSelectedCompany);
  const toggleAllCompanies = usePipelineStore((s) => s.toggleAllCompanies);

  // Selection state bridged to DataTable's Set-based API
  const selectedIds = useMemo(
    () => new Set<string | number>(selectedCompanyIds),
    [selectedCompanyIds]
  );

  const handleSelectionChange = (ids: Set<string | number>) => {
    // Sync back to the pipeline store
    const newIds = Array.from(ids) as string[];
    const currentIds = new Set(selectedCompanyIds);

    // Find removed
    selectedCompanyIds.forEach((id) => {
      if (!ids.has(id)) removeSelectedCompany(id);
    });

    // Find added
    newIds.forEach((id) => {
      if (!currentIds.has(id)) addSelectedCompany(id);
    });
  };

  const handleSort = (key: string, direction: SortDirection) => {
    const storeField = columnKeyToSortField[key];
    if (storeField) {
      if (sortBy !== storeField) {
        setSortBy(storeField as "name" | "date" | "priority" | "salary");
      }
      if (sortOrder !== direction) {
        toggleSortOrder();
      }
    }
  };

  const columns: ColumnDef<CompanyWithRelations>[] = useMemo(
    () => [
      {
        key: "name",
        header: "Company",
        sortable: true,
        cell: (row) => (
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-100 truncate">
              {row.name}
            </p>
            {row.jobTitle && (
              <p className="text-[11px] text-zinc-500 truncate">
                {row.jobTitle}
              </p>
            )}
          </div>
        ),
      },
      {
        key: "stage",
        header: "Stage",
        cell: (row) => {
          if (!row.userStage) return <span className="text-zinc-600">--</span>;
          return (
            <span className="inline-flex items-center gap-1.5 text-xs">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: row.userStage.color }}
              />
              <span className="text-zinc-300">{row.userStage.name}</span>
            </span>
          );
        },
      },
      {
        key: "priority",
        header: "Priority",
        sortable: true,
        cell: (row) => {
          const config = priorityConfig[row.priority];
          return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
        },
      },
      {
        key: "salary",
        header: "Salary Range",
        sortable: true,
        align: "right" as const,
        cell: (row) => {
          if (!row.salaryMin && !row.salaryMax) {
            return <span className="text-zinc-600">--</span>;
          }
          return (
            <span className="text-xs text-zinc-300 font-mono">
              {row.salaryMin && row.salaryMax
                ? `${formatCurrency(row.salaryMin, { compact: true })} - ${formatCurrency(row.salaryMax, { compact: true })}`
                : row.salaryMin
                  ? `${formatCurrency(row.salaryMin, { compact: true })}+`
                  : `Up to ${formatCurrency(row.salaryMax!, { compact: true })}`}
            </span>
          );
        },
      },
      {
        key: "appliedDate",
        header: "Applied",
        sortable: true,
        cell: (row) => {
          if (!row.appliedDate) return <span className="text-zinc-600">--</span>;
          return (
            <span className="text-xs text-zinc-400">
              {formatDate(row.appliedDate)}
            </span>
          );
        },
      },
      {
        key: "nextInterview",
        header: "Next Interview",
        cell: (row) => {
          const now = new Date();
          const next = row.interviews
            .filter(
              (i) =>
                new Date(i.scheduledAt) > now && i.status === "SCHEDULED"
            )
            .sort(
              (a, b) =>
                new Date(a.scheduledAt).getTime() -
                new Date(b.scheduledAt).getTime()
            )[0];

          if (!next) return <span className="text-zinc-600">--</span>;

          return (
            <span className="text-xs text-cyan-400">
              {formatDate(next.scheduledAt, "datetime")}
            </span>
          );
        },
      },
      {
        key: "actions",
        header: "",
        width: 44,
        cell: (row) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 transition-colors"
              >
                <FiMoreVertical className="w-3.5 h-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={() => router.push(`/companies/${row.id}`)}>
                <FiEye className="w-3.5 h-3.5 mr-2" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/companies/${row.id}`)}>
                <FiEdit2 className="w-3.5 h-3.5 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                destructive
                onClick={() => onDelete?.(row.id)}
              >
                <FiTrash2 className="w-3.5 h-3.5 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [router, onDelete]
  );

  return (
    <DataTable
      columns={columns}
      data={companies}
      getRowId={(row) => row.id}
      selectable
      selectedIds={selectedIds}
      onSelectionChange={handleSelectionChange}
      onRowClick={(row) => router.push(`/companies/${row.id}`)}
      sortKey={sortFieldToColumnKey[sortBy]}
      sortDirection={sortOrder}
      onSort={handleSort}
      loading={isLoading}
      emptyState={
        <div className="text-center">
          <p className="text-sm text-zinc-400 mb-1">No companies found</p>
          <p className="text-xs text-zinc-600">
            Add a company to start tracking your pipeline.
          </p>
        </div>
      }
    />
  );
}
