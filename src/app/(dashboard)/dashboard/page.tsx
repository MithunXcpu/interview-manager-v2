"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  FiBriefcase, FiCalendar, FiTrendingUp, FiAward,
  FiSend, FiCheckCircle, FiClock, FiMessageSquare,
  FiPhoneCall, FiStar, FiArrowUpRight, FiArrowRight,
} from "react-icons/fi";

const Tour = dynamic(() => import("@/components/shared/tour"), { ssr: false });

// ---------------------------------------------------------------------------
// Demo data
// ---------------------------------------------------------------------------

const quickStats = [
  { label: "Active Applications", value: "12", icon: FiBriefcase, change: "+3 this week", changeType: "up" as const, accentColor: "text-indigo-400", bgColor: "bg-indigo-500/10", borderColor: "border-indigo-500/20" },
  { label: "Interviews This Week", value: "3", icon: FiCalendar, change: "Next: Tomorrow 2pm", changeType: "neutral" as const, accentColor: "text-cyan-400", bgColor: "bg-cyan-500/10", borderColor: "border-cyan-500/20" },
  { label: "Response Rate", value: "34%", icon: FiTrendingUp, change: "+8% vs last month", changeType: "up" as const, accentColor: "text-emerald-400", bgColor: "bg-emerald-500/10", borderColor: "border-emerald-500/20" },
  { label: "Offers Pending", value: "2", icon: FiAward, change: "Decision by Feb 7", changeType: "neutral" as const, accentColor: "text-amber-400", bgColor: "bg-amber-500/10", borderColor: "border-amber-500/20" },
];

const recentActivity = [
  { id: 1, icon: FiSend, iconColor: "text-cyan-400", iconBg: "bg-cyan-500/10", title: "Applied to Google", subtitle: "Software Engineer, L5 \u2014 Mountain View, CA", time: "2 hours ago" },
  { id: 2, icon: FiCalendar, iconColor: "text-indigo-400", iconBg: "bg-indigo-500/10", title: "Interview scheduled at Meta", subtitle: "ML Engineer \u2014 System Design Round", time: "5 hours ago" },
  { id: 3, icon: FiCheckCircle, iconColor: "text-emerald-400", iconBg: "bg-emerald-500/10", title: "Passed screening at Amazon", subtitle: "Technical Program Manager \u2014 Moving to onsite", time: "Yesterday" },
  { id: 4, icon: FiMessageSquare, iconColor: "text-amber-400", iconBg: "bg-amber-500/10", title: "Recruiter message from Stripe", subtitle: "Product Manager role \u2014 Wants to schedule intro call", time: "Yesterday" },
  { id: 5, icon: FiAward, iconColor: "text-emerald-400", iconBg: "bg-emerald-500/10", title: "Offer received from Microsoft", subtitle: "SDE II \u2014 $185k base + $40k RSU/yr", time: "2 days ago" },
  { id: 6, icon: FiPhoneCall, iconColor: "text-indigo-400", iconBg: "bg-indigo-500/10", title: "Completed phone screen at Netflix", subtitle: "Data Engineer \u2014 Awaiting feedback", time: "3 days ago" },
];

const upcomingInterviews = [
  { id: 1, company: "Meta", role: "ML Engineer", round: "System Design", date: "Tomorrow", time: "2:00 PM PST", type: "Virtual", accentColor: "border-l-indigo-500" },
  { id: 2, company: "Amazon", role: "Technical Program Manager", round: "Onsite \u2014 Loop (4 rounds)", date: "Feb 3, 2025", time: "10:00 AM PST", type: "Onsite", accentColor: "border-l-amber-500" },
  { id: 3, company: "Stripe", role: "Product Manager", round: "Intro Call with Recruiter", date: "Feb 5, 2025", time: "11:30 AM PST", type: "Virtual", accentColor: "border-l-cyan-500" },
];

