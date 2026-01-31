# Interview Manager V2 - Development Kanban

## Backlog

### Polish & Enhancements
- [ ] Wire up AI Actions in email-thread.tsx (Summarize, Classify, Suggest Reply use real hooks)
- [ ] Wire ReplyCompose to use useReplyEmail + useGenerateReply hooks
- [ ] Add booking link management UI to settings page
- [ ] Run Prisma migration for schema changes (AvailabilitySlot + BookingLink fields)
- [ ] Replace MOCK_USER_ID with real Clerk auth across all API routes
- [ ] Make dashboard page use real data instead of hardcoded demo

---

## In Progress

---

## Done

### Pipeline Fixes
- [x] Rewrite pipeline page to use real KanbanBoard, TableView, PipelineStats components
- [x] Remove timeline view references from store and toolbar
- [x] Create /companies list route (redirect to /pipeline)
- [x] Create useUserStages hook + stages API integration

### Confetti Celebrations
- [x] Port stage advancement detection logic to lib/stages.ts (CELEBRATION_STAGES, STAGE_ORDER, isStageAdvancement)
- [x] Create useConfetti hook (canvas-confetti with dual-burst animation)
- [x] Integrate confetti into KanbanBoard drag-end + move-to-stage handlers

### Email Integration + AI Detection
- [x] Port Google OAuth helpers to lib/google.ts (Gmail + Calendar API)
- [x] Create AI server functions in lib/ai-server.ts (detectCompanyFromEmail, generateEmailReply, summarizeEmail)
- [x] Create Google OAuth routes (api/auth/google + callback)
- [x] Rewrite email sync API with Gmail integration + AI recruiter detection
- [x] Add send/reply/mark_read/link_company/create_company/generate_reply actions to email API
- [x] Rewrite use-emails hook with TransformedEmail type + all new mutations
- [x] Fix type errors across email-list.tsx, email-thread.tsx, emails/page.tsx

### Booking Links
- [x] Update Prisma schema (title, description, meetingType on BookingLink; isActive, timezone on AvailabilitySlot)
- [x] Create booking API route (api/book/[slug]) - availability calc + calendar event creation
- [x] Create availability API route (api/availability) - CRUD with bulk upsert
- [x] Create bookings management API (api/bookings) - list, create, update
- [x] Create public booking page (app/book/[slug]) - 4-step wizard

### Onboarding + Tour
- [x] Create /api/user/onboarding-complete endpoint (saves profile, stages, marks onboarding done)
- [x] Update onboarding wizard to redirect with ?welcome=true and clear tour flag
- [x] Create Tour component (tooltip-based guided walkthrough with 4 steps)
- [x] Add data-tour attributes to sidebar nav links (pipeline, emails, settings)
- [x] Add data-tour attribute to Add Company button in pipeline toolbar
- [x] Wire tour into dashboard page (useSearchParams + localStorage check)
- [x] Create useOnboardingCheck hook (redirects to /onboarding if not completed)
- [x] Integrate onboarding check into dashboard layout

---

## Notes & Ideas
<!-- Drop your notes here anytime - feature ideas, bugs, things to revisit -->

- The onboarding wizard already existed in v2 (5-step: Welcome, Profile, Pipeline, Integrations, Ready) - just needed the API endpoint and tour wiring
- V1 had 4-step onboarding with Availability and Booking Link steps - v2's pipeline customization step is a good replacement
- All email hooks now return `{ emails: TransformedEmail[], isDemo?: boolean }` format
- Tour positions use "right" for sidebar items since sidebar is on the left side
