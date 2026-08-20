import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, formatDistanceToNow } from 'date-fns';

// ─── Tailwind Class Merger ────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ─── Dwell Time Formatting ────────────────────────────────────────────────────

/**
 * Formats dwell time in seconds to a human-readable string.
 * < 60s   → "45s"
 * < 3600s → "12m 30s"
 * ≥ 3600s → "2h 15m"
 */
export function formatDwell(seconds: number): string {
  if (seconds < 0) return '0s';
  if (seconds < 60) return `${Math.floor(seconds)}s`;
  if (seconds < 3600) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
  }
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/**
 * Formats dwell time in minutes.
 */
export function formatDwellMinutes(minutes: number): string {
  return formatDwell(minutes * 60);
}

// ─── License Plate Formatting ─────────────────────────────────────────────────

/**
 * Formats a license plate to uppercase with consistent spacing.
 * e.g. "nl01c7821" → "NL01 C 7821"
 * Handles common Indian plate formats.
 */
export function formatPlate(plate: string): string {
  if (!plate) return '';
  const p = plate.toUpperCase().replace(/\s+/g, '');
  // Try Indian format: XX00XX0000 or XX00X0000
  const match = p.match(/^([A-Z]{2})(\d{2})([A-Z]{1,3})(\d{1,4})$/);
  if (match) {
    return `${match[1]}${match[2]} ${match[3]} ${match[4]}`;
  }
  return p;
}

// ─── Currency Formatting ──────────────────────────────────────────────────────

/**
 * Formats a number as Indian Rupees.
 * e.g. 500 → "₹500", 1500 → "₹1,500"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// ─── Date / Time Formatting ───────────────────────────────────────────────────

/**
 * Formats an ISO date string to "DD MMM YYYY, HH:MM"
 * e.g. "2024-01-15T14:30:00Z" → "15 Jan 2024, 14:30"
 */
export function formatDate(iso: string): string {
  try {
    const date = typeof iso === 'string' ? parseISO(iso) : new Date(iso);
    return format(date, 'dd MMM yyyy, HH:mm');
  } catch {
    return iso;
  }
}

export function formatTimestamp(iso: string): string {
  return formatDate(iso);
}

/**
 * Formats an ISO date string to just the date portion.
 */
export function formatDateOnly(iso: string): string {
  try {
    const date = typeof iso === 'string' ? parseISO(iso) : new Date(iso);
    return format(date, 'dd MMM yyyy');
  } catch {
    return iso;
  }
}

/**
 * Formats an ISO date string to just the time portion.
 */
export function formatTimeOnly(iso: string): string {
  try {
    const date = typeof iso === 'string' ? parseISO(iso) : new Date(iso);
    return format(date, 'HH:mm:ss');
  } catch {
    return iso;
  }
}

/**
 * Returns a relative time string like "2 minutes ago".
 */
export function timeAgo(iso: string): string {
  try {
    const date = typeof iso === 'string' ? parseISO(iso) : new Date(iso);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return iso;
  }
}

// ─── Hash Formatting ──────────────────────────────────────────────────────────

/**
 * Returns first 16 characters of SHA-256 hash with ellipsis.
 * e.g. "a3f9c12d8e4b7a1f..." 
 */
export function sha256Truncated(hash: string): string {
  if (!hash) return '';
  if (hash.length <= 16) return hash;
  return `${hash.slice(0, 16)}…`;
}

export function formatHash(hash: string): string {
  return sha256Truncated(hash);
}

// ─── Confidence Formatting ────────────────────────────────────────────────────

/**
 * Formats OCR/detection confidence as percentage string.
 * e.g. 0.9234 → "92.3%" or 92.34 → "92.3%"
 */
export function formatConfidence(value: number): string {
  const pct = value > 1 ? value : value * 100;
  return `${pct.toFixed(1)}%`;
}

// ─── String Utilities ─────────────────────────────────────────────────────────

/**
 * Capitalizes first letter of each word.
 */
export function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(/[\s_-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Truncates a string to maxLen characters, appending ellipsis.
 */
export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return `${str.slice(0, maxLen)}…`;
}

// ─── Numeric Utilities ────────────────────────────────────────────────────────

/**
 * Clamps a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Formats a large number compactly: 1500 → "1.5K", 1200000 → "1.2M"
 */
export function formatCompact(n: number): string {
  return new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n);
}

// ─── Color Utilities ──────────────────────────────────────────────────────────

/**
 * Returns a Tailwind color class based on violation status.
 */
export function statusColor(status: string): string {
  switch (status.toUpperCase()) {
    case 'CONFIRMED':
    case 'ISSUED':
      return 'text-danger';
    case 'PENDING':
    case 'DISPUTED':
      return 'text-warning';
    case 'DISMISSED':
    case 'PAID':
      return 'text-success';
    case 'ACTIVE':
      return 'text-brand';
    case 'OFFLINE':
      return 'text-text-muted';
    default:
      return 'text-text-secondary';
  }
}
