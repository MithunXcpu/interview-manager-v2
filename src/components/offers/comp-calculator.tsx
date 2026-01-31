"use client";

import { useState, useMemo } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FiColumns, FiDollarSign } from "react-icons/fi";

// =============================================================================
// Compensation Calculator — real-time total comp with optional comparison mode
// =============================================================================

interface CompValues {
  baseSalary: string;
  equityValue: string;
  signingBonus: string;
  annualBonus: string;
  other: string;
}

const emptyValues: CompValues = {
  baseSalary: "",
  equityValue: "",
  signingBonus: "",
  annualBonus: "",
  other: "",
};

function parseNum(val: string): number {
  const n = parseFloat(val.replace(/[^0-9.]/g, ""));
  return isNaN(n) ? 0 : n;
}

function calcTotal(values: CompValues): number {
  return (
    parseNum(values.baseSalary) +
    parseNum(values.equityValue) +
    parseNum(values.signingBonus) +
    parseNum(values.annualBonus) +
    parseNum(values.other)
  );
}

const fields: { key: keyof CompValues; label: string; hint?: string }[] = [
  { key: "baseSalary", label: "Base Salary" },
  { key: "equityValue", label: "Equity Value (Annual)" },
  { key: "signingBonus", label: "Signing Bonus (Amortized)", hint: "Spread over 1 year" },
  { key: "annualBonus", label: "Annual Bonus" },
  { key: "other", label: "Other Compensation" },
];

interface CompCalculatorProps {
  className?: string;
}

export function CompCalculator({ className }: CompCalculatorProps) {
  const [compareMode, setCompareMode] = useState(false);
  const [valuesA, setValuesA] = useState<CompValues>(emptyValues);
  const [valuesB, setValuesB] = useState<CompValues>(emptyValues);

  const totalA = useMemo(() => calcTotal(valuesA), [valuesA]);
  const totalB = useMemo(() => calcTotal(valuesB), [valuesB]);

  const updateValue = (
    setter: React.Dispatch<React.SetStateAction<CompValues>>,
    key: keyof CompValues,
    value: string
  ) => {
    setter((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <FiDollarSign className="w-4 h-4 text-cyan-400" />
            Compensation Calculator
          </CardTitle>
          <Button
            variant={compareMode ? "primary" : "secondary"}
            size="sm"
            iconLeft={<FiColumns className="w-3.5 h-3.5" />}
            onClick={() => setCompareMode(!compareMode)}
          >
            {compareMode ? "Single Mode" : "Compare"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "grid gap-6",
            compareMode ? "grid-cols-2" : "grid-cols-1 max-w-md"
          )}
        >
          {/* Column A */}
          <div className="space-y-3">
            {compareMode && (
              <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
                Offer A
              </p>
            )}
            {fields.map((field) => (
              <Input
                key={field.key}
                label={field.label}
                hint={field.hint}
                type="text"
                inputMode="numeric"
                placeholder="$0"
                value={valuesA[field.key]}
                onChange={(e) =>
                  updateValue(setValuesA, field.key, e.target.value)
                }
                iconPrefix={
                  <span className="text-xs text-zinc-500">$</span>
                }
              />
            ))}

            <Separator className="my-4" />

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-300">
                Total Compensation
              </span>
              <span className="text-2xl font-bold font-mono tabular-nums text-emerald-400">
                {formatCurrency(totalA)}
              </span>
            </div>
          </div>

          {/* Column B (compare mode) */}
          {compareMode && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
                Offer B
              </p>
              {fields.map((field) => (
                <Input
                  key={field.key}
                  label={field.label}
                  hint={field.hint}
                  type="text"
                  inputMode="numeric"
                  placeholder="$0"
                  value={valuesB[field.key]}
                  onChange={(e) =>
                    updateValue(setValuesB, field.key, e.target.value)
                  }
                  iconPrefix={
                    <span className="text-xs text-zinc-500">$</span>
                  }
                />
              ))}

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-300">
                  Total Compensation
                </span>
                <span className="text-2xl font-bold font-mono tabular-nums text-emerald-400">
                  {formatCurrency(totalB)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Comparison summary */}
        {compareMode && (totalA > 0 || totalB > 0) && (
          <div className="mt-6 p-4 rounded-lg bg-zinc-800/40 border border-zinc-700/40">
            <p className="text-xs font-medium text-zinc-400 mb-2">
              Difference
            </p>
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "text-lg font-bold font-mono tabular-nums",
                  totalA > totalB
                    ? "text-indigo-400"
                    : totalB > totalA
                    ? "text-cyan-400"
                    : "text-zinc-400"
                )}
              >
                {totalA > totalB
                  ? `Offer A +${formatCurrency(totalA - totalB)}`
                  : totalB > totalA
                  ? `Offer B +${formatCurrency(totalB - totalA)}`
                  : "Equal"}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
