"use client";

import { useState } from "react";
import { 
  Camera as CameraIcon, 
  Video, 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Play, 
  Eye,
  Sliders,
  Settings,
  Plus
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import type { Camera, CameraStatus } from "@/types";

const DEMO_CAMERAS: Camera[] = [
  {
    id: 1,
    name: "CAM-01 (Nagaland Commercial Strip)",
    location: "Main Street Curb, Dimapur",
    status: "active",
    zone_name: "Street No-Parking Curb",
    vehicle_count: 79,
    violation_count_today: 9,
    thumbnail_url: "/evidence/violations/violation_youtube_test_tr89_20260819_184818.jpg",
  },
  {
    id: 2,
    name: "CAM-02 (Parking Bay 3 CCTV)",
    location: "Bay 3 North Terminal",
    status: "active",
    zone_name: "No-Parking Bay 3",
    vehicle_count: 11,
    violation_count_today: 1,
    thumbnail_url: "/evidence/violations/violation_parking_bay_3_tr1_20260819_184536.jpg",
  },
  {
    id: 3,
    name: "CAM-03 (Junction Gate Area)",
    location: "Traffic Junction 2 East",
    status: "active",
    zone_name: "Emergency Vehicle Access Lane",
    vehicle_count: 7,
    violation_count_today: 0,
    thumbnail_url: "/evidence/violations/violation_parking_cctv_1_tr18_20260819_184602.jpg",
  },
  {
    id: 4,
    name: "CAM-04 (Terminal 1 Arrivals)",
    location: "Terminal 1 Gate Corridor",
    status: "active",
    zone_name: "Passenger Drop-off No-Dwell",
    vehicle_count: 8,
    violation_count_today: 5,
    thumbnail_url: "/evidence/violations/violation_parking_cctv_1_tr23_20260819_184606.jpg",
  },
];

export default function CamerasPage() {
  const [selectedCam, setSelectedCam] = useState<Camera | null>(DEMO_CAMERAS[0]);

  return (
    <div className="min-h-screen bg-ink text-text-primary p-6 space-y-6">
      {/* Header */}
      <PageHeader
        title="Camera Zones & Feeds"
        description="Monitor surveillance cameras, Geo-Fence parameters, and automated detection status across municipal zones"
        breadcrumbs={[{ label: "Overview", href: "/overview" }, { label: "Cameras" }]}
      />

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active CCTV Nodes"
          value="4 / 4"
          icon={<CameraIcon className="h-4 w-4 text-brand" />}
          accent="brand"
        />
        <StatCard
          label="Total Monitored Vehicles"
          value={105}
          icon={<Eye className="h-4 w-4 text-brand" />}
          accent="brand"
        />
        <StatCard
          label="Violations Detected Today"
          value={15}
          icon={<AlertTriangle className="h-4 w-4 text-danger" />}
          accent="danger"
        />
        <StatCard
          label="AI Inference Latency"
          value="33 ms (30 FPS)"
          icon={<CheckCircle2 className="h-4 w-4 text-success" />}
          accent="success"
        />
      </div>

      {/* Cameras Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {DEMO_CAMERAS.map((cam) => (
          <div
            key={cam.id}
            onClick={() => setSelectedCam(cam)}
            className={`rounded-xl border p-4 bg-surface cursor-pointer transition-all shadow-card space-y-3 ${
              selectedCam?.id === cam.id
                ? "border-brand ring-1 ring-brand"
                : "border-border hover:border-border/80 hover:bg-elevated/40"
            }`}
          >
            {/* Camera Header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-primary truncate">
                {cam.name}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                ONLINE
              </span>
            </div>

            {/* Thumbnail */}
            <div className="rounded-lg overflow-hidden border border-border/80 bg-black aspect-video relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cam.thumbnail_url || "/evidence/violations/violation_youtube_test_tr89_20260819_184818.jpg"}
                alt={cam.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="p-2 rounded-full bg-brand text-white shadow-lg">
                  <Play className="h-4 w-4" />
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-1 text-[11px] font-mono text-text-secondary">
              <div className="flex justify-between">
                <span>Zone:</span>
                <span className="text-text-primary font-sans font-medium">{cam.zone_name}</span>
              </div>
              <div className="flex justify-between">
                <span>Location:</span>
                <span className="text-text-muted font-sans truncate">{cam.location}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-border">
                <span>Tracked: <strong className="text-brand">{cam.vehicle_count}</strong></span>
                <span>Violations: <strong className="text-danger">{cam.violation_count_today}</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Camera Details & Video Playback */}
      {selectedCam && (
        <div className="rounded-xl border border-border bg-surface p-6 shadow-card space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
            <div>
              <span className="text-[10px] font-mono text-text-muted uppercase">Selected CCTV Feed</span>
              <h3 className="text-base font-bold text-text-primary">{selectedCam.name}</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-text-secondary">Geo-Fence: 5-Min Dwell Limit</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Player */}
            <div className="lg:col-span-2 rounded-lg overflow-hidden border border-border bg-black aspect-video">
              <video
                src="/videos/annotated_output.mp4"
                autoPlay
                loop
                muted
                playsInline
                controls
                className="w-full h-full object-cover"
              />
            </div>

            {/* Zone & Parameter Panel */}
            <div className="p-4 rounded-lg bg-elevated/40 border border-border space-y-4 text-xs font-mono">
              <span className="text-xs font-semibold font-sans text-text-primary flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-brand" />
                Zone Configuration
              </span>

              <div className="space-y-2 text-text-secondary">
                <div className="flex justify-between p-2 rounded bg-black/40">
                  <span>Zone Name:</span>
                  <span className="text-text-primary">{selectedCam.zone_name}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-black/40">
                  <span>Camera Node:</span>
                  <span className="text-text-primary">{selectedCam.location}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-black/40">
                  <span>Dwell Timeout:</span>
                  <span className="text-danger font-bold">300s (5m 00s)</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-black/40">
                  <span>Fine Penalty:</span>
                  <span className="text-text-primary font-bold">₹500</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-black/40">
                  <span>Model Backend:</span>
                  <span className="text-success font-semibold">YOLO11 + ByteTrack</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
