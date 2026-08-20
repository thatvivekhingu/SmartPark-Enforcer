"use client";

import { useQuery } from "@tanstack/react-query";
import { getStats, getViolations, getChallans, getActiveTrackers } from "@/lib/api";
import { REFRESH_INTERVAL_MS } from "@/lib/constants";

export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
    refetchInterval: REFRESH_INTERVAL_MS,
    staleTime: 3000,
  });
}

export function useViolations() {
  return useQuery({
    queryKey: ["violations"],
    queryFn: getViolations,
    refetchInterval: REFRESH_INTERVAL_MS,
    staleTime: 3000,
  });
}

export function useChallans() {
  return useQuery({
    queryKey: ["challans"],
    queryFn: getChallans,
    refetchInterval: REFRESH_INTERVAL_MS,
    staleTime: 3000,
  });
}

export function useActiveTrackers() {
  return useQuery({
    queryKey: ["trackers"],
    queryFn: getActiveTrackers,
    refetchInterval: REFRESH_INTERVAL_MS,
    staleTime: 3000,
  });
}

export function useSystemStatus() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
    refetchInterval: REFRESH_INTERVAL_MS,
    staleTime: 3000,
    select: (data) => ({
      yolo: data.total_vehicles >= 0,
      ocr: data.ocr_available,
      websocket: true,
      backend: true,
    }),
  });
}
