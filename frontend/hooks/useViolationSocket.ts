"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { WS_URL, WS_RECONNECT_BASE_MS, WS_RECONNECT_MAX_MS } from "@/lib/constants";
import type { ViolationWsEvent } from "@/types";

interface UseViolationSocketOptions {
  onViolation?: (data: ViolationWsEvent["data"]) => void;
  onDetection?: (data: ViolationWsEvent["data"]) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

interface UseViolationSocketReturn {
  connected: boolean;
  lastEvent: ViolationWsEvent | null;
}

export function useViolationSocket(
  options: UseViolationSocketOptions = {}
): UseViolationSocketReturn {
  const { onViolation, onDetection, onConnect, onDisconnect } = options;
  const [connected, setConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<ViolationWsEvent | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const attemptRef = useRef(0);
  const mountedRef = useRef(true);

  const cleanup = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    if (!mountedRef.current) return;

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!mountedRef.current) return;
        setConnected(true);
        attemptRef.current = 0;
        onConnect?.();
      };

      ws.onmessage = (event) => {
        if (!mountedRef.current) return;
        try {
          const parsed = JSON.parse(event.data) as ViolationWsEvent;
          setLastEvent(parsed);

          switch (parsed.type) {
            case "VIOLATION_CREATED":
              onViolation?.(parsed.data);
              break;
            case "DETECTION":
              onDetection?.(parsed.data);
              break;
          }
        } catch {
          // malformed message, ignore
        }
      };

      ws.onclose = () => {
        if (!mountedRef.current) return;
        setConnected(false);
        onDisconnect?.();

        const delay = Math.min(
          WS_RECONNECT_BASE_MS * Math.pow(2, attemptRef.current),
          WS_RECONNECT_MAX_MS
        );
        attemptRef.current += 1;
        reconnectTimeoutRef.current = setTimeout(connect, delay);
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch {
      const delay = Math.min(
        WS_RECONNECT_BASE_MS * Math.pow(2, attemptRef.current),
        WS_RECONNECT_MAX_MS
      );
      attemptRef.current += 1;
      reconnectTimeoutRef.current = setTimeout(connect, delay);
    }
  }, [onViolation, onDetection, onConnect, onDisconnect]);

  useEffect(() => {
    mountedRef.current = true;
    connect();

    return () => {
      mountedRef.current = false;
      cleanup();
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect, cleanup]);

  return { connected, lastEvent };
}
