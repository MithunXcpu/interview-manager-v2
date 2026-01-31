"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  FiPlay,
  FiSkipForward,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiList,
} from "react-icons/fi";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// =============================================================================
// Types & Question Pool
// =============================================================================

interface MockQuestion {
  id: string;
  text: string;
  category: string;
}

interface AnswerRecord {
  question: MockQuestion;
  answer: string;
  timeSpent: number; // seconds
}

type MockState = "idle" | "active" | "reviewing";

const QUESTION_POOL: MockQuestion[] = [
  { id: "m1", text: "Tell me about yourself and your background.", category: "Behavioral" },
  { id: "m2", text: "What is your greatest professional achievement?", category: "Behavioral" },
  { id: "m3", text: "Explain the difference between REST and GraphQL. When would you use each?", category: "Technical" },
  { id: "m4", text: "Describe a time you disagreed with your manager. How did you handle it?", category: "Behavioral" },
  { id: "m5", text: "How would you design a notification system that scales to millions of users?", category: "System Design" },
  { id: "m6", text: "What is your approach to debugging a production incident?", category: "Technical" },
  { id: "m7", text: "Tell me about a time you failed. What did you learn?", category: "Behavioral" },
  { id: "m8", text: "Explain the CAP theorem and its practical implications.", category: "Technical" },
  { id: "m9", text: "How do you prioritize tasks when everything is urgent?", category: "Behavioral" },
  { id: "m10", text: "Design a rate limiter for an API. Walk me through your approach.", category: "System Design" },
  { id: "m11", text: "What makes a good code review? How do you give constructive feedback?", category: "Culture Fit" },
  { id: "m12", text: "Describe your experience with CI/CD pipelines.", category: "Technical" },
];

const TIMER_DURATION = 120; // 2 minutes per question

const categoryColor: Record<string, string> = {
  Technical: "info",
  Behavioral: "success",
  "System Design": "warning",
  "Culture Fit": "primary",
};

// =============================================================================
// Shuffle utility
// =============================================================================

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// =============================================================================
// Timer Hook
// =============================================================================

function useTimer(
  isActive: boolean,
  onExpire: () => void
) {
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const expireFnRef = useRef(onExpire);
  expireFnRef.current = onExpire;

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          expireFnRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  const reset = useCallback(() => {
    setTimeLeft(TIMER_DURATION);
  }, []);

  return { timeLeft, reset };
}

// =============================================================================
// Format time
// =============================================================================

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// =============================================================================
// Mock Interview Component
// =============================================================================

