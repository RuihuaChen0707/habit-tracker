import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Project, Checkin, Log } from '@/types';
import { LocalStorage } from './storage';
import { calculateProjectStats } from './utils';

interface AppState {
  projects: Project[];
  checkins: Checkin[];
  logs: Log[];
  isLoading: boolean;
  error: string | null;
}

interface AppActions {
  // Projects
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Checkins
  addCheckin: (checkin: Omit<Checkin, 'id' | 'createdAt'>) => void;
  updateCheckin: (id: string, updates: Partial<Checkin>) => void;
  deleteCheckin: (id: string) => void;
  undoLastCheckin: (projectId: string) => void;

  // Logs
  addLog: (log: Omit<Log, 'id' | 'createdAt'>) => void;
  updateLog: (id: string, updates: Partial<Log>) => void;
  deleteLog: (id: string) => void;

  // Utility
  loadFromStorage: () => void;
  saveToStorage: () => void;
  clearError: () => void;
}

export type AppStore = AppState & AppActions;

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      projects: [],
      checkins: [],
      logs: [],
      isLoading: false,
      error: null,

      // Project actions
      addProject: (projectData) => {
        try {
          const newProject: Project = {
            ...projectData,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
          };

          set((state) => ({
            projects: [...state.projects, newProject],
            error: null,
          }));

          // Auto save to localStorage
          get().saveToStorage();
        } catch (error) {
          set({ error: '创建项目失败' });
        }
      },

      updateProject: (id, updates) => {
        try {
          set((state) => ({
            projects: state.projects.map((project) =>
              project.id === id ? { ...project, ...updates } : project
            ),
            error: null,
          }));

          get().saveToStorage();
        } catch (error) {
          set({ error: '更新项目失败' });
        }
      },

      deleteProject: (id) => {
        try {
          set((state) => ({
            projects: state.projects.filter((project) => project.id !== id),
            checkins: state.checkins.filter((checkin) => checkin.projectId !== id),
            logs: state.logs.filter((log) => log.projectId !== id),
            error: null,
          }));

          get().saveToStorage();
        } catch (error) {
          set({ error: '删除项目失败' });
        }
      },

      // Checkin actions
      addCheckin: (checkinData) => {
        try {
          const newCheckin: Checkin = {
            ...checkinData,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
          };

          // 同时创建 Log 记录
          const newLog: Log = {
            ...checkinData,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
          };

          set((state) => ({
            checkins: [...state.checkins, newCheckin],
            logs: [...state.logs, newLog],
            error: null,
          }));

          get().saveToStorage();
        } catch (error) {
          set({ error: '添加打卡记录失败' });
        }
      },

      updateCheckin: (id, updates) => {
        try {
          set((state) => ({
            checkins: state.checkins.map((checkin) =>
              checkin.id === id ? { ...checkin, ...updates } : checkin
            ),
            error: null,
          }));

          get().saveToStorage();
        } catch (error) {
          set({ error: '更新打卡记录失败' });
        }
      },

      deleteCheckin: (id) => {
        try {
          set((state) => ({
            checkins: state.checkins.filter((checkin) => checkin.id !== id),
            error: null,
          }));

          get().saveToStorage();
        } catch (error) {
          set({ error: '删除打卡记录失败' });
        }
      },

      undoLastCheckin: (projectId) => {
        try {
          const state = get();

          // 找到该项目最近的打卡记录
          const projectCheckins = state.checkins
            .filter(checkin => checkin.projectId === projectId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

          const projectLogs = state.logs
            .filter(log => log.projectId === projectId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

          if (projectCheckins.length > 0 && projectLogs.length > 0) {
            const lastCheckin = projectCheckins[0];
            const lastLog = projectLogs[0];

            // 删除最近的打卡记录和对应的日志
            set((prevState) => ({
              checkins: prevState.checkins.filter(checkin => checkin.id !== lastCheckin.id),
              logs: prevState.logs.filter(log => log.id !== lastLog.id),
              error: null,
            }));

            get().saveToStorage();
          }
        } catch (error) {
          set({ error: '撤销打卡失败' });
        }
      },

      // Log actions
      addLog: (logData) => {
        try {
          const newLog: Log = {
            ...logData,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
          };

          set((state) => ({
            logs: [...state.logs, newLog],
            error: null,
          }));

          get().saveToStorage();
        } catch (error) {
          set({ error: '添加日志记录失败' });
        }
      },

      updateLog: (id, updates) => {
        try {
          set((state) => ({
            logs: state.logs.map((log) =>
              log.id === id ? { ...log, ...updates } : log
            ),
            error: null,
          }));

          get().saveToStorage();
        } catch (error) {
          set({ error: '更新日志记录失败' });
        }
      },

      deleteLog: (id) => {
        try {
          set((state) => ({
            logs: state.logs.filter((log) => log.id !== id),
            error: null,
          }));

          get().saveToStorage();
        } catch (error) {
          set({ error: '删除日志记录失败' });
        }
      },

      // Utility actions
      loadFromStorage: () => {
        try {
          set({ isLoading: true });
          const projects = LocalStorage.getProjects();
          const checkins = LocalStorage.getCheckins();

          set({
            projects,
            checkins,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: '加载数据失败',
          });
        }
      },

      saveToStorage: () => {
        try {
          const { projects, checkins } = get();
          LocalStorage.saveProjects(projects);
          LocalStorage.saveCheckins(checkins);
        } catch (error) {
          set({ error: '保存数据失败' });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'habit-tracker-storage',
      storage: createJSONStorage(() => localStorage),
      // 只持久化核心数据，不包含loading和error状态
      partialize: (state) => ({
        projects: state.projects,
        checkins: state.checkins,
        logs: state.logs,
      }),
      // 从storage恢复时的处理
      onRehydrateStorage: () => (state) => {
        if (state) {
          // 确保恢复后错误状态被清除
          state.error = null;
          state.isLoading = false;
        }
      },
    }
  )
);

// 便捷的hooks
export const useProjects = () => {
  const { projects } = useAppStore();
  return projects;
};

export const useCheckins = () => {
  const { checkins } = useAppStore();
  return checkins;
};

export const useProjectStats = (projectId: string) => {
  const checkins = useCheckins();
  return calculateProjectStats(projectId, checkins);
};

export const useError = () => {
  const { error, clearError } = useAppStore();
  return { error, clearError };
};