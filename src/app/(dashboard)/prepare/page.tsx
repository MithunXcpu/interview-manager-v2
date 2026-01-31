"use client";

import { useState } from "react";
import {
  FiSearch,
  FiPlus,
  FiFileText,
  FiHelpCircle,
  FiStar,
  FiMic,
} from "react-icons/fi";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { SkeletonCard } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { BriefingCard } from "@/components/prep/briefing-card";
import { QuestionBank } from "@/components/prep/question-bank";
import { StarBuilder } from "@/components/prep/star-builder";
import { MockInterview } from "@/components/prep/mock-interview";
import { usePreps, useCreatePrep } from "@/hooks/use-prep";
import { useCompanies } from "@/hooks/use-companies";
import type { InterviewPrepWithCompany } from "@/hooks/use-prep";

// =============================================================================
// Interview Prep Suite Page
// =============================================================================

export default function PreparePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCompanyId, setFilterCompanyId] = useState<string>("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Form state for creating a new briefing
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("briefing");
  const [newContent, setNewContent] = useState("");
  const [newCompanyId, setNewCompanyId] = useState("");

  const { data: preps, isLoading: prepsLoading } = usePreps(
    filterCompanyId || undefined
  );
  const { data: companies } = useCompanies();
  const createMutation = useCreatePrep();

  // Filter preps by search query
  const filteredPreps = (preps ?? []).filter((p: InterviewPrepWithCompany) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      p.type.toLowerCase().includes(q) ||
      p.company?.name?.toLowerCase().includes(q)
    );
  });

  function handleCreateBriefing() {
    if (!newCompanyId) {
      toast.error("Please select a company");
      return;
    }
    if (!newTitle.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (!newContent.trim()) {
      toast.error("Please enter content");
      return;
    }

    createMutation.mutate(
      {
        companyId: newCompanyId,
        type: newType,
        title: newTitle.trim(),
        content: newContent.trim(),
      },
      {
        onSuccess: () => {
          toast.success("Briefing created successfully");
          setCreateDialogOpen(false);
          setNewTitle("");
          setNewType("briefing");
          setNewContent("");
          setNewCompanyId("");
        },
        onError: () => {
          toast.error("Failed to create briefing");
        },
      }
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-zinc-100 tracking-tight leading-tight">
            Interview Prep Suite
          </h1>
          <p className="text-[13px] text-zinc-500 mt-0.5">
            Prepare, practice, and perfect your interview performance
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setCreateDialogOpen(true)}
          iconLeft={<FiPlus className="w-3.5 h-3.5" />}
        >
          Generate New Briefing
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="briefings" className="space-y-5">
        <TabsList>
          <TabsTrigger value="briefings">
            <FiFileText className="w-3.5 h-3.5" />
            Briefings
          </TabsTrigger>
          <TabsTrigger value="questions">
            <FiHelpCircle className="w-3.5 h-3.5" />
            Questions
          </TabsTrigger>
          <TabsTrigger value="star">
            <FiStar className="w-3.5 h-3.5" />
            STAR Stories
          </TabsTrigger>
          <TabsTrigger value="mock">
            <FiMic className="w-3.5 h-3.5" />
            Mock Interview
          </TabsTrigger>
        </TabsList>

        {/* ================================================================= */}
        {/* Briefings Tab */}
        {/* ================================================================= */}
        <TabsContent value="briefings">
          <div className="space-y-4">
            {/* Search + Filter */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <Input
                  placeholder="Search briefings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  iconPrefix={<FiSearch className="w-3.5 h-3.5" />}
                />
              </div>
              <select
                value={filterCompanyId}
                onChange={(e) => setFilterCompanyId(e.target.value)}
                className={cn(
                  "h-9 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 text-sm text-zinc-100",
                  "focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20"
                )}
              >
                <option value="">All Companies</option>
                {(companies ?? []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Briefing grid */}
            {prepsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredPreps.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/10 mx-auto mb-3">
                    <FiFileText className="w-5 h-5 text-indigo-400" />
                  </div>
                  <p className="text-sm text-zinc-400 mb-1">No briefings found</p>
                  <p className="text-xs text-zinc-600 max-w-sm mx-auto">
                    {searchQuery || filterCompanyId
                      ? "Try adjusting your search or filter to find what you're looking for."
                      : "Create your first interview briefing to get started with prep."}
                  </p>
                  {!searchQuery && !filterCompanyId && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="mt-4"
                      onClick={() => setCreateDialogOpen(true)}
                      iconLeft={<FiPlus className="w-3.5 h-3.5" />}
                    >
                      Create Briefing
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPreps.map((prep: InterviewPrepWithCompany) => (
                  <BriefingCard
                    key={prep.id}
                    prep={prep}
                    companyName={prep.company?.name}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* ================================================================= */}
        {/* Questions Tab */}
        {/* ================================================================= */}
        <TabsContent value="questions">
          <QuestionBank />
        </TabsContent>

        {/* ================================================================= */}
        {/* STAR Stories Tab */}
        {/* ================================================================= */}
        <TabsContent value="star">
          <StarBuilder />
        </TabsContent>

        {/* ================================================================= */}
        {/* Mock Interview Tab */}
        {/* ================================================================= */}
        <TabsContent value="mock">
          <MockInterview />
        </TabsContent>
      </Tabs>

      {/* ================================================================= */}
      {/* Create Briefing Dialog */}
      {/* ================================================================= */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>Create New Briefing</DialogTitle>
            <DialogDescription>
              Add a new interview prep briefing for a company.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-4 space-y-4">
            {/* Company selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-400">
                Company
              </label>
              <select
                value={newCompanyId}
                onChange={(e) => setNewCompanyId(e.target.value)}
                className={cn(
                  "h-9 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 text-sm text-zinc-100",
                  "focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20"
                )}
              >
                <option value="">Select a company...</option>
                {(companies ?? []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Type selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-400">Type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className={cn(
                  "h-9 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 text-sm text-zinc-100",
                  "focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20"
                )}
              >
                <option value="briefing">Briefing</option>
                <option value="technical">Technical</option>
                <option value="behavioral">Behavioral</option>
                <option value="system-design">System Design</option>
                <option value="culture-fit">Culture Fit</option>
              </select>
            </div>

            {/* Title */}
            <Input
              label="Title"
              placeholder="e.g., Google SWE Interview Briefing"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />

            {/* Content */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-400">
                Content
              </label>
              <textarea
                rows={8}
                placeholder="Enter your briefing content, key points, research notes..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className={cn(
                  "w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3 py-2",
                  "text-sm text-zinc-300 leading-relaxed resize-none",
                  "focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20",
                  "placeholder:text-zinc-600"
                )}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" size="sm">
                Cancel
              </Button>
            </DialogClose>
            <Button
              size="sm"
              onClick={handleCreateBriefing}
              loading={createMutation.isPending}
            >
              Create Briefing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
