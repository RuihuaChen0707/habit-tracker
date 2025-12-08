import { Project, Checkin, AppState } from '@/types';

const STORAGE_KEYS = {
  PROJECTS: 'habit-tracker-projects',
  CHECKINS: 'habit-tracker-checkins',
} as const;

export class LocalStorage {
  static getProjects(): Project[] {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load projects from localStorage:', error);
      return [];
    }
  }

  static saveProjects(projects: Project[]): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (error) {
      console.error('Failed to save projects to localStorage:', error);
      throw new Error('存储空间不足，请清理部分数据');
    }
  }

  static getCheckins(): Checkin[] {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHECKINS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load checkins from localStorage:', error);
      return [];
    }
  }

  static saveCheckins(checkins: Checkin[]): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEYS.CHECKINS, JSON.stringify(checkins));
    } catch (error) {
      console.error('Failed to save checkins to localStorage:', error);
      throw new Error('存储空间不足，请清理部分数据');
    }
  }

  static getAppState(): AppState {
    return {
      projects: this.getProjects(),
      checkins: this.getCheckins(),
    };
  }

  static clearAllData(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(STORAGE_KEYS.PROJECTS);
      localStorage.removeItem(STORAGE_KEYS.CHECKINS);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }

  static exportData(): string {
    const data = this.getAppState();
    return JSON.stringify(data, null, 2);
  }

  static importData(jsonData: string): boolean {
    try {
      const data: AppState = JSON.parse(jsonData);

      // 验证数据格式
      if (!data.projects || !Array.isArray(data.projects)) {
        throw new Error('Invalid projects data');
      }
      if (!data.checkins || !Array.isArray(data.checkins)) {
        throw new Error('Invalid checkins data');
      }

      this.saveProjects(data.projects);
      this.saveCheckins(data.checkins);
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }
}