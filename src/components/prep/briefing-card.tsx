"use client";

import { useState } from "react";
import { FiEdit2, FiTrash2, FiFileText } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { truncate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { useDeletePrep, useUpdatePrep } from "@/hooks/use-prep";
import type { InterviewPrep } from "@/types";

// =============================================================================
// Briefing Card Component
// =============================================================================

const typeBadgeVariant: Record<string, "primary" | "success" | "info" | "warning" | "default"> = {
  briefing: "primary",
  technical: "info",
  behavioral: "success",
  "system-design": "warning",
  "culture-fit": "default",
};

interface BriefingCardProps {
  prep: InterviewPrep;
  companyName?: string;
}

export function BriefingCard({ prep, companyName }: BriefingCardProps) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(prep.content);
  const [editTitle, setEditTitle] = useState(prep.title);

  const deleteMutation = useDeletePrep();
  const updateMutation = useUpdatePrep();

  function handleDelete() {
    deleteMutation.mutate(prep.id, {
      onSuccess: () => {
        toast.success("Prep item deleted");
        setDetailOpen(false);
      },
      onError: () => {
        toast.error("Failed to delete prep item");
      },
    });
  }

  function handleSaveEdit() {
    updateMutation.mutate(
      { id: prep.id, data: { title: editTitle, content: editContent } },
      {
        onSuccess: () => {
          toast.success("Prep item updated");
          setIsEditing(false);
        },
        onError: () => {
          toast.error("Failed to update prep item");
        },
      }
    );
  }

  const variant = typeBadgeVariant[prep.type] ?? "default";

  return (
    <>
      <Card
        hover
        interactive
        className="flex flex-col"
        onClick={() => setDetailOpen(true)}
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/10 shrink-0">
                <FiFileText className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="min-w-0">
                <CardTitle className="truncate">{prep.title}</CardTitle>
                {companyName && (
                  <p className="text-[11px] text-zinc-500 mt-0.5 truncate">
                    {companyName}
                  </p>
                )}
              </div>
            </div>
            <Badge variant={variant} size="sm">
              {prep.type}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-xs text-zinc-400 leading-relaxed">
            {truncate(prep.content, 200)}
          </p>
        </CardContent>
        <div className="px-5 pb-4">
          <p className="text-[10px] text-zinc-600">
            {formatDate(prep.createdAt)}
          </p>
        </div>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent size="lg">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Badge variant={variant} size="sm">
                {prep.type}
              </Badge>
              {companyName && (
                <span className="text-xs text-zinc-500">{companyName}</span>
              )}
            </div>
            <DialogTitle className="mt-2">
              {isEditing ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className={cn(
                    "w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3 py-1.5",
                    "text-sm text-zinc-100 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20"
                  )}
                />
              ) : (
                prep.title
              )}
            </DialogTitle>
            <DialogDescription>
              Created {formatDate(prep.createdAt)}
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-4 max-h-[400px] overflow-y-auto">
            {isEditing ? (
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={12}
                className={cn(
                  "w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3 py-2",
                  "text-sm text-zinc-300 leading-relaxed resize-none",
                  "focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20"
                )}
              />
            ) : (
              <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {prep.content}
              </p>
            )}
          </div>

          <DialogFooter>
            {isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false);
                    setEditTitle(prep.title);
                    setEditContent(prep.content);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  loading={updateMutation.isPending}
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleDelete}
                  loading={deleteMutation.isPending}
                  iconLeft={<FiTrash2 className="w-3.5 h-3.5" />}
                >
                  Delete
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  iconLeft={<FiEdit2 className="w-3.5 h-3.5" />}
                >
                  Edit
                </Button>
                <DialogClose asChild>
                  <Button variant="ghost" size="sm">
                    Close
                  </Button>
                </DialogClose>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
