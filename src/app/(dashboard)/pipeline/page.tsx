"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useCompanies, useDeleteCompany } from "@/hooks/use-companies";
import { useUserStages } from "@/hooks/use-stages";
import { usePipelineStore } from "@/stores/pipeline-store";
import { KanbanBoard } from "@/components/pipeline/kanban-board";
import { TableView } from "@/components/pipeline/table-view";
import { PipelineStats } from "@/components/pipeline/pipeline-stats";
import { PipelineToolbar } from "@/components/pipeline/pipeline-toolbar";
import { AddCompanyDialog } from "@/components/pipeline/add-company-dialog";

export default function PipelinePage() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: companies = [], isLoading: companiesLoading } = useCompanies();
  const { data: userStages = [], isLoading: stagesLoading } = useUserStages();
  const deleteCompany = useDeleteCompany();

  const view = usePipelineStore((s) => s.view);
  const sortBy = usePipelineStore((s) => s.sortBy);
  const sortOrder = usePipelineStore((s) => s.sortOrder);
  const filterPriority = usePipelineStore((s) => s.filterPriority);
  const selectedCompanyIds = usePipelineStore((s) => s.selectedCompanyIds);
  const clearSelectedCompanies = usePipelineStore((s) => s.clearSelectedCompanies);

  const isLoading = companiesLoading || stagesLoading;

  // Filter and sort companies
  const filteredCompanies = useMemo(() => {
    let result = [...companies];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.jobTitle?.toLowerCase().includes(q) ||
          c.location?.toLowerCase().includes(q) ||
          c.recruiterName?.toLowerCase().includes(q)
      );
    }

    // Priority filter
    if (filterPriority !== "ALL") {
      result = result.filter((c) => c.priority === filterPriority);
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "date":
          cmp =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "priority": {
          const order = { HIGH: 0, MEDIUM: 1, LOW: 2 };
          cmp = order[a.priority] - order[b.priority];
          break;
        }
        case "salary":
          cmp = (a.salaryMax ?? 0) - (b.salaryMax ?? 0);
          break;
      }
      return sortOrder === "asc" ? cmp : -cmp;
    });

    return result;
  }, [companies, searchQuery, filterPriority, sortBy, sortOrder]);

  const handleDelete = (id: string) => {
    const company = companies.find((c) => c.id === id);
    deleteCompany.mutate(id, {
      onSuccess: () => {
        toast.success("Company removed", {
          description: company
            ? `${company.name} has been removed from your pipeline.`
            : "Company removed from pipeline.",
        });
      },
      onError: () => {
        toast.error("Failed to delete company");
      },
    });
  };

  const handleBulkDelete = () => {
    if (selectedCompanyIds.length === 0) return;
    selectedCompanyIds.forEach((id) => deleteCompany.mutate(id));
    clearSelectedCompanies();
    toast.success(`Removed ${selectedCompanyIds.length} companies`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <h1 className="text-[22px] font-bold text-zinc-100 tracking-tight leading-tight">
          Pipeline
        </h1>
        <p className="text-[13px] text-zinc-500 mt-0.5">
          Track and manage your interview pipeline
          {companies.length > 0 && ` across ${companies.length} companies`}
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        <PipelineStats companies={filteredCompanies} isLoading={isLoading} />
      </motion.div>

      {/* Toolbar */}
      <motion.div
        className="mb-5"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <PipelineToolbar
          onAddCompany={() => setAddDialogOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onBulkDelete={handleBulkDelete}
        />
      </motion.div>

      {/* Main content -- Kanban or Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15 }}
      >
        {view === "kanban" ? (
          <KanbanBoard
            companies={filteredCompanies}
            userStages={userStages}
            onDelete={handleDelete}
          />
        ) : (
          <TableView
            companies={filteredCompanies}
            isLoading={isLoading}
            onDelete={handleDelete}
          />
        )}
      </motion.div>

      {/* Add Company Dialog */}
      <AddCompanyDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        userStages={userStages}
      />
    </div>
  );
}
