'use client';

import React from 'react';

interface EventItemProps {
  event: {
    id: string;
    title: string;
    start: string;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    extendedProps: {
      projectId: string;
      projectName: string;
      duration: number;
      emoji: string;
    };
  };
}

export function EventItem({ event }: EventItemProps) {
  const { emoji, projectName, duration } = event.extendedProps;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '12px',
        padding: '2px 6px',
        borderRadius: '6px',
        borderLeft: `3px solid ${event.borderColor || '#3b82f6'}`,
        backgroundColor: event.backgroundColor || '#3b82f620',
        color: event.textColor || '#111827',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        minHeight: '20px',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
      title={`${emoji} ${projectName} - ${duration}分钟`}
    >
      <span style={{ marginRight: '2px' }}>{emoji}</span>
      <span style={{ fontWeight: '500' }}>{projectName}</span>
      {duration > 0 && (
        <span style={{
          fontSize: '10px',
          opacity: 0.8,
          marginLeft: '4px'
        }}>
          {duration}m
        </span>
      )}
    </div>
  );
}