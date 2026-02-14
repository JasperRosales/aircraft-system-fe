import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plane, Wrench, LogOut, TrendingUp, AlertTriangle, CheckCircle, Clock, BarChart3 } from "lucide-react";

interface MaintenanceStats {
  totalAircraft: number;
  inMaintenance: number;
  available: number;
  inFlight: number;
}

interface PartStats {
  total: number;
  good: number;
  fair: number;
  needsReplacement: number;
}

const mockStats: MaintenanceStats = {
  totalAircraft: 24,
  inMaintenance: 5,
  available: 15,
  inFlight: 4,
};

const mockPartsStats: PartStats = {
  total: 156,
  good: 120,
  fair: 28,
  needsReplacement: 8,
};

const monthlyData = [
  { month: "Jan", repairs: 12, inspections: 28 },
  { month: "Feb", repairs: 18, inspections: 32 },
  { month: "Mar", repairs: 15, inspections: 30 },
  { month: "Apr", repairs: 22, inspections: 35 },
  { month: "May", repairs: 19, inspections: 33 },
  { month: "Jun", repairs: 25, inspections: 38 },
];

const recentAlerts = [
  { id: 1, type: "critical", message: "Engine #3 needs immediate inspection", aircraft: "Boeing 737-800", time: "2 hours ago" },
  { id: 2, type: "warning", message: "Landing gear calibration due", aircraft: "Airbus A320", time: "5 hours ago" },
  { id: 3, type: "info", message: "Scheduled maintenance completed", aircraft: "Cessna 172", time: "1 day ago" },
  { id: 4, type: "warning", message: "Hydraulic fluid level low", aircraft: "Boeing 787-9", time: "2 days ago" },
];

export default function MechanicPage({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<"overview" | "maintenance">("overview");

  const maxValue = Math.max(...monthlyData.map(d => Math.max(d.repairs, d.inspections)));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wrench className="w-8 h-8 text-slate-700" />
            <h1 className="text-xl font-bold text-slate-900">Mechanic Dashboard</h1>
          </div>
          <Button variant="outline" onClick={onLogout} className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Plane className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-sm text-slate-500">Total Aircraft</p>
            <p className="text-2xl font-bold text-slate-900">{mockStats.totalAircraft}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Wrench className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-sm text-slate-500">In Maintenance</p>
            <p className="text-2xl font-bold text-slate-900">{mockStats.inMaintenance}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-slate-500">Available</p>
            <p className="text-2xl font-bold text-slate-900">{mockStats.available}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-slate-500">In Flight</p>
            <p className="text-2xl font-bold text-slate-900">{mockStats.inFlight}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Parts Status Chart */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-slate-600" />
              <h2 className="text-lg font-semibold text-slate-900">Parts Status Overview</h2>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Good Condition</span>
                  <span className="font-medium text-slate-900">{mockPartsStats.good} ({Math.round(mockPartsStats.good / mockPartsStats.total * 100)}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div className="bg-green-500 h-3 rounded-full" style={{ width: `${mockPartsStats.good / mockPartsStats.total * 100}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Fair Condition</span>
                  <span className="font-medium text-slate-900">{mockPartsStats.fair} ({Math.round(mockPartsStats.fair / mockPartsStats.total * 100)}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div className="bg-yellow-500 h-3 rounded-full" style={{ width: `${mockPartsStats.fair / mockPartsStats.total * 100}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Needs Replacement</span>
                  <span className="font-medium text-slate-900">{mockPartsStats.needsReplacement} ({Math.round(mockPartsStats.needsReplacement / mockPartsStats.total * 100)}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div className="bg-red-500 h-3 rounded-full" style={{ width: `${mockPartsStats.needsReplacement / mockPartsStats.total * 100}%` }}></div>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-slate-900">{mockPartsStats.total}</p>
                  <p className="text-xs text-slate-500">Total Parts</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{mockPartsStats.good}</p>
                  <p className="text-xs text-slate-500">Good</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">{mockPartsStats.needsReplacement}</p>
                  <p className="text-xs text-slate-500">Critical</p>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Activity Chart */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-slate-600" />
              <h2 className="text-lg font-semibold text-slate-900">Monthly Maintenance Activity</h2>
            </div>
            <div className="flex items-end justify-between h-48 gap-2">
              {monthlyData.map((data) => (
                <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex gap-1 items-end" style={{ height: "160px" }}>
                    <div
                      className="flex-1 bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                      style={{ height: `${(data.repairs / maxValue) * 100}%` }}
                      title={`Repairs: ${data.repairs}`}
                    ></div>
                    <div
                      className="flex-1 bg-slate-400 rounded-t transition-all hover:bg-slate-500"
                      style={{ height: `${(data.inspections / maxValue) * 100}%` }}
                      title={`Inspections: ${data.inspections}`}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-500">{data.month}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-sm text-slate-600">Repairs</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-400 rounded"></div>
                <span className="text-sm text-slate-600">Inspections</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-900">Recent Alerts</h2>
          </div>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg flex items-center justify-between ${
                  alert.type === "critical"
                    ? "bg-red-50 border border-red-200"
                    : alert.type === "warning"
                    ? "bg-yellow-50 border border-yellow-200"
                    : "bg-blue-50 border border-blue-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle
                    className={`w-5 h-5 ${
                      alert.type === "critical"
                        ? "text-red-500"
                        : alert.type === "warning"
                        ? "text-yellow-500"
                        : "text-blue-500"
                    }`}
                  />
                  <div>
                    <p className="font-medium text-slate-900">{alert.message}</p>
                    <p className="text-sm text-slate-500">{alert.aircraft}</p>
                  </div>
                </div>
                <span className="text-sm text-slate-400">{alert.time}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

