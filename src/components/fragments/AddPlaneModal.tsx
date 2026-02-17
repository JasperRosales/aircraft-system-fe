import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface AddPlaneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { tail_number: string; model: string }) => Promise<void>;
}

export function AddPlaneModal({ isOpen, onClose, onSubmit }: AddPlaneModalProps) {
  const [formData, setFormData] = useState({ tail_number: "", model: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tail_number.trim() || !formData.model.trim()) return;
    
    try {
      setLoading(true);
      await onSubmit({
        tail_number: formData.tail_number.trim(),
        model: formData.model.trim(),
      });
      setFormData({ tail_number: "", model: "" });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Add New Plane</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="tail_number" className="block text-sm font-medium text-slate-700 mb-1">
                Tail Number
              </label>
              <input
                id="tail_number"
                type="text"
                value={formData.tail_number}
                onChange={(e) => setFormData({ ...formData, tail_number: e.target.value })}
                placeholder="e.g., N12345"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                required
              />
            </div>
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-slate-700 mb-1">
                Model
              </label>
              <input
                id="model"
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="e.g., Boeing 737"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Plane"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

