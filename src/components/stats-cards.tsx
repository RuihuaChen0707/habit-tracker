'use client';

import React from 'react';
import { Target, TrendingUp, Clock } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface StatsCardsProps {
  projects: any[];
}

export function StatsCards({ projects }: StatsCardsProps) {
  const { checkins } = useAppStore();

  // 计算总体统计
  const totalStats = projects.reduce((acc, project) => {
    const projectCheckins = checkins.filter(c => c.projectId === project.id);
    acc.totalDuration += projectCheckins.reduce((sum, c) => sum + c.duration, 0);
    acc.totalCheckins += projectCheckins.length;
    return acc;
  }, { totalDuration: 0, totalCheckins: 0 });

  const stats = [
    {
      title: '项目总数',
      value: projects.length,
      icon: Target,
      color: 'blue',
      bgClass: 'bg-blue-50',
      iconClass: 'text-blue-600',
      borderClass: 'border-blue-200',
    },
    {
      title: '总打卡次数',
      value: totalStats.totalCheckins,
      icon: TrendingUp,
      color: 'green',
      bgClass: 'bg-green-50',
      iconClass: 'text-green-600',
      borderClass: 'border-green-200',
    },
    {
      title: '累计学习时长',
      value: `${Math.floor(totalStats.totalDuration / 60)}h ${totalStats.totalDuration % 60}m`,
      icon: Clock,
      color: 'purple',
      bgClass: 'bg-purple-50',
      iconClass: 'text-purple-600',
      borderClass: 'border-purple-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="card p-6 border-l-4"
            style={{ borderLeftColor: `var(--${stat.color}-500, #4f46e5)` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgClass}`}>
                <Icon className={`h-6 w-6 ${stat.iconClass}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}