"use client";

import { cn, formatDate } from '@/lib/utils';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { CompanyResearch as CompanyResearchType } from '@/types';
import {
  FiGlobe,
  FiUsers,
  FiCalendar,
  FiCpu,
  FiBookOpen,
  FiStar,
  FiSearch,
  FiZap,
} from 'react-icons/fi';

// =============================================================================
// CompanyResearch -- Research panel showing auto-gathered intelligence
// =============================================================================

interface CompanyResearchProps {
  research: CompanyResearchType | null;
}

// Helper to safely extract glassdoor data
interface GlassdoorData {
  rating?: number;
  reviews?: number;
  ceoApproval?: string;
  recommend?: string;
}

function parseGlassdoor(
  raw: Record<string, unknown> | null
): GlassdoorData | null {
  if (!raw) return null;
  return {
    rating: typeof raw.rating === 'number' ? raw.rating : undefined,
    reviews: typeof raw.reviews === 'number' ? raw.reviews : undefined,
    ceoApproval:
      typeof raw.ceoApproval === 'string' ? raw.ceoApproval : undefined,
    recommend:
      typeof raw.recommend === 'string' ? raw.recommend : undefined,
  };
}

// Helper to safely extract news items
interface NewsItem {
  title: string;
  url?: string;
  date?: string;
  source?: string;
}

function parseNews(raw: Record<string, unknown> | null): NewsItem[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.filter(
      (item): item is NewsItem =>
        typeof item === 'object' && item !== null && typeof (item as NewsItem).title === 'string'
    );
  }
  if (Array.isArray((raw as Record<string, unknown>).items)) {
    return ((raw as Record<string, unknown>).items as unknown[]).filter(
      (item): item is NewsItem =>
        typeof item === 'object' && item !== null && typeof (item as NewsItem).title === 'string'
    );
  }
  return [];
}

// -- Empty State --------------------------------------------------------------

function EmptyResearchState() {
  return (
    <Card>
      <CardContent className="py-12">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-500/10 mb-4">
            <FiSearch className="h-6 w-6 text-indigo-400" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-200 mb-1">
            No research available
          </h3>
          <p className="text-xs text-zinc-500 mb-4 max-w-[260px]">
            Gather intelligence about this company including tech stack, news,
            and employee reviews.
          </p>
          <Button size="sm" iconLeft={<FiSearch className="h-3.5 w-3.5" />}>
            Research Company
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// -- AI Badge -----------------------------------------------------------------

function AiBadge() {
  return (
    <Badge variant="info" size="sm">
      <FiZap className="h-3 w-3" />
      AI
    </Badge>
  );
}

// -- Main Component -----------------------------------------------------------

export function CompanyResearch({ research }: CompanyResearchProps) {
  if (!research) {
    return <EmptyResearchState />;
  }

  const glassdoor = parseGlassdoor(research.glassdoor);
  const news = parseNews(research.recentNews);
  const hasTechStack = research.techStack && research.techStack.length > 0;
  const hasOverview =
    research.description || research.industry || research.size || research.founded;

  return (
    <div className="space-y-4">
      {/* Overview Section */}
      {hasOverview && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiGlobe className="h-4 w-4 text-zinc-400" />
                <CardTitle>Overview</CardTitle>
              </div>
              <AiBadge />
            </div>
          </CardHeader>
          <CardContent>
            {research.description && (
              <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                {research.description}
              </p>
            )}
            <div className="grid grid-cols-2 gap-3">
              {research.industry && (
                <div className="flex items-center gap-2">
                  <FiBookOpen className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                  <div>
                    <span className="text-[10px] text-zinc-600 uppercase tracking-wider font-medium">
                      Industry
                    </span>
                    <p className="text-xs text-zinc-300">{research.industry}</p>
                  </div>
                </div>
              )}
              {research.size && (
                <div className="flex items-center gap-2">
                  <FiUsers className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                  <div>
                    <span className="text-[10px] text-zinc-600 uppercase tracking-wider font-medium">
                      Company Size
                    </span>
                    <p className="text-xs text-zinc-300">{research.size}</p>
                  </div>
                </div>
              )}
              {research.founded && (
                <div className="flex items-center gap-2">
                  <FiCalendar className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                  <div>
                    <span className="text-[10px] text-zinc-600 uppercase tracking-wider font-medium">
                      Founded
                    </span>
                    <p className="text-xs text-zinc-300">{research.founded}</p>
                  </div>
                </div>
              )}
              {research.website && (
                <div className="flex items-center gap-2">
                  <FiGlobe className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                  <div>
                    <span className="text-[10px] text-zinc-600 uppercase tracking-wider font-medium">
                      Website
                    </span>
                    <p className="text-xs text-indigo-400 truncate">
                      {research.website}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tech Stack Section */}
      {hasTechStack && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiCpu className="h-4 w-4 text-zinc-400" />
                <CardTitle>Tech Stack</CardTitle>
              </div>
              <AiBadge />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {research.techStack.map((tech) => (
                <Badge key={tech} variant="primary" size="sm">
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent News Section */}
      {news.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiBookOpen className="h-4 w-4 text-zinc-400" />
                <CardTitle>Recent News</CardTitle>
              </div>
              <AiBadge />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {news.map((item, i) => (
                <div
                  key={i}
                  className={cn(
                    'pb-3',
                    i < news.length - 1 && 'border-b border-zinc-800/60'
                  )}
                >
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-zinc-200 hover:text-indigo-400 transition-colors"
                    >
                      {item.title}
                    </a>
                  ) : (
                    <p className="text-sm text-zinc-200">{item.title}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    {item.source && (
                      <span className="text-[10px] text-zinc-500">
                        {item.source}
                      </span>
                    )}
                    {item.date && (
                      <span className="text-[10px] text-zinc-600">
                        {formatDate(item.date)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Glassdoor Section */}
      {glassdoor && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiStar className="h-4 w-4 text-zinc-400" />
                <CardTitle>Glassdoor</CardTitle>
              </div>
              <AiBadge />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {glassdoor.rating != null && (
                <div>
                  <span className="text-[10px] text-zinc-600 uppercase tracking-wider font-medium">
                    Rating
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-lg font-bold text-zinc-100">
                      {glassdoor.rating.toFixed(1)}
                    </span>
                    <span className="text-xs text-zinc-500">/ 5.0</span>
                  </div>
                </div>
              )}
              {glassdoor.reviews != null && (
                <div>
                  <span className="text-[10px] text-zinc-600 uppercase tracking-wider font-medium">
                    Reviews
                  </span>
                  <p className="text-lg font-bold text-zinc-100 mt-0.5">
                    {glassdoor.reviews.toLocaleString()}
                  </p>
                </div>
              )}
              {glassdoor.ceoApproval != null && (
                <div>
                  <span className="text-[10px] text-zinc-600 uppercase tracking-wider font-medium">
                    CEO Approval
                  </span>
                  <p className="text-sm font-semibold text-emerald-400 mt-0.5">
                    {glassdoor.ceoApproval}
                  </p>
                </div>
              )}
              {glassdoor.recommend != null && (
                <div>
                  <span className="text-[10px] text-zinc-600 uppercase tracking-wider font-medium">
                    Recommend
                  </span>
                  <p className="text-sm font-semibold text-emerald-400 mt-0.5">
                    {glassdoor.recommend}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Last updated */}
      {research.lastUpdated && (
        <CardDescription className="text-center">
          Last updated: {formatDate(research.lastUpdated)}
        </CardDescription>
      )}
    </div>
  );
}
