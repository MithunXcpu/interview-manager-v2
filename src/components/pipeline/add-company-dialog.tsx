"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createCompanySchema } from "@/lib/validators";
import { useCreateCompany } from "@/hooks/use-companies";
import { DEFAULT_STAGES } from "@/lib/stages";
import type { UserStage } from "@/types";
import type { z } from "zod";

// ---------------------------------------------------------------------------
// Add Company Dialog -- Form to create a new company
// ---------------------------------------------------------------------------

type FormValues = z.infer<typeof createCompanySchema>;

interface AddCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userStages: UserStage[];
}

export function AddCompanyDialog({
  open,
  onOpenChange,
  userStages,
}: AddCompanyDialogProps) {
  const createCompany = useCreateCompany();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(createCompanySchema) as never,
    defaultValues: {
      name: "",
      jobTitle: "",
      website: "",
      location: "",
      priority: "MEDIUM",
      recruiterName: "",
      recruiterEmail: "",
      notes: "",
      jobUrl: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Clean up empty strings to undefined for optional fields
      const cleaned = {
        ...data,
        website: data.website || undefined,
        jobTitle: data.jobTitle || undefined,
        location: data.location || undefined,
        recruiterName: data.recruiterName || undefined,
        recruiterEmail: data.recruiterEmail || undefined,
        notes: data.notes || undefined,
        jobUrl: data.jobUrl || undefined,
        salaryMin: data.salaryMin ?? undefined,
        salaryMax: data.salaryMax ?? undefined,
        userStageId: data.userStageId || undefined,
      };

      await createCompany.mutateAsync(cleaned);

      toast.success("Company added", {
        description: `${data.name} has been added to your pipeline.`,
      });

      reset();
      onOpenChange(false);
    } catch {
      toast.error("Failed to add company", {
        description: "Something went wrong. Please try again.",
      });
    }
  };

  // Build stage options from userStages or fallback to defaults
  const stageOptions =
    userStages.length > 0
      ? userStages
          .filter((s) => s.isEnabled)
          .sort((a, b) => a.order - b.order)
          .map((s) => ({
            label: `${s.emoji} ${s.name}`,
            value: s.id,
          }))
      : DEFAULT_STAGES.map((s) => ({
          label: `${s.emoji} ${s.name}`,
          value: s.key,
        }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Add Company</DialogTitle>
          <DialogDescription>
            Add a new company to your interview pipeline.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Company Name */}
            <Input
              label="Company Name *"
              placeholder="e.g., Google"
              error={errors.name?.message}
              {...register("name")}
            />

            {/* Job Title */}
            <Input
              label="Job Title"
              placeholder="e.g., Senior Software Engineer"
              error={errors.jobTitle?.message}
              {...register("jobTitle")}
            />

            {/* Website */}
            <Input
              label="Website"
              placeholder="https://company.com"
              error={errors.website?.message}
              {...register("website")}
            />

            {/* Location */}
            <Input
              label="Location"
              placeholder="e.g., San Francisco, CA"
              error={errors.location?.message}
              {...register("location")}
            />

            {/* Salary Min */}
            <Input
              label="Salary Min ($)"
              type="number"
              placeholder="e.g., 150000"
              error={errors.salaryMin?.message}
              {...register("salaryMin", { valueAsNumber: true })}
            />

            {/* Salary Max */}
            <Input
              label="Salary Max ($)"
              type="number"
              placeholder="e.g., 200000"
              error={errors.salaryMax?.message}
              {...register("salaryMax", { valueAsNumber: true })}
            />

            {/* Priority */}
            <Select
              label="Priority"
              options={[
                { label: "High", value: "HIGH" },
                { label: "Medium", value: "MEDIUM" },
                { label: "Low", value: "LOW" },
              ]}
              error={errors.priority?.message}
              {...register("priority")}
            />

            {/* Stage */}
            <Select
              label="Pipeline Stage"
              placeholder="Select a stage"
              options={stageOptions}
              error={errors.userStageId?.message}
              {...register("userStageId")}
            />

            {/* Recruiter Name */}
            <Input
              label="Recruiter Name"
              placeholder="e.g., Jane Smith"
              error={errors.recruiterName?.message}
              {...register("recruiterName")}
            />

            {/* Recruiter Email */}
            <Input
              label="Recruiter Email"
              type="email"
              placeholder="recruiter@company.com"
              error={errors.recruiterEmail?.message}
              {...register("recruiterEmail")}
            />

            {/* Job URL */}
            <div className="sm:col-span-2">
              <Input
                label="Job URL"
                placeholder="https://company.com/jobs/123"
                error={errors.jobUrl?.message}
                {...register("jobUrl")}
              />
            </div>

            {/* Notes */}
            <div className="sm:col-span-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400 select-none">
                  Notes
                </label>
                <textarea
                  className="h-20 w-full rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/60 transition-colors duration-150 resize-none"
                  placeholder="Any notes about this opportunity..."
                  {...register("notes")}
                />
                {errors.notes?.message && (
                  <p className="text-xs text-red-400">{errors.notes.message}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6 px-0">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting || createCompany.isPending}
            >
              Add Company
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