const pipelineSummary = [
  { stage: "Applied", count: 3, dotClass: "stage-dot-applied", accent: "var(--accent-cyan)" },
  { stage: "Screening", count: 2, dotClass: "stage-dot-screening", accent: "var(--accent-indigo)" },
  { stage: "Interview", count: 2, dotClass: "stage-dot-interview", accent: "var(--accent-amber)" },
  { stage: "Offer", count: 1, dotClass: "stage-dot-offer", accent: "var(--accent-emerald)" },
  { stage: "Rejected", count: 1, dotClass: "stage-dot-rejected", accent: "var(--accent-red)" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

const stagger = { visible: { transition: { staggerChildren: 0.06 } } };

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Tour wrapper -- reads ?welcome=true and localStorage
// ---------------------------------------------------------------------------

function TourManager() {
  const searchParams = useSearchParams();
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("hasSeenDashboardTour");
    const isWelcome = searchParams.get("welcome") === "true";

    if (!hasSeenTour || isWelcome) {
      // Small delay so the dashboard renders first
      const timeout = setTimeout(() => setShowTour(true), 800);
      return () => clearTimeout(timeout);
    }
  }, [searchParams]);

  const handleTourComplete = useCallback(() => {
    setShowTour(false);
    localStorage.setItem("hasSeenDashboardTour", "true");
  }, []);

  return <Tour isActive={showTour} onComplete={handleTourComplete} />;
}

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Tour */}
      <Suspense fallback={null}>
        <TourManager />
      </Suspense>

      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }}
      >
        <h1 className="text-[22px] font-bold text-zinc-100 tracking-tight leading-tight">
          Welcome back, Mithun
        </h1>
        <p className="text-[13px] text-zinc-500 mt-0.5">
          Your job search is gaining momentum &mdash; 3 interviews lined up this week.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {quickStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              custom={i}
              variants={fadeUp}
              className={`stat-card group relative overflow-hidden border ${stat.borderColor} hover:border-opacity-60 transition-all duration-200`}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bgColor} rounded-full blur-2xl opacity-30 -translate-y-8 translate-x-8`} />
              <div className="flex items-center justify-between mb-3 relative">
                <span className="stat-card-label">{stat.label}</span>
                <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-4 h-4 ${stat.accentColor}`} />
                </div>
              </div>
              <div className="stat-card-value relative">{stat.value}</div>
              <div className="stat-card-subtitle mt-1.5 relative">
                {stat.changeType === "up" && <FiArrowUpRight className="w-3 h-3 text-emerald-400" />}
                <span className={stat.changeType === "up" ? "text-emerald-400" : "text-zinc-500"}>{stat.change}</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Activity */}
        <motion.div
          className="lg:col-span-2 card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-semibold text-zinc-100">Recent Activity</h2>
            <button className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
              View all <FiArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-0.5">
            {recentActivity.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.06, duration: 0.35 }}
                  className="flex items-start gap-3 py-3 px-2 -mx-2 rounded-lg hover:bg-[#1e293b]/50 transition-colors cursor-pointer group"
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${item.iconBg} shrink-0 mt-0.5`}>
                    <Icon className={`w-3.5 h-3.5 ${item.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-zinc-200 group-hover:text-zinc-100 transition-colors">{item.title}</p>
                    <p className="text-[12px] text-zinc-500 truncate">{item.subtitle}</p>
                  </div>
                  <span className="text-[11px] text-zinc-600 shrink-0 mt-0.5 font-mono">{item.time}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Upcoming Interviews */}
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[15px] font-semibold text-zinc-100">Upcoming Interviews</h2>
              <span className="badge-dot badge-dot-primary">{upcomingInterviews.length} scheduled</span>
            </div>
            <div className="space-y-3">
              {upcomingInterviews.map((iv, i) => (
                <motion.div
                  key={iv.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + i * 0.08, duration: 0.35 }}
                  className={`p-3 rounded-lg bg-[#111827]/60 border border-zinc-800/50 border-l-[3px] ${iv.accentColor} hover:bg-[#111827] transition-colors cursor-pointer`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[13px] font-semibold text-zinc-100">{iv.company}</span>
                    <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wide bg-zinc-800/60 px-2 py-0.5 rounded">{iv.type}</span>
                  </div>
                  <p className="text-[12px] text-zinc-400 mb-2">{iv.role} &middot; {iv.round}</p>
                  <div className="flex items-center gap-2 text-[11px]">
                    <FiCalendar className="w-3 h-3 text-zinc-500" />
                    <span className="text-zinc-400 font-mono">{iv.date}</span>
                    <span className="text-zinc-600">&middot;</span>
                    <FiClock className="w-3 h-3 text-zinc-500" />
                    <span className="text-zinc-400 font-mono">{iv.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Pipeline Overview */}
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[15px] font-semibold text-zinc-100">Pipeline Overview</h2>
              <button className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                Pipeline <FiArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-3">
              {pipelineSummary.map((s) => {
                const pct = Math.round((s.count / 9) * 100);
                return (
                  <div key={s.stage}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`stage-dot ${s.dotClass}`} />
                        <span className="text-[12px] text-zinc-300 font-medium">{s.stage}</span>
                      </div>
                      <span className="text-[12px] text-zinc-500 font-mono">{s.count}</span>
                    </div>
                    <div className="progress-bar">
                      <motion.div
                        className="progress-bar-fill"
                        style={{ background: s.accent }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/50 flex items-center justify-between">
              <span className="text-[12px] text-zinc-500">Total companies</span>
              <span className="text-[14px] font-bold text-zinc-200 font-mono">9</span>
            </div>
          </motion.div>

          {/* AI Insight */}
          <motion.div
            className="card border-indigo-500/20 relative overflow-hidden"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const }}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <FiStar className="w-4 h-4 text-indigo-400" />
                <h3 className="text-[13px] font-semibold text-zinc-200">AI Insight</h3>
              </div>
              <p className="text-[12px] text-zinc-400 leading-relaxed">
                Your response rate is 8% above average. Consider following up with Google and
                Notion where you applied recently &mdash; companies that receive a follow-up
                within 5 days have a 22% higher callback rate.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
