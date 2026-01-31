"use client";

import { useMemo, useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DEFAULT_STAGES, CELEBRATION_STAGES, isStageAdvancement, type StageDefinition } from "@/lib/stages";
import { usePipelineStore } from "@/stores/pipeline-store";
import { useMoveCompany } from "@/hooks/use-companies";
import { useConfetti } from "@/hooks/use-confetti";
import { KanbanCard } from "./kanban-card";
import type { CompanyWithRelations, UserStage } from "@/types";

// ---------------------------------------------------------------------------
// Kanban Board -- Drag-and-drop pipeline board
// ---------------------------------------------------------------------------

interface KanbanBoardProps {
  companies: CompanyWithRelations[];
  userStages: UserStage[];
  onDelete?: (id: string) => void;
}

// -- Droppable Column ---------------------------------------------------------

function KanbanColumn({
  stage,
  companies,
  userStage,
  onDelete,
  onMoveToStage,
}: {
  stage: StageDefinition;
  companies: CompanyWithRelations[];
  userStage?: UserStage;
  onDelete?: (id: string) => void;
  onMoveToStage?: (companyId: string, stageKey: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.key,
    data: { type: "column", stageKey: stage.key, userStageId: userStage?.id },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col min-w-[280px] max-w-[300px] shrink-0",
        "rounded-xl border transition-colors duration-200",
        isOver
          ? "border-indigo-500/30 bg-indigo-500/[0.03]"
          : "border-zinc-800/40 bg-zinc-900/30"
      )}
    >
      {/* Column header */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 border-b border-zinc-800/40"
        style={{
          borderTopColor: stage.color,
          borderTopWidth: "2px",
          borderTopLeftRadius: "0.75rem",
          borderTopRightRadius: "0.75rem",
        }}
      >
        <span className="text-base leading-none">{stage.emoji}</span>
        <span className="text-xs font-semibold text-zinc-200 truncate">
          {stage.name}
        </span>
        <Badge size="sm" variant="default" className="ml-auto shrink-0">
          {companies.length}
        </Badge>
      </div>

      {/* Cards container */}
      <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[calc(100vh-340px)] min-h-[120px]">
        <SortableContext
          items={companies.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {companies.map((company) => (
            <KanbanCard
              key={company.id}
              company={company}
              stageColor={stage.color}
              onDelete={onDelete}
              onMoveToStage={onMoveToStage}
            />
          ))}
        </SortableContext>

        {companies.length === 0 && (
          <div className="flex items-center justify-center py-8 text-[11px] text-zinc-600">
            Drop companies here
          </div>
        )}
      </div>
    </div>
  );
}

// -- Main Board Component -----------------------------------------------------

export function KanbanBoard({ companies, userStages, onDelete }: KanbanBoardProps) {
  const setDraggedCompanyId = usePipelineStore((s) => s.setDraggedCompanyId);
  const moveCompany = useMoveCompany();
  const { celebrate } = useConfetti();

  const [activeId, setActiveId] = useState<string | null>(null);

  // Build a map from stageKey -> UserStage
  const stageKeyToUserStage = useMemo(() => {
    const map = new Map<string, UserStage>();
    userStages.forEach((us) => {
      map.set(us.stageKey, us);
    });
    return map;
  }, [userStages]);

  // Group companies by stage key
  const companiesByStage = useMemo(() => {
    const map = new Map<string, CompanyWithRelations[]>();
    DEFAULT_STAGES.forEach((stage) => {
      map.set(stage.key, []);
    });

    companies.forEach((company) => {
      const stageKey = company.userStage?.stageKey ?? "WISHLIST";
      const arr = map.get(stageKey);
      if (arr) {
        arr.push(company);
      } else {
        // Fallback to WISHLIST if stage doesn't exist
        map.get("WISHLIST")?.push(company);
      }
    });

    return map;
  }, [companies]);

  // The dragged company for the overlay
  const activeCompany = useMemo(() => {
    if (!activeId) return null;
    return companies.find((c) => c.id === activeId) ?? null;
  }, [activeId, companies]);

  // Sensors: pointer + keyboard
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const id = event.active.id as string;
      setActiveId(id);
      setDraggedCompanyId(id);
    },
    [setDraggedCompanyId]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      setActiveId(null);
      setDraggedCompanyId(null);

      if (!over) return;

      const companyId = active.id as string;
      const overData = over.data.current;

      // Determine target stage
      let targetStageKey: string | null = null;

      if (overData?.type === "column") {
        targetStageKey = overData.stageKey as string;
      } else if (overData?.type === "company") {
        // Dropped on another company -- use that company's stage
        const overCompany = overData.company as CompanyWithRelations;
        targetStageKey = overCompany.userStage?.stageKey ?? null;
      } else if (typeof over.id === "string") {
        // Might be a stage key directly
        const isStageKey = DEFAULT_STAGES.some((s) => s.key === over.id);
        if (isStageKey) {
          targetStageKey = over.id;
        }
      }

      if (!targetStageKey) return;

      // Find source stage
      const sourceCompany = companies.find((c) => c.id === companyId);
      if (!sourceCompany) return;

      const sourceStageKey = sourceCompany.userStage?.stageKey;

      // Don't move if same stage
      if (sourceStageKey === targetStageKey) return;

      // Find the userStageId for the target
      const targetUserStage = stageKeyToUserStage.get(targetStageKey);
      if (!targetUserStage) return;

      moveCompany.mutate({
        id: companyId,
        userStageId: targetUserStage.id,
      });

      // Celebrate stage advancement to OFFER or ACCEPTED
      if (
        sourceStageKey &&
        isStageAdvancement(sourceStageKey, targetStageKey) &&
        CELEBRATION_STAGES.includes(targetStageKey)
      ) {
        celebrate();
      }
    },
    [companies, stageKeyToUserStage, moveCompany, setDraggedCompanyId, celebrate]
  );

  const handleMoveToStage = useCallback(
    (companyId: string, stageKey: string) => {
      const targetUserStage = stageKeyToUserStage.get(stageKey);
      if (!targetUserStage) return;

      const company = companies.find((c) => c.id === companyId);
      const sourceStageKey = company?.userStage?.stageKey;

      moveCompany.mutate({
        id: companyId,
        userStageId: targetUserStage.id,
      });

      if (
        sourceStageKey &&
        isStageAdvancement(sourceStageKey, stageKey) &&
        CELEBRATION_STAGES.includes(stageKey)
      ) {
        celebrate();
      }
    },
    [companies, stageKeyToUserStage, moveCompany, celebrate]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2">
        {DEFAULT_STAGES.map((stage) => (
          <KanbanColumn
            key={stage.key}
            stage={stage}
            companies={companiesByStage.get(stage.key) ?? []}
            userStage={stageKeyToUserStage.get(stage.key)}
            onDelete={onDelete}
            onMoveToStage={handleMoveToStage}
          />
        ))}
      </div>

      {/* Drag overlay */}
      <DragOverlay dropAnimation={{ duration: 200, easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)" }}>
        {activeCompany && (
          <div className="w-[280px] opacity-90 rotate-2 scale-105">
            <KanbanCard
              company={activeCompany}
              stageColor={activeCompany.userStage?.color ?? "#6366f1"}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
