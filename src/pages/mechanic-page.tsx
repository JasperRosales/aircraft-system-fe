import { useState, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { planeService, type Plane as PlaneType } from "@/service/plane.service";
import { partService, type PlanePart } from "@/service/part.service";
import Header from "@/components/mvpblocks/header-2";

const PartsOverview = lazy(() => import("@/components/fragments/PartsOverview").then(module => ({ default: module.PartsOverview })));

const NotificationModal = lazy(() => import("@/components/fragments/NotificationModal").then(module => ({ default: module.NotificationModal })));
const EditPlaneModal = lazy(() => import("@/components/fragments/EditPlaneModal").then(module => ({ default: module.EditPlaneModal })));
const ConfirmDeleteModal = lazy(() => import("@/components/fragments/ConfirmDeleteModal").then(module => ({ default: module.ConfirmDeleteModal })));
const PartsModal = lazy(() => import("@/components/fragments/PartsModal").then(module => ({ default: module.PartsModal })));
const MaintenanceActivity = lazy(() => import("@/components/fragments/MaintenanceActivity").then(module => ({ default: module.MaintenanceActivity })));

const ModalFallback = () => (
    <div className="fixed inset-0 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
    </div>
);

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

  
    const renderContent = () => {
        return (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Suspense fallback={
                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <div className="animate-pulse space-y-4">
                            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/5"></div>
                            </div>
                        </div>
                    </div>
                }>
                    <PartsOverview
                        filteredParts={filteredParts}
                        warningParts={warningParts}
                        planes={planes}
                        selectedPlaneId={selectedPlaneId}
                        onPlaneChange={handlePlaneChange}
                    />
                </Suspense>

                <Suspense fallback={
                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <div className="animate-pulse space-y-4">
                            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                            </div>
                        </div>
                    </div>
                }>
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
                </Suspense>
            </div>
        );
    };

    return (
        <div className="relative min-h-screen overflow-x-hidden">
            <Header onLogout={onLogout} />

            <main className="max-w-7xl mx-auto px-4 pt-16 py-8 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
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
                </motion.div>
            </main>

            <Suspense fallback={<ModalFallback />}>
                <NotificationModal
                    isOpen={showNotificationModal}
                    onClose={() => setShowNotificationModal(false)}
                    parts={warningParts}
                />
            </Suspense>
            
            <Suspense fallback={<ModalFallback />}>
                <EditPlaneModal
                    isOpen={showEditPlaneModal}
                    plane={editingPlane}
                    onClose={() => {
                        setShowEditPlaneModal(false);
                        setEditingPlane(null);
                    }}
                    onSubmit={handleUpdatePlane}
                />
            </Suspense>
            
            <Suspense fallback={<ModalFallback />}>
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
            </Suspense>
            
            <Suspense fallback={<ModalFallback />}>
                <PartsModal
                    isOpen={showPartsModal}
                    plane={planes[currentPlaneIndex] || null}
                    parts={currentPlaneParts}
                    loading={currentPlaneLoading}
                    onClose={() => setShowPartsModal(false)}
                    onAddPart={() => loadPartsByPlaneId(planes[currentPlaneIndex]?.id)}
                />
            </Suspense>
        </div>
    );
}
  