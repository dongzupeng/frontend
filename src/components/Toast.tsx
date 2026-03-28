import React, { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: 'bg-green-100',
          borderColor: 'border-green-400',
          textColor: 'text-green-800',
          icon: '✅',
        };
      case 'error':
        return {
          backgroundColor: 'bg-red-100',
          borderColor: 'border-red-400',
          textColor: 'text-red-800',
          icon: '❌',
        };
      case 'warning':
        return {
          backgroundColor: 'bg-yellow-100',
          borderColor: 'border-yellow-400',
          textColor: 'text-yellow-800',
          icon: '⚠️',
        };
      case 'info':
      default:
        return {
          backgroundColor: 'bg-primary/10',
          borderColor: 'border-primary',
          textColor: 'text-primary',
          icon: 'ℹ️',
        };
    }
  };

  const styles = getTypeStyles();

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`max-w-xs w-full ${styles.backgroundColor} ${styles.borderColor} border-l-4 p-3 rounded-lg shadow-lg transition-all duration-300 ease-in-out`}
    >
      <div className="flex items-center gap-2">
        <div className="text-base flex-shrink-0">{styles.icon}</div>
        <div className="flex-1">
          <p className={`text-xs font-medium ${styles.textColor}`}>{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => {
              if (onClose) {
                onClose();
              }
            }, 300);
          }}
          className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Toast管理器
interface ToastItem {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

const ToastManager: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (toast: Omit<ToastItem, 'id'>) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // 导出addToast方法到全局
  useEffect(() => {
    (window as any).toast = {
      success: (message: string, duration?: number) => addToast({ message, type: 'success', duration }),
      error: (message: string, duration?: number) => addToast({ message, type: 'error', duration }),
      warning: (message: string, duration?: number) => addToast({ message, type: 'warning', duration }),
      info: (message: string, duration?: number) => addToast({ message, type: 'info', duration }),
    };

    return () => {
      delete (window as any).toast;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 space-y-2 pointer-events-auto">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Toast;
export { ToastManager };