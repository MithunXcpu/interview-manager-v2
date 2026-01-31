"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiLayout,
  FiCpu,
  FiBookOpen,
  FiDollarSign,
  FiBarChart2,
  FiHeart,
  FiPlus,
  FiTarget,
  FiAward,
  FiZap,
  FiShield,
  FiTrendingUp,
  FiArrowRight,
  FiGithub,
  FiCheck,
  FiStar,
} from "react-icons/fi";

/* ==========================================================================
   Signal — Marketing Landing Page
   Portfolio-grade dark-theme, animated with Framer Motion whileInView
   ========================================================================== */

// ---------------------------------------------------------------------------
// Animation Variants
// ---------------------------------------------------------------------------
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.4, 0.25, 1] as const },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: i * 0.12 },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const features = [
  {
    icon: FiLayout,
    title: "Pipeline Tracking",
    description: "Kanban boards, table views, smart filtering — see every opportunity at a glance.",
    color: "indigo" as const,
  },
  {
    icon: FiCpu,
    title: "AI Command Center",
    description: "Contextual AI assistant that helps at every stage of your job search.",
    color: "cyan" as const,
  },
  {
    icon: FiBookOpen,
    title: "Interview Prep",
    description: "AI-generated briefings, STAR story builder, and mock interview prompts.",
    color: "emerald" as const,
  },
  {
    icon: FiDollarSign,
    title: "Salary Negotiation",
    description: "Side-by-side offer comparison, total comp calculator, counter-offer drafts.",
    color: "amber" as const,
  },
  {
    icon: FiBarChart2,
    title: "Analytics Dashboard",
    description: "Funnel visualization, activity heatmaps, and weekly progress reports.",
    color: "indigo" as const,
  },
  {
    icon: FiHeart,
    title: "Wellness Tracker",
    description: "Mood tracking, streaks, and reflection prompts to stay balanced.",
    color: "cyan" as const,
  },
];

const colorMap = {
  indigo: {
    bg: "rgba(99, 102, 241, 0.12)",
    border: "rgba(99, 102, 241, 0.25)",
    text: "#818cf8",
    glow: "rgba(99, 102, 241, 0.2)",
  },
  cyan: {
    bg: "rgba(34, 211, 238, 0.12)",
    border: "rgba(34, 211, 238, 0.25)",
    text: "#67e8f9",
    glow: "rgba(34, 211, 238, 0.2)",
  },
  emerald: {
    bg: "rgba(16, 185, 129, 0.12)",
    border: "rgba(16, 185, 129, 0.25)",
    text: "#34d399",
    glow: "rgba(16, 185, 129, 0.2)",
  },
  amber: {
    bg: "rgba(245, 158, 11, 0.12)",
    border: "rgba(245, 158, 11, 0.25)",
    text: "#fbbf24",
    glow: "rgba(245, 158, 11, 0.2)",
  },
};

const steps = [
  {
    number: "01",
    icon: FiPlus,
    title: "Add Companies",
    description: "Track every opportunity in your pipeline with one click.",
  },
  {
    number: "02",
    icon: FiTarget,
    title: "Prepare & Interview",
    description: "AI-powered prep, briefings, and scheduling — all automated.",
  },
  {
    number: "03",
    icon: FiAward,
    title: "Negotiate & Win",
    description: "Compare offers, draft counter-proposals, and close with confidence.",
  },
];

const stats = [
  {
    value: "6+",
    label: "Integrated Tools",
    icon: FiZap,
    description: "Pipeline, Prep, Offers & more",
  },
  {
    value: "AI",
    label: "Powered Prep",
    icon: FiShield,
    description: "Context-aware coaching",
  },
  {
    value: "Full",
    label: "Offer Analysis",
    icon: FiTrendingUp,
    description: "Total comp breakdown",
  },
];

const socialProofLogos = ["Google", "Meta", "Amazon", "Microsoft", "Apple", "Netflix"];

