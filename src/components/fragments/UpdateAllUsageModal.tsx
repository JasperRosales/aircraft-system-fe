import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface UpdateAllUsageModalProps {
  isOpen: boolean;
  onClose: () => void;
  partCount: number;
  onSubmit: (hoursToAdd: number) => Promise<void>;
}

export function UpdateAllUsageModal({ isOpen, onClose, partCount, onSubmit }: UpdateAllUsageModalProps) {
  const [hoursToAdd, setHoursToAdd] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hoursToAdd <= 0) return;
    
    try {
      setLoading(true);
      await onSubmit(hoursToAdd);
      setHoursToAdd(0);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Update All Parts Usage</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              This will add hours to <strong>all parts</strong> of this aircraft. Enter the number of hours to add.
            </p>
            <div>
              <label htmlFor="hours_to_add" className="block text-sm font-medium text-slate-700 mb-1">
                Hours to Add
              </label>
              <input
                id="hours_to_add"
                type="number"
                min="1"
                value={hoursToAdd}
                onChange={(e) => setHoursToAdd(parseInt(e.target.value) || 0)}
                placeholder="e.g., 10"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                required
              />
            </div>
            {partCount > 0 && (
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-sm text-slate-600">
                  <strong>{partCount}</strong> part(s) will be updated.
                </p>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || partCount === 0}>
              {loading ? "Updating..." : "Update All Parts"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

