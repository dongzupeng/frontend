import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[360px] max-w-[90vw] shadow-lg animate-fade-in">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        <div className="mb-6">
          <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
        </div>
        <div className="flex gap-3 justify-end">
          <button 
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-all duration-300"
            onClick={onCancel}
          >
            取消
          </button>
          <button 
            className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all duration-300"
            onClick={onConfirm}
          >
            确认
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;