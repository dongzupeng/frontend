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
    <div className="space-y-4">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setImagePreview(e.target.value);
        }}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-600 bg-transparent placeholder-gray-400"
      />
      <div className="flex flex-wrap items-center gap-4">
        <input
          type="file"
          accept={accept}
          onChange={handleImageUpload}
          disabled={uploading || disabled}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-all duration-300 cursor-pointer bg-gray-50">
          {uploading ? (
            <span className="text-gray-600">上传中...</span>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="text-2xl text-gray-400">+</div>
              <div className="text-sm text-gray-500 mt-1">Upload</div>
            </div>
          )}
        </label>
        <span className="text-sm text-gray-500">（图片大小不超过5MB）</span>
      </div>
      {imagePreview && (
        <div className="flex items-center gap-4">
          <img src={imagePreview} alt="预览" className="w-24 h-24 object-cover rounded-lg" />
          <button
            type="button"
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleRemoveImage}
            disabled={disabled}
          >
            移除
          </button>
        </div>
      )}
      
      {cropping && cropImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">裁剪图片</h3>
            <div className="w-full h-64 mb-4 relative">
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
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-all duration-300"
                onClick={handleCropCancel}
              >
                取消
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-blue-100 text-primary font-medium rounded-lg hover:bg-blue-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleCropConfirm}
                disabled={uploading}
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