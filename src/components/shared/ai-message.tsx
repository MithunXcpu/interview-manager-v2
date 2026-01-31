"use client";

// ============================================================================
// AI Message Component -- Single chat bubble in the AI sidebar
// ============================================================================
// Renders user and assistant messages with distinct styling.
// Supports markdown-ish formatting: **bold**, `code`, ```code blocks```,
// bullet lists (- item), and numbered lists.
// ============================================================================

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { formatRelativeDate } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AiMessageData {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AiMessageProps {
  message: AiMessageData;
}

// ---------------------------------------------------------------------------
// Simple markdown-ish renderer
// ---------------------------------------------------------------------------

function renderContent(content: string): React.ReactNode[] {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let codeBlock: string[] | null = null;
  let codeBlockKey = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block toggle
    if (line.startsWith("```")) {
      if (codeBlock !== null) {
        // End code block
        elements.push(
          <pre
            key={`code-${codeBlockKey++}`}
            className="my-2 rounded-lg bg-zinc-900 border border-zinc-800/60 px-3 py-2.5 text-xs font-mono text-zinc-300 overflow-x-auto"
          >
            <code>{codeBlock.join("\n")}</code>
          </pre>
        );
        codeBlock = null;
      } else {
        // Start code block
        codeBlock = [];
      }
      continue;
    }

    // Inside code block
    if (codeBlock !== null) {
      codeBlock.push(line);
      continue;
    }

    // Empty line -> spacer
    if (line.trim() === "") {
      elements.push(<div key={`space-${i}`} className="h-2" />);
      continue;
    }

    // Heading-like lines (bold entire line using **)
    if (line.startsWith("**") && line.endsWith("**")) {
      elements.push(
        <p key={`h-${i}`} className="font-semibold text-zinc-100 mt-2 mb-0.5">
          {line.slice(2, -2)}
        </p>
      );
      continue;
    }

    // Bullet list item
    if (line.match(/^\s*[-*]\s/)) {
      const text = line.replace(/^\s*[-*]\s/, "");
      elements.push(
        <div key={`li-${i}`} className="flex gap-2 ml-1 my-0.5">
          <span className="text-zinc-500 shrink-0 mt-0.5">&#8226;</span>
          <span>{renderInlineFormatting(text)}</span>
        </div>
      );
      continue;
    }

    // Numbered list item
    if (line.match(/^\s*\d+\.\s/)) {
      const match = line.match(/^(\s*\d+\.)\s(.+)/);
      if (match) {
        elements.push(
          <div key={`ol-${i}`} className="flex gap-2 ml-1 my-0.5">
            <span className="text-zinc-500 shrink-0 font-mono text-[11px] mt-0.5 min-w-[1.25rem]">
              {match[1]}
            </span>
            <span>{renderInlineFormatting(match[2])}</span>
          </div>
        );
        continue;
      }
    }

    // Horizontal rule (---)
    if (line.trim() === "---") {
      elements.push(
        <hr key={`hr-${i}`} className="my-2 border-zinc-700/50" />
      );
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={`p-${i}`} className="my-0.5">
        {renderInlineFormatting(line)}
      </p>
    );
  }

  // Handle unclosed code block
  if (codeBlock !== null) {
    elements.push(
      <pre
        key={`code-${codeBlockKey}`}
        className="my-2 rounded-lg bg-zinc-900 border border-zinc-800/60 px-3 py-2.5 text-xs font-mono text-zinc-300 overflow-x-auto"
      >
        <code>{codeBlock.join("\n")}</code>
      </pre>
    );
  }

  return elements;
}

/**
 * Render inline formatting: **bold** and `inline code`.
 */
function renderInlineFormatting(text: string): React.ReactNode {
  // Split by inline code and bold markers
  const parts: React.ReactNode[] = [];
  // Match **bold** or `code`
  const regex = /(\*\*(.+?)\*\*|`([^`]+)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let partKey = 0;

  while ((match = regex.exec(text)) !== null) {
    // Text before the match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[2]) {
      // Bold
      parts.push(
        <strong key={`b-${partKey++}`} className="font-semibold text-zinc-100">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      // Inline code
      parts.push(
        <code
          key={`c-${partKey++}`}
          className="font-mono text-[11px] bg-zinc-900 border border-zinc-800/60 rounded px-1 py-0.5 text-cyan-300"
        >
          {match[3]}
        </code>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length === 1 && typeof parts[0] === "string" ? parts[0] : parts;
}

// ---------------------------------------------------------------------------
// AiMessage Component
// ---------------------------------------------------------------------------

export function AiMessage({ message }: AiMessageProps) {
  const isUser = message.role === "user";
  const renderedContent = useMemo(
    () => renderContent(message.content),
    [message.content]
  );

  return (
    <div
      className={cn(
        "flex w-full gap-2",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* AI avatar badge */}
      {!isUser && (
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
      )}

      {/* Message bubble */}
      <div className={cn("flex flex-col max-w-[85%]", isUser && "items-end")}>
        <div
          className={cn(
            "px-3.5 py-2.5 text-[13px] leading-relaxed",
            isUser
              ? "bg-indigo-500/15 border border-indigo-500/20 text-zinc-100 rounded-2xl rounded-tr-sm"
              : "bg-zinc-800/60 border border-zinc-700/30 text-zinc-200 rounded-2xl rounded-tl-sm"
          )}
        >
          {isUser ? message.content : renderedContent}
        </div>

        {/* Timestamp */}
        <span
          className={cn(
            "text-[10px] text-zinc-600 mt-1 px-1",
            isUser ? "text-right" : "text-left"
          )}
        >
          {formatRelativeDate(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
