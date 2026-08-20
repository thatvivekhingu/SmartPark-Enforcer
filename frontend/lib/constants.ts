import type { NavItem } from '@/types';

export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

export const APP_NAME = 'SmartPark Enforcer';

export const DWELL_LIMIT_MINUTES = 5;
export const DWELL_LIMIT_SECONDS = 300;

export const STREAM_URL = `${API_BASE}/api/stream`;
export const WS_URL = `${API_BASE ? API_BASE.replace(/^http/, 'ws') : 'ws://localhost:8000'}/ws/violations`;
export const WS_RECONNECT_BASE_MS = 1000;
export const WS_RECONNECT_MAX_MS = 30000;

export const REFRESH_INTERVAL_MS = 5000;
export const FINE_AMOUNT = 500;

export const NAV_ITEMS: NavItem[] = [
  { href: '/overview',    label: 'Overview',         icon: 'LayoutDashboard' },
  { href: '/upload',      label: 'Upload Evidence',  icon: 'Upload' },
  { href: '/violations',  label: 'Violations',        icon: 'AlertTriangle' },
  { href: '/challans',    label: 'Challans',          icon: 'FileText' },
  { href: '/cameras',     label: 'Cameras',           icon: 'Camera' },
  { href: '/analytics',  label: 'Analytics',         icon: 'BarChart2' },
  { href: '/settings',   label: 'Settings',          icon: 'Settings' },
] as const;

export const VIOLATION_TYPES = [
  'OVERSTAY',
  'NO_PERMIT',
  'WRONG_ZONE',
  'BLOCKED_EXIT',
  'DOUBLE_PARK',
] as const;

export const VEHICLE_TYPES = [
  'Car',
  'Motorcycle',
  'Truck',
  'Bus',
  'Auto',
  'Van',
] as const;

export const ZONES = [
  'Zone A – Main Entrance',
  'Zone B – Staff Parking',
  'Zone C – Visitor Bay',
  'Zone D – Loading Dock',
  'Zone E – Reserved',
] as const;

export const DATE_FORMAT = 'dd MMM yyyy, HH:mm';

export const PLATE_REGEX = /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/;
