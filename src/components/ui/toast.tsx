'use client';

import React from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    className: 'bg-green-50 border-green-200 text-green-800',
    iconClassName: 'text-green-600',
  },
  error: {
    icon: XCircle,
    className: 'bg-red-50 border-red-200 text-red-800',
    iconClassName: 'text-red-600',
  },
  info: {
    icon: Info,
    className: 'bg-blue-50 border-blue-200 text-blue-800',
    iconClassName: 'text-blue-600',
  },
};

export function Toast({ message, type = 'success', isVisible, onClose, duration = 3000 }: ToastProps) {
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (isVisible && duration > 0) {
      timerRef.current = setTimeout(() => {
        onClose();
      }, duration);
    } else if (!isVisible && timerRef.current) {
      clearTimeout(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const config = toastConfig[type];
  const Icon = config.icon;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm animate-in slide-in-from-top-2 fade-in-0">
      <div
        className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg ${config.className}`}
      >
        <Icon className={`h-5 w-5 flex-shrink-0 ${config.iconClassName}`} />
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={() => {
            onClose();
          }}
          className="ml-auto flex-shrink-0 p-1 rounded-md hover:bg-black/10 transition-colors"
        >
          <XCircle className="h-4 w-4 opacity-60" />
        </button>
      </div>
    </div>
  );
}

// Toast Provider Context
interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toastMessage, setToastMessage] = React.useState('');
  const [toastType, setToastType] = React.useState<ToastType>('success');
  const [toastDuration, setToastDuration] = React.useState(3000);
  const [toastVisible, setToastVisible] = React.useState(false);

  const showToast = (message: string, type: ToastType = 'success', duration: number = 3000) => {
    setToastMessage(message);
    setToastType(type);
    setToastDuration(duration);
    setToastVisible(true);
  };

  const closeToast = () => {
    setToastVisible(false);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={toastVisible}
        onClose={closeToast}
        duration={toastDuration}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}