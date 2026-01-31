"use client";

import { useMemo } from "react";
import { FiDollarSign, FiTrendingUp, FiExternalLink } from "react-icons/fi";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { useOffers } from "@/hooks/use-offers";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/shared/empty-state";
import { OfferComparison } from "@/components/offers/offer-comparison";
import { CompCalculator } from "@/components/offers/comp-calculator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { OfferStatus, OfferWithCompany } from "@/types";

// =============================================================================
// Offers Overview Page
// =============================================================================

const statusConfig: Record<
  OfferStatus,
  { label: string; variant: "default" | "primary" | "success" | "warning" | "danger" | "info" }
> = {
  PENDING: { label: "Pending", variant: "warning" },
  NEGOTIATING: { label: "Negotiating", variant: "primary" },
  ACCEPTED: { label: "Accepted", variant: "success" },
  DECLINED: { label: "Declined", variant: "danger" },
  EXPIRED: { label: "Expired", variant: "default" },
};

const statusOrder: OfferStatus[] = [
  "PENDING",
  "NEGOTIATING",
  "ACCEPTED",
  "DECLINED",
  "EXPIRED",
];

function OfferCard({ offer }: { offer: OfferWithCompany }) {
  const total =
    (offer.baseSalary ?? 0) +
    (offer.equityValue ?? 0) +
    (offer.signingBonus ?? 0) +
    (offer.annualBonus ?? 0);

  const config = statusConfig[offer.status];

  return (
    <Card hover className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-base truncate">
              {offer.company.name}
            </CardTitle>
            {offer.company.jobTitle && (
              <p className="text-xs text-zinc-500 mt-0.5 truncate">
                {offer.company.jobTitle}
              </p>
            )}
          </div>
          <Badge variant={config.variant} dot>
            {config.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        {/* Total comp */}
        {total > 0 && (
          <div>
            <p className="text-xs text-zinc-500 mb-0.5">Total Compensation</p>
            <p className="text-xl font-bold font-mono tabular-nums text-zinc-100">
              {formatCurrency(total)}
            </p>
          </div>
        )}

        {/* Breakdown */}
        <div className="space-y-1.5">
          {offer.baseSalary != null && offer.baseSalary > 0 && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Base</span>
              <span className="font-mono tabular-nums text-zinc-300">
                {formatCurrency(offer.baseSalary)}
              </span>
            </div>
          )}
          {offer.equityValue != null && offer.equityValue > 0 && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Equity</span>
              <span className="font-mono tabular-nums text-zinc-300">
                {formatCurrency(offer.equityValue)}
              </span>
            </div>
          )}
          {offer.signingBonus != null && offer.signingBonus > 0 && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Signing</span>
              <span className="font-mono tabular-nums text-zinc-300">
                {formatCurrency(offer.signingBonus)}
              </span>
            </div>
          )}
          {offer.annualBonus != null && offer.annualBonus > 0 && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Bonus</span>
              <span className="font-mono tabular-nums text-zinc-300">
                {formatCurrency(offer.annualBonus)}
              </span>
            </div>
          )}
        </div>

        {/* Deadline */}
        {offer.deadline && (
          <>
            <Separator />
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Deadline</span>
              <span className="text-zinc-300">
                {formatDate(offer.deadline)}
              </span>
            </div>
          </>
        )}

        {/* Notes */}
        {offer.notes && (
          <p className="text-xs text-zinc-500 line-clamp-2">{offer.notes}</p>
        )}
      </CardContent>
    </Card>
  );
}

