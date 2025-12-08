'use client';

import React from 'react';

interface InputWithSuffixProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  suffix: string;
  type?: string;
  min?: string;
  step?: string;
  required?: boolean;
}

export function InputWithSuffix({
  id,
  label,
  value,
  onChange,
  placeholder,
  suffix,
  type = 'text',
  min,
  step,
  required = false,
}: InputWithSuffixProps) {
  return (
    <div>
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
          step={step}
          required={required}
          className="form-input pr-12"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <span className="text-sm text-gray-500">{suffix}</span>
        </div>
      </div>
    </div>
  );
}