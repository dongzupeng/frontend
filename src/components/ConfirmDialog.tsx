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
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog">
        <div className="confirm-dialog-header">
          <h3>{title}</h3>
        </div>
        <div className="confirm-dialog-content">
          <p>{message}</p>
        </div>
        <div className="confirm-dialog-footer">
          <button 
            className="confirm-dialog-button cancel" 
            onClick={onCancel}
          >
            取消
          </button>
          <button 
            className="confirm-dialog-button confirm" 
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