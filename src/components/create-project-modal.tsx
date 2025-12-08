'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Project } from '@/types';
import { ProjectForm } from './project-form';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onSubmit: (project: Omit<Project, 'id' | 'createdAt'>) => void;
}

export function CreateProjectModal({ isOpen, onClose, project, onSubmit }: CreateProjectModalProps) {
  if (!isOpen) return null;

  // ESC键关闭
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(2px)',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }} onClick={onClose}>
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          width: '100%',
          maxWidth: '448px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* 模态框头部 */}
        <div style={{
          backgroundColor: '#f9fafb',
          padding: '16px 24px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h2
              id="modal-title"
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#111827',
                margin: 0
              }}
            >
              {project ? '编辑项目' : '创建新项目'}
            </h2>
            <button
              onClick={onClose}
              style={{
                padding: '4px',
                borderRadius: '8px',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e5e7eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              aria-label="关闭弹窗"
            >
              <X style={{ height: '20px', width: '20px', color: '#6b7280' }} />
            </button>
          </div>
        </div>

        {/* 表单内容区域 */}
        <div style={{ padding: '24px' }}>
          <ProjectForm
            project={project}
            isOpen={true}
            onClose={onClose}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </div>
  );
}