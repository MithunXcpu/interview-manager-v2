"use client";

// ============================================================================
// AI Sidebar -- Command Center Panel
// ============================================================================
// Full AI chat interface embedded in the right sidebar.
// Layout: Header, scrollable messages area, quick actions, input.
// Uses useAiStore for all state and useSendMessage for chat flow.
// ============================================================================

import React, { useRef, useEffect, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  FiX,
  FiTrash2,
  FiSend,
  FiZap,
  FiMessageSquare,
} from "react-icons/fi";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";
import { useAiStore } from "@/stores/ai-store";
import { useSendMessage } from "@/hooks/use-ai";
import { AiMessage } from "@/components/shared/ai-message";
import { Tooltip } from "@/components/ui/tooltip";

// ---------------------------------------------------------------------------
// Quick action chip definitions by page context
// ---------------------------------------------------------------------------

interface QuickAction {
  label: string;
  prompt: string;
}

const QUICK_ACTIONS: Record<string, QuickAction[]> = {
  pipeline: [
    { label: "Analyze pipeline", prompt: "Analyze my current pipeline and give me insights on conversion rates and bottlenecks." },
    { label: "Suggest next steps", prompt: "What should I focus on next based on my current pipeline?" },
    { label: "Draft follow-up", prompt: "Draft a follow-up email for my most recent interview." },
  ],
  companies: [
    { label: "Research company", prompt: "Research this company and give me key details for my interview preparation." },
    { label: "Prep interview", prompt: "Help me prepare for an upcoming interview. What are common questions and strategies?" },
    { label: "Draft email", prompt: "Draft a professional email to the hiring manager expressing my interest." },
  ],
  emails: [
    { label: "Summarize thread", prompt: "Summarize the email thread and highlight key action items." },
    { label: "Classify email", prompt: "Classify this email -- is it a recruiter outreach, interview invite, rejection, or follow-up?" },
    { label: "Suggest reply", prompt: "Suggest a professional reply to this email." },
  ],
  default: [
    { label: "Help me search", prompt: "Help me search for relevant companies and roles in my pipeline." },
    { label: "Weekly report", prompt: "Generate a weekly report of my interview pipeline activity." },
    { label: "Interview tips", prompt: "Give me your best interview preparation tips." },
  ],
};

function getQuickActions(pathname: string): QuickAction[] {
  if (pathname.includes("/pipeline")) return QUICK_ACTIONS.pipeline;
  if (pathname.includes("/companies")) return QUICK_ACTIONS.companies;
  if (pathname.includes("/emails") || pathname.includes("/email"))
    return QUICK_ACTIONS.emails;
  return QUICK_ACTIONS.default;
}

// ---------------------------------------------------------------------------
// Loading dots animation
// ---------------------------------------------------------------------------

