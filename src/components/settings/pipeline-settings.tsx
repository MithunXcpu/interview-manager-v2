"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DEFAULT_STAGES, type StageDefinition } from "@/lib/stages";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { FiMenu, FiRotateCcw } from "react-icons/fi";

// ---------------------------------------------------------------------------
// Pipeline Settings -- Customize stages with drag-to-reorder, toggle, edit
// ---------------------------------------------------------------------------

interface EditableStage extends StageDefinition {
  isEnabled: boolean;
}

function toEditableStages(stages: StageDefinition[]): EditableStage[] {
  return stages.map((s) => ({ ...s, isEnabled: true }));
}

// -- Sortable Stage Row -------------------------------------------------------

function SortableStageRow({
  stage,
  onToggle,
}: {
  stage: EditableStage;
  onToggle: (key: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stage.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg border border-zinc-800/60 bg-zinc-900/50",
        "transition-all duration-150",
        isDragging && "z-10 shadow-lg shadow-black/30 border-indigo-500/30 bg-zinc-900",
        !stage.isEnabled && "opacity-50"
      )}
    >
      {/* Drag handle */}
      <button
        className="flex items-center justify-center w-6 h-6 rounded text-zinc-600 hover:text-zinc-400 cursor-grab active:cursor-grabbing shrink-0"
        {...attributes}
        {...listeners}
        aria-label={`Drag to reorder ${stage.name}`}
      >
        <FiMenu className="w-4 h-4" />
      </button>

      {/* Emoji */}
      <span className="text-lg shrink-0 w-7 text-center" role="img" aria-label={stage.name}>
        {stage.emoji}
      </span>

      {/* Name + key */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-zinc-200 truncate">
          {stage.name}
        </div>
        <div className="text-[11px] text-zinc-600 font-mono">
          {stage.key}
        </div>
      </div>

      {/* Color swatch */}
      <div
        className="w-4 h-4 rounded-full shrink-0 ring-1 ring-white/10"
        style={{ backgroundColor: stage.color }}
        title={stage.color}
      />

      {/* Enabled toggle */}
      <Toggle
        size="sm"
        pressed={stage.isEnabled}
        onPressedChange={() => onToggle(stage.key)}
        aria-label={`${stage.isEnabled ? "Disable" : "Enable"} ${stage.name}`}
      />
    </div>
  );
}

// -- Pipeline Settings component ----------------------------------------------

export function PipelineSettings() {
  const [stages, setStages] = useState<EditableStage[]>(
    toEditableStages(DEFAULT_STAGES)
  );
  const [isSaving, setIsSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setStages((prev) => {
      const oldIndex = prev.findIndex((s) => s.key === active.id);
      const newIndex = prev.findIndex((s) => s.key === over.id);
      const reordered = arrayMove(prev, oldIndex, newIndex);
      return reordered.map((s, i) => ({ ...s, order: i }));
    });
  }, []);

  const handleToggle = useCallback((key: string) => {
    setStages((prev) =>
      prev.map((s) =>
        s.key === key ? { ...s, isEnabled: !s.isEnabled } : s
      )
    );
  }, []);

  const handleReset = useCallback(() => {
    setStages(toEditableStages(DEFAULT_STAGES));
    toast.success("Pipeline stages reset to defaults");
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const payload = stages.map((s) => ({
        stageKey: s.key,
        name: s.name,
        emoji: s.emoji,
        color: s.color,
        order: s.order,
        isEnabled: s.isEnabled,
      }));

      const res = await fetch("/api/user/stages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stages: payload }),
      });

      if (!res.ok) throw new Error("Failed to save stages");

      toast.success("Pipeline stages saved successfully");
    } catch {
      toast.error("Failed to save pipeline stages. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [stages]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Pipeline Stages</CardTitle>
            <CardDescription>
              Customize your interview pipeline stages. Drag to reorder, toggle to enable/disable.
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            iconLeft={<FiRotateCcw className="w-3.5 h-3.5" />}
          >
            Reset to Defaults
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={stages.map((s) => s.key)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {stages.map((stage) => (
                <SortableStageRow
                  key={stage.key}
                  stage={stage}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Save button */}
        <div className="flex justify-end pt-5">
          <Button onClick={handleSave} loading={isSaving}>
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
