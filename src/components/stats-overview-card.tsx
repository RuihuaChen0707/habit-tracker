'use client';

import React from 'react';
import { Target, TrendingUp, Clock } from 'lucide-react';
import { Project } from '@/types';
import { useAppStore } from '@/lib/store';

interface StatsOverviewCardProps {
  projects: Project[];
}

export function StatsOverviewCard({ projects }: StatsOverviewCardProps) {
  const { logs } = useAppStore();

  const stats = React.useMemo(() => {
    // 计算实际的统计数据
    const totalDuration = logs.reduce((sum, c) => sum + c.duration, 0);

    return {
      totalProjects: projects.length,
      totalCheckins: logs.length,
      totalHours: Math.floor(totalDuration / 60)
    };
  }, [projects.length, logs.length]);

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      padding: '24px',
      border: '1px solid #e5e7eb'
    }}>
      <h2 style={{
        fontSize: '18px',
        fontWeight: '600',
        color: '#111827',
        marginBottom: '20px'
      }}>
        数据总览
      </h2>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* 项目总数 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#dbeafe',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Target style={{ height: '20px', width: '20px', color: '#3b82f6' }} />
            </div>
            <span style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#6b7280'
            }}>
              项目总数
            </span>
          </div>
          <span style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#111827'
          }}>
            {stats.totalProjects}
          </span>
        </div>

        {/* 总打卡次数 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#dcfce7',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingUp style={{ height: '20px', width: '20px', color: '#22c55e' }} />
            </div>
            <span style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#6b7280'
            }}>
              总打卡次数
            </span>
          </div>
          <span style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#111827'
          }}>
            {stats.totalCheckins}
          </span>
        </div>

        {/* 累计学习时长 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#fef3c7',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Clock style={{ height: '20px', width: '20px', color: '#f59e0b' }} />
            </div>
            <span style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#6b7280'
            }}>
              累计学习时长
            </span>
          </div>
          <span style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#111827'
          }}>
            {stats.totalHours}h
          </span>
        </div>
      </div>
    </div>
  );
}