"use client";

import { useState } from "react";
import { 
  Settings as SettingsIcon, 
  Shield, 
  Clock, 
  DollarSign, 
  Bell, 
  QrCode, 
  Save, 
  Check, 
  Server, 
  Lock,
  User
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";

export default function SettingsPage() {
  const [dwellLimit, setDwellLimit] = useState(5);
  const [fineAmount, setFineAmount] = useState(500);
  const [zonePrefix, setZonePrefix] = useState("SPE-NL");
  const [qrDelivery, setQrDelivery] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.85);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-ink text-text-primary p-6 space-y-6">
      {/* Header */}
      <PageHeader
        title="System Settings & Policy"
        description="Configure enforcement thresholds, penalty parameters, citation delivery rules, and officer credentials"
        breadcrumbs={[{ label: "Overview", href: "/overview" }, { label: "Settings" }]}
      />

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        {/* Card 1: Enforcement Rules */}
        <div className="rounded-xl border border-border bg-surface p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <Shield className="h-4 w-4 text-brand" />
            <h3 className="text-sm font-semibold text-text-primary">
              Parking Enforcement Rules & Thresholds
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="space-y-1.5">
              <label className="text-text-secondary font-sans">
                Max Allowed Dwell Time (Minutes)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={dwellLimit}
                  onChange={(e) => setDwellLimit(Number(e.target.value))}
                  className="w-full p-2 rounded-lg bg-elevated border border-border text-text-primary font-mono focus:outline-none focus:border-brand"
                />
                <span className="text-text-muted font-sans whitespace-nowrap">min (05:00 default)</span>
              </div>
              <p className="text-[10px] text-text-muted font-sans">
                Vehicles stationary in No-Parking Zone exceeding this duration trigger automatic violation.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-text-secondary font-sans">
                Default Fine Amount (INR)
              </label>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-elevated border border-border text-text-muted font-mono">₹</span>
                <input
                  type="number"
                  step={50}
                  value={fineAmount}
                  onChange={(e) => setFineAmount(Number(e.target.value))}
                  className="w-full p-2 rounded-lg bg-elevated border border-border text-text-primary font-mono focus:outline-none focus:border-brand"
                />
              </div>
              <p className="text-[10px] text-text-muted font-sans">
                Standard penalty per Section 177 of Motor Vehicles Act for No-Parking infraction.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-text-secondary font-sans">
                Challan Identifier Prefix
              </label>
              <input
                type="text"
                value={zonePrefix}
                onChange={(e) => setZonePrefix(e.target.value)}
                className="w-full p-2 rounded-lg bg-elevated border border-border text-text-primary font-mono focus:outline-none focus:border-brand"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-text-secondary font-sans">
                OCR Confidence Threshold ({confidenceThreshold})
              </label>
              <input
                type="range"
                min={0.5}
                max={0.99}
                step={0.01}
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                className="w-full accent-brand"
              />
              <div className="flex justify-between text-[10px] text-text-muted">
                <span>0.50 (Permissive)</span>
                <span>0.85 (Recommended)</span>
                <span>0.99 (Strict)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Citation Delivery Method */}
        <div className="rounded-xl border border-border bg-surface p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <QrCode className="h-4 w-4 text-success" />
            <h3 className="text-sm font-semibold text-text-primary">
              Physical & Digital Citation Delivery
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-elevated/60 border border-border">
              <input
                type="checkbox"
                id="qrDelivery"
                checked={qrDelivery}
                onChange={(e) => setQrDelivery(e.target.checked)}
                className="mt-0.5 accent-brand"
              />
              <label htmlFor="qrDelivery" className="space-y-1 cursor-pointer">
                <span className="font-semibold text-text-primary block">
                  Enable Windshield QR Code Sticker Mode
                </span>
                <span className="text-text-secondary text-[11px] block">
                  When a challan is issued, officer prints the citation with a cryptographically signed QR code sticker to affix to the vehicle windshield. Vehicle owner scans to view tamper-evident citation on the public verification portal.
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Card 3: Officer Credentials */}
        <div className="rounded-xl border border-border bg-surface p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <User className="h-4 w-4 text-brand" />
            <h3 className="text-sm font-semibold text-text-primary">
              Officer Profile & Authority
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3 rounded-lg bg-elevated/40 border border-border space-y-1">
              <span className="text-[10px] text-text-muted uppercase font-sans">Active Officer</span>
              <div className="text-xs font-semibold text-text-primary font-sans">
                Inspector V. Hingu (Badge #OFF-2024-001)
              </div>
            </div>
            <div className="p-3 rounded-lg bg-elevated/40 border border-border space-y-1">
              <span className="text-[10px] text-text-muted uppercase font-sans">Jurisdiction Unit</span>
              <div className="text-xs font-semibold text-text-primary font-sans">
                Traffic Enforcement Division · Central Zone
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && (
            <span className="text-xs text-success flex items-center gap-1 font-medium animate-fade-in">
              <Check className="h-4 w-4" /> Settings updated successfully
            </span>
          )}
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand text-white text-xs font-semibold hover:bg-brand/90 transition-all shadow-sm"
          >
            <Save className="h-4 w-4" />
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
