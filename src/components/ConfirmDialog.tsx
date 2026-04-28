import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: "danger" | "warning" | "info";
  showCancelButton?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  type = "warning",
  showCancelButton = true,
}) => {
  if (!isOpen) return null;

  const getColors = () => {
    switch (type) {
      case "danger":
        return {
          icon: "text-red-600",
          bg: "bg-red-50",
          button: "bg-red-600 hover:bg-red-700",
        };
      case "info":
        return {
          icon: "text-blue-600",
          bg: "bg-blue-50",
          button: "bg-blue-600 hover:bg-blue-700",
        };
      default:
        return {
          icon: "text-amber-600",
          bg: "bg-amber-50",
          button: "bg-indigo-600 hover:bg-indigo-700",
        };
    }
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div
              className={`flex-shrink-0 w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center ${colors.icon}`}
            >
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              {title && (
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {title}
                </h3>
              )}
              <p className="text-slate-600 leading-relaxed">{message}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 rounded-b-2xl flex gap-3 justify-end">
          {showCancelButton && (
            <button
              onClick={onCancel}
              className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={onConfirm}
            className={`px-5 py-2.5 text-white rounded-xl font-semibold transition-colors ${colors.button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
