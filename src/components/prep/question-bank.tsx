"use client";

import { useState, useCallback } from "react";
import {
  FiPlus,
  FiCheck,
  FiCircle,
  FiChevronDown,
  FiChevronUp,
  FiCode,
  FiUsers,
  FiGrid,
  FiHeart,
} from "react-icons/fi";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

// =============================================================================
// Types & Default Data
// =============================================================================

type QuestionCategory = "Technical" | "Behavioral" | "System Design" | "Culture Fit";
type Difficulty = "Easy" | "Medium" | "Hard";

interface Question {
  id: string;
  text: string;
  category: QuestionCategory;
  difficulty: Difficulty;
  notes: string;
  answered: boolean;
}

const categoryIcons: Record<QuestionCategory, React.ReactNode> = {
  Technical: <FiCode className="w-4 h-4" />,
  Behavioral: <FiUsers className="w-4 h-4" />,
  "System Design": <FiGrid className="w-4 h-4" />,
  "Culture Fit": <FiHeart className="w-4 h-4" />,
};

const categoryColors: Record<QuestionCategory, string> = {
  Technical: "bg-cyan-500/10 text-cyan-400",
  Behavioral: "bg-emerald-500/10 text-emerald-400",
  "System Design": "bg-amber-500/10 text-amber-400",
  "Culture Fit": "bg-indigo-500/10 text-indigo-400",
};

const difficultyVariant: Record<Difficulty, "success" | "warning" | "danger"> = {
  Easy: "success",
  Medium: "warning",
  Hard: "danger",
};

const DEFAULT_QUESTIONS: Question[] = [
  // Technical
  {
    id: "t1",
    text: "Explain the difference between var, let, and const in JavaScript.",
    category: "Technical",
    difficulty: "Easy",
    notes: "",
    answered: false,
  },
  {
    id: "t2",
    text: "How does React reconciliation work? Explain the virtual DOM diffing algorithm.",
    category: "Technical",
    difficulty: "Medium",
    notes: "",
    answered: false,
  },
  {
    id: "t3",
    text: "Implement a debounce function from scratch and explain its time complexity.",
    category: "Technical",
    difficulty: "Medium",
    notes: "",
    answered: false,
  },
  {
    id: "t4",
    text: "Describe how you would optimize a slow SQL query with multiple JOINs.",
    category: "Technical",
    difficulty: "Hard",
    notes: "",
    answered: false,
  },
  // Behavioral
  {
    id: "b1",
    text: "Tell me about a time you had a conflict with a teammate. How did you resolve it?",
    category: "Behavioral",
    difficulty: "Medium",
    notes: "",
    answered: false,
  },
  {
    id: "b2",
    text: "Describe a project where you had to learn a new technology quickly.",
    category: "Behavioral",
    difficulty: "Easy",
    notes: "",
    answered: false,
  },
  {
    id: "b3",
    text: "Give an example of a time you had to push back on requirements from a stakeholder.",
    category: "Behavioral",
    difficulty: "Hard",
    notes: "",
    answered: false,
  },
  // System Design
  {
    id: "s1",
    text: "Design a URL shortening service like bit.ly.",
    category: "System Design",
    difficulty: "Medium",
    notes: "",
    answered: false,
  },
  {
    id: "s2",
    text: "Design a real-time collaborative editing system like Google Docs.",
    category: "System Design",
    difficulty: "Hard",
    notes: "",
    answered: false,
  },
  {
    id: "s3",
    text: "How would you design a rate limiter for an API gateway?",
    category: "System Design",
    difficulty: "Medium",
    notes: "",
    answered: false,
  },
  // Culture Fit
  {
    id: "c1",
    text: "What does your ideal engineering team culture look like?",
    category: "Culture Fit",
    difficulty: "Easy",
    notes: "",
    answered: false,
  },
  {
    id: "c2",
    text: "How do you stay up-to-date with new technologies and industry trends?",
    category: "Culture Fit",
    difficulty: "Easy",
    notes: "",
    answered: false,
  },
  {
    id: "c3",
    text: "Describe how you approach mentoring junior engineers.",
    category: "Culture Fit",
    difficulty: "Medium",
    notes: "",
    answered: false,
  },
];

const ALL_CATEGORIES: QuestionCategory[] = [
  "Technical",
  "Behavioral",
  "System Design",
  "Culture Fit",
];

// =============================================================================
// Question Bank Component
// =============================================================================

