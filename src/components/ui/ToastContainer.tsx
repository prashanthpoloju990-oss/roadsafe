import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useToast, ToastItem } from '../../context/ToastContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  const getIcon = (type: ToastItem['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-[#2B8A3E] shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0" />;
      case 'emergency':
        return <AlertCircle className="w-4 h-4 text-[#C92A2A] shrink-0" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-[#364FC7] shrink-0" />;
    }
  };

  const getBorderColor = (type: ToastItem['type']) => {
    switch (type) {
      case 'emergency':
        return 'border-[#F8D7DA]';
      case 'success':
        return 'border-[#D2EED7]';
      case 'warning':
        return 'border-[#FDE68A]';
      case 'info':
      default:
        return 'border-[#E2E0D8]';
    }
  };

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 bg-white border ${getBorderColor(
              toast.type
            )} rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.06)]`}
          >
            <div className="mt-0.5">{getIcon(toast.type)}</div>
            <div className="grow space-y-0.5">
              <p className="text-xs sm:text-sm font-semibold text-[#141517] tracking-tight">
                {toast.title}
              </p>
              {toast.message && (
                <p className="text-xs text-[#585A62] leading-relaxed">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="p-1 text-[#8A8D96] hover:text-[#141517] rounded cursor-pointer transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
