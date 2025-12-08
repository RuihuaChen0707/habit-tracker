'use client';

import React, { useState } from 'react';
import { Plus, Target, Calendar } from 'lucide-react';
import { Project } from '@/types';
import { ProjectCard } from '@/components/project-card';
import { EmptyState } from '@/components/empty-state';
import { CreateProjectModal } from '@/components/create-project-modal';
import { ToastProvider, useToast } from '@/components/ui/toast';
import { useAppStore } from '@/lib/store';
import { StatsOverviewCard } from '@/components/stats-overview-card';

function HomeContent() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { showToast } = useToast();

  const { projects, addProject, updateProject, deleteProject, addCheckin } = useAppStore();

  const handleCreateProject = () => {
    setEditingProject(null);
    setIsCreateModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsCreateModalOpen(true);
  };

  const handleSubmitProject = (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    try {
      if (editingProject) {
        updateProject(editingProject.id, projectData);
        showToast('项目更新成功', 'success');
      } else {
        addProject(projectData);
        showToast('项目创建成功', 'success');
      }
      // 关闭模态框
      closeModal();
    } catch (error) {
      showToast(editingProject ? '项目更新失败' : '项目创建失败', 'error');
    }
  };

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('此操作将同时删除该项目下的所有打卡记录且不可恢复，确定要删除吗？')) {
      try {
        deleteProject(projectId);
        showToast('项目删除成功', 'success');
      } catch (error) {
        showToast('项目删除失败', 'error');
      }
    }
  };

  const handleCheckin = (projectId: string, duration: number) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      addCheckin({
        projectId,
        date: today,
        duration,
      });

      const project = projects.find(p => p.id === projectId);
      const projectName = project?.name || '项目';
      showToast(`在 ${projectName} 中成功打卡 ${duration} 分钟`, 'success');
    } catch (error) {
      showToast('打卡失败，请重试', 'error');
    }
  };

  const closeModal = () => {
    setIsCreateModalOpen(false);
    setEditingProject(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面头部 */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '64px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Target style={{ height: '20px', width: '20px', color: 'white' }} />
              </div>
              <h1 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#111827'
              }}>
                习惯追踪器
              </h1>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a
                href="/calendar"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  backgroundColor: 'white',
                  color: '#374151',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                  e.currentTarget.style.borderColor = '#3b82f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                <Calendar style={{ height: '16px', width: '16px' }} />
                日历视图
              </a>
              <button
                onClick={handleCreateProject}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                <Plus style={{ height: '16px', width: '16px' }} />
                创建项目
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区域 - 单栏布局 */}
      <main style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '32px 24px'
      }}>
        {projects.length === 0 ? (
          /* 空状态 */
          <EmptyState onCreateProject={handleCreateProject} />
        ) : (
          <div>
            {/* 统计概览卡片 */}
            <div style={{ marginBottom: '32px' }}>
              <StatsOverviewCard projects={projects} />
            </div>

            {/* 项目列表 - 网格布局，一个屏幕显示4个项目 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '20px',
              width: '100%'
            }}>
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={handleEditProject}
                  onDelete={handleDeleteProject}
                  onCheckin={handleCheckin}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 创建/编辑项目模态框 */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={closeModal}
        project={editingProject}
        onSubmit={handleSubmitProject}
      />
    </div>
  );
}

export default function Home() {
  return (
    <ToastProvider>
      <HomeContent />
    </ToastProvider>
  );
}