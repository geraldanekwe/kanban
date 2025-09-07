"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

type ToastType = "success" | "error";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextProps {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`relative px-4 py-4 rounded-xl border shadow-lg backdrop-blur-sm 
              transform transition-all duration-300 ease-out animate-in slide-in-from-right-full
              ${
                toast.type === "success"
                  ? "bg-white/95 border-green-200 text-green-800"
                  : "bg-white/95 border-red-200 text-red-800"
              }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex-shrink-0 w-5 h-5 ${
                  toast.type === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {toast.type === "success" ? (
                  <CheckCircleIcon className="w-5 h-5" />
                ) : (
                  <XCircleIcon className="w-5 h-5" />
                )}
              </div>

              <p className="text-sm font-medium flex-1 pr-2">{toast.message}</p>

              <button
                onClick={() => removeToast(toast.id)}
                className={`flex-shrink-0 p-1 rounded-lg transition-colors duration-200 ${
                  toast.type === "success"
                    ? "hover:bg-green-100 text-green-500"
                    : "hover:bg-red-100 text-red-500"
                }`}
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};
