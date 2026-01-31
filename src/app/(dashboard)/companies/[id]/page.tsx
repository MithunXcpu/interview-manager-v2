import { CompanyDetail } from '@/components/company/company-detail';

// =============================================================================
// Company Detail Page — Server Component wrapper
// =============================================================================

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <CompanyDetail companyId={id} />;
}
