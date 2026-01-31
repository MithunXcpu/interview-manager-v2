"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { useCreateCheckIn } from "@/hooks/use-wellness";

// =============================================================================
// Mood Tracker — daily check-in form
// =============================================================================

const moodOptions = [
  { value: 1, emoji: "\u{1F614}", label: "Very Sad" },
  { value: 2, emoji: "\u{1F615}", label: "Sad" },
  { value: 3, emoji: "\u{1F610}", label: "Neutral" },
  { value: 4, emoji: "\u{1F642}", label: "Happy" },
  { value: 5, emoji: "\u{1F60A}", label: "Very Happy" },
] as const;

const energyColors = [
  "bg-red-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-lime-500",
  "bg-emerald-500",
];

interface MoodTrackerProps {
  className?: string;
}

export function MoodTracker({ className }: MoodTrackerProps) {
  const [mood, setMood] = useState<number | null>(null);
  const [energy, setEnergy] = useState<number | null>(null);
  const [notes, setNotes] = useState("");

  const createCheckIn = useCreateCheckIn();

  const handleSubmit = () => {
    if (mood === null || energy === null) {
      toast.error("Please select both mood and energy level");
      return;
    }

    createCheckIn.mutate(
      {
        mood,
        energy,
        notes: notes.trim() || undefined,
        date: new Date(),
      },
      {
        onSuccess: () => {
          toast.success("Check-in recorded!");
          setMood(null);
          setEnergy(null);
          setNotes("");
        },
        onError: () => {
          toast.error("Failed to save check-in");
        },
      }
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Daily Check-In</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Mood selector */}
        <div>
          <label className="text-xs font-medium text-zinc-400 mb-2 block">
            How are you feeling?
          </label>
          <div className="flex items-center gap-2">
            {moodOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setMood(option.value)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl px-3 py-2",
                  "transition-all duration-150 ease-out",
                  "hover:bg-zinc-800/60",
                  mood === option.value
                    ? "bg-indigo-500/15 ring-2 ring-indigo-500/40 scale-110"
                    : "bg-zinc-800/30"
                )}
                title={option.label}
              >
                <span
                  className={cn(
                    "transition-transform duration-150",
                    mood === option.value ? "text-3xl" : "text-2xl"
                  )}
                >
                  {option.emoji}
                </span>
                <span
                  className={cn(
                    "text-[10px] font-medium",
                    mood === option.value
                      ? "text-indigo-400"
                      : "text-zinc-600"
                  )}
                >
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Energy selector */}
        <div>
          <label className="text-xs font-medium text-zinc-400 mb-2 block">
            Energy Level
          </label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setEnergy(level)}
                className={cn(
                  "h-8 flex-1 rounded-md transition-all duration-150",
                  energy !== null && level <= energy
                    ? energyColors[level - 1]
                    : "bg-zinc-800 hover:bg-zinc-700"
                )}
                title={`Energy: ${level}/5`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-zinc-600">Low</span>
            <span className="text-[10px] text-zinc-600">High</span>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-xs font-medium text-zinc-400 mb-1.5 block">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How's the job search going today?"
            maxLength={2000}
            rows={3}
            className={cn(
              "w-full rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-2",
              "text-sm text-zinc-100 placeholder:text-zinc-600",
              "transition-colors duration-150 ease-out",
              "focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
              "resize-none"
            )}
          />
        </div>

        {/* Submit */}
        <Button
          variant="primary"
          className="w-full"
          onClick={handleSubmit}
          loading={createCheckIn.isPending}
          disabled={mood === null || energy === null}
        >
          Log Check-In
        </Button>
      </CardContent>
    </Card>
  );
}
