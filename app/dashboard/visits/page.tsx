import { listVisits, getVisitsOverview } from "@/lib/services/visits.service";
import { VisitsPageClient } from "@/components/visits/visits-page-client";
import type { VisitStatus } from "@/lib/types";


type VisitsPageProps = {
  searchParams: Promise<{
    customerId?: string;
    marketerId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: string;
  }>;
};

export default async function VisitsPage({ searchParams }: VisitsPageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const limit = 20;

  const [result, overview] = await Promise.all([
    listVisits({
      customerId: params.customerId,
      marketerId: params.marketerId,
      status: params.status as VisitStatus | undefined,
      startDate: params.startDate ? new Date(params.startDate) : undefined,
      endDate: params.endDate ? new Date(params.endDate) : undefined,
      page,
      limit,
    }),
    getVisitsOverview(),
  ]);

  return (
    <VisitsPageClient
      initialVisits={result.data}
      initialTotal={result.total}
      initialPage={result.page}
      initialLimit={result.limit}
      overview={overview}
    />
  );
}

