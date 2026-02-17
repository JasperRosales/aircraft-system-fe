import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Plus, Pencil, Trash, Clock } from "lucide-react";
import { CircularProgress } from "./CircularProgress";
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
    await partService.updatePart(partId, data);
    await onAddPart();
  };

  const handleDeletePart = async (partId: number) => {
    if (!confirm("Are you sure you want to delete this part? This action cannot be undone.")) return;
    await partService.deletePart(partId);
    await onAddPart();
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

  if (!isOpen || !plane) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
          <div className="p-6 border-b flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{plane.model}</h2>
              <p className="text-slate-500">{plane.tail_number}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Parts List</h3>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setShowUpdateAllUsageModal(true)} className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Update All Usage
                </Button>
                <Button size="sm" onClick={() => setShowAddPartModal(true)} className="flex items-center gap-1">
                  <Plus className="w-4 h-4" />
                  Add Part
                </Button>
              </div>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-900"></div>
              </div>
            ) : parts.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No parts found for this aircraft</p>
            ) : (
              <div className="space-y-3">
                {parts.map((part) => (
                  <div key={part.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">{part.part_name}</p>
                      <p className="text-sm text-slate-500">S/N: {part.serial_number}</p>
                      <p className="text-sm text-slate-500">Category: {part.category}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <CircularProgress percent={part.usage_percent} />
                      <div className="text-right">
                        <p className="text-xs text-slate-500">{part.usage_hours} / {part.usage_limit_hours} hrs</p>
                        <p className="text-xs text-slate-500">Installed: {formatDate(part.installed_at)}</p>
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
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleDeletePart(part.id)}
                          className="flex items-center gap-1 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash className="w-4 h-4" />
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

