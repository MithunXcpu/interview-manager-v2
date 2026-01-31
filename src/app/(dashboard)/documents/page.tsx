"use client";

import {
  FiFileText,
  FiFile,
  FiBarChart2,
  FiDownload,
  FiMonitor,
} from "react-icons/fi";
import { cn, formatDate } from "@/lib/utils";
import { useDocuments } from "@/hooks/use-documents";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { toast } from "@/components/ui/toast";
import type { Document } from "@/types";

// =============================================================================
// Documents Page — document generation hub
// =============================================================================

interface DocumentTypeCard {
  type: string;
  format: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}

const documentTypes: DocumentTypeCard[] = [
  {
    type: "briefing",
    format: "PDF",
    title: "Company Briefing",
    description:
      "Generate a comprehensive briefing document with company research, interview prep, and key talking points.",
    icon: <FiFileText className="w-5 h-5" />,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
  },
  {
    type: "cover_letter",
    format: "DOCX",
    title: "Cover Letter",
    description:
      "Create a tailored cover letter highlighting relevant skills and experience for the target role.",
    icon: <FiFile className="w-5 h-5" />,
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20",
  },
  {
    type: "presentation",
    format: "PPTX",
    title: "Presentation",
    description:
      "Build a professional presentation for case studies, portfolio reviews, or interview presentations.",
    icon: <FiMonitor className="w-5 h-5" />,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
  {
    type: "salary_sheet",
    format: "XLSX",
    title: "Salary Sheet",
    description:
      "Export a detailed salary comparison spreadsheet with all your offers and compensation data.",
    icon: <FiBarChart2 className="w-5 h-5" />,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
];

const formatBadgeVariant: Record<string, "default" | "primary" | "success" | "warning" | "danger" | "info"> = {
  PDF: "danger",
  DOCX: "primary",
  PPTX: "warning",
  XLSX: "success",
};

const typeBadgeVariant: Record<string, "default" | "primary" | "success" | "warning" | "danger" | "info"> = {
  briefing: "info",
  cover_letter: "primary",
  presentation: "warning",
  salary_sheet: "success",
};

const typeLabels: Record<string, string> = {
  briefing: "Briefing",
  cover_letter: "Cover Letter",
  presentation: "Presentation",
  salary_sheet: "Salary Sheet",
};

function DocumentTypeCardComponent({ docType }: { docType: DocumentTypeCard }) {
  const handleGenerate = () => {
    toast.info(`${docType.title} generation coming soon!`, {
      description: "Document generation will be available in a future update.",
    });
  };

  return (
    <Card hover className="flex flex-col">
      <CardContent className="flex-1 pt-5">
        {/* Icon */}
        <div
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-lg mb-3",
            docType.bgColor,
            "border",
            docType.borderColor
          )}
        >
          <span className={docType.color}>{docType.icon}</span>
        </div>

        {/* Title & format */}
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-sm font-semibold text-zinc-100">
            {docType.title}
          </h3>
          <Badge
            size="sm"
            variant={formatBadgeVariant[docType.format] ?? "default"}
          >
            {docType.format}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-xs text-zinc-500 leading-relaxed mb-4">
          {docType.description}
        </p>

        {/* Generate button */}
        <Button
          variant="secondary"
          size="sm"
          className="w-full"
          onClick={handleGenerate}
        >
          Generate
        </Button>
      </CardContent>
    </Card>
  );
}

function DocumentItem({ document }: { document: Document }) {
  const handleDownload = () => {
    if (document.fileUrl) {
      window.open(document.fileUrl, "_blank");
    } else {
      toast.info("File not available yet", {
        description: "This document is still being generated.",
      });
    }
  };

  return (
    <div className="flex items-center gap-4 py-3">
      {/* Icon */}
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-zinc-800/60 shrink-0">
        <FiFileText className="w-4 h-4 text-zinc-500" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-200 truncate">
          {document.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <Badge
            size="sm"
            variant={typeBadgeVariant[document.type] ?? "default"}
          >
            {typeLabels[document.type] ?? document.type}
          </Badge>
          <Badge
            size="sm"
            variant={formatBadgeVariant[document.format.toUpperCase()] ?? "default"}
          >
            {document.format.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Date */}
      <span className="text-xs text-zinc-600 shrink-0">
        {formatDate(document.createdAt)}
      </span>

      {/* Download */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDownload}
        iconLeft={<FiDownload className="w-3.5 h-3.5" />}
      >
        Download
      </Button>
    </div>
  );
}

export default function DocumentsPage() {
  const { data: documents, isLoading } = useDocuments();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <Skeleton variant="text" className="w-48 h-7" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-[22px] font-bold text-zinc-100 tracking-tight leading-tight">
          Documents
        </h1>
        <p className="text-[13px] text-zinc-500 mt-0.5">
          Generate and manage interview-related documents
        </p>
      </div>

      {/* Document type cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {documentTypes.map((docType) => (
          <DocumentTypeCardComponent key={docType.type} docType={docType} />
        ))}
      </div>

      <Separator label="Generated Documents" />

      {/* Previously generated documents */}
      <Card>
        <CardContent>
          {!documents || documents.length === 0 ? (
            <EmptyState
              icon={<FiFileText className="w-5 h-5" />}
              title="No documents generated"
              description="Use the cards above to generate your first document."
              className="py-8"
            />
          ) : (
            <div className="divide-y divide-zinc-800/60">
              {documents.map((doc) => (
                <DocumentItem key={doc.id} document={doc} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
