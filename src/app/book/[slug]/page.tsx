"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface BookingInfo {
  bookingLink: {
    slug: string;
    title: string;
    description: string | null;
    duration: number;
    meetingType: string;
  };
  host: {
    name: string;
    timezone: string;
  };
  slots: { date: string; times: string[] }[];
}

interface BookingResult {
  success: boolean;
  booking: {
    date: string;
    time: string;
    duration: number;
    title: string;
    hostName: string;
    meetLink?: string;
  };
}

type Step = "date" | "time" | "details" | "confirmed";

export default function BookingPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [data, setData] = useState<BookingInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [step, setStep] = useState<Step>("date");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    notes: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<BookingResult | null>(null);

  useEffect(() => {
    async function fetchAvailability() {
      try {
        const res = await fetch(`/api/book/${slug}`);
        if (!res.ok) {
          setError("Booking link not found or inactive.");
          return;
        }
        const json = await res.json();
        setData(json);
      } catch {
        setError("Failed to load booking page.");
      } finally {
        setLoading(false);
      }
    }
    fetchAvailability();
  }, [slug]);

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !form.name || !form.email) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/book/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate,
          time: selectedTime,
          ...form,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setResult(json);
        setStep("confirmed");
      } else {
        setError(json.error || "Booking failed.");
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const timesForSelectedDate =
    data?.slots.find((s) => s.date === selectedDate)?.times || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-400 text-sm">Loading...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-zinc-100 mb-2">
            Booking Unavailable
          </h1>
          <p className="text-zinc-400 text-sm">
            {error || "This booking link is not available."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-zinc-100">
            {data.bookingLink.title}
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            with {data.host.name} &middot; {data.bookingLink.duration} min
          </p>
          {data.bookingLink.description && (
            <p className="text-zinc-500 text-xs mt-2">
              {data.bookingLink.description}
            </p>
          )}
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 justify-center mb-8">
          {(["date", "time", "details", "confirmed"] as Step[]).map((s, i) => (
            <div
              key={s}
              className={`h-1.5 w-12 rounded-full transition-colors ${
                (["date", "time", "details", "confirmed"] as Step[]).indexOf(
                  step
                ) >= i
                  ? "bg-indigo-500"
                  : "bg-zinc-800"
              }`}
            />
          ))}
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6">
          {/* Step 1: Select Date */}
          {step === "date" && (
            <div>
              <h2 className="text-sm font-semibold text-zinc-200 mb-4">
                Select a Date
              </h2>
              {data.slots.length === 0 ? (
                <p className="text-zinc-500 text-sm">
                  No available dates found.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {data.slots.map((slot) => {
                    const d = new Date(slot.date + "T12:00:00");
                    return (
                      <button
                        key={slot.date}
                        onClick={() => {
                          setSelectedDate(slot.date);
                          setSelectedTime(null);
                          setStep("time");
                        }}
                        className="px-4 py-3 rounded-lg border border-zinc-800 text-left hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-colors"
                      >
                        <div className="text-sm font-medium text-zinc-200">
                          {d.toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        <div className="text-xs text-zinc-500 mt-0.5">
                          {slot.times.length} slots available
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Select Time */}
          {step === "time" && (
            <div>
              <button
                onClick={() => setStep("date")}
                className="text-xs text-indigo-400 hover:text-indigo-300 mb-3 block"
              >
                &larr; Back to dates
              </button>
              <h2 className="text-sm font-semibold text-zinc-200 mb-4">
                Select a Time
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {timesForSelectedDate.map((time) => (
                  <button
                    key={time}
                    onClick={() => {
                      setSelectedTime(time);
                      setStep("details");
                    }}
                    className="px-3 py-2 rounded-lg border border-zinc-800 text-sm text-zinc-200 font-mono hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-colors"
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Details */}
          {step === "details" && (
            <div>
              <button
                onClick={() => setStep("time")}
                className="text-xs text-indigo-400 hover:text-indigo-300 mb-3 block"
              >
                &larr; Back to times
              </button>
              <h2 className="text-sm font-semibold text-zinc-200 mb-4">
                Your Details
              </h2>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Your name *"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-900 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/60"
                />
                <input
                  type="email"
                  placeholder="Your email *"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-900 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/60"
                />
                <input
                  type="text"
                  placeholder="Company (optional)"
                  value={form.company}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, company: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-900 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/60"
                />
                <textarea
                  placeholder="Notes (optional)"
                  value={form.notes}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, notes: e.target.value }))
                  }
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-900 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/60 resize-none"
                />
                <button
                  onClick={handleSubmit}
                  disabled={!form.name || !form.email || submitting}
                  className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-white transition-colors"
                >
                  {submitting ? "Booking..." : "Confirm Booking"}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Confirmed */}
          {step === "confirmed" && result && (
            <div className="text-center py-6">
              <div className="text-3xl mb-3">&#10003;</div>
              <h2 className="text-lg font-bold text-zinc-100 mb-2">
                You&apos;re booked!
              </h2>
              <p className="text-zinc-400 text-sm mb-4">
                {result.booking.title} with {result.booking.hostName}
              </p>
              <div className="bg-zinc-800/50 rounded-lg p-4 text-left space-y-1.5">
                <p className="text-xs text-zinc-400">
                  <span className="text-zinc-500">Date:</span>{" "}
                  {result.booking.date}
                </p>
                <p className="text-xs text-zinc-400">
                  <span className="text-zinc-500">Time:</span>{" "}
                  {result.booking.time}
                </p>
                <p className="text-xs text-zinc-400">
                  <span className="text-zinc-500">Duration:</span>{" "}
                  {result.booking.duration} min
                </p>
                {result.booking.meetLink && (
                  <p className="text-xs">
                    <span className="text-zinc-500">Meet:</span>{" "}
                    <a
                      href={result.booking.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:underline"
                    >
                      Join meeting
                    </a>
                  </p>
                )}
              </div>
              <p className="text-zinc-500 text-xs mt-4">
                A calendar invite has been sent to your email.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
