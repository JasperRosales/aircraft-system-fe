import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plane, Wrench, ChevronRight, Plus, Pencil, Trash } from "lucide-react";
import { planeService, type Plane as PlaneType } from "@/service/plane.service";
import { partService, type PlanePart } from "@/service/part.service";
import { AddPlaneModal } from "@/components/fragments/AddPlaneModal";
import { EditPlaneModal } from "@/components/fragments/EditPlaneModal";
import { ConfirmDeleteModal } from "@/components/fragments/ConfirmDeleteModal";
import { PartsModal } from "@/components/fragments/PartsModal";
import Header from "@/components/mvpblocks/header-2";

export default function UserPage({ onLogout }: { onLogout: () => void }) {
  const [planes, setPlanes] = useState<PlaneType[]>([]);
  const [selectedPlane, setSelectedPlane] = useState<PlaneType | null>(null);
  const [parts, setParts] = useState<PlanePart[]>([]);
  const [loading, setLoading] = useState(true);
  const [partsLoading, setPartsLoading] = useState(false);
const [showAddModal, setShowAddModal] = useState(false);
  const [editingPlane, setEditingPlane] = useState<PlaneType | null>(null);
  const [deletingPlane, setDeletingPlane] = useState<PlaneType | null>(null);

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

const handleEditPlane = async (planeId: number, data: { tail_number: string; model: string }) => {
    await planeService.updatePlane(planeId, { tail_number: data.tail_number, model: data.model });
    setEditingPlane(null);
    loadPlanes();
  };

const handleDeletePlane = async (planeId: number) => {
    await planeService.deletePlane(planeId);
    setDeletingPlane(null);
    loadPlanes();
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
    <div className="relative min-h-screen overflow-x-hidden">
      <Header onLogout={onLogout}/>

      <main className="max-w-7xl mx-auto px-4 pt-16 py-8 relative">
        <div className="mb-6 mt-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm md:text-lg font-semibold text-gray-500">Available Planes</h2>
            <p className="text-xs text-slate-500">Browse and view aircraft details</p>
          </div>
          <Button 
            onClick={() => setShowAddModal(true)} 
            className="flex items-center gap-2 bg-gray-500 hover:bg-gray-700 text-white border border-gray-400 shadow-lg shadow-gray-700/40"
          >
            <Plus className="w-4 h-4" />
            Add Plane
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
          </div>
        ) : planes.length === 0 ? (
          <div className="text-center py-12">
            <Plane className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-slate-500">No planes available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {planes.map((plane) => (
              <div
                key={plane.id}
                className="bg-white rounded-xl shadow-2xl border p-6 hover:shadow-lg transition-shadow"
              >
<div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Plane className="w-6 h-6 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-500">{plane.model}</h3>
                      <p className="text-sm text-slate-400">{plane.tail_number}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEditingPlane(plane)}
                      className="h-8 w-8"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
<Button
                      variant="outline"
                      size="icon"
                      onClick={() => setDeletingPlane(plane)}
                      className="h-8 w-8 bg-transparent text-black/70 border shadow-2xl hover:bg-gray-100"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-slate-400 mb-4">
                  <p>Registered: {formatDate(plane.created_at)}</p>
                </div>
                <Button
                  onClick={() => handleViewParts(plane)}
                  className="w-full flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-700 text-white border border-gray-400 shadow-lg shadow-gray-700/40"
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

<EditPlaneModal
        isOpen={!!editingPlane}
        plane={editingPlane}
        onClose={() => setEditingPlane(null)}
        onSubmit={handleEditPlane}
      />

      <ConfirmDeleteModal
        isOpen={!!deletingPlane}
        title="Delete Plane"
        message={`Are you sure you want to delete ${deletingPlane?.model} (${deletingPlane?.tail_number})? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={() => deletingPlane && handleDeletePlane(deletingPlane.id)}
        onClose={() => setDeletingPlane(null)}
      />
    </div>
  );
}

