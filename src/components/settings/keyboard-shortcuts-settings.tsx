"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Keyboard Shortcuts Settings -- grouped read-only display
// ---------------------------------------------------------------------------

interface Shortcut {
  action: string;
  keys: string[];
}

interface ShortcutGroup {
  name: string;
  shortcuts: Shortcut[];
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    name: "Navigation",
    shortcuts: [
      { action: "Command Palette", keys: ["\u2318", "K"] },
      { action: "Toggle Sidebar", keys: ["\u2318", "B"] },
      { action: "Toggle AI Assistant", keys: ["\u2318", "J"] },
      { action: "Navigate to Page", keys: ["\u2318", "1-9"] },
    ],
  },
  {
    name: "Pipeline",
    shortcuts: [
      { action: "New Company", keys: ["N"] },
      { action: "Edit Selected", keys: ["E"] },
      { action: "Delete Selected", keys: ["D"] },
      { action: "Kanban View", keys: ["K"] },
      { action: "Table View", keys: ["T"] },
    ],
  },
  {
    name: "General",
    shortcuts: [
      { action: "Save", keys: ["\u2318", "S"] },
      { action: "Undo", keys: ["\u2318", "Z"] },
      { action: "Close Dialog", keys: ["Esc"] },
    ],
  },
];

function KbdKey({ children }: { children: React.ReactNode }) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center",
        "min-w-[24px] h-6 px-1.5",
        "rounded-md border border-zinc-700/80 bg-zinc-800/80",
        "text-[11px] font-mono font-medium text-zinc-300",
        "shadow-[0_1px_0_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]"
      )}
    >
      {children}
    </kbd>
  );
}

function ShortcutRow({ shortcut }: { shortcut: Shortcut }) {
  return (
    <div className="flex items-center justify-between py-2.5 px-1">
      <span className="text-sm text-zinc-300">{shortcut.action}</span>
      <div className="flex items-center gap-1">
        {shortcut.keys.map((key, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && (
              <span className="text-[10px] text-zinc-600 mx-0.5">+</span>
            )}
            <KbdKey>{key}</KbdKey>
          </span>
        ))}
      </div>
    </div>
  );
}

export function KeyboardShortcutsSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Keyboard Shortcuts</CardTitle>
        <CardDescription>
          Quick reference for all keyboard shortcuts. Custom shortcuts coming soon.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {SHORTCUT_GROUPS.map((group, groupIndex) => (
            <div key={group.name}>
              {groupIndex > 0 && <Separator className="mb-5" />}
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                {group.name}
              </h3>
              <div className="divide-y divide-zinc-800/60">
                {group.shortcuts.map((shortcut) => (
                  <ShortcutRow key={shortcut.action} shortcut={shortcut} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
