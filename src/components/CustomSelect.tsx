import React, { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = '请选择',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const option = options.find(opt => opt.value === value);
    setSelectedOption(option || null);
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option: Option) => {
    onChange(option.value);
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block min-w-[140px] ${className}`} ref={selectRef}>
      <div
        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white shadow-sm hover:border-primary hover:bg-gray-50 transition-all duration-300 cursor-pointer flex items-center justify-between gap-2 h-9"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className={`text-xs text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 border border-gray-300 rounded-lg bg-white shadow-md z-50 overflow-hidden max-h-[200px] overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-4 py-3 text-gray-700 cursor-pointer transition-all duration-200 ${option.value === value ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-50'}`}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;