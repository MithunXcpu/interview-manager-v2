"use client";

import { FiUser, FiGitMerge, FiLink, FiCommand, FiDatabase } from "react-icons/fi";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProfileSettings } from "@/components/settings/profile-settings";
import { PipelineSettings } from "@/components/settings/pipeline-settings";
import { IntegrationSettings } from "@/components/settings/integration-settings";
import { KeyboardShortcutsSettings } from "@/components/settings/keyboard-shortcuts-settings";
import { DataSettings } from "@/components/settings/data-settings";

// ---------------------------------------------------------------------------
// Settings page -- tabbed layout
// ---------------------------------------------------------------------------

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-zinc-100 tracking-tight leading-tight">
          Settings
        </h1>
        <p className="text-[13px] text-zinc-500 mt-0.5">
          Manage your profile, pipeline, integrations, and preferences
        </p>
      </div>

      {/* Tabbed settings sections */}
      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile" className="gap-1.5">
            <FiUser className="w-3.5 h-3.5" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="pipeline" className="gap-1.5">
            <FiGitMerge className="w-3.5 h-3.5" />
            Pipeline
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-1.5">
            <FiLink className="w-3.5 h-3.5" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="shortcuts" className="gap-1.5">
            <FiCommand className="w-3.5 h-3.5" />
            Keyboard Shortcuts
          </TabsTrigger>
          <TabsTrigger value="data" className="gap-1.5">
            <FiDatabase className="w-3.5 h-3.5" />
            Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="pipeline">
          <PipelineSettings />
        </TabsContent>

        <TabsContent value="integrations">
          <IntegrationSettings />
        </TabsContent>

        <TabsContent value="shortcuts">
          <KeyboardShortcutsSettings />
        </TabsContent>

        <TabsContent value="data">
          <DataSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
