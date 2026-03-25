import React, { useState } from 'react';
import Cropper from 'react-easy-crop';

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
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropping, setCropping] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 限制文件大小
      if (file.size > maxSize) {
        alert('图片大小不能超过5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setCropImage(base64String);
        setCropping(true);
      };
      reader.onerror = () => {
        alert('图片上传失败');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    onChange('');
    setImagePreview(null);
  };

  // 处理裁剪
  const onCropComplete = (_croppedArea: any, croppedAreaPixels: any) => {
    // 保存裁剪区域信息
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // 裁剪图片
  const getCroppedImg = (imageSrc: string, pixelCrop: any) => {
    return new Promise<string>((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      const image = new Image();
      // 处理跨域问题
      image.crossOrigin = 'anonymous';
      image.src = imageSrc;
      
      image.onload = () => {
        // 确保裁剪区域在图片范围内
        const cropX = Math.max(0, pixelCrop.x);
        const cropY = Math.max(0, pixelCrop.y);
        const cropWidth = Math.min(pixelCrop.width, image.width - cropX);
        const cropHeight = Math.min(pixelCrop.height, image.height - cropY);
        
        canvas.width = cropWidth;
        canvas.height = cropHeight;
        
        ctx.drawImage(
          image,
          cropX,
          cropY,
          cropWidth,
          cropHeight,
          0,
          0,
          cropWidth,
          cropHeight
        );

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Could not create blob from canvas'));
            return;
          }
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(blob);
        });
      };
      image.onerror = () => {
        reject(new Error('Could not load image'));
      };
    });
  };

  // 确认裁剪
  const handleCropConfirm = async () => {
    if (!cropImage) return;
    
    setUploading(true);
    
    try {
      // 使用用户实际调整的裁剪区域
      let cropArea = croppedAreaPixels;
      
      // 如果没有裁剪区域信息，使用默认的居中裁剪
      if (!cropArea) {
        // 创建一个新的Image对象来获取图片尺寸
        const image = new Image();
        image.src = cropImage;
        
        // 等待图片加载完成
        await new Promise<void>((resolve) => {
          image.onload = () => resolve();
        });
        
        const cropWidth = 300;
        const cropHeight = 300;
        const x = Math.max(0, (image.width - cropWidth) / 2);
        const y = Math.max(0, (image.height - cropHeight) / 2);
        
        cropArea = {
          x,
          y,
          width: cropWidth,
          height: cropHeight
        };
      }
      
      const croppedImage = await getCroppedImg(cropImage, cropArea);
      
      onChange(croppedImage);
      setImagePreview(croppedImage);
      setCropping(false);
      setCropImage(null);
      setCroppedAreaPixels(null);
      setUploading(false);
    } catch (error) {
      console.error('裁剪失败:', error);
      alert('裁剪失败，请重试');
      setUploading(false);
      setCropping(false);
      setCropImage(null);
      setCroppedAreaPixels(null);
    }
  };

  // 取消裁剪
  const handleCropCancel = () => {
    setCropping(false);
    setCropImage(null);
    setCroppedAreaPixels(null);
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
      
      {cropping && cropImage && (
        <div className="crop-modal" style={{ zIndex: 1000, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="crop-container" style={{ position: 'relative', zIndex: 1001, backgroundColor: 'white', borderRadius: '8px', padding: '20px', width: '90%', maxWidth: '400px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#333', textAlign: 'center', fontSize: '16px' }}>裁剪图片</h3>
            <div className="crop-area" style={{ width: '100%', height: '250px', marginBottom: '15px', position: 'relative' }}>
              <Cropper
                image={cropImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="crop-controls" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '0' }}>
              <button
                type="button"
                className="crop-button cancel"
                onClick={handleCropCancel}
                style={{ padding: '8px 16px', backgroundColor: '#f5f5f5', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
              >
                取消
              </button>
              <button
                type="button"
                className="crop-button confirm"
                onClick={handleCropConfirm}
                disabled={uploading}
                style={{ padding: '8px 16px', backgroundColor: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
              >
                {uploading ? '处理中...' : '确认'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;