// ---------------------------------------------------------------------------
// Section: Animated Gradient Mesh Background
// ---------------------------------------------------------------------------
function GradientMeshBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary gradient orb */}
      <div
        className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.4) 0%, rgba(99,102,241,0.1) 40%, transparent 70%)",
          animation: "meshFloat1 20s ease-in-out infinite",
        }}
      />
      {/* Secondary gradient orb */}
      <div
        className="absolute -bottom-1/4 -left-1/4 w-[700px] h-[700px] rounded-full opacity-25"
        style={{
          background:
            "radial-gradient(circle, rgba(34,211,238,0.35) 0%, rgba(34,211,238,0.08) 40%, transparent 70%)",
          animation: "meshFloat2 25s ease-in-out infinite",
        }}
      />
      {/* Tertiary gradient orb */}
      <div
        className="absolute top-1/3 left-1/3 w-[500px] h-[500px] rounded-full opacity-15"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.4) 0%, transparent 60%)",
          animation: "meshFloat3 18s ease-in-out infinite",
        }}
      />
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, transparent 50%, #0a0f1e 100%)",
        }}
      />

      {/* Mesh keyframe animations */}
      <style>{`
        @keyframes meshFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes meshFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-25px, 35px) scale(1.08); }
          66% { transform: translate(35px, -15px) scale(0.92); }
        }
        @keyframes meshFloat3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -30px) scale(1.1); }
        }
      `}</style>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section: Browser Mockup — macOS-style frame with mini dashboard
