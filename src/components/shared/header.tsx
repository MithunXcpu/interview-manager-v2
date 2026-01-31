"use client";

import { useCallback, useEffect } from "react";
import { FiSearch, FiBell, FiMessageSquare, FiUser } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";

// ---------------------------------------------------------------------------
// Header component -- top bar of the dashboard shell
// ---------------------------------------------------------------------------

export function Header() {
  const setCommandPaletteOpen = useAppStore((s) => s.setCommandPaletteOpen);
  const toggleAiSidebar = useAppStore((s) => s.toggleAiSidebar);

  // Cmd+K keyboard shortcut for command palette
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    },
    [setCommandPaletteOpen]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <header className="flex items-center justify-between h-14 px-6 bg-[#111827]/80 backdrop-blur-md border-b border-zinc-800/50 shrink-0 z-[100]">
      {/* Left: Search trigger */}
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className={cn(
          "flex items-center gap-2.5 h-9 px-3.5 rounded-lg",
          "bg-zinc-800/50 border border-zinc-700/50",
          "text-zinc-500 text-sm",
          "hover:bg-zinc-800 hover:border-zinc-600 hover:text-zinc-400",
          "transition-all duration-150",
          "w-[280px] max-w-sm"
        )}
      >
        <FiSearch className="w-4 h-4 shrink-0" />
        <span className="flex-1 text-left text-[13px]">Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-zinc-900/80 border border-zinc-700/50 text-[10px] font-mono text-zinc-500">
          <span className="text-xs">&#8984;</span>K
        </kbd>
      </button>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        {/* Notifications */}
        <HeaderIconButton
          icon={<FiBell className="w-4 h-4" />}
          label="Notifications"
          onClick={() => {
            // Notifications panel -- to be implemented
          }}
        />

        {/* AI Assistant toggle */}
        <HeaderIconButton
          icon={<FiMessageSquare className="w-4 h-4" />}
          label="AI Assistant"
          onClick={toggleAiSidebar}
          className="text-cyan-400/70 hover:text-cyan-300"
        />

        {/* Divider */}
        <div className="w-px h-6 bg-zinc-800 mx-2" />

        {/* User avatar placeholder (Clerk integration later) */}
        <button
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full",
            "bg-indigo-500/15 text-indigo-400",
            "hover:bg-indigo-500/25 transition-colors duration-150",
            "text-sm font-semibold"
          )}
          title="User menu"
        >
          <FiUser className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Header icon button
// ---------------------------------------------------------------------------

function HeaderIconButton({
  icon,
  label,
  onClick,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-center w-9 h-9 rounded-lg",
        "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60",
        "transition-all duration-150",
        className
      )}
      title={label}
      aria-label={label}
    >
      {icon}
    </button>
  );
}
