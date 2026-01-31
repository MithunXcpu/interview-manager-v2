"use client";

import { useState } from "react";
import { FiPlus, FiSearch, FiTrash2, FiDownload, FiArrowUp, FiArrowDown } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { usePipelineStore } from "@/stores/pipeline-store";
import type { PipelineView } from "@/types";

// ---------------------------------------------------------------------------
// Pipeline Toolbar
// ---------------------------------------------------------------------------

interface PipelineToolbarProps {
  onAddCompany: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onBulkDelete?: () => void;
  onBulkExport?: () => void;
}

const viewOptions: { key: PipelineView; label: string; icon: string }[] = [
  { key: "kanban", label: "Kanban", icon: "columns" },
  { key: "table", label: "Table", icon: "list" },
];

const sortOptions = [
  { key: "name", label: "Name" },
  { key: "date", label: "Date Added" },
  { key: "priority", label: "Priority" },
  { key: "salary", label: "Salary" },
] as const;

const priorityFilters = ["ALL", "HIGH", "MEDIUM", "LOW"] as const;

export function PipelineToolbar({
  onAddCompany,
  searchQuery,
  onSearchChange,
  onBulkDelete,
  onBulkExport,
}: PipelineToolbarProps) {
  const view = usePipelineStore((s) => s.view);
  const setView = usePipelineStore((s) => s.setView);
  const sortBy = usePipelineStore((s) => s.sortBy);
  const setSortBy = usePipelineStore((s) => s.setSortBy);
  const sortOrder = usePipelineStore((s) => s.sortOrder);
  const toggleSortOrder = usePipelineStore((s) => s.toggleSortOrder);
  const filterPriority = usePipelineStore((s) => s.filterPriority);
  const setFilterPriority = usePipelineStore((s) => s.setFilterPriority);
  const selectedCompanyIds = usePipelineStore((s) => s.selectedCompanyIds);
  const clearSelectedCompanies = usePipelineStore((s) => s.clearSelectedCompanies);

  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  const hasSelection = selectedCompanyIds.length > 0;

  return (
    <div className="space-y-3">
      {/* Main toolbar row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Left: View switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-0.5">
            {viewOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setView(opt.key)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150",
                  view === opt.key
                    ? "bg-indigo-500/15 text-indigo-400 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <DropdownMenu open={sortMenuOpen} onOpenChange={setSortMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm">
                Sort: {sortOptions.find((s) => s.key === sortBy)?.label ?? "Date"}
                {sortOrder === "asc" ? (
                  <FiArrowUp className="w-3 h-3 ml-1" />
                ) : (
                  <FiArrowDown className="w-3 h-3 ml-1" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {sortOptions.map((opt) => (
                <DropdownMenuItem
                  key={opt.key}
                  onClick={() => {
                    if (sortBy === opt.key) {
                      toggleSortOrder();
                    } else {
                      setSortBy(opt.key);
                    }
                    setSortMenuOpen(false);
                  }}
                >
                  <span
                    className={cn(
                      sortBy === opt.key ? "text-indigo-400" : "text-zinc-300"
                    )}
                  >
                    {opt.label}
                  </span>
                  {sortBy === opt.key && (
                    <span className="ml-auto text-indigo-400">
                      {sortOrder === "asc" ? (
                        <FiArrowUp className="w-3 h-3" />
                      ) : (
                        <FiArrowDown className="w-3 h-3" />
                      )}
                    </span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Priority filter buttons */}
          <div className="hidden md:flex items-center gap-1">
            {priorityFilters.map((p) => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-medium rounded-md transition-all duration-150",
                  filterPriority === p
                    ? p === "HIGH"
                      ? "bg-red-500/15 text-red-400 border border-red-500/20"
                      : p === "MEDIUM"
                        ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                        : p === "LOW"
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                          : "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20"
                    : "text-zinc-500 hover:text-zinc-300 border border-transparent"
                )}
              >
                {p === "ALL" ? "All" : p.charAt(0) + p.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Search + Add */}
        <div className="flex items-center gap-3">
          <div className="w-52">
            <Input
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              iconPrefix={<FiSearch className="w-3.5 h-3.5" />}
              className="h-8 text-xs"
            />
          </div>

          <div data-tour="add-company">
            <Button
              size="sm"
              iconLeft={<FiPlus className="w-3.5 h-3.5" />}
              onClick={onAddCompany}
            >
              Add Company
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk actions bar */}
      {hasSelection && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-indigo-500/20 bg-indigo-500/[0.06]">
          <span className="text-xs text-indigo-400 font-medium">
            {selectedCompanyIds.length} selected
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="ghost"
              size="sm"
              iconLeft={<FiDownload className="w-3 h-3" />}
              onClick={onBulkExport}
            >
              Export
            </Button>
            <Button
              variant="danger"
              size="sm"
              iconLeft={<FiTrash2 className="w-3 h-3" />}
              onClick={onBulkDelete}
            >
              Delete
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelectedCompanies}
            >
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
