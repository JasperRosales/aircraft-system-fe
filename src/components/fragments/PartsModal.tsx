import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Plus, Pencil, Trash, Clock, Check } from "lucide-react";
import { LinearProgress } from "./LinearProgress";
import { AddPartModal } from "./AddPartModal";
import { EditPartModal } from "./EditPartModal";
import { UpdateAllUsageModal } from "./UpdateAllUsageModal";
import { partService, type PlanePart, type UpdatePlanePartRequest } from "@/service/part.service";
import type { Plane } from "@/service/plane.service";

interface PartsModalProps {
  isOpen: boolean;
  plane: Plane | null;
  parts: PlanePart[];
  loading: boolean;
  onClose: () => void;
  onAddPart: () => Promise<void>;
}

export function PartsModal({ isOpen, plane, parts, loading, onClose, onAddPart }: PartsModalProps) {
  const [showAddPartModal, setShowAddPartModal] = useState(false);
  const [showEditPartModal, setShowEditPartModal] = useState(false);
  const [showUpdateAllUsageModal, setShowUpdateAllUsageModal] = useState(false);
  const [editingPart, setEditingPart] = useState<PlanePart | null>(null);
  const [selectedParts, setSelectedParts] = useState<Set<number>>(new Set());

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  const handleEditPart = (part: PlanePart) => {
    setEditingPart(part);
    setShowEditPartModal(true);
  };

  const handleUpdatePart = async (partId: number, data: UpdatePlanePartRequest) => {
    // First update the general part info
    await partService.updatePart(partId, data);
    
    // If usage_hours was provided, also call the dedicated usage endpoint
    if (data.usage_hours !== undefined) {
      await partService.updatePartUsage(partId, data.usage_hours);
    }
    
    // Refresh the parts list from the server to get the updated values
    await onAddPart();
    // After refresh, fetch the updated part to ensure we have the latest data
    const updatedParts = await partService.getPartsByPlane(plane!.id);
    const updatedPart = updatedParts.find(p => p.id === partId);
    if (updatedPart) {
      setEditingPart(updatedPart);
    }
  };

  const handlePartUpdated = (updatedPart: PlanePart) => {
    // Update the local editing part state with the new values - but don't overwrite
    // if we just refreshed from the server (handled in handleUpdatePart)
    if (!editingPart || editingPart.id !== updatedPart.id) {
      setEditingPart(updatedPart);
    }
  };

  const handleUpdateAllUsage = async (hoursToAdd: number) => {
    for (const part of parts) {
      const newUsageHours = part.usage_hours + hoursToAdd;
      await partService.updatePartUsage(part.id, newUsageHours);
    }
    setShowUpdateAllUsageModal(false);
    await onAddPart();
  };

  const handleAddPartSubmit = async () => {
    setShowAddPartModal(false);
    await onAddPart();
  };

  // Selection handlers
  const togglePartSelection = (partId: number) => {
    setSelectedParts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(partId)) {
        newSet.delete(partId);
      } else {
        newSet.add(partId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedParts.size === parts.length) {
      setSelectedParts(new Set());
    } else {
      setSelectedParts(new Set(parts.map(p => p.id)));
    }
  };

  const handleDeleteSelectedParts = async () => {
    if (selectedParts.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedParts.size} part(s)? This action cannot be undone.`)) return;
    
    for (const partId of selectedParts) {
      await partService.deletePart(partId);
    }
    setSelectedParts(new Set());
    await onAddPart();
  };

  if (!isOpen || !plane) return null;

  return (
    <>
      <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border">
          <div className="p-6 border-b bg-transparent flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-500">{plane.model}</h2>
              <p className="text-gray-500">{plane.tail_number}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {parts.length > 0 && (
                  <button
                    onClick={toggleSelectAll}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      selectedParts.size === parts.length && parts.length > 0
                        ? 'bg-gray-600' 
                        : 'bg-transparent '
                    }`}
                  >
                    {selectedParts.size === parts.length && parts.length > 0 && <Check className="w-3 h-3 text-white" />}
                  </button>
                )}
                <h3 className="font-semibold text-sm text-gray-500">Parts List</h3>
              </div>
              <div className="flex items-center gap-2">
                {selectedParts.size > 0 && (
                  <Button 
                    size="sm" 
                    onClick={handleDeleteSelectedParts}
                    className="flex items-center gap-1 bg-transparent text-black/70 border shadow-2xl hover:bg-gray-100"
                  >
                    <Trash className="w-2 h-" />
                    ({selectedParts.size})
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => setShowUpdateAllUsageModal(true)} className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowAddPartModal(true)} className="flex items-center gap-1">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
              </div>
            ) : parts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No parts found for this aircraft</p>
            ) : (
              <div className="space-y-3">
                {parts.map((part) => (
                  <div key={part.id} className={`flex items-center bg-white outline-1 justify-between p-4 rounded-lg transition-colors ${selectedParts.has(part.id) ? 'border' : 'bg-gray-100 border-2 border-transparent'}`}>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => togglePartSelection(part.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          selectedParts.has(part.id) 
                            ? 'bg-gray-500' 
                            : 'border-gray-400 '
                        }`}
                      >
                        {selectedParts.has(part.id) && <Check className="w-3 h-3 text-white" />}
                      </button>
                      <div>
                        <p className="text-xs md:text-md font-bold text-gray-500">{part.part_name}</p>
                        <p className="text-[10px] md:text-xs text-gray-500">S/N: {part.serial_number}</p>
                        <p className="text-[10px] md:text-xs text-gray-500">Category: {part.category}</p>
                        <div className="md:hidden">
                          <p className="text-[10px] md:text-xs text-gray-500">{part.usage_hours} / {part.usage_limit_hours} hrs</p>
                          <p className="text-[10px] md:text-xs text-gray-500">Installed: {formatDate(part.installed_at)}</p>
                          <LinearProgress percent={part.usage_percent} />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden md:block">
                        <p className="text-xs text-gray-500">{part.usage_hours} / {part.usage_limit_hours} hrs</p>
                        <p className="text-xs text-gray-500">Installed: {formatDate(part.installed_at)}</p>
                        <LinearProgress percent={part.usage_percent} />
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleEditPart(part)}
                          className="flex items-center gap-1 h-8 w-8"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AddPartModal
        isOpen={showAddPartModal}
        onClose={() => setShowAddPartModal(false)}
        onSubmit={async (data) => {
          await partService.addPart(plane.id, data);
          await handleAddPartSubmit();
        }}
      />

      <EditPartModal
        isOpen={showEditPartModal}
        part={editingPart}
        onClose={() => {
          setShowEditPartModal(false);
          setEditingPart(null);
        }}
        onSubmit={handleUpdatePart}
        onUpdated={handlePartUpdated}
      />

      <UpdateAllUsageModal
        isOpen={showUpdateAllUsageModal}
        onClose={() => setShowUpdateAllUsageModal(false)}
        partCount={parts.length}
        onSubmit={handleUpdateAllUsage}
      />
    </>
  );
}

