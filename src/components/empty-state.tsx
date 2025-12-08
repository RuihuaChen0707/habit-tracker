'use client';

import React from 'react';
import { Target, Plus } from 'lucide-react';

interface EmptyStateProps {
  onCreateProject: () => void;
}

export function EmptyState({ onCreateProject }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center">
          <Target className="h-10 w-10 text-gray-400" />
        </div>
      </div>

      <div className="empty-state-title">
        还没有任何项目
      </div>

      <div className="empty-state-description">
        创建你的第一个项目，开始记录学习进度。设定目标，坚持打卡，见证成长的每一步。
      </div>

      <button
        onClick={onCreateProject}
        className="btn btn-primary btn-lg"
      >
        <Plus className="h-5 w-5" />
        创建第一个项目
      </button>
    </div>
  );
}