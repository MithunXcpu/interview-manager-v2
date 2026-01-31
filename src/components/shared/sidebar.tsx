"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  FiHome,
  FiGrid,
  FiBriefcase,
  FiMail,
  FiCalendar,
  FiBarChart2,
  FiBookOpen,
  FiDollarSign,
  FiFileText,
  FiHeart,
  FiSettings,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";

// ---------------------------------------------------------------------------
// Navigation items
// ---------------------------------------------------------------------------

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  tourId?: string;
}

const mainNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: FiHome },
  { label: "Pipeline", href: "/pipeline", icon: FiGrid, tourId: "pipeline" },
  { label: "Companies", href: "/companies", icon: FiBriefcase },
  { label: "Emails", href: "/emails", icon: FiMail, tourId: "nav-emails" },
  { label: "Calendar", href: "/calendar", icon: FiCalendar },
  { label: "Analytics", href: "/analytics", icon: FiBarChart2 },
];

const secondaryNavItems: NavItem[] = [
  { label: "Prep", href: "/prepare", icon: FiBookOpen },
  { label: "Offers", href: "/offers", icon: FiDollarSign },
  { label: "Documents", href: "/documents", icon: FiFileText },
  { label: "Wellness", href: "/wellness", icon: FiHeart },
];

const bottomNavItems: NavItem[] = [
  { label: "Settings", href: "/settings", icon: FiSettings, tourId: "nav-settings" },
];

// ---------------------------------------------------------------------------
// Sidebar component
// ---------------------------------------------------------------------------

export function Sidebar() {
  const pathname = usePathname();
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);
  const toggleSidebarCollapse = useAppStore((s) => s.toggleSidebarCollapse);

  return (
    <motion.aside
      className="relative flex flex-col h-screen bg-[#111827] border-r border-zinc-800/50 z-[200] select-none"
      animate={{ width: sidebarCollapsed ? 64 : 240 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Logo area */}
      <div
        className={cn(
          "flex items-center h-14 border-b border-zinc-800/50 shrink-0",
          sidebarCollapsed ? "justify-center px-0" : "px-5"
        )}
      >
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          {/* Logo mark */}
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 shadow-[0_0_12px_rgba(99,102,241,0.25)]">
            <span className="text-white text-sm font-bold tracking-tight">
              S
            </span>
          </div>
          {/* Logo text */}
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              transition={{ duration: 0.15, delay: 0.05 }}
              className="text-[15px] font-semibold text-zinc-100 tracking-tight"
            >
              Signal
            </motion.span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3">
        {/* Main section */}
        <NavSection
          label="Main"
          items={mainNavItems}
          collapsed={sidebarCollapsed}
          pathname={pathname}
        />

        {/* Tools section */}
        <NavSection
          label="Tools"
          items={secondaryNavItems}
          collapsed={sidebarCollapsed}
          pathname={pathname}
        />
      </nav>

      {/* Bottom section */}
      <div className="border-t border-zinc-800/50 py-2">
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            collapsed={sidebarCollapsed}
            isActive={pathname === item.href}
          />
        ))}

        {/* Collapse toggle */}
        <button
          onClick={toggleSidebarCollapse}
          className={cn(
            "flex items-center w-full gap-3 px-4 py-2 mx-auto text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors duration-150 rounded-md",
            sidebarCollapsed ? "justify-center mx-1" : "mx-2"
          )}
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <FiChevronsRight className="w-4 h-4 shrink-0" />
          ) : (
            <>
              <FiChevronsLeft className="w-4 h-4 shrink-0" />
              <span className="text-xs font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
}

// ---------------------------------------------------------------------------
// Nav section (group with label)
// ---------------------------------------------------------------------------

function NavSection({
  label,
  items,
  collapsed,
  pathname,
}: {
  label: string;
  items: NavItem[];
  collapsed: boolean;
  pathname: string;
}) {
  return (
    <div className="mb-1">
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="px-5 pt-4 pb-1.5"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-zinc-500">
            {label}
          </span>
        </motion.div>
      )}
      {collapsed && <div className="pt-2" />}
      {items.map((item) => (
        <NavLink
          key={item.href}
          item={item}
          collapsed={collapsed}
          isActive={pathname === item.href}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Individual nav link
// ---------------------------------------------------------------------------

function NavLink({
  item,
  collapsed,
  isActive,
}: {
  item: NavItem;
  collapsed: boolean;
  isActive: boolean;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "relative flex items-center gap-3 py-2 mx-2 rounded-md text-[13px] font-medium transition-all duration-150",
        collapsed ? "justify-center px-0" : "px-3",
        isActive
          ? "bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-500"
          : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 border-l-2 border-transparent"
      )}
      title={collapsed ? item.label : undefined}
      {...(item.tourId ? { "data-tour": item.tourId } : {})}
    >
      <Icon
        className={cn(
          "w-[18px] h-[18px] shrink-0",
          isActive ? "text-indigo-400" : "text-zinc-500"
        )}
      />
      {!collapsed && (
        <motion.span
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -4 }}
          transition={{ duration: 0.12 }}
          className="truncate"
        >
          {item.label}
        </motion.span>
      )}
    </Link>
  );
}
