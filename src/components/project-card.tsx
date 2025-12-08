'use client';

import React from 'react';
import { Edit2, Trash2, Target, CheckCircle, Zap, RotateCcw } from 'lucide-react';
import { ProgressBar } from './progress-bar';
import { Project } from '@/types';
import { useAppStore } from '@/lib/store';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  onCheckin: (projectId: string, duration: number) => void;
}

export function ProjectCard({ project, onEdit, onDelete, onCheckin }: ProjectCardProps) {
  const { logs, undoLastCheckin } = useAppStore();
  const quickTimeOptions = [15, 30, 45, 60, 90, 120]; // 分钟

  const projectStats = React.useMemo(() => {
    // 从store获取实际的统计数据
    const projectLogs = logs.filter(c => c.projectId === project.id);
    const today = new Date().toISOString().split('T')[0];
    const todayLogs = projectLogs.filter(c => c.date === today);

    const totalDuration = projectLogs.reduce((sum, c) => sum + c.duration, 0);

    return {
      totalCheckins: projectLogs.length,
      totalDuration: totalDuration, // 分钟
      todayCheckins: todayLogs.length,
      todayDuration: todayLogs.reduce((sum, c) => sum + c.duration, 0)
    };
  }, [project.id, logs]);

  const handleQuickLog = (duration: number) => {
    onCheckin(project.id, duration);
  };

  const handleUndoLastCheckin = () => {
    if (window.confirm('确定要撤销最近的一次打卡吗？此操作不可恢复。')) {
      try {
        undoLastCheckin(project.id);
      } catch (error) {
        alert('撤销打卡失败，请重试');
      }
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      padding: '18px',
      border: '1px solid #e5e7eb'
    }}>
      {/* 卡片头部 */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '16px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flex: 1
        }}>
          <div style={{
            fontSize: '24px',
            backgroundColor: project.color + '20',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {project.emoji || '📚'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '2px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {project.name}
            </h2>
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Target style={{ height: '12px', width: '12px' }} />
              目标:
              {project.goal?.duration && (
                <span>{Math.floor(project.goal.duration / 60)}h</span>
              )}
              {project.goal?.duration && project.goal?.checkins && ' • '}
              {project.goal?.checkins && <span>{project.goal.checkins}次</span>}
              {!project.goal?.duration && !project.goal?.checkins && ' 未设定'}
            </p>
          </div>
        </div>

        {/* 操作按钮 */}
        <div style={{
          display: 'flex',
          gap: '4px',
          flexShrink: 0
        }}>
          <button
            onClick={() => onEdit(project)}
            style={{
              padding: '6px',
              border: '1px solid #e5e7eb',
              borderRadius: '4px',
              backgroundColor: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Edit2 style={{ height: '14px', width: '14px', color: '#6b7280' }} />
          </button>
          <button
            onClick={() => onDelete(project.id)}
            style={{
              padding: '6px',
              border: '1px solid #e5e7eb',
              borderRadius: '4px',
              backgroundColor: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Trash2 style={{ height: '14px', width: '14px', color: '#6b7280' }} />
          </button>
        </div>
      </div>

      {/* 进度条 - 紧凑版本 */}
      <div style={{ marginBottom: '14px' }}>
        <ProgressBar
          label="打卡次数"
          current={projectStats.totalCheckins}
          total={project.goal?.checkins || 0}
          unit="次"
          color={project.color}
        />

        <div style={{ marginTop: '10px' }}>
          <ProgressBar
            label="累计时长"
            current={Math.floor(projectStats.totalDuration / 60)}
            total={project.goal?.duration ? Math.floor(project.goal.duration / 60) : 0}
            unit="小时"
            color={project.color}
          />
        </div>
      </div>

      {/* 今日统计 - 紧凑版本 */}
      <div style={{
        padding: '8px 12px',
        backgroundColor: '#f0f9ff',
        borderRadius: '6px',
        border: '1px solid #bae6fd',
        marginBottom: '14px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <CheckCircle style={{ height: '14px', width: '14px', color: '#0ea5e9' }} />
            <span style={{
              fontSize: '12px',
              color: '#0c4a6e',
              fontWeight: '500'
            }}>
              今日 {projectStats.todayDuration}分钟 ({projectStats.todayCheckins}次)
            </span>
          </div>

          {projectStats.todayCheckins > 0 && (
            <button
              onClick={handleUndoLastCheckin}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                padding: '2px 6px',
                fontSize: '10px',
                color: '#dc2626',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
              title="撤销最近一次打卡"
            >
              <RotateCcw style={{ height: '10px', width: '10px' }} />
              撤销
            </button>
          )}
        </div>
      </div>

      {/* 快速打卡区域 - 紧凑版本 */}
      <div style={{
        padding: '12px',
        backgroundColor: '#fef3c7',
        borderRadius: '6px',
        border: '1px solid #fbbf24'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '10px'
        }}>
          <Zap style={{ height: '16px', width: '16px', color: '#f59e0b' }} />
          <h3 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#92400e',
            margin: 0
          }}>
            快速打卡
          </h3>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '6px',
          marginBottom: '8px'
        }}>
          {quickTimeOptions.slice(0, 6).map((minutes) => (
            <button
              key={minutes}
              onClick={() => handleQuickLog(minutes)}
              style={{
                padding: '8px 4px',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                backgroundColor: 'white',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
                e.currentTarget.style.borderColor = '#f59e0b';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.transform = 'translateY(0px)';
              }}
            >
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#111827'
              }}>
                {minutes}
              </div>
              <div style={{
                fontSize: '10px',
                color: '#6b7280'
              }}>
                分钟
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}