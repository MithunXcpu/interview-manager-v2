"use client";

import { useEffect, useCallback } from 'react';
import { useAppStore } from '@/stores/app-store';

// =============================================================================
// Types
// =============================================================================

interface Shortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  handler: () => void;
  description: string;
}

// =============================================================================
// Core Hook
// =============================================================================

/**
 * Registers keyboard event listeners for the provided shortcuts.
 *
 * - Handles Cmd (meta) on Mac and Ctrl on Windows/Linux.
 * - Ignores events when the user is typing in an input, textarea, or
 *   contenteditable element so shortcuts don't interfere with text entry.
 * - Cleans up listeners on unmount or when the shortcuts array changes.
 */
export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't fire shortcuts when the user is typing in a form field
      const target = event.target as HTMLElement;
      const isEditable =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      if (isEditable) return;

      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

        // Treat ctrl and meta as interchangeable (Cmd on Mac, Ctrl on Win/Linux)
        const modifierRequired = shortcut.ctrl || shortcut.meta;
        const modifierPressed = event.metaKey || event.ctrlKey;
        const modifierMatch = modifierRequired ? modifierPressed : !modifierPressed;

        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;

        if (keyMatch && modifierMatch && shiftMatch) {
          event.preventDefault();
          shortcut.handler();
          return;
        }
      }
    },
    [shortcuts],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

// =============================================================================
// Global Shortcuts Hook
// =============================================================================

/**
 * Registers the default application-wide keyboard shortcuts:
 *
 * - Cmd/Ctrl + K  -- Toggle the command palette
 * - Cmd/Ctrl + B  -- Toggle the sidebar
 * - Cmd/Ctrl + J  -- Toggle the AI sidebar
 */
export function useGlobalShortcuts() {
  const toggleCommandPalette = useAppStore((s) => s.toggleCommandPalette);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const toggleAiSidebar = useAppStore((s) => s.toggleAiSidebar);

  useKeyboardShortcuts([
    {
      key: 'k',
      meta: true,
      handler: toggleCommandPalette,
      description: 'Toggle command palette',
    },
    {
      key: 'b',
      meta: true,
      handler: toggleSidebar,
      description: 'Toggle sidebar',
    },
    {
      key: 'j',
      meta: true,
      handler: toggleAiSidebar,
      description: 'Toggle AI sidebar',
    },
  ]);
}
