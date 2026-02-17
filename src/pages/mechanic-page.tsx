import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plane, Wrench, LogOut, TrendingUp, AlertTriangle, CheckCircle, Clock, BarChart3 } from "lucide-react";
import { planeService, type Plane as PlaneType } from "@/service/plane.service";
import { partService, type PlanePart } from "@/service/part.service";

export default function MechanicPage({ onLogout }: { onLogout: () => void }) {
  const [planes, setPlanes] = useState<PlaneType[]>([]);
  const [maintenanceAlerts, setMaintenanceAlerts] = useState<PlanePart[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [planesData, alertsData] = await Promise.all([
        planeService.getAllPlanes(),
        partService.getMaintenanceAlerts(80),
      ]);
      setPlanes(planesData);
      setMaintenanceAlerts(alertsData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAlertType = (part: PlanePart): "critical" | "warning" | "info" => {
    if (part.usage_percent >= 80) {
      return "critical";
    }
    if (part.usage_percent >= 50) {
      return "warning";
    }
    return "info";
  };

  const getGoodCount = () => maintenanceAlerts.filter(p => p.usage_percent < 50).length;
  const getWarningCount = () => maintenanceAlerts.filter(p => p.usage_percent >= 50 && p.usage_percent < 80).length;
  const getCriticalCount = () => maintenanceAlerts.filter(p => p.usage_percent >= 80).length;

  return (
    <div className="min-h-screen bg-slate-50">
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
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Plane className="w-6 h-6 text-blue-600" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-sm text-slate-500">Total Aircraft</p>
                <p className="text-2xl font-bold text-slate-900">{planes.length}</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Wrench className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
                <p className="text-sm text-slate-500">Parts Needing Attention</p>
                <p className="text-2xl font-bold text-slate-900">{getCriticalCount()}</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <p className="text-sm text-slate-500">Good Condition Parts</p>
                <p className="text-2xl font-bold text-slate-900">{getGoodCount()}</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-sm text-slate-500">Total Parts Tracked</p>
                <p className="text-2xl font-bold text-slate-900">{maintenanceAlerts.length}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="w-5 h-5 text-slate-600" />
                  <h2 className="text-lg font-semibold text-slate-900">Parts Status Overview</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">Good</span>
                      <span className="font-medium text-slate-900">
                        {maintenanceAlerts.length > 0 ? Math.round((getGoodCount() / maintenanceAlerts.length) * 100) : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3">
                      <div className="bg-green-500 h-3 rounded-full" style={{ width: `${maintenanceAlerts.length > 0 ? (getGoodCount() / maintenanceAlerts.length) * 100 : 0}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">Warning</span>
                      <span className="font-medium text-slate-900">
                        {maintenanceAlerts.length > 0 ? Math.round((getWarningCount() / maintenanceAlerts.length) * 100) : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3">
                      <div className="bg-yellow-500 h-3 rounded-full" style={{ width: `${maintenanceAlerts.length > 0 ? (getWarningCount() / maintenanceAlerts.length) * 100 : 0}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">Critical</span>
                      <span className="font-medium text-slate-900">
                        {maintenanceAlerts.length > 0 ? Math.round((getCriticalCount() / maintenanceAlerts.length) * 100) : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3">
                      <div className="bg-red-500 h-3 rounded-full" style={{ width: `${maintenanceAlerts.length > 0 ? (getCriticalCount() / maintenanceAlerts.length) * 100 : 0}%` }}></div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{maintenanceAlerts.length}</p>
                      <p className="text-xs text-slate-500">Total Parts</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">{getGoodCount()}</p>
                      <p className="text-xs text-slate-500">Good</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-600">{getCriticalCount()}</p>
                      <p className="text-xs text-slate-500">Critical</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-slate-600" />
                  <h2 className="text-lg font-semibold text-slate-900">Maintenance Activity</h2>
                </div>
                <div className="flex items-center justify-center h-48 text-slate-500">
                  <p>Historical maintenance data will appear here</p>
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

            <div className="mt-6 bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-slate-600" />
                <h2 className="text-lg font-semibold text-slate-900">Maintenance Alerts</h2>
              </div>
              {maintenanceAlerts.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p>No maintenance alerts at this time</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {maintenanceAlerts.map((alert) => (
                    <div key={alert.id} className={`p-4 rounded-lg flex items-center justify-between ${getAlertType(alert) === "critical" ? "bg-red-50 border border-red-200" : getAlertType(alert) === "warning" ? "bg-yellow-50 border border-yellow-200" : "bg-blue-50 border border-blue-200"}`}>
                      <div className="flex items-center gap-3">
                        <AlertTriangle className={`w-5 h-5 ${getAlertType(alert) === "critical" ? "text-red-500" : getAlertType(alert) === "warning" ? "text-yellow-500" : "text-blue-500"}`} />
                        <div>
                          <p className="font-medium text-slate-900">{alert.part_name}</p>
                          <p className="text-sm text-slate-500">Category: {alert.category} | S/N: {alert.serial_number}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-medium ${getAlertType(alert) === "critical" ? "text-red-600" : getAlertType(alert) === "warning" ? "text-yellow-600" : "text-blue-600"}`}>
                          {alert.usage_percent.toFixed(1)}% used
                        </span>
                        <p className="text-sm text-slate-400">{alert.usage_hours} / {alert.usage_limit_hours} hrs</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

