import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { DEFAULT_STAGES } from '@/lib/stages';

const MOCK_USER_ID = 'mock-user-id';

// =============================================================================
// Analytics API Types
// =============================================================================

interface StageCount {
  stageKey: string;
  stageName: string;
  color: string;
  count: number;
}

interface SalaryData {
  company: string;
  min: number;
  max: number;
}

interface MonthlyCount {
  month: string;
  count: number;
}

interface ActivityDay {
  date: string;
  count: number;
}

export interface AnalyticsData {
  companiesByStage: StageCount[];
  totalCompanies: number;
  totalInterviews: number;
  avgResponseDays: number;
  offerRate: number;
  applicationsOverTime: MonthlyCount[];
  salaryData: SalaryData[];
  activityByDate: ActivityDay[];
}

// =============================================================================
// GET /api/analytics — aggregate pipeline stats
// =============================================================================

export async function GET() {
  try {
    // Fetch all companies with relations for the user
    const companies = await db.company.findMany({
      where: { userId: MOCK_USER_ID },
      include: {
        userStage: true,
        interviews: true,
        offers: true,
      },
    });

    // Fetch activity logs for the last 12 weeks
    const twelveWeeksAgo = new Date();
    twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84);

    const activityLogs = await db.activityLog.findMany({
      where: {
        userId: MOCK_USER_ID,
        createdAt: { gte: twelveWeeksAgo },
      },
      orderBy: { createdAt: 'asc' },
    });

    // -------------------------------------------------------------------------
    // Companies by stage
    // -------------------------------------------------------------------------
    const stageCountMap: Record<string, number> = {};
    for (const company of companies) {
      const key = company.userStage?.stageKey ?? 'UNKNOWN';
      stageCountMap[key] = (stageCountMap[key] ?? 0) + 1;
    }

    const companiesByStage: StageCount[] = DEFAULT_STAGES
      .filter((stage) => (stageCountMap[stage.key] ?? 0) > 0)
      .map((stage) => ({
        stageKey: stage.key,
        stageName: stage.name,
        color: stage.color,
        count: stageCountMap[stage.key] ?? 0,
      }));

    // -------------------------------------------------------------------------
    // Total stats
    // -------------------------------------------------------------------------
    const totalCompanies = companies.length;
    const totalInterviews = companies.reduce(
      (sum, c) => sum + c.interviews.length,
      0
    );

    // Offer rate: companies with offers / total companies
    const companiesWithOffers = companies.filter(
      (c) => c.offers.length > 0
    ).length;
    const offerRate =
      totalCompanies > 0
        ? Math.round((companiesWithOffers / totalCompanies) * 100)
        : 0;

    // Average response time: days between appliedDate and first interview
    let totalResponseDays = 0;
    let responseCount = 0;
    for (const company of companies) {
      if (company.appliedDate && company.interviews.length > 0) {
        const applied = new Date(company.appliedDate).getTime();
        const firstInterview = new Date(
          company.interviews[0].scheduledAt
        ).getTime();
        const days = Math.max(
          0,
          Math.round((firstInterview - applied) / (1000 * 60 * 60 * 24))
        );
        totalResponseDays += days;
        responseCount++;
      }
    }
    const avgResponseDays =
      responseCount > 0 ? Math.round(totalResponseDays / responseCount) : 0;

    // -------------------------------------------------------------------------
    // Applications over time (monthly)
    // -------------------------------------------------------------------------
    const monthlyMap: Record<string, number> = {};
    for (const company of companies) {
      const date = company.appliedDate ?? company.createdAt;
      const d = new Date(date);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthlyMap[monthKey] = (monthlyMap[monthKey] ?? 0) + 1;
    }

    const applicationsOverTime: MonthlyCount[] = Object.entries(monthlyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month, count }));

    // -------------------------------------------------------------------------
    // Salary data
    // -------------------------------------------------------------------------
    const salaryData: SalaryData[] = companies
      .filter((c) => c.salaryMin != null || c.salaryMax != null)
      .map((c) => ({
        company: c.name,
        min: c.salaryMin ?? 0,
        max: c.salaryMax ?? 0,
      }))
      .sort((a, b) => b.max - a.max);

    // -------------------------------------------------------------------------
    // Activity by date (last 12 weeks)
    // -------------------------------------------------------------------------
    const activityMap: Record<string, number> = {};

    // Initialize all 84 days with 0
    for (let i = 0; i < 84; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (83 - i));
      const key = d.toISOString().split('T')[0];
      activityMap[key] = 0;
    }

    // Count activity logs
    for (const log of activityLogs) {
      const key = new Date(log.createdAt).toISOString().split('T')[0];
      if (activityMap[key] !== undefined) {
        activityMap[key]++;
      }
    }

    // Also count company updates and interview creation as activity
    for (const company of companies) {
      const updatedKey = new Date(company.updatedAt).toISOString().split('T')[0];
      if (activityMap[updatedKey] !== undefined) {
        activityMap[updatedKey]++;
      }
      for (const interview of company.interviews) {
        const createdKey = new Date(interview.createdAt).toISOString().split('T')[0];
        if (activityMap[createdKey] !== undefined) {
          activityMap[createdKey]++;
        }
      }
    }

    const activityByDate: ActivityDay[] = Object.entries(activityMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));

    // -------------------------------------------------------------------------
    // Response
    // -------------------------------------------------------------------------
    const data: AnalyticsData = {
      companiesByStage,
      totalCompanies,
      totalInterviews,
      avgResponseDays,
      offerRate,
      applicationsOverTime,
      salaryData,
      activityByDate,
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('GET /api/analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
