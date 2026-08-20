'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/brand/Logo';
import { NAV_ITEMS } from '@/lib/constants';

// ─── Icon Map ─────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  Upload,
  AlertTriangle,
  FileText,
  Camera,
  BarChart2,
  Settings,
};

// ─── Sidebar Store (inline Zustand) ──────────────────────────────────────────

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
    { name: 'sp-sidebar' }
  )
);

// ─── Nav Item Component ───────────────────────────────────────────────────────

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
        'relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
        collapsed ? 'justify-center px-0 w-full' : '',
        active
          ? 'bg-brand/10 text-brand'
          : 'text-text-secondary hover:bg-white/[0.04] hover:text-text-primary'
      )}
    >
      {/* Active accent bar */}
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-brand rounded-r-full" />
      )}

      <Icon
        size={17}
        strokeWidth={active ? 2.5 : 2}
        className={cn(
          'shrink-0 transition-colors duration-150',
          active ? 'text-brand' : 'text-text-muted group-hover:text-text-secondary'
        )}
      />

      {!collapsed && (
        <span className="truncate leading-none">{label}</span>
      )}

      {/* Tooltip for collapsed mode */}
      {collapsed && (
        <div className="pointer-events-none absolute left-full ml-3 z-50 hidden group-hover:flex">
          <div className="bg-elevated border border-white/[0.1] text-text-primary text-xs font-medium rounded-md px-2.5 py-1.5 whitespace-nowrap shadow-elevated">
            {label}
          </div>
        </div>
      )}
    </Link>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebarStore();

  return (
    <aside
      className={cn(
        'relative flex flex-col shrink-0 h-screen bg-[#0A0B0E]/85 backdrop-blur-md border-r border-white/[0.07] transition-all duration-250 ease-smooth z-30',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* ── Logo ── */}
      <div
        className={cn(
          'flex items-center h-[60px] shrink-0 border-b border-white/[0.07] px-4',
          collapsed ? 'justify-center px-0' : ''
        )}
      >
        <Logo size={28} showText={!collapsed} />
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-0.5 no-scrollbar">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/overview'
              ? pathname === '/overview' || pathname === '/'
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
          'flex items-center gap-3 p-3 mx-2 my-2 rounded-lg hover:bg-white/[0.03] transition-colors duration-150',
          collapsed ? 'justify-center mx-0 my-1 rounded-none' : ''
        )}
      >
        {/* Avatar */}
        <div className="shrink-0 w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
          <span className="text-xs font-black text-amber-400 leading-none">004</span>
        </div>

        {!collapsed && (
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-slate-100 truncate leading-tight">
              Traffic Officer | Inspector Sharma - Unit 004
            </div>
            <div className="text-[10px] font-semibold text-slate-400 truncate leading-tight mt-0.5 uppercase tracking-wider">
              Municipal Traffic Enforcement Unit
            </div>
          </div>
        )}

        {!collapsed && (
          <button
            title="Sign out"
            className="shrink-0 p-1 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors duration-150"
          >
            <LogOut size={14} />
          </button>
        )}
      </div>

      {/* ── Collapse Toggle ── */}
      <button
        onClick={toggle}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className={cn(
          'absolute -right-3 top-[72px] z-40',
          'w-6 h-6 rounded-full bg-elevated border border-white/[0.1] shadow-elevated',
          'flex items-center justify-center text-text-muted hover:text-text-primary hover:border-brand/40 hover:bg-brand/10',
          'transition-all duration-150'
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