export function MockInterview() {
  const [mockState, setMockState] = useState<MockState>("idle");
  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [questionCount, setQuestionCount] = useState(5);

  const handleTimerExpire = useCallback(() => {
    handleNext();
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  const { timeLeft, reset: resetTimer } = useTimer(
    mockState === "active",
    handleTimerExpire
  );

  // Start session
  function handleStart() {
    const shuffled = shuffleArray(QUESTION_POOL).slice(0, questionCount);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setCurrentAnswer("");
    setAnswers([]);
    setMockState("active");
    resetTimer();
  }

  // Next question / finish
  function handleNext() {
    const currentQuestion = questions[currentIndex];
    if (currentQuestion) {
      const timeSpent = TIMER_DURATION - timeLeft;
      const record: AnswerRecord = {
        question: currentQuestion,
        answer: currentAnswer.trim(),
        timeSpent,
      };
      setAnswers((prev) => [...prev, record]);
    }

    if (currentIndex + 1 >= questions.length) {
      setMockState("reviewing");
    } else {
      setCurrentIndex((prev) => prev + 1);
      setCurrentAnswer("");
      resetTimer();
    }
  }

  // Reset
  function handleReset() {
    setMockState("idle");
    setQuestions([]);
    setCurrentIndex(0);
    setCurrentAnswer("");
    setAnswers([]);
  }

  const progress = questions.length > 0
    ? ((currentIndex + (mockState === "reviewing" ? 1 : 0)) / questions.length) * 100
    : 0;

  const timerPct = (timeLeft / TIMER_DURATION) * 100;
  const isTimeLow = timeLeft <= 30;

  // =========================================================================
  // IDLE STATE
  // =========================================================================
  if (mockState === "idle") {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 mx-auto mb-4">
            <FiPlay className="w-6 h-6 text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-100 mb-1">
            Mock Interview
          </h3>
          <p className="text-sm text-zinc-500 mb-6 max-w-md mx-auto">
            Practice answering interview questions under timed conditions.
            Each question has a 2-minute countdown.
          </p>

          {/* Question count selector */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <label className="text-xs text-zinc-400">Questions:</label>
            <div className="flex items-center bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-0.5">
              {[3, 5, 8, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => setQuestionCount(n)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150",
                    questionCount === n
                      ? "bg-indigo-500/15 text-indigo-400 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <Button
            size="lg"
            onClick={handleStart}
            iconLeft={<FiPlay className="w-4 h-4" />}
          >
            Start Mock Interview
          </Button>

          {/* Pool info */}
          <p className="text-[11px] text-zinc-600 mt-4">
            {QUESTION_POOL.length} questions in pool
          </p>
        </CardContent>
      </Card>
    );
  }

  // =========================================================================
  // ACTIVE STATE
  // =========================================================================
  if (mockState === "active") {
    const currentQuestion = questions[currentIndex];

    return (
      <div className="space-y-4">
        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500">
            {currentIndex + 1} / {questions.length}
          </span>
          <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-zinc-500"
          >
            End
          </Button>
        </div>

        {/* Question card */}
        <Card className="border-indigo-500/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge
                variant={
                  (categoryColor[currentQuestion.category] as "info" | "success" | "warning" | "primary") ?? "default"
                }
                size="sm"
              >
                {currentQuestion.category}
              </Badge>

              {/* Timer */}
              <div className="flex items-center gap-2">
                <FiClock
                  className={cn(
                    "w-4 h-4",
                    isTimeLow ? "text-red-400" : "text-zinc-400"
                  )}
                />
                <div className="relative w-20 h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-1000 ease-linear",
                      isTimeLow ? "bg-red-500" : "bg-emerald-500"
                    )}
                    style={{ width: `${timerPct}%` }}
                  />
                </div>
                <span
                  className={cn(
                    "text-sm font-mono font-medium tabular-nums",
                    isTimeLow ? "text-red-400" : "text-zinc-300"
                  )}
                >
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-base text-zinc-100 font-medium leading-relaxed">
              {currentQuestion.text}
            </p>

            <Separator />

            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1.5 block">
                Your Answer
              </label>
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                rows={6}
                placeholder="Type your answer here..."
                autoFocus
                className={cn(
                  "w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-3 py-2",
                  "text-sm text-zinc-300 leading-relaxed resize-none",
                  "focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20",
                  "placeholder:text-zinc-600"
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={handleNext}
                iconRight={<FiSkipForward className="w-3.5 h-3.5" />}
              >
                {currentIndex + 1 >= questions.length
                  ? "Finish"
                  : "Next Question"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // =========================================================================
  // REVIEWING STATE
  // =========================================================================
  return (
    <div className="space-y-4">
      {/* Summary header */}
      <Card className="border-emerald-500/20">
        <CardContent className="py-6 text-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 mx-auto mb-3">
            <FiCheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-100 mb-1">
            Interview Complete
          </h3>
          <p className="text-sm text-zinc-500 mb-4">
            You answered {answers.length} questions. Review your responses below.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-zinc-100">
                {answers.filter((a) => a.answer.length > 0).length}
              </p>
              <p className="text-[11px] text-zinc-500">Answered</p>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="text-center">
              <p className="text-2xl font-bold text-zinc-100">
                {answers.filter((a) => a.answer.length === 0).length}
              </p>
              <p className="text-[11px] text-zinc-500">Skipped</p>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="text-center">
              <p className="text-2xl font-bold text-zinc-100">
                {formatTime(
                  Math.round(
                    answers.reduce((acc, a) => acc + a.timeSpent, 0) /
                      Math.max(answers.length, 1)
                  )
                )}
              </p>
              <p className="text-[11px] text-zinc-500">Avg Time</p>
            </div>
          </div>

          <div className="mt-6">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleReset}
              iconLeft={<FiRefreshCw className="w-3.5 h-3.5" />}
            >
              Start New Session
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Answer cards */}
      <div className="space-y-3">
        {answers.map((record, idx) => (
          <Card key={record.question.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-600 font-mono">
                    Q{idx + 1}
                  </span>
                  <Badge
                    variant={
                      (categoryColor[record.question.category] as "info" | "success" | "warning" | "primary") ?? "default"
                    }
                    size="sm"
                  >
                    {record.question.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5">
                  <FiClock className="w-3 h-3 text-zinc-600" />
                  <span className="text-[11px] text-zinc-500 font-mono">
                    {formatTime(record.timeSpent)}
                  </span>
                </div>
              </div>
              <CardTitle className="mt-1">{record.question.text}</CardTitle>
            </CardHeader>
            <CardContent>
              {record.answer ? (
                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  {record.answer}
                </p>
              ) : (
                <div className="flex items-center gap-2 text-zinc-600">
                  <FiAlertCircle className="w-3.5 h-3.5" />
                  <span className="text-xs italic">No answer recorded</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
