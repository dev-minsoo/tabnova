import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  description?: string;
  duration?: number;
}

interface ToastComponentProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastComponent({ toast, onRemove }: ToastComponentProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Auto-remove after duration
    const duration = toast.duration || 3000;
    const removeTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(removeTimer);
    };
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 200);
  };

  const getToastIcon = () => {
    switch (toast.type) {
      case 'success':
        return (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500">
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500">
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        );
      case 'info':
        return (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success': return 'border-green-200';
      case 'error': return 'border-red-200';
      case 'warning': return 'border-yellow-200';
      case 'info': return 'border-blue-200';
    }
  };

  return (
    <div
      className={`
        relative flex w-full max-w-md items-center space-x-3 rounded-lg border p-4 shadow-lg
        ${getBorderColor()}
        ${isExiting ? 'toast-exit' : 'toast-enter'}
      `}
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderColor: 'var(--border-color)',
        minWidth: '320px',
      }}
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        {getToastIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p
            className="text-sm font-medium"
            style={{ color: 'var(--text-primary)' }}
          >
            {toast.title}
          </p>
        )}
        {toast.description && (
          <p
            className={`text-sm ${toast.title ? 'mt-1' : ''}`}
            style={{ color: 'var(--text-secondary)' }}
          >
            {toast.description}
          </p>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="flex-shrink-0 rounded-full p-1 transition-colors"
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          style={{ color: 'var(--text-secondary)' }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
  position?: 'bottom-right' | 'bottom-center';
}

export function ToastContainer({ toasts, onRemove, position = 'bottom-right' }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  const positionClasses = position === 'bottom-center'
    ? 'fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col space-y-2'
    : 'fixed bottom-4 right-4 z-50 flex flex-col space-y-2';

  return createPortal(
    <div className={positionClasses}>
      {toasts.map((toast) => (
        <ToastComponent
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
        />
      ))}
    </div>,
    document.body
  );
}

// Toast hook for easy usage
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 11);
    const newToast: Toast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const success = (title: string, description?: string) => {
    addToast({ type: 'success', title, description });
  };

  const error = (title: string, description?: string) => {
    addToast({ type: 'error', title, description });
  };

  const warning = (title: string, description?: string) => {
    addToast({ type: 'warning', title, description });
  };

  const info = (title: string, description?: string) => {
    addToast({ type: 'info', title, description });
  };

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
}