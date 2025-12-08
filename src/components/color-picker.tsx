'use client';

import React, { useRef } from 'react';
import { Check } from 'lucide-react';

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

// 精选的预设颜色色板
const PRESET_COLORS = [
  { color: '#EF4444', name: 'Red' },
  { color: '#F97316', name: 'Orange' },
  { color: '#F59E0B', name: 'Amber' },
  { color: '#EAB308', name: 'Yellow' },
  { color: '#84CC16', name: 'Lime' },
  { color: '#22C55E', name: 'Green' },
  { color: '#10B981', name: 'Emerald' },
  { color: '#14B8A6', name: 'Teal' },
  { color: '#06B6D4', name: 'Cyan' },
  { color: '#0EA5E9', name: 'Sky' },
  { color: '#3B82F6', name: 'Blue' },
  { color: '#6366F1', name: 'Indigo' },
  { color: '#8B5CF6', name: 'Violet' },
  { color: '#A855F7', name: 'Purple' },
  { color: '#D946EF', name: 'Fuchsia' },
  { color: '#EC4899', name: 'Pink' },
  { color: '#F43F5E', name: 'Rose' },
  { color: '#6B7280', name: 'Gray' },
  { color: '#475569', name: 'Slate' },
  { color: '#1F2937', name: 'Gray-900' },
];

export function ColorPicker({ selectedColor, onColorChange }: ColorPickerProps) {
  const customColorInputRef = useRef<HTMLInputElement>(null);

  const handlePresetColorClick = (color: string) => {
    onColorChange(color);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onColorChange(e.target.value);
  };

  const handleCustomColorClick = () => {
    customColorInputRef.current?.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 预设颜色选择器 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 32px)', gap: '8px' }}>
        {PRESET_COLORS.map(({ color, name }) => {
          const isSelected = selectedColor.toLowerCase() === color.toLowerCase();

          return (
            <button
              key={color}
              onClick={() => handlePresetColorClick(color)}
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: color,
                border: isSelected ? '2px solid #1f2937' : '2px solid #e5e7eb',
                borderRadius: '8px',
                cursor: 'pointer',
                position: 'relative'
              }}
              title={name}
            >
              {isSelected && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ color: 'white', fontSize: '16px' }}>✓</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 自定义颜色选择器 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <label htmlFor="custom-color" style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
          自定义颜色:
        </label>
        <input
          id="custom-color"
          type="color"
          value={selectedColor}
          onChange={handleCustomColorChange}
          style={{
            width: '48px',
            height: '48px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        />
        <span style={{ fontSize: '12px', color: '#6b7280' }}>
          {selectedColor.toUpperCase()}
        </span>
      </div>
    </div>
  );
}