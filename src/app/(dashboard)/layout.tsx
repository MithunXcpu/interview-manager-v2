"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/shared/sidebar";
import { Header } from "@/components/shared/header";
import { AiSidebar } from "@/components/shared/ai-sidebar";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { useAppStore } from "@/stores/app-store";
import { useOnboardingCheck } from "@/hooks/use-onboarding-check";

// ---------------------------------------------------------------------------
// Dashboard shell layout
// Persistent sidebar + header + scrollable main content + AI sidebar panel
// ---------------------------------------------------------------------------

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const aiSidebarOpen = useAppStore((s) => s.aiSidebarOpen);
  const isReady = useOnboardingCheck();

  // Show nothing while checking onboarding status (prevents flash)
  if (!isReady) {
    return (
      <div className="flex h-screen bg-[#0a0f1e] items-center justify-center">
        <div className="text-zinc-500 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0a0f1e] overflow-hidden">
      {/* Left sidebar — persistent */}
      <Sidebar />

      {/* Main column */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>

      {/* AI Sidebar panel — slides in from right */}
      <AnimatePresence mode="wait">
        {aiSidebarOpen && (
          <motion.aside
            key="ai-sidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 380, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="h-screen border-l border-zinc-800/50 bg-[#111827] flex flex-col overflow-hidden shrink-0"
          >
            <AiSidebar />
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
