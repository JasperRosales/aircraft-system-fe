import { Button } from "@/components/ui/button";
import { X, AlertTriangle } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDeleteModal({ 
  isOpen, 
  title, 
  message, 
  confirmText = "Delete", 
  onConfirm, 
  onClose 
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-500">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-800" />
            </div>
            <p className="text-gray-500">{message}</p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={onConfirm} 
              className="bg-gray-500 text-white shadow-sm"
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

