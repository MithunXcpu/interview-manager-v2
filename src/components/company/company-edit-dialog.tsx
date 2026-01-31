"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateCompanySchema } from '@/lib/validators';
import { useUpdateCompany } from '@/hooks/use-companies';
import { toast } from '@/components/ui/toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import type { CompanyWithRelations } from '@/types';
import { z } from 'zod';

// =============================================================================
// Form Schema — exclude refinements for the form
// =============================================================================

const formSchema = z.object({
  name: z.string().min(1, 'Company name is required').max(200),
  jobTitle: z.string().max(200).optional(),
  website: z.string().optional(),
  location: z.string().max(200).optional(),
  salaryMin: z.union([z.number().nonnegative(), z.nan()]).optional(),
  salaryMax: z.union([z.number().nonnegative(), z.nan()]).optional(),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional(),
  recruiterName: z.string().max(200).optional(),
  recruiterEmail: z.string().optional(),
  notes: z.string().max(5000).optional(),
  jobUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// =============================================================================
// Priority Options
// =============================================================================

const priorityOptions = [
  { label: 'High', value: 'HIGH' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'Low', value: 'LOW' },
];

// =============================================================================
// Company Edit Dialog
// =============================================================================

interface CompanyEditDialogProps {
  company: CompanyWithRelations;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CompanyEditDialog({
  company,
  open,
  onOpenChange,
}: CompanyEditDialogProps) {
  const updateCompany = useUpdateCompany();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: company.name,
      jobTitle: company.jobTitle ?? '',
      website: company.website ?? '',
      location: company.location ?? '',
      salaryMin: company.salaryMin ?? undefined,
      salaryMax: company.salaryMax ?? undefined,
      priority: company.priority ?? 'MEDIUM',
      recruiterName: company.recruiterName ?? '',
      recruiterEmail: company.recruiterEmail ?? '',
      notes: company.notes ?? '',
      jobUrl: company.jobUrl ?? '',
    },
  });

  // Reset form when company changes
  useEffect(() => {
    if (open) {
      reset({
        name: company.name,
        jobTitle: company.jobTitle ?? '',
        website: company.website ?? '',
        location: company.location ?? '',
        salaryMin: company.salaryMin ?? undefined,
        salaryMax: company.salaryMax ?? undefined,
        priority: company.priority ?? 'MEDIUM',
        recruiterName: company.recruiterName ?? '',
        recruiterEmail: company.recruiterEmail ?? '',
        notes: company.notes ?? '',
        jobUrl: company.jobUrl ?? '',
      });
    }
  }, [open, company, reset]);

  const onSubmit = (values: FormValues) => {
    // Clean up form data
    const data = {
      ...values,
      salaryMin: values.salaryMin && !isNaN(values.salaryMin) ? values.salaryMin : undefined,
      salaryMax: values.salaryMax && !isNaN(values.salaryMax) ? values.salaryMax : undefined,
      website: values.website || undefined,
      recruiterEmail: values.recruiterEmail || undefined,
      jobUrl: values.jobUrl || undefined,
      jobTitle: values.jobTitle || undefined,
      location: values.location || undefined,
      recruiterName: values.recruiterName || undefined,
      notes: values.notes || undefined,
    };

    updateCompany.mutate(
      { id: company.id, data },
      {
        onSuccess: () => {
          toast.success('Company updated successfully');
          onOpenChange(false);
        },
        onError: () => {
          toast.error('Failed to update company');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Edit Company</DialogTitle>
          <DialogDescription>
            Update the details for {company.name}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-2 space-y-4">
          {/* Row 1: Name & Job Title */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Company Name"
              placeholder="e.g., Google"
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="Job Title"
              placeholder="e.g., Senior Software Engineer"
              error={errors.jobTitle?.message}
              {...register('jobTitle')}
            />
          </div>

          {/* Row 2: Website & Location */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Website"
              placeholder="https://..."
              error={errors.website?.message}
              {...register('website')}
            />
            <Input
              label="Location"
              placeholder="San Francisco, CA"
              error={errors.location?.message}
              {...register('location')}
            />
          </div>

          {/* Row 3: Salary Range & Priority */}
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Min Salary"
              type="number"
              placeholder="100000"
              error={errors.salaryMin?.message}
              {...register('salaryMin', { valueAsNumber: true })}
            />
            <Input
              label="Max Salary"
              type="number"
              placeholder="150000"
              error={errors.salaryMax?.message}
              {...register('salaryMax', { valueAsNumber: true })}
            />
            <Select
              label="Priority"
              options={priorityOptions}
              error={errors.priority?.message}
              {...register('priority')}
            />
          </div>

          {/* Row 4: Recruiter Info */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Recruiter Name"
              placeholder="Jane Smith"
              error={errors.recruiterName?.message}
              {...register('recruiterName')}
            />
            <Input
              label="Recruiter Email"
              placeholder="jane@company.com"
              error={errors.recruiterEmail?.message}
              {...register('recruiterEmail')}
            />
          </div>

          {/* Row 5: Job URL */}
          <Input
            label="Job Posting URL"
            placeholder="https://..."
            error={errors.jobUrl?.message}
            {...register('jobUrl')}
          />

          {/* Row 6: Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400">Notes</label>
            <textarea
              placeholder="Additional notes..."
              className="h-20 w-full rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors duration-150 ease-out resize-y"
              {...register('notes')}
            />
            {errors.notes?.message && (
              <p className="text-xs text-red-400">{errors.notes.message}</p>
            )}
          </div>

          <DialogFooter className="px-0">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting || updateCompany.isPending}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
