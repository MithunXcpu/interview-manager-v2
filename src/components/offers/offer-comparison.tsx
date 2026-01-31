"use client";

import { useMemo } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { OfferWithCompany } from "@/types";

// =============================================================================
// Offer Comparison — side-by-side comparison of 2-3 offers
// =============================================================================

interface OfferComparisonProps {
  offers: OfferWithCompany[];
  className?: string;
}

interface ComparisonRow {
  label: string;
  key: string;
  getValue: (offer: OfferWithCompany) => number | null;
}

const comparisonRows: ComparisonRow[] = [
  {
    label: "Base Salary",
    key: "baseSalary",
    getValue: (o) => o.baseSalary,
  },
  {
    label: "Equity (Annual)",
    key: "equityValue",
    getValue: (o) => o.equityValue,
  },
  {
    label: "Signing Bonus",
    key: "signingBonus",
    getValue: (o) => o.signingBonus,
  },
  {
    label: "Annual Bonus",
    key: "annualBonus",
    getValue: (o) => o.annualBonus,
  },
];

function getTotalComp(offer: OfferWithCompany): number {
  return (
    (offer.baseSalary ?? 0) +
    (offer.equityValue ?? 0) +
    (offer.signingBonus ?? 0) +
    (offer.annualBonus ?? 0)
  );
}

export function OfferComparison({ offers, className }: OfferComparisonProps) {
  const displayOffers = offers.slice(0, 3);

  // For each row, determine which offer has the best (highest) value
  const bestIndices = useMemo(() => {
    const result: Record<string, number> = {};

    for (const row of comparisonRows) {
      let bestIdx = -1;
      let bestVal = -1;
      displayOffers.forEach((offer, idx) => {
        const val = row.getValue(offer);
        if (val !== null && val > bestVal) {
          bestVal = val;
          bestIdx = idx;
        }
      });
      result[row.key] = bestIdx;
    }

    // Total comp best
    let bestTotalIdx = -1;
    let bestTotal = -1;
    displayOffers.forEach((offer, idx) => {
      const total = getTotalComp(offer);
      if (total > bestTotal) {
        bestTotal = total;
        bestTotalIdx = idx;
      }
    });
    result["totalComp"] = bestTotalIdx;

    return result;
  }, [displayOffers]);

  if (displayOffers.length === 0) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Offer Comparison</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left text-xs font-medium text-zinc-500 px-5 py-3 w-40">
                  Component
                </th>
                {displayOffers.map((offer) => (
                  <th
                    key={offer.id}
                    className="text-left text-xs font-medium text-zinc-300 px-5 py-3"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-zinc-100 font-semibold">
                        {offer.company.name}
                      </span>
                      {offer.company.jobTitle && (
                        <span className="text-zinc-500 font-normal">
                          {offer.company.jobTitle}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr
                  key={row.key}
                  className="border-b border-zinc-800/60 hover:bg-zinc-800/20 transition-colors"
                >
                  <td className="text-xs text-zinc-400 px-5 py-3 font-medium">
                    {row.label}
                  </td>
                  {displayOffers.map((offer, idx) => {
                    const val = row.getValue(offer);
                    const isBest = bestIndices[row.key] === idx && val !== null && val > 0;
                    return (
                      <td key={offer.id} className="px-5 py-3">
                        <span
                          className={cn(
                            "text-sm font-mono tabular-nums",
                            isBest
                              ? "text-emerald-400 font-semibold"
                              : val !== null
                              ? "text-zinc-200"
                              : "text-zinc-600"
                          )}
                        >
                          {val !== null ? formatCurrency(val) : "--"}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Benefits row */}
              <tr className="border-b border-zinc-800/60 hover:bg-zinc-800/20 transition-colors">
                <td className="text-xs text-zinc-400 px-5 py-3 font-medium">
                  Benefits
                </td>
                {displayOffers.map((offer) => (
                  <td key={offer.id} className="px-5 py-3">
                    {offer.benefits &&
                    Object.keys(offer.benefits).length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {Object.keys(offer.benefits)
                          .slice(0, 3)
                          .map((key) => (
                            <Badge key={key} size="sm" variant="default">
                              {key}
                            </Badge>
                          ))}
                        {Object.keys(offer.benefits).length > 3 && (
                          <Badge size="sm" variant="default">
                            +{Object.keys(offer.benefits).length - 3}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-zinc-600">--</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Total Comp row */}
              <tr className="bg-zinc-800/30">
                <td className="text-xs text-zinc-200 px-5 py-3 font-semibold">
                  Total Comp
                </td>
                {displayOffers.map((offer, idx) => {
                  const total = getTotalComp(offer);
                  const isBest = bestIndices["totalComp"] === idx && total > 0;
                  return (
                    <td key={offer.id} className="px-5 py-3">
                      <span
                        className={cn(
                          "text-sm font-mono tabular-nums font-bold",
                          isBest ? "text-emerald-400" : "text-zinc-100"
                        )}
                      >
                        {total > 0 ? formatCurrency(total) : "--"}
                      </span>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
