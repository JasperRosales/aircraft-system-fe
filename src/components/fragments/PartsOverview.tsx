import type { Plane as PlaneType } from "@/service/plane.service";
import type { PlanePart } from "@/service/part.service";

interface PartsOverviewProps {
    filteredParts: PlanePart[];
    warningParts: PlanePart[];
    planes: PlaneType[];
    selectedPlaneId: number | null;
    onPlaneChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function PartsOverview({
    filteredParts,
    warningParts,
    planes,
    selectedPlaneId,
    onPlaneChange,
}: PartsOverviewProps) {
    // Good: usage < 50%
    const getGoodCount = () =>
        filteredParts.filter((p) => p.usage_percent < 50).length;
    // Warning: 50% <= usage < 80%
    const getWarningCount = () =>
        warningParts.filter((p) => p.usage_percent >= 50 && p.usage_percent < 80).length;
    // Critical: usage >= 80%
    const getCriticalCount = () =>
        filteredParts.filter((p) => p.usage_percent >= 80).length;

    return (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <h2 className="text-md md:text-lg font-semibold text-gray-500 text-shadow-2xs ">
                        Parts Status Overview
                    </h2>
                </div>
                <select
                    value={selectedPlaneId ?? ""}
                    onChange={onPlaneChange}
                    className="rounded-md border border-slate-300 px-1 py-1.5 text-sm text-gray-500 text-shadow-2xs focus:outline-none"
                >
                    <option value="">All Planes</option>
                    {planes.map((plane) => (
                        <option key={plane.model} value={plane.model}>
                            {plane.model}
                        </option>
                    ))}
                </select>
            </div>
            <div className="space-y-4">
                <div>
                    <div className="mb-1 flex justify-between text-sm">
                        <span className="text-slate-600">Good</span>
                        <span className="font-medium text-gray-500 text-shadow-2xs">
                            {filteredParts.length > 0
                                ? Math.round(
                                      (getGoodCount() /
                                          filteredParts.length) *
                                          100
                                  )
                                : 0}
                            %
                        </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-slate-100">
                        <div
                            className="h-3 rounded-full bg-green-500"
                            style={{
                                width: `${
                                    filteredParts.length > 0
                                        ? (getGoodCount() /
                                              filteredParts.length) *
                                          100
                                        : 0
                                }%`,
                            }}
                        ></div>
                    </div>
                </div>
                <div>
                    <div className="mb-1 flex justify-between text-sm">
                        <span className="text-slate-600">Warning</span>
                        <span className="font-medium text-slate-900">
                            {filteredParts.length > 0
                                ? Math.round(
                                      (getWarningCount() /
                                          filteredParts.length) *
                                          100
                                  )
                                : 0}
                            %
                        </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-slate-100">
                        <div
                            className="h-3 rounded-full bg-yellow-500"
                            style={{
                                width: `${
                                    filteredParts.length > 0
                                        ? (getWarningCount() /
                                              filteredParts.length) *
                                          100
                                        : 0
                                }%`,
                            }}
                        ></div>
                    </div>
                </div>
                <div>
                    <div className="mb-1 flex justify-between text-sm">
                        <span className="text-slate-600">Critical</span>
                        <span className="font-medium text-slate-900">
                            {filteredParts.length > 0
                                ? Math.round(
                                      (getCriticalCount() /
                                          filteredParts.length) *
                                          100
                                  )
                                : 0}
                            %
                        </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-slate-100">
                        <div
                            className="h-3 rounded-full bg-red-500"
                            style={{
                                width: `${
                                    filteredParts.length > 0
                                        ? (getCriticalCount() /
                                              filteredParts.length) *
                                          100
                                        : 0
                                }%`,
                            }}
                        ></div>
                    </div>
                </div>
            </div>
            <div className="mt-6 border-t pt-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-2xl font-bold text-slate-900">
                            {filteredParts.length}
                        </p>
                        <p className="text-xs text-slate-500">Total Parts</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-yellow-600">
                            {getWarningCount()}
                        </p>
                        <p className="text-xs text-slate-500">Warning</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-red-600">
                            {getCriticalCount()}
                        </p>
                        <p className="text-xs text-slate-500">Critical</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

