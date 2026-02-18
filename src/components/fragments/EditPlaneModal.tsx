import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { Plane } from "@/service/plane.service";

interface EditPlaneModalProps {
  isOpen: boolean;
  plane: Plane | null;
  onClose: () => void;
  onSubmit: (planeId: number, data: { tail_number: string; model: string }) => Promise<void>;
}

export function EditPlaneModal({ isOpen, plane, onClose, onSubmit }: EditPlaneModalProps) {
  const [formData, setFormData] = useState<{ tail_number: string; model: string }>({ tail_number: "", model: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (plane) {
      setFormData({
        tail_number: plane.tail_number,
        model: plane.model,
      });
    }
  }, [plane]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plane) return;

    try {
      setLoading(true);
      await onSubmit(plane.id, formData);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !plane) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-500">Edit Plane</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="edit_tail_number" className="block text-sm font-medium text-gray-500 mb-1">
                Tail Number
              </label>
              <input
                id="edit_tail_number"
                type="text"
                value={formData.tail_number || ""}
                onChange={(e) => setFormData({ ...formData, tail_number: e.target.value })}
                placeholder="e.g., N12345"
                className="w-full px-3 py-2 border rounded-lg text-gray-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label htmlFor="edit_model" className="block text-sm font-medium text-gray-500 mb-1">
                Model
              </label>
              <input
                id="edit_model"
                type="text"
                value={formData.model || ""}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="e.g., Boeing 737"
                className="w-full px-3 py-2 border text-gray-500 rounded-lg focus:outline-none"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-gray-500 hover:bg-gray-600">
              {loading ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

