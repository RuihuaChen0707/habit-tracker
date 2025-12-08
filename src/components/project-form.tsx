'use client';

import React, { useState, useEffect } from 'react';
import { ColorPicker } from './color-picker';
import { InputWithSuffix } from './input-with-suffix';

interface ProjectFormProps {
  project?: any;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: any) => void;
}

export function ProjectForm({ project, isOpen, onClose, onSubmit }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    emoji: '',
    color: '#3B82F6', // 默认选择蓝色
    goal: {
      duration: '',
      checkins: '',
    },
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        emoji: project.emoji || '',
        color: project.color,
        goal: {
          duration: project.goal?.duration ? Math.floor(project.goal.duration / 60).toString() : '',
          checkins: project.goal?.checkins?.toString() || '',
        },
      });
    } else {
      setFormData({
        name: '',
        emoji: '',
        color: '#3B82F6',
        goal: {
          duration: '',
          checkins: '',
        },
      });
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('请输入项目名称');
      return;
    }

    const submitData = {
      name: formData.name.trim(),
      emoji: formData.emoji.trim() || undefined,
      color: formData.color,
      goal: {
        duration: formData.goal.duration ? parseInt(formData.goal.duration) * 60 : undefined,
        checkins: formData.goal.checkins ? parseInt(formData.goal.checkins) : undefined,
      },
    };

    onSubmit(submitData);
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('goal.')) {
      const goalField = field.replace('goal.', '');
      setFormData(prev => ({
        ...prev,
        goal: {
          ...prev.goal,
          [goalField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 项目名称 */}
      <div>
        <label htmlFor="name" style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#1f2937' }}>
          项目名称 <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="例如：学习React、健身锻炼"
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '14px'
          }}
          required
        />
      </div>

      {/* 项目图标 */}
      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#1f2937' }}>
          项目图标
        </label>

        {/* 当前选择的emoji显示 */}
        <div style={{ marginBottom: '8px' }}>
          <input
            id="emoji"
            type="text"
            value={formData.emoji}
            onChange={(e) => handleInputChange('emoji', e.target.value)}
            placeholder="点击下方选择一个图标"
            maxLength={2}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: '#f9fafb'
            }}
          />
        </div>

        {/* Emoji选择器 */}
        <div style={{
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '12px',
          backgroundColor: '#ffffff'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 40px)',
            gap: '8px',
            justifyContent: 'center'
          }}>
            {[
              // 📚 学习相关
              '📚', '📖', '✏️', '📝', '💡', '🎓', '🧠', '💻',
              // 💪 健身相关
              '💪', '🏃', '🏋️', '🚴', '🏊', '⚽', '🎾', '🏀',
              // 🎵 艺术音乐相关
              '🎵', '🎸', '🎹', '🎨', '🎭', '📷', '🎬', '🎤',
              // 🎯 其他习惯
              '🎯', '⏰', '💰', '🌱', '🔥', '⭐', '🚀', '💎'
            ].map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleInputChange('emoji', emoji)}
                style={{
                  width: '40px',
                  height: '40px',
                  fontSize: '20px',
                  border: formData.emoji === emoji ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                  borderRadius: '8px',
                  backgroundColor: formData.emoji === emoji ? '#eff6ff' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  if (formData.emoji !== emoji) {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                    e.currentTarget.style.borderColor = '#9ca3af';
                  }
                }}
                onMouseLeave={(e) => {
                  if (formData.emoji !== emoji) {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }
                }}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* 清除按钮 */}
          {formData.emoji && (
            <button
              type="button"
              onClick={() => handleInputChange('emoji', '')}
              style={{
                marginTop: '8px',
                padding: '4px 8px',
                fontSize: '12px',
                color: '#6b7280',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                backgroundColor: '#ffffff',
                cursor: 'pointer'
              }}
            >
              清除图标
            </button>
          )}
        </div>
      </div>

      {/* 项目颜色 */}
      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#1f2937' }}>
          项目颜色 <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <ColorPicker
          selectedColor={formData.color}
          onColorChange={(color) => handleInputChange('color', color)}
        />
      </div>

      {/* 目标设置 */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', backgroundColor: '#f9fafb' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
          目标设置 <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#6b7280' }}>(可选)</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* 时长目标 */}
          <div>
            <label htmlFor="duration" style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#1f2937' }}>
              时长目标
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="duration"
                type="number"
                min="0"
                step="0.5"
                value={formData.goal.duration}
                onChange={(e) => handleInputChange('goal.duration', e.target.value)}
                placeholder="例如: 100"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  paddingRight: '48px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
              <span style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '14px',
                color: '#6b7280'
              }}>
                小时
              </span>
            </div>
          </div>

          {/* 次数目标 */}
          <div>
            <label htmlFor="checkins" style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#1f2937' }}>
              次数目标
            </label>
            <input
              id="checkins"
              type="number"
              min="0"
              value={formData.goal.checkins}
              onChange={(e) => handleInputChange('goal.checkins', e.target.value)}
              placeholder="例如: 50"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '12px' }}>
          设置目标后，系统会显示进度条帮助你追踪完成情况
        </p>
      </div>

      {/* 表单按钮 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            padding: '8px 16px',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            backgroundColor: 'white',
            color: '#1f2937',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          取消
        </button>
        <button
          type="submit"
          style={{
            padding: '8px 16px',
            border: '1px solid #3b82f6',
            borderRadius: '6px',
            backgroundColor: '#3b82f6',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          {project ? '保存修改' : '创建项目'}
        </button>
      </div>
    </form>
  );
}