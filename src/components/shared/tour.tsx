"use client";

import { useState, useEffect, useCallback } from "react";

// ---------------------------------------------------------------------------
// Tour -- tooltip-based guided walkthrough for new users
// ---------------------------------------------------------------------------

interface TourStep {
  target: string;
  title: string;
  content: string;
  position: "top" | "bottom" | "left" | "right";
}

const TOUR_STEPS: TourStep[] = [
  {
    target: "[data-tour='pipeline']",
    title: "Your Interview Pipeline",
    content:
      "Track all your job applications here. Drag and drop companies between stages as you progress.",
    position: "right",
  },
  {
    target: "[data-tour='add-company']",
    title: "Add Companies",
    content:
      "Click here to add a new company you're applying to. Track job details, recruiter info, and more.",
    position: "bottom",
  },
  {
    target: "[data-tour='nav-emails']",
    title: "Email Integration",
    content:
      "Connect your Gmail to automatically detect recruiter emails and generate AI-powered replies.",
    position: "right",
  },
  {
    target: "[data-tour='nav-settings']",
    title: "Customize Your Experience",
    content:
      "Set up your availability, customize pipeline stages, and configure your booking link.",
    position: "right",
  },
];

interface TourProps {
  onComplete: () => void;
  isActive: boolean;
}

export default function Tour({ onComplete, isActive }: TourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});

  const updatePosition = useCallback(() => {
    if (!isActive) return;

    const step = TOUR_STEPS[currentStep];
    const target = document.querySelector(step.target);

    if (target) {
      const rect = target.getBoundingClientRect();
      const style: React.CSSProperties = {
        position: "fixed",
        zIndex: 10001,
      };

      switch (step.position) {
        case "bottom":
          style.top = rect.bottom + 12;
          style.left = rect.left + rect.width / 2;
          style.transform = "translateX(-50%)";
          break;
        case "top":
          style.bottom = window.innerHeight - rect.top + 12;
          style.left = rect.left + rect.width / 2;
          style.transform = "translateX(-50%)";
          break;
        case "left":
          style.top = rect.top + rect.height / 2;
          style.right = window.innerWidth - rect.left + 12;
          style.transform = "translateY(-50%)";
          break;
        case "right":
          style.top = rect.top + rect.height / 2;
          style.left = rect.right + 12;
          style.transform = "translateY(-50%)";
          break;
      }

      setTooltipStyle(style);

      // Remove previous highlights and add to current target
      document.querySelectorAll(".tour-highlight").forEach((el) => {
        el.classList.remove("tour-highlight");
      });
      target.classList.add("tour-highlight");
    }
  }, [currentStep, isActive]);

  useEffect(() => {
    if (!isActive) return;

    updatePosition();
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      document.querySelectorAll(".tour-highlight").forEach((el) => {
        el.classList.remove("tour-highlight");
      });
    };
  }, [updatePosition, isActive]);

  const handleSkip = useCallback(() => {
    document.querySelectorAll(".tour-highlight").forEach((el) => {
      el.classList.remove("tour-highlight");
    });
    onComplete();
  }, [onComplete]);

  const handleNext = useCallback(() => {
    const step = TOUR_STEPS[currentStep];
    const currentTarget = document.querySelector(step.target);
    currentTarget?.classList.remove("tour-highlight");

    if (currentStep === TOUR_STEPS.length - 1) {
      onComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, onComplete]);

  if (!isActive) return null;

  const step = TOUR_STEPS[currentStep];
  const isLastStep = currentStep === TOUR_STEPS.length - 1;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[10000]"
        onClick={handleSkip}
      />

      {/* Tooltip */}
      <div
        style={tooltipStyle}
        className="bg-zinc-900 border border-zinc-700/80 rounded-xl p-4 shadow-2xl shadow-black/40 max-w-xs"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-zinc-500 font-medium">
            Step {currentStep + 1} of {TOUR_STEPS.length}
          </span>
          <button
            onClick={handleSkip}
            className="text-zinc-500 hover:text-zinc-300 text-xs transition-colors"
          >
            Skip tour
          </button>
        </div>
        <h3 className="text-sm font-semibold text-zinc-100 mb-1">
          {step.title}
        </h3>
        <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
          {step.content}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            {TOUR_STEPS.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === currentStep ? "bg-indigo-500" : "bg-zinc-700"
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
          >
            {isLastStep ? "Get Started" : "Next"}
          </button>
        </div>
      </div>

      {/* Tour highlight styles */}
      <style jsx global>{`
        .tour-highlight {
          position: relative;
          z-index: 10001 !important;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.5),
            0 0 16px rgba(99, 102, 241, 0.25) !important;
          border-radius: 8px;
        }
      `}</style>
    </>
  );
}
