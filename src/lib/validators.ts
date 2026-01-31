import { z } from 'zod';

// =============================================================================
// Enum Schemas
// =============================================================================

export const prioritySchema = z.enum(['HIGH', 'MEDIUM', 'LOW']);

export const interviewTypeSchema = z.enum([
  'PHONE_SCREEN',
  'TECHNICAL',
  'BEHAVIORAL',
  'SYSTEM_DESIGN',
  'CULTURE_FIT',
  'PANEL',
  'FINAL',
  'OTHER',
]);

export const interviewStatusSchema = z.enum([
  'SCHEDULED',
  'COMPLETED',
  'CANCELLED',
  'RESCHEDULED',
  'NO_SHOW',
]);

export const meetingTypeSchema = z.enum([
  'GOOGLE_MEET',
  'ZOOM',
  'PHONE',
  'IN_PERSON',
  'MICROSOFT_TEAMS',
]);

export const offerStatusSchema = z.enum([
  'PENDING',
  'NEGOTIATING',
  'ACCEPTED',
  'DECLINED',
  'EXPIRED',
]);

// =============================================================================
// Company Validators
// =============================================================================

const companyBaseSchema = z.object({
  name: z
    .string()
    .min(1, 'Company name is required')
    .max(200, 'Company name must be under 200 characters'),
  jobTitle: z.string().max(200).optional(),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  location: z.string().max(200).optional(),
  salaryMin: z.number().nonnegative('Salary cannot be negative').optional(),
  salaryMax: z.number().nonnegative('Salary cannot be negative').optional(),
  priority: prioritySchema.optional().default('MEDIUM'),
  recruiterName: z.string().max(200).optional(),
  recruiterEmail: z
    .string()
    .email('Must be a valid email')
    .optional()
    .or(z.literal('')),
  notes: z.string().max(5000).optional(),
  jobUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  appliedDate: z.coerce.date().optional(),
  userStageId: z.string().cuid().optional(),
});

export const createCompanySchema = companyBaseSchema.refine(
  (data) => {
    if (data.salaryMin != null && data.salaryMax != null) {
      return data.salaryMax >= data.salaryMin;
    }
    return true;
  },
  {
    message: 'Maximum salary must be greater than or equal to minimum salary',
    path: ['salaryMax'],
  }
);

export const updateCompanySchema = companyBaseSchema.partial().extend({
  lastActivityDate: z.coerce.date().optional(),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;

// =============================================================================
// Interview Validators
// =============================================================================

export const createInterviewSchema = z.object({
  companyId: z.string().cuid('Invalid company ID'),
  title: z
    .string()
    .min(1, 'Interview title is required')
    .max(200, 'Title must be under 200 characters'),
  scheduledAt: z.coerce.date().refine(
    (date) => date > new Date(),
    'Scheduled date must be in the future'
  ),
  duration: z
    .number()
    .int()
    .min(15, 'Duration must be at least 15 minutes')
    .max(480, 'Duration cannot exceed 8 hours')
    .optional()
    .default(60),
  type: interviewTypeSchema.optional().default('PHONE_SCREEN'),
  meetingType: meetingTypeSchema.optional(),
  meetingLink: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  location: z.string().max(500).optional(),
  interviewerName: z.string().max(200).optional(),
  interviewerRole: z.string().max(200).optional(),
  interviewerLinkedIn: z
    .string()
    .url('Must be a valid LinkedIn URL')
    .optional()
    .or(z.literal('')),
  notes: z.string().max(5000).optional(),
});

export type CreateInterviewInput = z.infer<typeof createInterviewSchema>;

// =============================================================================
// Offer Validators
// =============================================================================

export const createOfferSchema = z.object({
  companyId: z.string().cuid('Invalid company ID'),
  baseSalary: z.number().nonnegative('Salary cannot be negative').optional(),
  equity: z.string().max(200).optional(),
  equityValue: z.number().nonnegative().optional(),
  signingBonus: z.number().nonnegative('Bonus cannot be negative').optional(),
  annualBonus: z.number().nonnegative('Bonus cannot be negative').optional(),
  bonusTarget: z.string().max(200).optional(),
  benefits: z.record(z.string(), z.unknown()).optional(),
  startDate: z.coerce.date().optional(),
  deadline: z.coerce.date().optional(),
  status: offerStatusSchema.optional().default('PENDING'),
  notes: z.string().max(5000).optional(),
  negotiationNotes: z.string().max(5000).optional(),
});

export type CreateOfferInput = z.infer<typeof createOfferSchema>;

// =============================================================================
// Wellness Check-In Validators
// =============================================================================

export const wellnessCheckInSchema = z.object({
  mood: z
    .number()
    .int()
    .min(1, 'Mood must be between 1 and 5')
    .max(5, 'Mood must be between 1 and 5'),
  energy: z
    .number()
    .int()
    .min(1, 'Energy must be between 1 and 5')
    .max(5, 'Energy must be between 1 and 5'),
  notes: z.string().max(2000).optional(),
  date: z.coerce.date(),
});

export type WellnessCheckInInput = z.infer<typeof wellnessCheckInSchema>;

// =============================================================================
// User Profile Validators
// =============================================================================

export const userProfileSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(200, 'Name must be under 200 characters'),
  email: z.string().email('Must be a valid email'),
  phone: z
    .string()
    .max(20, 'Phone number is too long')
    .optional()
    .or(z.literal('')),
  timezone: z.string().min(1, 'Timezone is required'),
});

export type UserProfileInput = z.infer<typeof userProfileSchema>;

// =============================================================================
// Availability Slot Validators
// =============================================================================

export const availabilitySlotSchema = z.object({
  dayOfWeek: z
    .number()
    .int()
    .min(0, 'Day must be between 0 (Sunday) and 6 (Saturday)')
    .max(6, 'Day must be between 0 (Sunday) and 6 (Saturday)'),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Must be in HH:MM format'),
  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Must be in HH:MM format'),
}).refine(
  (data) => data.endTime > data.startTime,
  {
    message: 'End time must be after start time',
    path: ['endTime'],
  }
);

export type AvailabilitySlotInput = z.infer<typeof availabilitySlotSchema>;
