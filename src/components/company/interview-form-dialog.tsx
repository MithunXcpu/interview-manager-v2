"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createInterviewSchema } from '@/lib/validators';
import { useCreateInterview } from '@/hooks/use-interviews';
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
import type { InterviewType, MeetingType } from '@/types';
import { z } from 'zod';

// =============================================================================
// Form Schema — adapt the createInterviewSchema for the form
// The companyId is set programmatically, scheduledAt comes from datetime-local
// =============================================================================

const formSchema = createInterviewSchema.omit({ companyId: true }).extend({
  scheduledAt: z.string().min(1, 'Scheduled date is required'),
});

type FormValues = z.infer<typeof formSchema>;

// =============================================================================
// Type & Meeting Type Options
// =============================================================================

const interviewTypeOptions = [
  { label: 'Phone Screen', value: 'PHONE_SCREEN' },
  { label: 'Technical', value: 'TECHNICAL' },
  { label: 'Behavioral', value: 'BEHAVIORAL' },
  { label: 'System Design', value: 'SYSTEM_DESIGN' },
  { label: 'Culture Fit', value: 'CULTURE_FIT' },
  { label: 'Panel', value: 'PANEL' },
  { label: 'Final', value: 'FINAL' },
  { label: 'Other', value: 'OTHER' },
];

const meetingTypeOptions = [
  { label: 'Select meeting type...', value: '' },
  { label: 'Google Meet', value: 'GOOGLE_MEET' },
  { label: 'Zoom', value: 'ZOOM' },
  { label: 'Phone', value: 'PHONE' },
  { label: 'In Person', value: 'IN_PERSON' },
  { label: 'Microsoft Teams', value: 'MICROSOFT_TEAMS' },
];

// =============================================================================
// Interview Form Dialog
// =============================================================================

interface InterviewFormDialogProps {
  companyId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InterviewFormDialog({
  companyId,
  open,
  onOpenChange,
}: InterviewFormDialogProps) {
  const createInterview = useCreateInterview();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema) as never,
    defaultValues: {
      title: '',
      scheduledAt: '',
      duration: 60,
      type: 'PHONE_SCREEN' as InterviewType,
      meetingLink: '',
      location: '',
      interviewerName: '',
      interviewerRole: '',
      interviewerLinkedIn: '',
      notes: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    // Convert the datetime-local string to a Date and merge with companyId
    const payload = {
      ...values,
      companyId,
      scheduledAt: new Date(values.scheduledAt),
      duration: Number(values.duration) || 60,
      meetingType: (values.meetingType || undefined) as MeetingType | undefined,
      meetingLink: values.meetingLink || undefined,
      location: values.location || undefined,
      interviewerName: values.interviewerName || undefined,
      interviewerRole: values.interviewerRole || undefined,
      interviewerLinkedIn: values.interviewerLinkedIn || undefined,
      notes: values.notes || undefined,
    };

    createInterview.mutate(payload, {
      onSuccess: () => {
        toast.success('Interview scheduled successfully');
        reset();
        onOpenChange(false);
      },
      onError: () => {
        toast.error('Failed to create interview');
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Add Interview</DialogTitle>
          <DialogDescription>
            Schedule a new interview for this company.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-2 space-y-4">
          {/* Row 1: Title */}
          <Input
            label="Title"
            placeholder="e.g., Technical Round 1"
            error={errors.title?.message}
            {...register('title')}
          />

          {/* Row 2: Date & Duration */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Scheduled At"
              type="datetime-local"
              error={errors.scheduledAt?.message}
              {...register('scheduledAt')}
            />
            <Input
              label="Duration (minutes)"
              type="number"
              placeholder="60"
              error={errors.duration?.message}
              {...register('duration', { valueAsNumber: true })}
            />
          </div>

          {/* Row 3: Type & Meeting Type */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Interview Type"
              options={interviewTypeOptions}
              error={errors.type?.message}
              {...register('type')}
            />
            <Select
              label="Meeting Type"
              options={meetingTypeOptions}
              error={errors.meetingType?.message}
              {...register('meetingType')}
            />
          </div>

          {/* Row 4: Meeting Link & Location */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Meeting Link"
              placeholder="https://..."
              error={errors.meetingLink?.message}
              {...register('meetingLink')}
            />
            <Input
              label="Location"
              placeholder="Office address or room"
              error={errors.location?.message}
              {...register('location')}
            />
          </div>

          {/* Row 5: Interviewer Info */}
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Interviewer Name"
              placeholder="Jane Smith"
              error={errors.interviewerName?.message}
              {...register('interviewerName')}
            />
            <Input
              label="Interviewer Role"
              placeholder="Senior Engineer"
              error={errors.interviewerRole?.message}
              {...register('interviewerRole')}
            />
            <Input
              label="LinkedIn URL"
              placeholder="https://linkedin.com/in/..."
              error={errors.interviewerLinkedIn?.message}
              {...register('interviewerLinkedIn')}
            />
          </div>

          {/* Row 6: Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400">Notes</label>
            <textarea
              placeholder="Anything to remember..."
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
              loading={isSubmitting || createInterview.isPending}
            >
              Schedule Interview
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
