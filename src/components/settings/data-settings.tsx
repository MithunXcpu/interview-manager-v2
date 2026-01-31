"use client";

import { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { FiDownload, FiUpload, FiAlertTriangle, FiTrash2, FiFileText } from "react-icons/fi";

// ---------------------------------------------------------------------------
// Data Settings -- Export, Import, Danger Zone
// ---------------------------------------------------------------------------

export function DataSettings() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleExportJSON() {
    toast.info("Coming soon: Export data as JSON");
  }

  function handleExportCSV() {
    toast.info("Coming soon: Export data as CSV");
  }

  function handleImportJSON() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      toast.info("Coming soon: Import data from JSON");
      // Reset input
      e.target.value = "";
    }
  }

  function handleDeleteAll() {
    setDeleteDialogOpen(false);
    setDeleteConfirmText("");
    toast.info("Coming soon: Delete all data");
  }

  return (
    <div className="space-y-6">
      {/* Export Data */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Export Data</CardTitle>
          <CardDescription>
            Download a copy of all your data for backup or analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleExportJSON}
              iconLeft={<FiDownload className="w-3.5 h-3.5" />}
            >
              Export as JSON
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleExportCSV}
              iconLeft={<FiFileText className="w-3.5 h-3.5" />}
            >
              Export as CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Import Data */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Import Data</CardTitle>
          <CardDescription>
            Restore data from a previously exported JSON file
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Drop zone */}
          <button
            type="button"
            onClick={handleImportJSON}
            className={cn(
              "w-full border-2 border-dashed border-zinc-800 rounded-xl",
              "py-10 px-6 text-center",
              "hover:border-zinc-700 hover:bg-zinc-900/30",
              "transition-all duration-200 cursor-pointer",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/30"
            )}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-800/60 border border-zinc-700/50">
                <FiUpload className="w-5 h-5 text-zinc-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-300">
                  Click to upload JSON file
                </p>
                <p className="text-xs text-zinc-600 mt-0.5">
                  Supports .json files exported from Signal
                </p>
              </div>
            </div>
          </button>
        </CardContent>
      </Card>

      <Separator />

      {/* Danger Zone */}
      <Card className="border-red-500/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FiAlertTriangle className="w-4 h-4 text-red-400" />
            <CardTitle className="text-base text-red-400">Danger Zone</CardTitle>
          </div>
          <CardDescription>
            Irreversible actions that will permanently affect your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg border border-red-500/20 bg-red-500/5">
            <div>
              <p className="text-sm font-medium text-zinc-200">
                Delete all data
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">
                Permanently delete all companies, interviews, emails, and settings
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
              iconLeft={<FiTrash2 className="w-3.5 h-3.5" />}
            >
              Delete All Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle className="text-red-400 flex items-center gap-2">
              <FiAlertTriangle className="w-4 h-4" />
              Delete All Data
            </DialogTitle>
            <DialogDescription>
              This action is irreversible. All your companies, interviews, emails,
              and settings will be permanently deleted.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-4">
            <label className="text-xs font-medium text-zinc-400 block mb-2">
              Type <span className="font-mono text-red-400">DELETE</span> to confirm
            </label>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className={cn(
                "h-9 w-full rounded-lg border bg-zinc-900/80 px-3 text-sm text-zinc-100",
                "placeholder:text-zinc-600",
                "border-zinc-800 focus:border-red-500/60",
                "focus:outline-none focus:ring-2 focus:ring-red-500/20"
              )}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary" size="sm">
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="danger"
              size="sm"
              disabled={deleteConfirmText !== "DELETE"}
              onClick={handleDeleteAll}
            >
              Permanently Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
