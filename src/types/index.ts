// =============================================================================
// Enum Types (string unions matching Prisma enums)
// =============================================================================

export type InterviewType =
  | 'PHONE_SCREEN'
  | 'TECHNICAL'
  | 'BEHAVIORAL'
  | 'SYSTEM_DESIGN'
  | 'CULTURE_FIT'
  | 'PANEL'
  | 'FINAL'
  | 'OTHER';

export type InterviewStatus =
  | 'SCHEDULED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'RESCHEDULED'
  | 'NO_SHOW';

export type MeetingType =
  | 'GOOGLE_MEET'
  | 'ZOOM'
  | 'PHONE'
  | 'IN_PERSON'
  | 'MICROSOFT_TEAMS';

export type OfferStatus =
  | 'PENDING'
  | 'NEGOTIATING'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'EXPIRED';

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

// =============================================================================
// Pipeline & View Types
// =============================================================================

export type PipelineView = 'kanban' | 'table';

export type StageKey =
  | 'WISHLIST'
  | 'APPLIED'
  | 'RECRUITER_SCREEN'
  | 'PHONE_SCREEN'
  | 'TECHNICAL'
  | 'SYSTEM_DESIGN'
  | 'BEHAVIORAL'
  | 'ONSITE'
  | 'TEAM_MATCH'
  | 'HIRING_MANAGER'
  | 'FINAL_ROUND'
  | 'OFFER'
  | 'REJECTED'
  | 'ACCEPTED'
  | 'DECLINED';

// =============================================================================
// Model Types
// =============================================================================

export interface User {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  phone: string | null;
  timezone: string;
  googleAccessToken: string | null;
  googleRefreshToken: string | null;
  googleTokenExpiry: Date | null;
  onboardingComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStage {
  id: string;
  userId: string;
  stageKey: string;
  name: string;
  emoji: string;
  color: string;
  order: number;
  isEnabled: boolean;
  createdAt: Date;
}

export interface Company {
  id: string;
  userId: string;
  userStageId: string | null;
  name: string;
  jobTitle: string | null;
  website: string | null;
  location: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  priority: Priority;
  recruiterName: string | null;
  recruiterEmail: string | null;
  notes: string | null;
  jobUrl: string | null;
  appliedDate: Date | null;
  lastActivityDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Interview {
  id: string;
  companyId: string;
  title: string;
  scheduledAt: Date;
  duration: number;
  type: InterviewType;
  status: InterviewStatus;
  meetingType: MeetingType | null;
  meetingLink: string | null;
  location: string | null;
  interviewerName: string | null;
  interviewerRole: string | null;
  interviewerLinkedIn: string | null;
  notes: string | null;
  feedback: string | null;
  calendarEventId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Email {
  id: string;
  userId: string;
  companyId: string | null;
  gmailId: string;
  threadId: string;
  from: string;
  to: string;
  subject: string;
  body: string | null;
  snippet: string | null;
  receivedAt: Date;
  isRead: boolean;
  isRecruiterEmail: boolean;
  detectedCompany: string | null;
  summary: string | null;
  createdAt: Date;
}

export interface AvailabilitySlot {
  id: string;
  userId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface BookingLink {
  id: string;
  userId: string;
  slug: string;
  duration: number;
  isActive: boolean;
}

export interface EmailTemplate {
  id: string;
  userId: string;
  name: string;
  subject: string;
  body: string;
  trigger: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyResearch {
  id: string;
  companyId: string;
  website: string | null;
  description: string | null;
  industry: string | null;
  size: string | null;
  founded: string | null;
  techStack: string[];
  recentNews: Record<string, unknown> | null;
  glassdoor: Record<string, unknown> | null;
  lastUpdated: Date;
}

export interface InterviewPrep {
  id: string;
  companyId: string;
  type: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Offer {
  id: string;
  companyId: string;
  baseSalary: number | null;
  equity: string | null;
  equityValue: number | null;
  signingBonus: number | null;
  annualBonus: number | null;
  bonusTarget: string | null;
  benefits: Record<string, unknown> | null;
  startDate: Date | null;
  deadline: Date | null;
  status: OfferStatus;
  notes: string | null;
  negotiationNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityLog {
  id: string;
  userId: string;
  companyId: string | null;
  action: string;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
}

export interface WellnessCheckIn {
  id: string;
  userId: string;
  mood: number;
  energy: number;
  notes: string | null;
  date: Date;
}

export interface Document {
  id: string;
  userId: string;
  companyId: string | null;
  title: string;
  type: string;
  format: string;
  content: string | null;
  fileUrl: string | null;
  createdAt: Date;
}

// =============================================================================
// Composite / Relation Types
// =============================================================================

export interface CompanyWithRelations extends Company {
  userStage: UserStage | null;
  interviews: Interview[];
  emails: Email[];
  research: CompanyResearch | null;
  interviewPreps: InterviewPrep[];
  offers: Offer[];
}

export interface InterviewWithCompany extends Interview {
  company: Company;
}

export interface OfferWithCompany extends Offer {
  company: Company;
}

export interface ActivityLogWithCompany extends ActivityLog {
  company: Company | null;
}

// =============================================================================
// UI Types
// =============================================================================

export interface SidebarNavItem {
  title: string;
  href: string;
  icon?: string;
  badge?: string | number;
  disabled?: boolean;
  children?: SidebarNavItem[];
}

export type Theme = 'light' | 'dark' | 'system';

// =============================================================================
// API / Form Types
// =============================================================================

export interface CreateCompanyInput {
  name: string;
  jobTitle?: string;
  website?: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  priority?: Priority;
  recruiterName?: string;
  recruiterEmail?: string;
  notes?: string;
  jobUrl?: string;
  appliedDate?: Date;
  userStageId?: string;
}

export interface UpdateCompanyInput extends Partial<CreateCompanyInput> {
  lastActivityDate?: Date;
}

export interface CreateInterviewInput {
  companyId: string;
  title: string;
  scheduledAt: Date;
  duration?: number;
  type?: InterviewType;
  meetingType?: MeetingType;
  meetingLink?: string;
  location?: string;
  interviewerName?: string;
  interviewerRole?: string;
  interviewerLinkedIn?: string;
  notes?: string;
}

export interface CreateOfferInput {
  companyId: string;
  baseSalary?: number;
  equity?: string;
  equityValue?: number;
  signingBonus?: number;
  annualBonus?: number;
  bonusTarget?: string;
  benefits?: Record<string, unknown>;
  startDate?: Date;
  deadline?: Date;
  status?: OfferStatus;
  notes?: string;
  negotiationNotes?: string;
}

export interface WellnessCheckInInput {
  mood: number;
  energy: number;
  notes?: string;
  date: Date;
}
