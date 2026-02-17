import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plane, Wrench, LogOut, ChevronRight, Plus } from "lucide-react";
import { planeService, type Plane as PlaneType } from "@/service/plane.service";
import { partService, type PlanePart } from "@/service/part.service";
import { AddPlaneModal } from "@/components/fragments/AddPlaneModal";
import { PartsModal } from "@/components/fragments/PartsModal";

export default function UserPage({ onLogout }: { onLogout: () => void }) {
  const [planes, setPlanes] = useState<PlaneType[]>([]);
  const [selectedPlane, setSelectedPlane] = useState<PlaneType | null>(null);
  const [parts, setParts] = useState<PlanePart[]>([]);
  const [loading, setLoading] = useState(true);
  const [partsLoading, setPartsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadPlanes();
  }, []);

  const loadPlanes = async () => {
    try {
      setLoading(true);
      const data = await planeService.getAllPlanes();
      setPlanes(data);
    } catch (error) {
      console.error("Failed to load planes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewParts = async (plane: PlaneType) => {
    setSelectedPlane(plane);
    setPartsLoading(true);
    try {
      const planeParts = await partService.getPartsByPlane(plane.id);
      setParts(planeParts);
    } catch (error) {
      console.error("Failed to load parts:", error);
      setParts([]);
    } finally {
      setPartsLoading(false);
    }
  };

  const handleAddPlane = async (data: { tail_number: string; model: string }) => {
    await planeService.createPlane(data);
    setShowAddModal(false);
    loadPlanes();
  };

  const handlePartsUpdated = async () => {
    if (selectedPlane) {
      const planeParts = await partService.getPartsByPlane(selectedPlane.id);
      setParts(planeParts);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
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
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Available Planes</h2>
            <p className="text-slate-500">Browse and view aircraft details</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Plane
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
          </div>
        ) : planes.length === 0 ? (
          <div className="text-center py-12">
            <Plane className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500">No planes available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {planes.map((plane) => (
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
                      <p className="text-sm text-slate-500">{plane.tail_number}</p>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-slate-500 mb-4">
                  <p>Registered: {formatDate(plane.created_at)}</p>
                </div>
                <Button
                  onClick={() => handleViewParts(plane)}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Wrench className="w-4 h-4" />
                  View Parts
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>

      <AddPlaneModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddPlane}
      />

      <PartsModal
        isOpen={!!selectedPlane}
        plane={selectedPlane}
        parts={parts}
        loading={partsLoading}
        onClose={() => setSelectedPlane(null)}
        onAddPart={handlePartsUpdated}
      />
    </div>
  );
}

