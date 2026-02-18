import { Button } from "@/components/ui/button";
import { X, AlertTriangle, AlertCircle, Plane } from "lucide-react";
import type { PlanePart } from "@/service/part.service";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  parts: PlanePart[];
}

export function NotificationModal({ isOpen, onClose, parts }: NotificationModalProps) {
  if (!isOpen) return null;

  // Filter parts into critical (>=80%) and warning (>=50% and <80%)
  const criticalParts = parts.filter((p) => p.usage_percent >= 80);
  const warningParts = parts.filter((p) => p.usage_percent >= 50 && p.usage_percent < 80);

  const totalAlerts = criticalParts.length + warningParts.length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border">
        <div className="p-6 border-b flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-md md:text-xl font-bold text-gray-500 text-shadow-2xs">Maintenance Alerts</h2>
              <p className="text-xs md:text-sm text-gray-500 text-shadow-2xs">
                {totalAlerts} part{totalAlerts !== 1 ? "s" : ""} requiring attention
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {totalAlerts === 0 ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plane className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-lg font-medium text-gray-400">All Clear!</p>
              <p className="text-gray-500">No parts require immediate attention</p>
            </div>
          ) : (
            <div className="space-y-6">
              {criticalParts.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-red-900" />
                    <h3 className="font-semibold text-red-900">
                      Critical ({criticalParts.length})
                    </h3>
                    <span className="text-xs text-gray-500">(80%+ usage)</span>
                  </div>
                  <div className="space-y-2">
                    {criticalParts.map((part) => (
                      <div
                        key={part.id}
                        className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3"
                      >
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="font-bold text-gray-500 text-sm text-shadow-2xs">
                              {part.part_name}
                            </p>
                            <p className="text-xs text-gray-500 text-shadow-2xs">
                              {part.category}|{part.serial_number}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-red-900 text-shadow-2xs">
                            {part.usage_percent.toFixed(1)}%
                          </span>
                          <p className="text-xs text-gray-500 text-shadow-2xs">
                            {part.usage_hours} / {part.usage_limit_hours} hrs
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {warningParts.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-semibold text-yellow-600">
                      Warning ({warningParts.length})
                    </h3>
                    <span className="text-xs text-slate-500 text-shadow-2xs">(50-79% usage)</span>
                  </div>
                  <div className="space-y-2">
                    {warningParts.map((part) => (
                      <div
                        key={part.id}
                        className="flex items-center justify-between rounded-lg border border-yellow-200 bg-yellow-50 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          <div>
                            <p className="font-medium text-gray-500 text-sm">
                              {part.part_name}
                            </p>
                            <p className="text-xs text-gray-500 text-shadow-2xs">
                              {part.category} | S/N: {part.serial_number}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-yellow-600 text-shadow-2xs">
                            {part.usage_percent.toFixed(1)}%
                          </span>
                          <p className="text-xs text-gray-500 text-shadow-2xs">
                            {part.usage_hours} / {part.usage_limit_hours} hrs
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-slate-50 flex justify-end">
          <Button onClick={onClose} className="bg-gray-500 text-white hover:bg-gray-600 shadow-2xl">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