function TotalCompSummary({ offers }: { offers: OfferWithCompany[] }) {
  const activeOffers = offers.filter(
    (o) => o.status === "PENDING" || o.status === "NEGOTIATING"
  );

  const highest = useMemo(() => {
    if (activeOffers.length === 0) return 0;
    return Math.max(
      ...activeOffers.map(
        (o) =>
          (o.baseSalary ?? 0) +
          (o.equityValue ?? 0) +
          (o.signingBonus ?? 0) +
          (o.annualBonus ?? 0)
      )
    );
  }, [activeOffers]);

  const average = useMemo(() => {
    if (activeOffers.length === 0) return 0;
    const sum = activeOffers.reduce(
      (acc, o) =>
        acc +
        (o.baseSalary ?? 0) +
        (o.equityValue ?? 0) +
        (o.signingBonus ?? 0) +
        (o.annualBonus ?? 0),
      0
    );
    return sum / activeOffers.length;
  }, [activeOffers]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card>
        <CardContent className="py-4">
          <p className="text-xs text-zinc-500 mb-1">Active Offers</p>
          <p className="text-2xl font-bold text-zinc-100">
            {activeOffers.length}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="py-4">
          <p className="text-xs text-zinc-500 mb-1">Highest Total Comp</p>
          <p className="text-2xl font-bold font-mono tabular-nums text-emerald-400">
            {highest > 0 ? formatCurrency(highest) : "--"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="py-4">
          <p className="text-xs text-zinc-500 mb-1">Average Comp</p>
          <p className="text-2xl font-bold font-mono tabular-nums text-cyan-400">
            {average > 0 ? formatCurrency(average) : "--"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function OffersPage() {
  const { data: offers, isLoading } = useOffers();

  const grouped = useMemo((): Record<OfferStatus, OfferWithCompany[]> => {
    const result: Record<OfferStatus, OfferWithCompany[]> = {
      PENDING: [],
      NEGOTIATING: [],
      ACCEPTED: [],
      DECLINED: [],
      EXPIRED: [],
    };
    if (!offers) return result;
    for (const offer of offers) {
      result[offer.status].push(offer);
    }
    return result;
  }, [offers]);

  // Offers suitable for comparison (pending or negotiating)
  const comparableOffers = useMemo(() => {
    if (!offers) return [];
    return offers.filter(
      (o) => o.status === "PENDING" || o.status === "NEGOTIATING"
    );
  }, [offers]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton variant="text" className="w-40 h-7" />
          <Skeleton className="w-28 h-9 rounded-lg" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-zinc-100 tracking-tight leading-tight">
            Offers & Negotiation
          </h1>
          <p className="text-[13px] text-zinc-500 mt-0.5">
            Compare offers and calculate total compensation
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          iconLeft={<FiExternalLink className="w-3.5 h-3.5" />}
          onClick={() => (window.location.href = "/dashboard")}
        >
          Add Offer
        </Button>
      </div>

      {/* Summary stats */}
      {offers && offers.length > 0 && <TotalCompSummary offers={offers} />}

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="compare">Compare</TabsTrigger>
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
        </TabsList>

        {/* Overview tab */}
        <TabsContent value="overview">
          {!offers || offers.length === 0 ? (
            <Card>
              <EmptyState
                icon={<FiDollarSign className="w-5 h-5" />}
                title="No offers yet"
                description="When you receive offers, they'll appear here for comparison and tracking."
                action={
                  <Button
                    size="sm"
                    iconLeft={<FiExternalLink className="w-3.5 h-3.5" />}
                    onClick={() => (window.location.href = "/dashboard")}
                  >
                    Go to Pipeline
                  </Button>
                }
              />
            </Card>
          ) : (
            <div className="space-y-8">
              {statusOrder.map((status) => {
                const items = grouped[status];
                if (!items || items.length === 0) return null;
                const config = statusConfig[status];
                return (
                  <div key={status}>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant={config.variant} dot>
                        {config.label}
                      </Badge>
                      <span className="text-xs text-zinc-600">
                        {items.length} offer{items.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {items.map((offer) => (
                        <OfferCard key={offer.id} offer={offer} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Compare tab */}
        <TabsContent value="compare">
          {comparableOffers.length >= 2 ? (
            <OfferComparison offers={comparableOffers} />
          ) : (
            <Card>
              <EmptyState
                icon={<FiTrendingUp className="w-5 h-5" />}
                title="Need at least 2 offers to compare"
                description="Add pending or negotiating offers to see a side-by-side comparison."
              />
            </Card>
          )}
        </TabsContent>

        {/* Calculator tab */}
        <TabsContent value="calculator">
          <CompCalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
