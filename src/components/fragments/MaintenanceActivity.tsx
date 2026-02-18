import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Pencil, Trash2, Eye } from "lucide-react";
import { LinearProgress } from "./LinearProgress";
import type { Plane as PlaneType } from "@/service/plane.service";
import type { PlanePart } from "@/service/part.service";

interface MaintenanceActivityProps {
    planes: PlaneType[];
    currentPlaneIndex: number;
    currentPlaneParts: PlanePart[];
    loading: boolean;
    onNavigateLeft: () => void;
    onNavigateRight: () => void;
    onEdit: (plane: PlaneType) => void;
    onDelete: (plane: PlaneType) => void;
    onViewParts: () => void;
}

export function MaintenanceActivity({
    planes,
    currentPlaneIndex,
    currentPlaneParts,
    loading,
    onNavigateLeft,
    onNavigateRight,
    onEdit,
    onDelete,
    onViewParts,
}: MaintenanceActivityProps) {
    const currentPlane = planes[currentPlaneIndex];

    return (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Maintenance Activity
                    </h2>
                </div>
                {planes.length > 0 && (
                    <span className="text-xs text-slate-500">
                        {currentPlaneIndex + 1} / {planes.length}
                    </span>
                )}
            </div>
            
            {planes.length === 0 ? (
                <div className="flex h-48 items-center justify-center text-slate-500">
                    <p>No planes available</p>
                </div>
            ) : (
                <>
                    {/* Navigation Controls */}
                    <div className="flex items-center justify-between mb-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={onNavigateLeft}
                            className="h-10 w-10"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        
                        <div className="flex-1 mx-4 text-center">
                            <h3 className="text-lg font-bold text-gray-700">
                                {currentPlane?.model}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {currentPlane?.tail_number}
                            </p>
                        </div>
                        
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={onNavigateRight}
                            className="h-10 w-10"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(currentPlane)}
                            className="flex items-center gap-1"
                        >
                            <Pencil className="w-4 h-4" />
                            Edit
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete(currentPlane)}
                            className="flex items-center gap-1 "
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </Button>
                    </div>
                    
                    {/* Parts Preview */}
                    <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold text-gray-600">
                                Parts ({currentPlaneParts.length})
                            </h4>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onViewParts}
                                className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
                            >
                                <Eye className="w-4 h-4" />
                                View All
                            </Button>
                        </div>
                        
                        {loading ? (
                            <div className="flex items-center justify-center py-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
                            </div>
                        ) : currentPlaneParts.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">No parts found for this aircraft</p>
                        ) : (
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {currentPlaneParts.slice(0, 5).map((part) => (
                                    <div key={part.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="text-xs md:text-sm font-medium text-gray-700">{part.part_name}</p>
                                            <p className="text-[10px] text-gray-500">S/N: {part.serial_number}</p>
                                        </div>
                                        <div className="w-20">
                                            <LinearProgress percent={part.usage_percent} />
                                            <p className="text-[10px] text-gray-500 text-right mt-1">
                                                {part.usage_hours}/{part.usage_limit_hours} hrs
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {currentPlaneParts.length > 5 && (
                                    <p className="text-xs text-gray-500 text-center py-2">
                                        +{currentPlaneParts.length - 5} more parts
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