function LoadingDots() {
  return (
    <div className="flex items-start gap-2">
      {/* AI avatar */}
      <div className="flex items-start pt-0.5 shrink-0">
        <div
          className={cn(
            "flex items-center justify-center w-6 h-6 rounded-md",
            "bg-cyan-500/15 border border-cyan-500/20",
            "text-[10px] font-bold text-cyan-400 uppercase tracking-wide"
          )}
        >
          AI
        </div>
      </div>
      {/* Dots */}
      <div className="px-3.5 py-3 bg-zinc-800/60 border border-zinc-700/30 rounded-2xl rounded-tl-sm">
        <div className="flex gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/70 animate-[bounce_1.4s_ease-in-out_infinite]" />
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/70 animate-[bounce_1.4s_ease-in-out_0.2s_infinite]" />
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/70 animate-[bounce_1.4s_ease-in-out_0.4s_infinite]" />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 text-center">
      <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/15 mb-3">
        <FiZap className="w-5 h-5 text-cyan-400" />
      </div>
      <p className="text-sm font-medium text-zinc-300 mb-1">
        AI Command Center
      </p>
      <p className="text-xs text-zinc-500 leading-relaxed max-w-[240px]">
        Ask questions about your pipeline, get interview prep help, or draft
        emails. Try a quick action below to get started.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Quick action chips
// ---------------------------------------------------------------------------

function QuickActionChips({
  actions,
  onSelect,
  disabled,
}: {
  actions: QuickAction[];
  onSelect: (prompt: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-1.5 px-4 py-2.5 border-t border-zinc-800/50">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={() => onSelect(action.prompt)}
          disabled={disabled}
          className={cn(
            "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg",
            "bg-zinc-800/50 border border-zinc-700/40",
            "text-[11px] font-medium text-zinc-400",
            "hover:bg-zinc-800 hover:border-zinc-600 hover:text-zinc-200",
            "transition-all duration-150",
            "disabled:opacity-40 disabled:pointer-events-none"
          )}
        >
          <FiZap className="w-3 h-3 text-cyan-400/70" />
          {action.label}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Input area
// ---------------------------------------------------------------------------

function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    // Clamp to ~4 lines (4 * 20px line height = 80px)
    el.style.height = `${Math.min(el.scrollHeight, 80)}px`;
  }, [value]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        onSend();
      }
    },
    [onSend]
  );

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="px-3 py-3 border-t border-zinc-800/50">
      <div
        className={cn(
          "flex items-end gap-2 rounded-xl",
          "bg-zinc-800/40 border border-zinc-700/40",
          "px-3 py-2",
          "focus-within:border-indigo-500/40 focus-within:ring-1 focus-within:ring-indigo-500/20",
          "transition-all duration-150"
        )}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your interviews..."
          disabled={disabled}
          rows={1}
          className={cn(
            "flex-1 bg-transparent text-[13px] text-zinc-200 placeholder:text-zinc-600",
            "resize-none outline-none",
            "leading-[20px] min-h-[20px]",
            "disabled:opacity-50"
          )}
        />
        <Tooltip content="Send (Cmd+Enter)" side="top">
          <button
            onClick={onSend}
            disabled={!canSend}
            className={cn(
              "flex items-center justify-center w-7 h-7 rounded-lg shrink-0",
              "transition-all duration-150",
              canSend
                ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm"
                : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
            )}
            aria-label="Send message"
          >
            <FiSend className="w-3.5 h-3.5" />
          </button>
        </Tooltip>
      </div>
      <p className="text-[10px] text-zinc-600 mt-1.5 px-1">
        Press{" "}
        <kbd className="font-mono text-zinc-500 bg-zinc-800/60 px-1 py-0.5 rounded text-[9px]">
          Cmd+Enter
        </kbd>{" "}
        to send
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main AiSidebar Component
// ---------------------------------------------------------------------------

export function AiSidebar() {
  const pathname = usePathname();
  const setAiSidebarOpen = useAppStore((s) => s.setAiSidebarOpen);

  // AI store state
  const messages = useAiStore((s) => s.messages);
  const isLoading = useAiStore((s) => s.isLoading);
  const inputValue = useAiStore((s) => s.inputValue);
  const setInputValue = useAiStore((s) => s.setInputValue);
  const clearMessages = useAiStore((s) => s.clearMessages);

  // Chat hook
  const { sendMessage } = useSendMessage();

  // Scroll to bottom on new messages
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Quick actions based on current page
  const quickActions = useMemo(
    () => getQuickActions(pathname),
    [pathname]
  );

  // Send handler
  const handleSend = useCallback(() => {
    if (!inputValue.trim() || isLoading) return;
    const text = inputValue;
    setInputValue("");
    sendMessage(text);
  }, [inputValue, isLoading, setInputValue, sendMessage]);

  // Quick action handler
  const handleQuickAction = useCallback(
    (prompt: string) => {
      if (isLoading) return;
      setInputValue("");
      sendMessage(prompt);
    },
    [isLoading, setInputValue, sendMessage]
  );

  // Clear chat
  const handleClear = useCallback(() => {
    clearMessages();
    setInputValue("");
  }, [clearMessages, setInputValue]);

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* ----------------------------------------------------------------- */}
      {/* Header                                                            */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-zinc-800/50 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-500/10">
            <FiZap className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <span className="text-sm font-semibold text-zinc-200">
            AI Assistant
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Clear button */}
          {hasMessages && (
            <Tooltip content="Clear chat" side="bottom">
              <button
                onClick={handleClear}
                className={cn(
                  "flex items-center justify-center w-7 h-7 rounded-md",
                  "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60",
                  "transition-colors duration-150"
                )}
                aria-label="Clear chat"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
              </button>
            </Tooltip>
          )}

          {/* Close button */}
          <Tooltip content="Close" side="bottom">
            <button
              onClick={() => setAiSidebarOpen(false)}
              className={cn(
                "flex items-center justify-center w-7 h-7 rounded-md",
                "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60",
                "transition-colors duration-150"
              )}
              aria-label="Close AI sidebar"
            >
              <FiX className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Messages area                                                     */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex-1 overflow-y-auto">
        {!hasMessages && !isLoading ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-4 px-4 py-4">
            {messages.map((msg) => (
              <AiMessage key={msg.id} message={msg} />
            ))}
            {isLoading && <LoadingDots />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Quick actions                                                     */}
      {/* ----------------------------------------------------------------- */}
      <QuickActionChips
        actions={quickActions}
        onSelect={handleQuickAction}
        disabled={isLoading}
      />

      {/* ----------------------------------------------------------------- */}
      {/* Input                                                             */}
      {/* ----------------------------------------------------------------- */}
      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSend}
        disabled={isLoading}
      />
    </div>
  );
}
