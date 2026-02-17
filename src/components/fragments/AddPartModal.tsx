import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface AddPartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    part_name: string;
    serial_number: string;
    category: string;
    usage_hours: number;
    usage_limit_hours: number;
  }) => Promise<void>;
}

export function AddPartModal({ isOpen, onClose, onSubmit }: AddPartModalProps) {
  const [formData, setFormData] = useState({
    part_name: "",
    serial_number: "",
    category: "",
    usage_hours: 0,
    usage_limit_hours: 1000,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.part_name.trim() || !formData.serial_number.trim() || !formData.category.trim()) return;
    
    try {
      setLoading(true);
      await onSubmit({
        part_name: formData.part_name.trim(),
        serial_number: formData.serial_number.trim(),
        category: formData.category.trim(),
        usage_hours: formData.usage_hours,
        usage_limit_hours: formData.usage_limit_hours,
      });
      setFormData({
        part_name: "",
        serial_number: "",
        category: "",
        usage_hours: 0,
        usage_limit_hours: 1000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Add New Part</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="part_name" className="block text-sm font-medium text-slate-700 mb-1">
                Part Name
              </label>
              <input
                id="part_name"
                type="text"
                value={formData.part_name}
                onChange={(e) => setFormData({ ...formData, part_name: e.target.value })}
                placeholder="e.g., Engine"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                required
              />
            </div>
            <div>
              <label htmlFor="serial_number" className="block text-sm font-medium text-slate-700 mb-1">
                Serial Number
              </label>
              <input
                id="serial_number"
                type="text"
                value={formData.serial_number}
                onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                placeholder="e.g., SN12345"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                required
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
                Category
              </label>
              <input
                id="category"
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Engine, Avionics, Structural"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="usage_hours" className="block text-sm font-medium text-slate-700 mb-1">
                  Usage Hours
                </label>
                <input
                  id="usage_hours"
                  type="number"
                  min="0"
                  value={formData.usage_hours}
                  onChange={(e) => setFormData({ ...formData, usage_hours: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>
              <div>
                <label htmlFor="usage_limit_hours" className="block text-sm font-medium text-slate-700 mb-1">
                  Usage Limit (Hours)
                </label>
                <input
                  id="usage_limit_hours"
                  type="number"
                  min="1"
                  value={formData.usage_limit_hours}
                  onChange={(e) => setFormData({ ...formData, usage_limit_hours: parseInt(e.target.value) || 1000 })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  required
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Part"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

