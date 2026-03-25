import React, { useState } from 'react';

interface UploadProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxSize?: number;
  accept?: string;
  disabled?: boolean;
}

const Upload: React.FC<UploadProps> = ({
  value,
  onChange,
  placeholder = '请输入图片 URL 或上传图片',
  maxSize = 5 * 1024 * 1024, // 默认5MB
  accept = 'image/*',
  disabled = false,
}) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(value || null);

  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 限制文件大小
      if (file.size > maxSize) {
        alert('图片大小不能超过5MB');
        return;
      }
      
      setUploading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        onChange(base64String);
        setImagePreview(base64String);
        setUploading(false);
      };
      reader.onerror = () => {
        alert('图片上传失败');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    onChange('');
    setImagePreview(null);
  };

  return (
    <div className="upload-component">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setImagePreview(e.target.value);
        }}
        placeholder={placeholder}
        disabled={disabled}
        className="upload-input"
      />
      <div className="upload-container">
        <input
          type="file"
          accept={accept}
          onChange={handleImageUpload}
          disabled={uploading || disabled}
          style={{ display: 'none' }}
          id="file-upload"
        />
        <label htmlFor="file-upload" className="upload-button">
          {uploading ? '上传中...' : (
            <div className="upload-content">
              <div className="upload-icon">+</div>
              <div className="upload-text">Upload</div>
            </div>
          )}
        </label>
        <span className="upload-hint">（图片大小不超过5MB）</span>
      </div>
      {imagePreview && (
        <div className="upload-preview">
          <img src={imagePreview} alt="预览" />
          <button
            type="button"
            className="remove-button"
            onClick={handleRemoveImage}
            disabled={disabled}
          >
            移除
          </button>
        </div>
      )}
    </div>
  );
};

export default Upload;