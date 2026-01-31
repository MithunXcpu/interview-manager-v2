"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_STAGES, type StageDefinition } from "@/lib/stages";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { FiArrowLeft, FiArrowRight, FiCheck, FiExternalLink } from "react-icons/fi";
import confetti from "canvas-confetti";

// ---------------------------------------------------------------------------
// Onboarding Wizard -- 5-step multi-step wizard
// ---------------------------------------------------------------------------

const STEPS = [
  { id: 1, label: "Welcome" },
  { id: 2, label: "Profile" },
  { id: 3, label: "Pipeline" },
  { id: 4, label: "Integrations" },
  { id: 5, label: "Ready" },
] as const;

const TIMEZONE_OPTIONS = [
  { label: "UTC (Coordinated Universal Time)", value: "UTC" },
  { label: "America/New_York (Eastern)", value: "America/New_York" },
  { label: "America/Chicago (Central)", value: "America/Chicago" },
  { label: "America/Denver (Mountain)", value: "America/Denver" },
  { label: "America/Los_Angeles (Pacific)", value: "America/Los_Angeles" },
  { label: "America/Anchorage (Alaska)", value: "America/Anchorage" },
  { label: "Pacific/Honolulu (Hawaii)", value: "Pacific/Honolulu" },
  { label: "Europe/London (GMT)", value: "Europe/London" },
  { label: "Europe/Berlin (Central Europe)", value: "Europe/Berlin" },
  { label: "Europe/Paris (Central Europe)", value: "Europe/Paris" },
  { label: "Asia/Tokyo (Japan)", value: "Asia/Tokyo" },
  { label: "Asia/Shanghai (China)", value: "Asia/Shanghai" },
  { label: "Asia/Kolkata (India)", value: "Asia/Kolkata" },
  { label: "Asia/Singapore (Singapore)", value: "Asia/Singapore" },
  { label: "Australia/Sydney (Australia Eastern)", value: "Australia/Sydney" },
];

interface StageConfig extends StageDefinition {
  isEnabled: boolean;
}

