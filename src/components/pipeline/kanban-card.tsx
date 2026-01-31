"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FiMoreVertical, FiEye, FiEdit2, FiTrash2, FiArrowRight, FiCalendar } from "react-icons/fi";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import { DEFAULT_STAGES } from "@/lib/stages";
import type { CompanyWithRelations } from "@/types";

// ---------------------------------------------------------------------------
// KanbanCard -- Draggable company card for the kanban board
// ---------------------------------------------------------------------------

interface KanbanCardProps {
  company: CompanyWithRelations;
  stageColor: string;
  onDelete?: (id: string) => void;
  onMoveToStage?: (companyId: string, stageId: string) => void;
}

const priorityConfig = {
  HIGH: { variant: "danger" as const, label: "High" },
  MEDIUM: { variant: "warning" as const, label: "Med" },
  LOW: { variant: "success" as const, label: "Low" },
} as const;

export function KanbanCard({ company, stageColor, onDelete, onMoveToStage }: KanbanCardProps) {
  const router = useRouter();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: company.id,
    data: { type: "company", company },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    "--stage-color": stageColor,
  } as React.CSSProperties;

  // Days since applied (or created)
  const daysSince = useMemo(() => {
    const date = company.appliedDate ?? company.createdAt;
    const diff = Date.now() - new Date(date).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }, [company.appliedDate, company.createdAt]);

  // Next scheduled interview
  const nextInterview = useMemo(() => {
    const now = new Date();
    return company.interviews
      .filter(
        (i) =>
          new Date(i.scheduledAt) > now && i.status === "SCHEDULED"
      )
      .sort(
        (a, b) =>
          new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
      )[0];
  }, [company.interviews]);

  const priority = priorityConfig[company.priority];

  const handleCardClick = () => {
    router.push(`/companies/${company.id}`);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group touch-manipulation",
        isDragging && "opacity-50 z-50"
      )}
    >
      <Card
        className={cn(
          "cursor-grab active:cursor-grabbing",
          "border-zinc-800/60 bg-zinc-900/80",
          "transition-all duration-200 ease-out",
          "hover:-translate-y-0.5",
          "hover:border-[var(--stage-color)]/30",
          "hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
          isDragging && "shadow-xl shadow-black/50 border-indigo-500/30"
        )}
        onClick={handleCardClick}
      >
        <div className="p-3 space-y-2">
          {/* Header: company name + menu */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold text-zinc-100 truncate leading-snug">
                {company.name}
              </h4>
              {company.jobTitle && (
                <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                  {company.jobTitle}
                </p>
              )}
            </div>

            {/* Context menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className={cn(
                    "shrink-0 p-1 rounded-md",
                    "text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800/60",
                    "opacity-0 group-hover:opacity-100 transition-all duration-150",
                    "focus:opacity-100"
                  )}
                >
                  <FiMoreVertical className="w-3.5 h-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem onClick={() => router.push(`/companies/${company.id}`)}>
                  <FiEye className="w-3.5 h-3.5 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/companies/${company.id}`)}>
                  <FiEdit2 className="w-3.5 h-3.5 mr-2" />
                  Edit
                </DropdownMenuItem>

                {/* Move to stage submenu */}
                {onMoveToStage && (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <FiArrowRight className="w-3.5 h-3.5 mr-2" />
                      Move to Stage
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {DEFAULT_STAGES.map((stage) => (
                        <DropdownMenuItem
                          key={stage.key}
                          onClick={() => {
                            // Find the matching userStageId --
                            // pass stage key and let the parent resolve
                            onMoveToStage(company.id, stage.key);
                          }}
                          className={cn(
                            company.userStage?.stageKey === stage.key &&
                              "text-indigo-400"
                          )}
                        >
                          <span className="mr-2">{stage.emoji}</span>
                          {stage.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  destructive
                  onClick={() => onDelete?.(company.id)}
                >
                  <FiTrash2 className="w-3.5 h-3.5 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Meta row: priority + salary */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant={priority.variant} size="sm">
              {priority.label}
            </Badge>

            {(company.salaryMin || company.salaryMax) && (
              <span className="text-[10px] text-zinc-500 font-medium">
                {company.salaryMin && company.salaryMax
                  ? `${formatCurrency(company.salaryMin, { compact: true })} - ${formatCurrency(company.salaryMax, { compact: true })}`
                  : company.salaryMin
                    ? `${formatCurrency(company.salaryMin, { compact: true })}+`
                    : `Up to ${formatCurrency(company.salaryMax!, { compact: true })}`}
              </span>
            )}
          </div>

          {/* Footer: days since + next interview */}
          <div className="flex items-center justify-between text-[10px] text-zinc-600 pt-1 border-t border-zinc-800/40">
            <span>
              {daysSince === 0
                ? "Today"
                : daysSince === 1
                  ? "1 day ago"
                  : `${daysSince}d ago`}
            </span>

            {nextInterview && (
              <span className="inline-flex items-center gap-1 text-cyan-400/80">
                <FiCalendar className="w-2.5 h-2.5" />
                {new Date(nextInterview.scheduledAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
