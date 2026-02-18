import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { planeService, type Plane as PlaneType } from "@/service/plane.service";
import { partService, type PlanePart } from "@/service/part.service";
import Header from "@/components/mvpblocks/header-2";
import { NotificationModal } from "@/components/fragments/NotificationModal";
import { EditPlaneModal } from "@/components/fragments/EditPlaneModal";
import { ConfirmDeleteModal } from "@/components/fragments/ConfirmDeleteModal";
import { PartsModal } from "@/components/fragments/PartsModal";
import { MaintenanceActivity } from "@/components/fragments/MaintenanceActivity";

export default function MechanicPage({ onLogout }: { onLogout: () => void }) {
    const [loading, setLoading] = useState(true);
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [planes, setPlanes] = useState<PlaneType[]>([]);
    const [selectedPlaneId, setSelectedPlaneId] = useState<number | null>(null);
    const [filteredParts, setFilteredParts] = useState<PlanePart[]>([]);
    const [warningParts, setWarningParts] = useState<PlanePart[]>([]);
    
    const [currentPlaneIndex, setCurrentPlaneIndex] = useState(0);
    const [currentPlaneParts, setCurrentPlaneParts] = useState<PlanePart[]>([]);
    const [currentPlaneLoading, setCurrentPlaneLoading] = useState(false);
    
    const [showEditPlaneModal, setShowEditPlaneModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPartsModal, setShowPartsModal] = useState(false);
    const [editingPlane, setEditingPlane] = useState<PlaneType | null>(null);

    useEffect(() => {
        loadData();
        loadPlanes();
    }, []);

    const loadPlanes = async () => {
        try {
            const planesData = await planeService.getAllPlanes();
            setPlanes(planesData);
            // Load parts for the first plane if available
            if (planesData.length > 0) {
                loadPartsByPlaneId(planesData[0].id);
            }
        } catch (error) {
            console.error("Failed to load planes:", error);
        }
    };

    const loadPartsByPlaneId = async (planeId: number) => {
        try {
            setCurrentPlaneLoading(true);
            const parts = await partService.getPartsByPlane(planeId);
            setCurrentPlaneParts(parts);
        } catch (error) {
            console.error("Failed to load plane parts:", error);
            setCurrentPlaneParts([]);
        } finally {
            setCurrentPlaneLoading(false);
        }
    };

    const handleNavigateLeft = () => {
        if (planes.length === 0) return;
        const newIndex = currentPlaneIndex > 0 ? currentPlaneIndex - 1 : planes.length - 1;
        setCurrentPlaneIndex(newIndex);
        loadPartsByPlaneId(planes[newIndex].id);
    };

    const handleNavigateRight = () => {
        if (planes.length === 0) return;
        const newIndex = currentPlaneIndex < planes.length - 1 ? currentPlaneIndex + 1 : 0;
        setCurrentPlaneIndex(newIndex);
        loadPartsByPlaneId(planes[newIndex].id);
    };

    const handleEditPlane = (plane: PlaneType) => {
        setEditingPlane(plane);
        setShowEditPlaneModal(true);
    };

    const handleUpdatePlane = async (planeId: number, data: { tail_number: string; model: string }) => {
        await planeService.updatePlane(planeId, data);
        await loadPlanes();
        setShowEditPlaneModal(false);
        setEditingPlane(null);
    };

    const handleDeletePlane = async () => {
        if (!editingPlane) return;
        try {
            await planeService.deletePlane(editingPlane.id);
            await loadPlanes();
            setShowDeleteModal(false);
            setEditingPlane(null);
            if (currentPlaneIndex >= planes.length) {
                setCurrentPlaneIndex(Math.max(0, planes.length - 1));
            }
        } catch (error) {
            console.error("Failed to delete plane:", error);
        }
    };

    const handleViewParts = () => {
        if (planes.length > 0) {
            setShowPartsModal(true);
        }
    };

    const loadData = async () => {
        try {
            setLoading(true);
            const allParts = await partService.getAllParts();
            const warning = await partService.getWarningParts(50);
            setFilteredParts(allParts);
            setWarningParts(warning);
        } catch (error) {
            console.error("Failed to load data:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadPartsByPlane = async (planeModel: string | null) => {
        try {
            setLoading(true);
            let parts: PlanePart[];
            let warning: PlanePart[];
            
            if (planeModel === null || planeModel === "") {
                // Get all parts when "All Planes" is selected
                parts = await partService.getAllParts();
                warning = await partService.getWarningParts(50);
            } else {
                // Get all parts and filter by plane model
                const allParts = await partService.getAllParts();
                const warningPartsAll = await partService.getWarningParts(50);
                
                // Get the plane IDs that match the model
                const matchingPlanes = planes.filter(p => p.model === planeModel);
                const planeIds = matchingPlanes.map(p => p.id);
                
                parts = allParts.filter(part => planeIds.includes(part.plane_id));
                warning = warningPartsAll.filter(part => planeIds.includes(part.plane_id));
            }
            setFilteredParts(parts);
            setWarningParts(warning);
        } catch (error) {
            console.error("Failed to load parts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePlaneChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        const planeModel = value === "" ? null : value;
        setSelectedPlaneId(planeModel as any);
        loadPartsByPlane(planeModel);
    };

    // Good: usage < 50%
    const getGoodCount = () =>
        filteredParts.filter((p) => p.usage_percent < 50).length;
    // Warning: 50% <= usage < 80%
    const getWarningCount = () =>
        warningParts.filter((p) => p.usage_percent >= 50 && p.usage_percent < 80).length;
    // Critical: usage >= 80%
    const getCriticalCount = () =>
        filteredParts.filter((p) => p.usage_percent >= 80).length;

    const renderContent = () => {
        return (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <h2 className="text-md md:text-lg font-semibold text-gray-500 text-shadow-2xs ">
                                Parts Status Overview
                            </h2>
                        </div>
                        <select
                            value={selectedPlaneId ?? ""}
                            onChange={handlePlaneChange}
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
                                <span className="font-medium text-slate-900">
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

                <MaintenanceActivity
                    planes={planes}
                    currentPlaneIndex={currentPlaneIndex}
                    currentPlaneParts={currentPlaneParts}
                    loading={currentPlaneLoading}
                    onNavigateLeft={handleNavigateLeft}
                    onNavigateRight={handleNavigateRight}
                    onEdit={handleEditPlane}
                    onDelete={(plane) => {
                        setEditingPlane(plane);
                        setShowDeleteModal(true);
                    }}
                    onViewParts={handleViewParts}
                />
            </div>
        );
    };

    return (
        <div className="relative min-h-screen overflow-x-hidden">
            <Header onLogout={onLogout} />

            <main className="max-w-7xl mx-auto px-4 pt-16 py-8 relative">
                <div className="mb-6 mt-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-sm md:text-lg font-semibold text-gray-500">Mechanic Dashboard</h2>
                        <p className="text-xs text-slate-500">Monitor aircraft parts and maintenance</p>
                    </div>
                    <Button 
                        onClick={() => setShowNotificationModal(true)}
                        className="flex items-center gap-2 bg-gray-500 hover:bg-gray-700 text-white border border-gray-400 shadow-lg shadow-gray-700/40"
                    >
                        <Bell className="w-4 h-4" />
                        Alerts ({warningParts.length})
                    </Button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
                    </div>
                ) : (
                    renderContent()
                )}
            </main>

            <NotificationModal
                isOpen={showNotificationModal}
                onClose={() => setShowNotificationModal(false)}
                parts={warningParts}
            />
            
            <EditPlaneModal
                isOpen={showEditPlaneModal}
                plane={editingPlane}
                onClose={() => {
                    setShowEditPlaneModal(false);
                    setEditingPlane(null);
                }}
                onSubmit={handleUpdatePlane}
            />
            
            <ConfirmDeleteModal
                isOpen={showDeleteModal}
                title="Delete Plane"
                message={`Are you sure you want to delete ${editingPlane?.model} (${editingPlane?.tail_number})? This action cannot be undone and all associated parts will also be deleted.`}
                confirmText="Delete"
                onConfirm={handleDeletePlane}
                onClose={() => {
                    setShowDeleteModal(false);
                    setEditingPlane(null);
                }}
            />
            
            <PartsModal
                isOpen={showPartsModal}
                plane={planes[currentPlaneIndex] || null}
                parts={currentPlaneParts}
                loading={currentPlaneLoading}
                onClose={() => setShowPartsModal(false)}
                onAddPart={() => loadPartsByPlaneId(planes[currentPlaneIndex]?.id)}
            />
        </div>
    );
}
  