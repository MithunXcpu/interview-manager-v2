// ---------------------------------------------------------------------------
// Onboarding layout -- minimal, no sidebar/header, dark background
// ---------------------------------------------------------------------------

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col">
      {/* Signal logo -- top-left */}
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-lg shadow-indigo-500/20">
            <span className="text-sm font-bold text-white tracking-tight">S</span>
          </div>
          <span className="text-sm font-semibold text-zinc-300 tracking-tight">
            Signal
          </span>
        </div>
      </div>

      {/* Centered content area */}
      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        {children}
      </div>
    </div>
  );
}
