import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { PlanePart, UpdatePlanePartRequest } from "@/service/part.service";

interface EditPartModalProps {
  isOpen: boolean;
  part: PlanePart | null;
  onClose: () => void;
  onSubmit: (partId: number, data: UpdatePlanePartRequest) => Promise<void>;
}

export function EditPartModal({ isOpen, part, onClose, onSubmit }: EditPartModalProps) {
  const [formData, setFormData] = useState<UpdatePlanePartRequest>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (part) {
      setFormData({
        part_name: part.part_name,
        serial_number: part.serial_number,
        category: part.category,
        usage_limit_hours: part.usage_limit_hours,
        usage_hours: part.usage_hours,
      });
    }
  }, [part]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!part) return;

    try {
      setLoading(true);
      const usageHoursChanged = formData.usage_hours !== undefined && formData.usage_hours !== part.usage_hours;
      const { usage_hours, ...updateData } = formData;
      
      if (Object.keys(updateData).length > 0) {
        await onSubmit(part.id, updateData);
      }
      
      if (usageHoursChanged && formData.usage_hours !== undefined) {
        await onSubmit(part.id, { usage_hours: formData.usage_hours });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !part) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Edit Part</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="edit_part_name" className="block text-sm font-medium text-slate-700 mb-1">
                Part Name
              </label>
              <input
                id="edit_part_name"
                type="text"
                value={formData.part_name || ""}
                onChange={(e) => setFormData({ ...formData, part_name: e.target.value })}
                placeholder="e.g., Engine"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                required
              />
            </div>
            <div>
              <label htmlFor="edit_serial_number" className="block text-sm font-medium text-slate-700 mb-1">
                Serial Number
              </label>
              <input
                id="edit_serial_number"
                type="text"
                value={formData.serial_number || ""}
                onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                placeholder="e.g., SN12345"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                required
              />
            </div>
            <div>
              <label htmlFor="edit_category" className="block text-sm font-medium text-slate-700 mb-1">
                Category
              </label>
              <input
                id="edit_category"
                type="text"
                value={formData.category || ""}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Engine, Avionics, Structural"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                required
              />
            </div>
            <div>
              <label htmlFor="edit_usage_limit_hours" className="block text-sm font-medium text-slate-700 mb-1">
                Usage Limit (Hours)
              </label>
              <input
                id="edit_usage_limit_hours"
                type="number"
                min="1"
                value={formData.usage_limit_hours || ""}
                onChange={(e) => setFormData({ ...formData, usage_limit_hours: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                required
              />
            </div>
            <div>
              <label htmlFor="edit_usage_hours" className="block text-sm font-medium text-slate-700 mb-1">
                Current Usage (Hours)
              </label>
              <input
                id="edit_usage_hours"
                type="number"
                min="0"
                value={formData.usage_hours === undefined ? "" : formData.usage_hours}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({ ...formData, usage_hours: val === "" ? undefined : parseInt(val) || 0 });
                }}
                placeholder="Enter hours"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

