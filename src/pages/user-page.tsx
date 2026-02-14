import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plane, Wrench, LogOut, ChevronRight, X } from "lucide-react";

interface Plane {
  id: string;
  model: string;
  registration: string;
  status: "available" | "maintenance" | "in-flight";
}

interface Part {
  id: string;
  name: string;
  serialNumber: string;
  condition: "good" | "fair" | "needs-replacement";
  lastMaintenance: string;
}

const mockPlanes: Plane[] = [
  { id: "1", model: "Boeing 737-800", registration: "N123AB", status: "available" },
  { id: "2", model: "Airbus A320", registration: "N456CD", status: "maintenance" },
  { id: "3", model: "Cessna 172", registration: "N789EF", status: "available" },
  { id: "4", model: "Boeing 787-9", registration: "N101GH", status: "in-flight" },
  { id: "5", model: "Airbus A350", registration: "N202IJ", status: "available" },
];

const mockParts: Record<string, Part[]> = {
  "1": [
    { id: "p1", name: "Left Engine", serialNumber: "ENG-001", condition: "good", lastMaintenance: "2024-01-15" },
    { id: "p2", name: "Right Engine", serialNumber: "ENG-002", condition: "good", lastMaintenance: "2024-01-15" },
    { id: "p3", name: "Landing Gear", serialNumber: "LG-001", condition: "fair", lastMaintenance: "2023-12-01" },
    { id: "p4", name: "Avionics System", serialNumber: "AV-001", condition: "good", lastMaintenance: "2024-02-01" },
  ],
  "2": [
    { id: "p5", name: "Left Engine", serialNumber: "ENG-003", condition: "needs-replacement", lastMaintenance: "2023-11-20" },
    { id: "p6", name: "Right Engine", serialNumber: "ENG-004", condition: "good", lastMaintenance: "2024-01-10" },
    { id: "p7", name: "Hydraulic System", serialNumber: "HYD-001", condition: "fair", lastMaintenance: "2023-12-15" },
  ],
  "3": [
    { id: "p8", name: "Engine", serialNumber: "ENG-005", condition: "good", lastMaintenance: "2024-01-20" },
    { id: "p9", name: "Propeller", serialNumber: "PROP-001", condition: "good", lastMaintenance: "2024-01-20" },
  ],
  "4": [
    { id: "p10", name: "Left Engine", serialNumber: "ENG-006", condition: "good", lastMaintenance: "2024-02-01" },
    { id: "p11", name: "Right Engine", serialNumber: "ENG-007", condition: "good", lastMaintenance: "2024-02-01" },
  ],
  "5": [
    { id: "p12", name: "Left Engine", serialNumber: "ENG-008", condition: "good", lastMaintenance: "2024-01-25" },
    { id: "p13", name: "Right Engine", serialNumber: "ENG-009", condition: "good", lastMaintenance: "2024-01-25" },
    { id: "p14", name: "Cabin Pressurization", serialNumber: "CP-001", condition: "good", lastMaintenance: "2024-01-25" },
  ],
};

export default function UserPage({ onLogout }: { onLogout: () => void }) {
  const [selectedPlane, setSelectedPlane] = useState<Plane | null>(null);

  const getStatusColor = (status: Plane["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
    case "in-flight":
        return "bg-blue-100 text-blue-800";
    }
  };

  const getConditionColor = (condition: Part["condition"]) => {
    switch (condition) {
      case "good":
        return "text-green-600";
      case "fair":
        return "text-yellow-600";
      case "needs-replacement":
        return "text-red-600";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Plane className="w-8 h-8 text-slate-700" />
            <h1 className="text-xl font-bold text-slate-900">User Dashboard</h1>
          </div>
          <Button variant="outline" onClick={onLogout} className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Available Planes</h2>
          <p className="text-slate-500">Browse and view aircraft details</p>
        </div>

        {/* Planes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockPlanes.map((plane) => (
            <div
              key={plane.id}
              className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Plane className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{plane.model}</h3>
                    <p className="text-sm text-slate-500">{plane.registration}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(plane.status)}`}>
                  {plane.status}
                </span>
              </div>
              <Button
                onClick={() => setSelectedPlane(plane)}
                className="w-full flex items-center justify-center gap-2"
              >
                <Wrench className="w-4 h-4" />
                View Parts
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </main>

      {/* Parts Modal */}
      {selectedPlane && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selectedPlane.model}</h2>
                <p className="text-slate-500">{selectedPlane.registration}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedPlane(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <h3 className="font-semibold text-slate-900 mb-4">Parts List</h3>
              <div className="space-y-3">
                {mockParts[selectedPlane.id]?.map((part) => (
                  <div
                    key={part.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{part.name}</p>
                      <p className="text-sm text-slate-500">S/N: {part.serialNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${getConditionColor(part.condition)}`}>
                        {part.condition.replace("-", " ")}
                      </p>
                      <p className="text-xs text-slate-500">Last: {part.lastMaintenance}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

