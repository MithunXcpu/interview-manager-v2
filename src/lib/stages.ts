export interface StageDefinition {
  key: string;
  name: string;
  emoji: string;
  color: string;
  order: number;
}

export const DEFAULT_STAGES: StageDefinition[] = [
  { key: 'WISHLIST', name: 'Wishlist', emoji: '⭐', color: '#a78bfa', order: 0 },
  { key: 'APPLIED', name: 'Applied', emoji: '📤', color: '#60a5fa', order: 1 },
  { key: 'RECRUITER_SCREEN', name: 'Recruiter Screen', emoji: '📞', color: '#34d399', order: 2 },
  { key: 'PHONE_SCREEN', name: 'Phone Screen', emoji: '📱', color: '#2dd4bf', order: 3 },
  { key: 'TECHNICAL', name: 'Technical', emoji: '💻', color: '#818cf8', order: 4 },
  { key: 'SYSTEM_DESIGN', name: 'System Design', emoji: '🏗️', color: '#c084fc', order: 5 },
  { key: 'BEHAVIORAL', name: 'Behavioral', emoji: '🤝', color: '#fb923c', order: 6 },
  { key: 'ONSITE', name: 'Onsite', emoji: '🏢', color: '#f472b6', order: 7 },
  { key: 'TEAM_MATCH', name: 'Team Match', emoji: '👥', color: '#22d3ee', order: 8 },
  { key: 'HIRING_MANAGER', name: 'Hiring Manager', emoji: '👔', color: '#fbbf24', order: 9 },
  { key: 'FINAL_ROUND', name: 'Final Round', emoji: '🎯', color: '#f97316', order: 10 },
  { key: 'OFFER', name: 'Offer', emoji: '🎉', color: '#10b981', order: 11 },
  { key: 'ACCEPTED', name: 'Accepted', emoji: '✅', color: '#22c55e', order: 12 },
  { key: 'REJECTED', name: 'Rejected', emoji: '❌', color: '#ef4444', order: 13 },
  { key: 'DECLINED', name: 'Declined', emoji: '🚫', color: '#6b7280', order: 14 },
];

export function getStageByKey(key: string): StageDefinition | undefined {
  return DEFAULT_STAGES.find((s) => s.key === key);
}

export function getStageColor(key: string): string {
  return getStageByKey(key)?.color ?? '#6b7280';
}

// Celebration stages - trigger confetti
export const CELEBRATION_STAGES = ['OFFER', 'ACCEPTED'];

// Forward progress stages (in order) - used to detect stage advancement
export const STAGE_ORDER = [
  'WISHLIST',
  'APPLIED',
  'RECRUITER_SCREEN',
  'PHONE_SCREEN',
  'TECHNICAL',
  'SYSTEM_DESIGN',
  'BEHAVIORAL',
  'ONSITE',
  'TEAM_MATCH',
  'HIRING_MANAGER',
  'FINAL_ROUND',
  'OFFER',
  'ACCEPTED',
];

// Check if moving from oldStage to newStage is forward progress
export function isStageAdvancement(oldStageKey: string, newStageKey: string): boolean {
  const oldIndex = STAGE_ORDER.indexOf(oldStageKey);
  const newIndex = STAGE_ORDER.indexOf(newStageKey);

  // If either stage is not in the order list (like REJECTED/DECLINED), no celebration
  if (oldIndex === -1 || newIndex === -1) return false;

  return newIndex > oldIndex;
}
