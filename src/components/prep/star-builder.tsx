"use client";

import { useState, useCallback } from "react";
import {
  FiPlus,
  FiSave,
  FiChevronDown,
  FiChevronUp,
  FiTrash2,
  FiStar,
  FiTag,
} from "react-icons/fi";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/toast";

// =============================================================================
// Types
// =============================================================================

interface StarStory {
  id: string;
  title: string;
  tag: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  createdAt: string;
}

const STORAGE_KEY = "interview-prep-star-stories";

function loadStories(): StarStory[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveStories(stories: StarStory[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
}

// =============================================================================
// STAR Builder Component
// =============================================================================

const STAR_LABELS = [
  { key: "situation" as const, label: "Situation", hint: "Set the scene. Describe the context and background." },
  { key: "task" as const, label: "Task", hint: "What was your role? What was expected of you?" },
  { key: "action" as const, label: "Action", hint: "What specific steps did you take?" },
  { key: "result" as const, label: "Result", hint: "What was the outcome? Quantify if possible." },
];

const STAR_COLORS = {
  situation: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  task: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  action: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  result: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
};

export function StarBuilder() {
  const [stories, setStories] = useState<StarStory[]>(() => loadStories());
  const [expandedStory, setExpandedStory] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [situation, setSituation] = useState("");
  const [task, setTask] = useState("");
  const [action, setAction] = useState("");
  const [result, setResult] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fieldSetters: Record<string, React.Dispatch<React.SetStateAction<string>>> = {
    situation: setSituation,
    task: setTask,
    action: setAction,
    result: setResult,
  };

  const fieldValues: Record<string, string> = {
    situation,
    task,
    action,
    result,
  };

  const resetForm = useCallback(() => {
    setTitle("");
    setTag("");
    setSituation("");
    setTask("");
    setAction("");
    setResult("");
  }, []);

  function handleSave() {
    if (!title.trim()) {
      toast.error("Please enter a title for your STAR story");
      return;
    }
    if (!situation.trim() && !task.trim() && !action.trim() && !result.trim()) {
      toast.error("Please fill in at least one STAR section");
      return;
    }

    const story: StarStory = {
      id: `star-${Date.now()}`,
      title: title.trim(),
      tag: tag.trim(),
      situation: situation.trim(),
      task: task.trim(),
      action: action.trim(),
      result: result.trim(),
      createdAt: new Date().toISOString(),
    };

    const updated = [story, ...stories];
    setStories(updated);
    saveStories(updated);
    resetForm();
    setShowForm(false);
    toast.success("STAR story saved");
  }

  function handleDelete(id: string) {
    const updated = stories.filter((s) => s.id !== id);
    setStories(updated);
    saveStories(updated);
    toast.success("STAR story deleted");
  }

  function toggleExpand(id: string) {
    setExpandedStory((prev) => (prev === id ? null : id));
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-zinc-500">
            {stories.length} {stories.length === 1 ? "story" : "stories"} saved
          </p>
        </div>
        <Button
          size="sm"
          variant={showForm ? "ghost" : "secondary"}
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) resetForm();
          }}
          iconLeft={showForm ? undefined : <FiPlus className="w-3.5 h-3.5" />}
        >
          {showForm ? "Cancel" : "New Story"}
        </Button>
      </div>

      {/* STAR Form */}
      {showForm && (
        <Card className="border-indigo-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiStar className="w-4 h-4 text-indigo-400" />
              New STAR Story
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Story Title"
                placeholder="e.g., Led migration to microservices"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Input
                label="Related Question / Tag"
                placeholder="e.g., Leadership, Conflict Resolution"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                iconPrefix={<FiTag className="w-3.5 h-3.5" />}
              />
            </div>

            <Separator />

            {/* STAR fields */}
            <div className="space-y-3">
              {STAR_LABELS.map(({ key, label, hint }) => (
                <div key={key}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={cn(
                        "inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-bold border",
                        STAR_COLORS[key]
                      )}
                    >
                      {label[0]}
                    </span>
                    <label className="text-xs font-medium text-zinc-400">
                      {label}
                    </label>
                  </div>
                  <textarea
                    rows={3}
                    placeholder={hint}
                    value={fieldValues[key]}
                    onChange={(e) => fieldSetters[key](e.target.value)}
                    className={cn(
                      "w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3 py-2",
                      "text-sm text-zinc-300 leading-relaxed resize-none",
                      "focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20",
                      "placeholder:text-zinc-600"
                    )}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                iconLeft={<FiSave className="w-3.5 h-3.5" />}
              >
                Save Story
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saved stories list */}
      {stories.length === 0 && !showForm && (
        <Card>
          <CardContent className="py-8 text-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/10 mx-auto mb-3">
              <FiStar className="w-5 h-5 text-indigo-400" />
            </div>
            <p className="text-sm text-zinc-400 mb-1">No STAR stories yet</p>
            <p className="text-xs text-zinc-600">
              Create your first STAR story to prepare structured answers for behavioral questions.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {stories.map((story) => {
          const isExpanded = expandedStory === story.id;

          return (
            <Card key={story.id}>
              {/* Collapsed header */}
              <button
                onClick={() => toggleExpand(story.id)}
                className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-zinc-800/30 transition-colors duration-150 rounded-xl"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/10 shrink-0">
                    <FiStar className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-sm font-medium text-zinc-200 truncate">
                      {story.title}
                    </p>
                    {story.tag && (
                      <p className="text-[11px] text-zinc-500 truncate">
                        {story.tag}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-zinc-600">
                    {new Date(story.createdAt).toLocaleDateString()}
                  </span>
                  {isExpanded ? (
                    <FiChevronUp className="w-4 h-4 text-zinc-500" />
                  ) : (
                    <FiChevronDown className="w-4 h-4 text-zinc-500" />
                  )}
                </div>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-5 pb-4">
                  <Separator className="mb-3" />
                  <div className="space-y-3">
                    {STAR_LABELS.map(({ key, label }) => {
                      const value = story[key as keyof StarStory] as string;
                      if (!value) return null;
                      return (
                        <div key={key} className="flex gap-3">
                          <span
                            className={cn(
                              "inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-bold border shrink-0 mt-0.5",
                              STAR_COLORS[key as keyof typeof STAR_COLORS]
                            )}
                          >
                            {label[0]}
                          </span>
                          <div>
                            <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide mb-0.5">
                              {label}
                            </p>
                            <p className="text-sm text-zinc-300 leading-relaxed">
                              {value}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(story.id)}
                      iconLeft={<FiTrash2 className="w-3.5 h-3.5" />}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
