"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Upload,
  AlertTriangle,
  FileText,
  Camera,
  BarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";
import { NAV_ITEMS } from "@/lib/constants";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  Upload,
  AlertTriangle,
  FileText,
  Camera,
  BarChart2,
  Settings,
};

interface SidebarStore {
  collapsed: boolean;
  toggle: () => void;
  setCollapsed: (v: boolean) => void;
}

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      collapsed: false,
      toggle: () => set((s) => ({ collapsed: !s.collapsed })),
      setCollapsed: (v) => set({ collapsed: v }),
    }),
    { name: "sp-sidebar" }
  )
);

interface NavItemProps {
  href: string;
  label: string;
  icon: string;
  collapsed: boolean;
  active: boolean;
}

function NavItemLink({ href, label, icon, collapsed, active }: NavItemProps) {
  const Icon = ICON_MAP[icon] ?? LayoutDashboard;

  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={cn(
        "relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
        collapsed ? "justify-center px-0 w-full" : "",
        active
          ? "bg-[#0071E3]/10 text-[#0071E3] font-semibold"
          : "text-[#6e6e73] hover:bg-black/[0.04] hover:text-[#1d1d1f]"
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3.5px] h-5 bg-[#0071E3] rounded-r-full" />
      )}

      <Icon
        size={18}
        strokeWidth={active ? 2.5 : 2}
        className={cn(
          "shrink-0 transition-colors duration-150",
          active ? "text-[#0071E3]" : "text-[#86868b] group-hover:text-[#1d1d1f]"
        )}
      />

      {!collapsed && <span className="truncate leading-none">{label}</span>}

      {collapsed && (
        <div className="pointer-events-none absolute left-full ml-3 z-50 hidden group-hover:flex">
          <div className="bg-[#1d1d1f] text-white text-xs font-medium rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-md">
            {label}
          </div>
        </div>
      )}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebarStore();

  return (
    <aside
      className={cn(
        "relative flex flex-col shrink-0 h-screen bg-white/90 backdrop-blur-xl border-r border-black/[0.06] transition-all duration-250 ease-smooth z-30",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* ── Logo ── */}
      <div
        className={cn(
          "flex items-center h-[60px] shrink-0 border-b border-black/[0.06] px-4",
          collapsed ? "justify-center px-0" : ""
        )}
      >
        <Logo size={28} showText={!collapsed} />
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-1 no-scrollbar">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/overview"
              ? pathname === "/overview" || pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <NavItemLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              collapsed={collapsed}
              active={isActive}
            />
          );
        })}
      </nav>

      {/* ── Divider ── */}
      <div className="divider mx-2" />

      {/* ── User Profile ── */}
      <div
        className={cn(
          "flex items-center gap-3 p-2.5 mx-2 my-2 rounded-xl bg-black/[0.02] border border-black/[0.04] hover:bg-black/[0.04] transition-colors duration-150",
          collapsed ? "justify-center mx-0 my-1 rounded-none border-0 bg-transparent" : ""
        )}
      >
        {/* Avatar */}
        <div className="shrink-0 w-8 h-8 rounded-full bg-[#0071E3]/15 border border-[#0071E3]/30 flex items-center justify-center">
          <span className="text-xs font-bold text-[#0071E3] leading-none">TO</span>
        </div>

        {!collapsed && (
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-[#1d1d1f] truncate leading-tight">
              Traffic Officer
            </div>
            <div className="text-[10px] text-[#86868b] truncate leading-tight mt-0.5 font-medium">
              Senior Inspector
            </div>
          </div>
        )}

        {!collapsed && (
          <button
            title="Sign out"
            className="shrink-0 p-1.5 rounded-lg text-[#86868b] hover:text-red-600 hover:bg-red-50 transition-colors duration-150"
          >
            <LogOut size={14} />
          </button>
        )}
      </div>

      {/* ── Collapse Toggle ── */}
      <button
        onClick={toggle}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className={cn(
          "absolute -right-3 top-[72px] z-40",
          "w-6 h-6 rounded-full bg-white border border-black/[0.12] shadow-sm",
          "flex items-center justify-center text-[#86868b] hover:text-[#1d1d1f] hover:border-[#0071E3] hover:bg-[#0071E3]/5",
          "transition-all duration-150"
        )}
      >
        {collapsed ? (
          <ChevronRight size={12} strokeWidth={2.5} />
        ) : (
          <ChevronLeft size={12} strokeWidth={2.5} />
        )}
      </button>
    </aside>
  );
}

export default Sidebar;