export function OnboardingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleting, setIsCompleting] = useState(false);
  const confettiFired = useRef(false);

  // Step 2 state -- profile
  const [name, setName] = useState("");
  const [timezone, setTimezone] = useState("America/Los_Angeles");

  // Step 3 state -- pipeline stages
  const [stages, setStages] = useState<StageConfig[]>(
    DEFAULT_STAGES.map((s) => ({ ...s, isEnabled: true }))
  );

  // Step 4 state -- integrations
  const [googleSkipped, setGoogleSkipped] = useState(false);

  // Fire confetti on step 5
  useEffect(() => {
    if (currentStep === 5 && !confettiFired.current) {
      confettiFired.current = true;
      // Small delay for the card to render
      const timeout = setTimeout(() => {
        void confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.55 },
          colors: ["#6366f1", "#22d3ee", "#10b981", "#f59e0b", "#ef4444"],
        });
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [currentStep]);

  const handleNext = useCallback(() => {
    if (currentStep < 5) {
      setCurrentStep((s) => s + 1);
    }
  }, [currentStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  const handleToggleStage = useCallback((key: string) => {
    setStages((prev) =>
      prev.map((s) =>
        s.key === key ? { ...s, isEnabled: !s.isEnabled } : s
      )
    );
  }, []);

  const handleGoogleConnect = useCallback(() => {
    // Placeholder
    window.location.href = "/api/auth/google";
  }, []);

  const handleComplete = useCallback(async () => {
    setIsCompleting(true);
    try {
      await fetch("/api/user/onboarding-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          timezone,
          stages: stages.map((s) => ({
            stageKey: s.key,
            name: s.name,
            emoji: s.emoji,
            color: s.color,
            order: s.order,
            isEnabled: s.isEnabled,
          })),
        }),
      });

      // Clear tour flag so the dashboard tour triggers
      if (typeof window !== "undefined") {
        localStorage.removeItem("hasSeenDashboardTour");
      }

      router.push("/dashboard?welcome=true");
    } catch {
      toast.error("Something went wrong. Redirecting to dashboard...");
      router.push("/dashboard");
    }
  }, [name, timezone, stages, router]);

  // Progress percentage
  const progressPercent = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-zinc-500">
            Step {currentStep} of {STEPS.length}
          </span>
          <span className="text-xs text-zinc-600">
            {STEPS[currentStep - 1].label}
          </span>
        </div>
        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Step content card */}
      <Card className="border-zinc-800/80 bg-zinc-900/70 backdrop-blur-sm">
        <CardContent className="p-8">
          {/* Step 1: Welcome */}
          {currentStep === 1 && (
            <div className="text-center py-6">
              {/* Animated S logo */}
              <div className="relative inline-flex mb-6">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-cyan-400/20 blur-xl animate-pulse" />
                <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-xl shadow-indigo-500/25">
                  <span className="text-3xl font-bold text-white tracking-tight">
                    S
                  </span>
                </div>
              </div>

              <h1 className="text-2xl font-bold text-zinc-100 tracking-tight mb-2">
                Welcome to Signal
              </h1>
              <p className="text-sm text-zinc-500 leading-relaxed max-w-sm mx-auto mb-8">
                Your intelligent interview pipeline manager. Track companies,
                schedule interviews, and land your dream job -- all in one place.
              </p>

              <Button onClick={handleNext} size="lg">
                Get Started
                <FiArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}

          {/* Step 2: Profile */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-lg font-bold text-zinc-100 tracking-tight mb-1">
                Set Up Your Profile
              </h2>
              <p className="text-sm text-zinc-500 mb-6">
                Tell us a little about yourself to personalize your experience.
              </p>

              <div className="space-y-5">
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <Select
                  label="Timezone"
                  options={TIMEZONE_OPTIONS}
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 3: Pipeline */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-lg font-bold text-zinc-100 tracking-tight mb-1">
                Customize Your Pipeline
              </h2>
              <p className="text-sm text-zinc-500 mb-6">
                Toggle stages on or off to match your interview process. You can change this later in Settings.
              </p>

              <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1 -mr-1">
                {stages.map((stage) => (
                  <div
                    key={stage.key}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg",
                      "border border-zinc-800/40",
                      "transition-all duration-150",
                      !stage.isEnabled && "opacity-50"
                    )}
                  >
                    <span className="text-base shrink-0 w-6 text-center">
                      {stage.emoji}
                    </span>
                    <span className="flex-1 text-sm font-medium text-zinc-200 truncate">
                      {stage.name}
                    </span>
                    <div
                      className="w-3 h-3 rounded-full shrink-0 ring-1 ring-white/10"
                      style={{ backgroundColor: stage.color }}
                    />
                    <Toggle
                      size="sm"
                      pressed={stage.isEnabled}
                      onPressedChange={() => handleToggleStage(stage.key)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Integrations */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-lg font-bold text-zinc-100 tracking-tight mb-1">
                Connect Your Accounts
              </h2>
              <p className="text-sm text-zinc-500 mb-6">
                Sync your calendar and email for a seamless experience. You can skip this and connect later.
              </p>

              {/* Google integration card */}
              <div className="rounded-xl border border-zinc-800/60 bg-zinc-800/30 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-800/80 border border-zinc-700/50">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-100">
                      Google Account
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Calendar, Gmail, Google Meet
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleGoogleConnect}
                    iconRight={<FiExternalLink className="w-3 h-3" />}
                  >
                    Connect Google
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setGoogleSkipped(true);
                      handleNext();
                    }}
                  >
                    Skip for now
                  </Button>
                </div>

                {googleSkipped && (
                  <p className="text-[11px] text-zinc-600 mt-2">
                    You can connect Google anytime from Settings &rarr; Integrations.
                  </p>
                )}
              </div>

              {/* Future integrations */}
              <div className="mt-4 flex gap-2">
                <Badge variant="info" size="sm">
                  LinkedIn -- Coming Soon
                </Badge>
                <Badge variant="info" size="sm">
                  GitHub -- Coming Soon
                </Badge>
              </div>
            </div>
          )}

          {/* Step 5: Ready */}
          {currentStep === 5 && (
            <div className="text-center py-6">
              {/* Animated check with CSS confetti ring */}
              <div className="relative inline-flex mb-6">
                {/* Confetti ring animation */}
                <div className="absolute inset-0 rounded-full border-2 border-emerald-400/40 animate-ping" />
                <div className="absolute -inset-3 rounded-full bg-emerald-500/10 animate-pulse" />
                <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-xl shadow-emerald-500/25">
                  <FiCheck className="w-8 h-8 text-white" strokeWidth={3} />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-zinc-100 tracking-tight mb-2">
                You&apos;re All Set!
              </h1>
              <p className="text-sm text-zinc-500 leading-relaxed max-w-sm mx-auto mb-8">
                Your interview pipeline is ready. Start adding companies and tracking
                your job search journey.
              </p>

              <Button
                onClick={handleComplete}
                loading={isCompleting}
                size="lg"
              >
                Go to Dashboard
                <FiArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bottom navigation */}
      {currentStep > 1 && currentStep < 5 && (
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            iconLeft={<FiArrowLeft className="w-3.5 h-3.5" />}
          >
            Back
          </Button>

          {/* Step dots indicator */}
          <div className="flex items-center gap-1.5">
            {STEPS.map((step) => (
              <button
                key={step.id}
                onClick={() => {
                  if (step.id <= currentStep) setCurrentStep(step.id);
                }}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-200",
                  step.id === currentStep
                    ? "w-6 bg-indigo-500"
                    : step.id < currentStep
                    ? "bg-indigo-500/40 hover:bg-indigo-500/60 cursor-pointer"
                    : "bg-zinc-700"
                )}
                aria-label={`Go to step ${step.id}: ${step.label}`}
                disabled={step.id > currentStep}
              />
            ))}
          </div>

          <Button
            size="sm"
            onClick={handleNext}
            iconRight={<FiArrowRight className="w-3.5 h-3.5" />}
          >
            Next
          </Button>
        </div>
      )}

      {/* Step 1 bottom dots (no back button) */}
      {currentStep === 1 && (
        <div className="flex items-center justify-center mt-6">
          <div className="flex items-center gap-1.5">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-200",
                  step.id === currentStep
                    ? "w-6 bg-indigo-500"
                    : "bg-zinc-700"
                )}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
