"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  AlertTriangle,
  Clock,
  MapPin,
  ShieldCheck,
  Loader2
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

// Time range wise dynamic data
const DYNAMIC_RANGE_DATA = {
  "7d": [
    { date: "14 Aug", violations: 8, vehicles: 62 },
    { date: "15 Aug", violations: 12, vehicles: 85 },
    { date: "16 Aug", violations: 6, vehicles: 54 },
    { date: "17 Aug", violations: 15, vehicles: 110 },
    { date: "18 Aug", violations: 11, vehicles: 92 },
    { date: "19 Aug", violations: 18, vehicles: 125 },
    { date: "20 Aug", violations: 15, vehicles: 105 },
  ],
  "30d": [
    { date: "Week 1", violations: 45, vehicles: 320 },
    { date: "Week 2", violations: 62, vehicles: 450 },
    { date: "Week 3", violations: 58, vehicles: 410 },
    { date: "Week 4", violations: 75, vehicles: 530 },
  ],
  "90d": [
    { date: "June", violations: 180, vehicles: 1400 },
    { date: "July", violations: 210, vehicles: 1650 },
    { date: "August", violations: 240, vehicles: 1890 },
  ],
};

const FALLBACK_ZONE = [
  { zone: "Nagaland Main Street", violations: 9, fine: 4500 },
  { zone: "Terminal 1 Gate", violations: 5, fine: 2500 },
  { zone: "Parking Bay 3", violations: 1, fine: 500 },
  { zone: "Junction Access Lane", violations: 0, fine: 0 },
];

const VEHICLE_DATA = [
  { name: "Cars / Sedans", value: 68, color: "#4C6FFF" },
  { name: "SUVs", value: 24, color: "#22C55E" },
  { name: "Motorcycles / Scooters", value: 12, color: "#F59E0B" },
  { name: "Trucks & Vans", value: 6, color: "#EF4444" },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("7d");
  const [loading, setLoading] = useState<boolean>(false);
  const [dailyData, setDailyData] = useState(DYNAMIC_RANGE_DATA["7d"]);
  const [zoneData, setZoneData] = useState(FALLBACK_ZONE);

  useEffect(() => {
    async function fetchAnalyticsData() {
      setLoading(true);
      try {
        const response = await fetch(`/api/analytics?range=${timeRange}`);
        if (!response.ok) throw new Error("API call failed");

        const data = await response.json();
        if (data.daily) setDailyData(data.daily);
        if (data.zones) setZoneData(data.zones);
      } catch (err) {
        // Backend API fail thay to dynamic range wise data set thase
        setDailyData(DYNAMIC_RANGE_DATA[timeRange]);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalyticsData();
  }, [timeRange]);

  const totalViolations = dailyData.reduce((acc, item) => acc + item.violations, 0);

  return (
    <div className="min-h-screen bg-ink text-text-primary p-6 space-y-6">
      {/* Header */}
      <PageHeader
        title="Enforcement Analytics"
        description="Trends, zone hotspot statistics, and vehicle type distribution for municipal traffic planning"
        breadcrumbs={[{ label: "Overview", href: "/overview" }, { label: "Analytics" }]}
        actions={
          <div className="flex items-center gap-1 bg-surface p-1 rounded-lg border border-border">
            {(["7d", "30d", "90d"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded text-[11px] font-medium transition-all ${timeRange === range
                  ? "bg-brand text-white shadow-sm font-semibold"
                  : "text-text-secondary hover:text-text-primary"
                  }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
        }
      />

      {/* Dynamic Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label={`Total Violations (${timeRange.toUpperCase()})`}
          value={loading ? "..." : totalViolations}
          delta="+14.2%"
          deltaType="up"
          icon={<AlertTriangle className="h-4 w-4 text-danger" />}
          accent="danger"
        />
        <StatCard
          label="Peak Violation Hour"
          value="09:00 - 11:30"
          icon={<Clock className="h-4 w-4 text-warning" />}
          accent="warning"
        />
        <StatCard
          label="Top Hotspot Zone"
          value={zoneData[0]?.zone || "N/A"}
          icon={<MapPin className="h-4 w-4 text-brand" />}
          accent="brand"
        />
        <StatCard
          label="Compliance Rate"
          value="88.6%"
          delta="+3.1%"
          deltaType="up"
          icon={<ShieldCheck className="h-4 w-4 text-success" />}
          accent="success"
        />
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Violations Line Chart */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-surface p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">
                Daily Violations & Monitored Vehicles
              </h3>
              <p className="text-xs text-text-muted">
                {timeRange.toUpperCase()} window of parking infractions detected
              </p>
            </div>
            {loading && <Loader2 className="h-4 w-4 animate-spin text-brand" />}
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="#5B6070" fontSize={11} />
                <YAxis stroke="#5B6070" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#12151B",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "#EDEEF1",
                  }}
                />
                <Line type="monotone" dataKey="violations" stroke="#EF4444" strokeWidth={2.5} dot={{ fill: "#EF4444", r: 4 }} name="Violations" />
                <Line type="monotone" dataKey="vehicles" stroke="#4C6FFF" strokeWidth={2} strokeDasharray="4 4" dot={{ fill: "#4C6FFF", r: 3 }} name="Vehicles" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vehicle Classification Pie Chart */}
        <div className="rounded-xl border border-border bg-surface p-5 shadow-card space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Vehicle Type Distribution</h3>
            <p className="text-xs text-text-muted">Composition of detected vehicles</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={VEHICLE_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                  {VEHICLE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#12151B", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs font-mono">
            {VEHICLE_DATA.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-text-secondary">
                <span className="flex items-center gap-2 font-sans">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-bold text-text-primary">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Zone Hotspots Bar Chart */}
      <div className="rounded-xl border border-border bg-surface p-5 shadow-card space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Violations & Revenue by Municipal Zone</h3>
          <p className="text-xs text-text-muted">Active enforcement zones</p>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={zoneData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="zone" stroke="#5B6070" fontSize={11} />
              <YAxis stroke="#5B6070" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: "#12151B", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }} />
              <Bar dataKey="violations" fill="#4C6FFF" radius={[4, 4, 0, 0]} name="Violations" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}