// ---------------------------------------------------------------------------
function BrowserMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
      className="hidden md:block relative max-w-4xl mx-auto mt-16"
    >
      {/* Browser frame */}
      <div
        className="rounded-xl overflow-hidden border"
        style={{
          borderColor: "rgba(30, 41, 59, 0.6)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 120px rgba(99,102,241,0.08)",
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{ background: "rgba(15, 23, 42, 0.95)" }}
        >
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div
            className="flex-1 mx-4 px-3 py-1 rounded-md text-[11px] text-zinc-500 text-center"
            style={{ background: "rgba(30, 41, 59, 0.5)" }}
          >
            signal.app/dashboard
          </div>
        </div>

        {/* Dashboard mockup */}
        <div
          className="p-5 grid grid-cols-12 gap-3"
          style={{ background: "#0a0f1e", minHeight: 280 }}
        >
          {/* Sidebar mock */}
          <div className="col-span-2 space-y-2">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white"
                style={{ background: "linear-gradient(135deg, #6366f1, #22d3ee)" }}
              >
                S
              </div>
              <span className="text-[10px] font-semibold text-zinc-300">Signal</span>
            </div>
            {["Dashboard", "Pipeline", "Companies", "Emails", "Calendar"].map(
              (item, i) => (
                <div
                  key={item}
                  className="px-2 py-1.5 rounded text-[10px] text-zinc-500"
                  style={
                    i === 0
                      ? { background: "rgba(99,102,241,0.1)", color: "#818cf8" }
                      : {}
                  }
                >
                  {item}
                </div>
              )
            )}
          </div>

          {/* Main content mock */}
          <div className="col-span-10 space-y-3">
            {/* Stats row */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Applications", value: "12", color: "#6366f1" },
                { label: "Interviews", value: "3", color: "#22d3ee" },
                { label: "Response Rate", value: "34%", color: "#10b981" },
                { label: "Offers", value: "2", color: "#f59e0b" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-lg p-2.5"
                  style={{
                    background: "rgba(17, 24, 39, 0.6)",
                    border: "1px solid rgba(30, 41, 59, 0.4)",
                  }}
                >
                  <div className="text-[9px] text-zinc-500 mb-0.5">{s.label}</div>
                  <div
                    className="text-lg font-bold font-mono"
                    style={{ color: s.color }}
                  >
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
            {/* Activity & Pipeline row */}
            <div className="grid grid-cols-5 gap-2">
              <div
                className="col-span-3 rounded-lg p-3"
                style={{
                  background: "rgba(17, 24, 39, 0.6)",
                  border: "1px solid rgba(30, 41, 59, 0.4)",
                }}
              >
                <div className="text-[10px] font-semibold text-zinc-300 mb-2">
                  Recent Activity
                </div>
                <div className="space-y-2">
                  {["Applied to Google — SWE L5", "Interview at Meta — System Design", "Offer from Microsoft — SDE II"].map(
                    (a, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{
                            background:
                              i === 0
                                ? "#22d3ee"
                                : i === 1
                                  ? "#6366f1"
                                  : "#10b981",
                          }}
                        />
                        <span className="text-[10px] text-zinc-400">{a}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
              <div
                className="col-span-2 rounded-lg p-3"
                style={{
                  background: "rgba(17, 24, 39, 0.6)",
                  border: "1px solid rgba(30, 41, 59, 0.4)",
                }}
              >
                <div className="text-[10px] font-semibold text-zinc-300 mb-2">
                  Pipeline
                </div>
                <div className="space-y-1.5">
                  {[
                    { s: "Applied", c: 3, color: "#22d3ee" },
                    { s: "Screening", c: 2, color: "#6366f1" },
                    { s: "Interview", c: 2, color: "#f59e0b" },
                    { s: "Offer", c: 1, color: "#10b981" },
                  ].map((p) => (
                    <div key={p.s} className="flex items-center gap-2">
                      <div
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: p.color }}
                      />
                      <span className="text-[9px] text-zinc-400 flex-1">{p.s}</span>
                      <span className="text-[9px] font-mono text-zinc-500">
                        {p.c}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reflection glow under the mockup */}
      <div
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-full blur-2xl"
        style={{ background: "rgba(99,102,241,0.15)" }}
      />
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Section: Social Proof Bar
// ---------------------------------------------------------------------------
function SocialProofBar() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      className="max-w-4xl mx-auto mt-16 text-center"
    >
      <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-600 mb-6 font-semibold">
        Trusted by professionals at
      </p>
      <div className="flex items-center justify-center gap-8 sm:gap-12 flex-wrap">
        {socialProofLogos.map((name) => (
          <span
            key={name}
            className="text-sm sm:text-base font-bold tracking-tight text-zinc-600 hover:text-zinc-400 transition-colors duration-300"
          >
            {name}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Section: Floating UI Preview Cards
// ---------------------------------------------------------------------------
function FloatingCards() {
  return (
    <div className="hidden lg:block relative w-full max-w-lg mx-auto mt-16 h-[260px]">
      {/* Card 1: Pipeline mini */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotate: -3 }}
        animate={{ opacity: 1, y: 0, rotate: -3 }}
        transition={{ duration: 0.8, delay: 0.6, type: "spring", stiffness: 80 }}
        className="absolute left-0 top-4 w-[220px]"
      >
        <div
          className="rounded-xl p-4 backdrop-blur-md border"
          style={{
            background: "rgba(17, 24, 39, 0.8)",
            borderColor: "rgba(30, 41, 59, 0.6)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: "#6366f1", boxShadow: "0 0 6px #6366f1" }}
            />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Pipeline
            </span>
          </div>
          <div className="space-y-2">
            {["Applied", "Screening", "Interview"].map((stage, i) => (
              <div key={stage} className="flex items-center justify-between">
                <span className="text-xs text-zinc-300">{stage}</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 3 - i }).map((_, j) => (
                    <div
                      key={j}
                      className="w-3 h-1.5 rounded-sm"
                      style={{
                        background:
                          i === 0
                            ? "#22d3ee"
                            : i === 1
                              ? "#6366f1"
                              : "#f59e0b",
                        opacity: 0.7,
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Card 2: AI assistant mini */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotate: 2 }}
        animate={{ opacity: 1, y: 0, rotate: 2 }}
        transition={{ duration: 0.8, delay: 0.8, type: "spring", stiffness: 80 }}
        className="absolute right-0 top-0 w-[240px]"
      >
        <div
          className="rounded-xl p-4 backdrop-blur-md border"
          style={{
            background: "rgba(17, 24, 39, 0.8)",
            borderColor: "rgba(30, 41, 59, 0.6)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <FiCpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              AI Assistant
            </span>
          </div>
          <div
            className="rounded-lg p-2.5 text-[11px] leading-relaxed text-zinc-300"
            style={{
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.15)",
            }}
          >
            Prepare 3 STAR stories for your Google PM interview focusing on
            leadership...
          </div>
        </div>
      </motion.div>

      {/* Card 3: Stat mini */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: -1 }}
        animate={{ opacity: 1, y: 0, rotate: -1 }}
        transition={{ duration: 0.8, delay: 1.0, type: "spring", stiffness: 80 }}
        className="absolute left-1/4 bottom-0 w-[180px]"
      >
        <div
          className="rounded-xl p-4 backdrop-blur-md border"
          style={{
            background: "rgba(17, 24, 39, 0.8)",
            borderColor: "rgba(30, 41, 59, 0.6)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1">
            Response Rate
          </div>
          <div
            className="text-2xl font-bold font-mono"
            style={{ color: "#10b981" }}
          >
            34%
          </div>
          <div className="flex items-center gap-1 mt-1">
            <FiTrendingUp className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] text-emerald-400">+12% this week</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section: Navbar
// ---------------------------------------------------------------------------
function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div
        className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between backdrop-blur-lg"
        style={{
          background: "rgba(10, 15, 30, 0.7)",
          borderBottom: "1px solid rgba(30, 41, 59, 0.4)",
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm text-white"
            style={{
              background: "linear-gradient(135deg, #6366f1, #22d3ee)",
              boxShadow: "0 0 16px rgba(99,102,241,0.3)",
            }}
          >
            S
          </div>
          <span className="text-lg font-bold tracking-tight text-zinc-100 group-hover:text-white transition-colors">
            Signal
          </span>
        </Link>

        {/* Nav links — hidden on mobile */}
        <div className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
          <a href="#features" className="hover:text-zinc-100 transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-zinc-100 transition-colors">
            How It Works
          </a>
          <a href="#stats" className="hover:text-zinc-100 transition-colors">
            Why Signal
          </a>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="hidden sm:inline-flex text-sm text-zinc-400 hover:text-zinc-100 transition-colors px-3 py-2"
          >
            Sign in
          </Link>
          <Link
            href="/dashboard"
            className="signal-btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all"
          >
            Get Started
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

// ---------------------------------------------------------------------------
// Section: Hero
// ---------------------------------------------------------------------------
function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
      <GradientMeshBackground />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide mb-8"
            style={{
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.25)",
              color: "#818cf8",
            }}
          >
            <FiZap className="w-3.5 h-3.5" />
            AI-Powered Job Search Platform
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6"
          style={{
            background:
              "linear-gradient(135deg, #f1f5f9 0%, #6366f1 40%, #22d3ee 70%, #10b981 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Your AI-Powered
          <br />
          Interview Command Center
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Track applications, prep with AI, negotiate offers, and land your
          dream job &mdash; all in one place.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/dashboard"
            className="signal-btn-primary group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-base font-semibold text-white transition-all duration-200"
          >
            Get Started Free
            <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/dashboard"
            className="signal-btn-secondary inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold transition-all duration-200"
          >
            View Demo
          </Link>
        </motion.div>

        {/* Browser mockup — more informative than floating cards */}
        <BrowserMockup />

        {/* Social proof */}
        <SocialProofBar />
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-5 h-8 rounded-full border-2 border-zinc-600 flex justify-center pt-1.5">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-1 rounded-full bg-zinc-400"
          />
        </div>
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Section: Features Grid — uses whileInView instead of useInView
// ---------------------------------------------------------------------------
function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative py-24 sm:py-32 px-6"
    >
      {/* Section header */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          custom={0}
        >
          <span
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider mb-6"
            style={{
              background: "rgba(34,211,238,0.1)",
              border: "1px solid rgba(34,211,238,0.2)",
              color: "#67e8f9",
            }}
          >
            Features
          </span>
        </motion.div>
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          custom={1}
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-100 mb-4"
        >
          Everything you need to{" "}
          <span style={{ color: "#6366f1" }}>land the role</span>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          custom={2}
          className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto"
        >
          From first application to signed offer letter, Signal has every stage
          covered.
        </motion.p>
      </div>

      {/* Features grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {features.map((feature, i) => {
          const colors = colorMap[feature.color];
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              variants={scaleIn}
              custom={i}
              className="signal-feature-card group relative rounded-2xl p-6 transition-all duration-300 cursor-default"
              style={{
                background: "rgba(17, 24, 39, 0.5)",
                border: "1px solid rgba(30, 41, 59, 0.5)",
                backdropFilter: "blur(12px)",
              }}
            >
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <Icon style={{ color: colors.text }} className="w-5 h-5" />
              </div>

              {/* Content */}
              <h3 className="text-base font-semibold text-zinc-100 mb-1.5">
                {feature.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover glow overlay */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `radial-gradient(300px circle at 50% 50%, ${colors.glow}, transparent 60%)`,
                }}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Section: How It Works — uses whileInView
// ---------------------------------------------------------------------------
function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="relative py-24 sm:py-32 px-6"
    >
      {/* Subtle divider gradient */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)",
        }}
      />

      <div className="max-w-4xl mx-auto text-center mb-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          custom={0}
        >
          <span
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider mb-6"
            style={{
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.2)",
              color: "#34d399",
            }}
          >
            How It Works
          </span>
        </motion.div>
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          custom={1}
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-100 mb-4"
        >
          Three steps to your{" "}
          <span style={{ color: "#10b981" }}>dream job</span>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          custom={2}
          className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto"
        >
          A streamlined workflow that takes you from application to offer.
        </motion.p>
      </div>

      {/* Steps */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.number}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={i + 1}
              className="relative text-center group"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div
                  className="hidden md:block absolute top-12 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(99,102,241,0.4), rgba(99,102,241,0.1))",
                  }}
                />
              )}

              {/* Step number circle */}
              <div className="relative inline-flex mb-5">
                <div
                  className="w-24 h-24 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 hover:border-indigo-500/30 hover:shadow-[0_0_30px_rgba(99,102,241,0.12)]"
                  style={{
                    background: "rgba(17, 24, 39, 0.6)",
                    border: "1px solid rgba(30, 41, 59, 0.5)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
                  }}
                >
                  <span
                    className="text-[11px] font-bold tracking-widest mb-1"
                    style={{ color: "#6366f1" }}
                  >
                    {step.number}
                  </span>
                  <Icon className="w-6 h-6 text-zinc-300" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-[250px] mx-auto">
                {step.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Section: Social Proof / Stats — uses whileInView
// ---------------------------------------------------------------------------
function StatsSection() {
  return (
    <section
      id="stats"
      className="relative py-24 sm:py-32 px-6"
    >
      {/* Subtle divider gradient */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(34,211,238,0.3), transparent)",
        }}
      />

      <div className="max-w-4xl mx-auto text-center mb-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          custom={0}
        >
          <span
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider mb-6"
            style={{
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.2)",
              color: "#818cf8",
            }}
          >
            Why Signal
          </span>
        </motion.div>
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          custom={1}
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-100 mb-4"
        >
          Built for{" "}
          <span style={{ color: "#22d3ee" }}>serious job seekers</span>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          custom={2}
          className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto"
        >
          Stop juggling spreadsheets. Signal gives you a professional-grade
          command center for your entire job search.
        </motion.p>
      </div>

      {/* Stat cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6"
      >
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              variants={scaleIn}
              custom={i}
              className="signal-feature-card relative rounded-2xl p-8 text-center transition-all duration-300"
              style={{
                background: "rgba(17, 24, 39, 0.5)",
                border: "1px solid rgba(30, 41, 59, 0.5)",
                backdropFilter: "blur(12px)",
              }}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-5"
                style={{
                  background: "rgba(99,102,241,0.1)",
                  border: "1px solid rgba(99,102,241,0.2)",
                }}
              >
                <Icon className="w-5 h-5" style={{ color: "#818cf8" }} />
              </div>

              {/* Value */}
              <motion.div
                className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-1 font-mono"
                style={{ color: "#f1f5f9" }}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.5,
                  delay: 0.3 + i * 0.15,
                  type: "spring",
                  stiffness: 120,
                }}
              >
                {stat.value}
              </motion.div>

              {/* Label */}
              <div className="text-sm font-semibold text-zinc-300 mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-zinc-500">{stat.description}</div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Section: Testimonial / Feature Highlight
// ---------------------------------------------------------------------------
function HighlightSection() {
  const highlights = [
    "Kanban, table, and timeline pipeline views",
    "AI briefing docs for every interview",
    "Side-by-side offer comparison calculator",
    "Activity analytics with funnel visualization",
    "Gmail & Google Calendar integration",
    "Mood tracking and wellness streaks",
  ];

  return (
    <section className="relative py-24 sm:py-32 px-6">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(16,185,129,0.3), transparent)",
        }}
      />

      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left — text */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            custom={0}
          >
            <span
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider mb-6"
              style={{
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.2)",
                color: "#34d399",
              }}
            >
              <FiStar className="w-3 h-3" />
              All-in-One Platform
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-4 tracking-tight">
              Stop switching between{" "}
              <span style={{ color: "#10b981" }}>10 different tools</span>
            </h2>
            <p className="text-zinc-400 mb-8 leading-relaxed">
              Signal replaces your job tracking spreadsheet, prep notes, offer calculator,
              calendar tool, and more — all powered by AI that understands your search context.
            </p>
            <ul className="space-y-3">
              {highlights.map((item, i) => (
                <motion.li
                  key={item}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i * 0.5 + 1}
                  className="flex items-center gap-3 text-sm text-zinc-300"
                >
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                    style={{
                      background: "rgba(16,185,129,0.12)",
                      border: "1px solid rgba(16,185,129,0.25)",
                    }}
                  >
                    <FiCheck className="w-3 h-3 text-emerald-400" />
                  </div>
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right — visual */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            custom={2}
          >
            <div
              className="rounded-2xl p-6 space-y-4"
              style={{
                background: "rgba(17, 24, 39, 0.6)",
                border: "1px solid rgba(30, 41, 59, 0.5)",
                boxShadow: "0 16px 48px rgba(0,0,0,0.3)",
              }}
            >
              <div className="text-[13px] font-semibold text-zinc-200 mb-3">
                Interview Prep — Google SWE
              </div>
              {[
                { label: "Company Research", pct: 100, color: "#10b981" },
                { label: "Behavioral Questions", pct: 75, color: "#6366f1" },
                { label: "System Design Prep", pct: 50, color: "#22d3ee" },
                { label: "Coding Practice", pct: 85, color: "#f59e0b" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-zinc-400">{item.label}</span>
                    <span className="text-[11px] font-mono text-zinc-500">
                      {item.pct}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-zinc-800/60">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: item.color }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
              <div
                className="mt-4 pt-4 text-[11px] text-zinc-500"
                style={{ borderTop: "1px solid rgba(30, 41, 59, 0.4)" }}
              >
                AI Suggestion: Focus on system design — most common in L5 loops.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Section: CTA Footer — uses whileInView
// ---------------------------------------------------------------------------
function CTASection() {
  return (
    <section className="relative py-24 sm:py-32 px-6">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(ellipse, rgba(99,102,241,0.4), transparent 70%)",
          }}
        />
      </div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        custom={0}
        className="relative z-10 max-w-3xl mx-auto text-center"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-100 mb-6">
          Ready to transform
          <br />
          <span
            style={{
              background:
                "linear-gradient(135deg, #6366f1, #22d3ee)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            your job search?
          </span>
        </h2>

        <p className="text-base sm:text-lg text-zinc-400 max-w-lg mx-auto mb-10">
          Join thousands of professionals who have streamlined their interview
          process with Signal.
        </p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          custom={1}
        >
          <Link
            href="/dashboard"
            className="signal-btn-primary group inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-base font-semibold text-white transition-all duration-200"
          >
            Get Started
            <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        <motion.p
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          custom={3}
          className="mt-5 text-xs text-zinc-500"
        >
          No credit card required
        </motion.p>
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Section: Footer
// ---------------------------------------------------------------------------
function Footer() {
  return (
    <footer
      className="relative px-6 py-12"
      style={{
        borderTop: "1px solid rgba(30, 41, 59, 0.4)",
        background: "rgba(10, 15, 30, 0.6)",
      }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Logo + copyright */}
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-white"
            style={{
              background: "linear-gradient(135deg, #6366f1, #22d3ee)",
            }}
          >
            S
          </div>
          <span className="text-sm text-zinc-500">
            Signal &copy; {new Date().getFullYear()}. Built with Next.js &amp;
            Claude.
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm text-zinc-500">
          <a href="#" className="hover:text-zinc-300 transition-colors">
            About
          </a>
          <a href="#" className="hover:text-zinc-300 transition-colors">
            Privacy
          </a>
          <a
            href="#"
            className="hover:text-zinc-300 transition-colors inline-flex items-center gap-1.5"
          >
            <FiGithub className="w-4 h-4" />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-zinc-100 font-sans overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <HighlightSection />
      <CTASection />
      <Footer />
    </div>
  );
}