export function QuestionBank() {
  const [questions, setQuestions] = useState<Question[]>(DEFAULT_QUESTIONS);
  const [expandedCategory, setExpandedCategory] = useState<QuestionCategory | null>("Technical");
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newCategory, setNewCategory] = useState<QuestionCategory>("Technical");
  const [newDifficulty, setNewDifficulty] = useState<Difficulty>("Medium");
  const [filterAnswered, setFilterAnswered] = useState<"all" | "answered" | "unanswered">("all");

  const toggleCategory = useCallback((cat: QuestionCategory) => {
    setExpandedCategory((prev) => (prev === cat ? null : cat));
  }, []);

  const toggleAnswered = useCallback((id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, answered: !q.answered } : q))
    );
  }, []);

  const updateNotes = useCallback((id: string, notes: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, notes } : q))
    );
  }, []);

  function handleAddQuestion() {
    if (!newQuestion.trim()) return;
    const question: Question = {
      id: `custom-${Date.now()}`,
      text: newQuestion.trim(),
      category: newCategory,
      difficulty: newDifficulty,
      notes: "",
      answered: false,
    };
    setQuestions((prev) => [...prev, question]);
    setNewQuestion("");
    setShowAddForm(false);
    setExpandedCategory(newCategory);
  }

  function getFilteredQuestions(category: QuestionCategory) {
    return questions.filter((q) => {
      if (q.category !== category) return false;
      if (filterAnswered === "answered") return q.answered;
      if (filterAnswered === "unanswered") return !q.answered;
      return true;
    });
  }

  const totalCount = questions.length;
  const answeredCount = questions.filter((q) => q.answered).length;

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500">
            {answeredCount}/{totalCount} answered
          </span>
          <div className="h-1.5 w-24 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{
                width: totalCount > 0 ? `${(answeredCount / totalCount) * 100}%` : "0%",
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter toggle */}
          <div className="flex items-center bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-0.5">
            {(["all", "unanswered", "answered"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilterAnswered(f)}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-medium rounded-md transition-all duration-150 capitalize",
                  filterAnswered === f
                    ? "bg-indigo-500/15 text-indigo-400 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {f}
              </button>
            ))}
          </div>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowAddForm(!showAddForm)}
            iconLeft={<FiPlus className="w-3.5 h-3.5" />}
          >
            Add Question
          </Button>
        </div>
      </div>

      {/* Add Question Form */}
      {showAddForm && (
        <Card>
          <CardContent className="space-y-3">
            <Input
              label="Question"
              placeholder="Enter your custom question..."
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as QuestionCategory)}
                  className="h-9 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20"
                >
                  {ALL_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400">Difficulty</label>
                <select
                  value={newDifficulty}
                  onChange={(e) => setNewDifficulty(e.target.value as Difficulty)}
                  className="h-9 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div className="flex items-end gap-2 flex-1">
                <Button size="sm" onClick={handleAddQuestion} className="mt-auto">
                  Add
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowAddForm(false)}
                  className="mt-auto"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category sections */}
      <div className="space-y-2">
        {ALL_CATEGORIES.map((category) => {
          const catQuestions = getFilteredQuestions(category);
          const isExpanded = expandedCategory === category;
          const catTotal = questions.filter((q) => q.category === category).length;
          const catAnswered = questions.filter(
            (q) => q.category === category && q.answered
          ).length;

          return (
            <Card key={category}>
              {/* Category header */}
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-zinc-800/30 transition-colors duration-150 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-lg",
                      categoryColors[category]
                    )}
                  >
                    {categoryIcons[category]}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-zinc-200">{category}</p>
                    <p className="text-[11px] text-zinc-500">
                      {catAnswered}/{catTotal} answered
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" size="sm">
                    {catQuestions.length}
                  </Badge>
                  {isExpanded ? (
                    <FiChevronUp className="w-4 h-4 text-zinc-500" />
                  ) : (
                    <FiChevronDown className="w-4 h-4 text-zinc-500" />
                  )}
                </div>
              </button>

              {/* Questions list */}
              {isExpanded && catQuestions.length > 0 && (
                <div className="px-5 pb-4">
                  <Separator className="mb-3" />
                  <div className="space-y-2">
                    {catQuestions.map((q) => (
                      <div
                        key={q.id}
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-lg border transition-colors duration-150",
                          q.answered
                            ? "border-emerald-500/20 bg-emerald-500/5"
                            : "border-zinc-800/60 bg-zinc-900/40 hover:bg-zinc-800/30"
                        )}
                      >
                        {/* Toggle answered */}
                        <button
                          onClick={() => toggleAnswered(q.id)}
                          className={cn(
                            "mt-0.5 flex items-center justify-center w-5 h-5 rounded-full border shrink-0 transition-colors duration-150",
                            q.answered
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : "border-zinc-600 text-zinc-600 hover:border-zinc-400"
                          )}
                        >
                          {q.answered ? (
                            <FiCheck className="w-3 h-3" />
                          ) : (
                            <FiCircle className="w-3 h-3" />
                          )}
                        </button>

                        {/* Question content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={cn(
                                "text-sm leading-relaxed",
                                q.answered
                                  ? "text-zinc-500 line-through"
                                  : "text-zinc-300"
                              )}
                            >
                              {q.text}
                            </p>
                            <Badge
                              variant={difficultyVariant[q.difficulty]}
                              size="sm"
                              className="shrink-0"
                            >
                              {q.difficulty}
                            </Badge>
                          </div>

                          {/* Notes field */}
                          {editingNotes === q.id ? (
                            <div className="mt-2">
                              <textarea
                                autoFocus
                                rows={2}
                                value={q.notes}
                                onChange={(e) => updateNotes(q.id, e.target.value)}
                                onBlur={() => setEditingNotes(null)}
                                placeholder="Add your notes..."
                                className={cn(
                                  "w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3 py-2",
                                  "text-xs text-zinc-300 leading-relaxed resize-none",
                                  "focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20",
                                  "placeholder:text-zinc-600"
                                )}
                              />
                            </div>
                          ) : (
                            <button
                              onClick={() => setEditingNotes(q.id)}
                              className="mt-1.5 text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors duration-150"
                            >
                              {q.notes ? (
                                <span className="text-zinc-500 italic">
                                  {q.notes}
                                </span>
                              ) : (
                                "+ Add notes"
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {isExpanded && catQuestions.length === 0 && (
                <div className="px-5 pb-4">
                  <Separator className="mb-3" />
                  <p className="text-xs text-zinc-600 text-center py-4">
                    No {filterAnswered !== "all" ? filterAnswered : ""} questions in this
                    category.
                  </p>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
