'use client';

import React from 'react';

interface ProgressBarProps {
  label: string;
  current: number;
  total: number;
  unit?: string;
  color?: string;
}

export function ProgressBar({ label, current, total, unit = '', color = '#3b82f6' }: ProgressBarProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div>
      {/* 标签行 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
      }}>
        <span style={{
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151'
        }}>
          {label}
        </span>
        <span style={{
          fontSize: '14px',
          fontWeight: '500',
          color: '#6b7280'
        }}>
          {current} / {total}{unit}
        </span>
      </div>

      {/* 进度条 */}
      <div style={{
        width: '100%',
        height: '8px',
        backgroundColor: '#f3f4f6',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <div
          style={{
            height: '100%',
            backgroundColor: color,
            borderRadius: '4px',
            transition: 'width 0.3s ease',
            width: `${Math.min(percentage, 100)}%`
          }}
        />
      </div>

      {/* 百分比显示 */}
      <div style={{
        fontSize: '12px',
        color: '#6b7280',
        marginTop: '4px',
        textAlign: 'right'
      }}>
        {percentage.toFixed(1)}%
      </div>
    </div>
  );
}