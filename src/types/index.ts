export interface Project {
  id: string;
  name: string;
  emoji?: string;
  color: string;
  goal?: {
    duration?: number; // 目标总时长，单位：分钟
    checkins?: number; // 目标总打卡次数
  };
  createdAt: string; // ISO 8601 UTC时间戳
}

export interface Checkin {
  id: string;
  projectId: string;
  date: string; // YYYY-MM-DD格式
  duration: number; // 打卡时长，单位：分钟
  createdAt: string; // ISO 8601 UTC时间戳
}

export interface Log {
  id: string;
  projectId: string;
  date: string; // YYYY-MM-DD格式
  duration: number; // 打卡时长，单位：分钟
  createdAt: string; // ISO 8601 UTC时间戳
}

export interface AppState {
  projects: Project[];
  checkins: Checkin[];
  logs: Log[];
}

export interface ProjectStats {
  totalDuration: number;
  totalCheckins: number;
  todayDuration?: number;
  todayCheckins?: number;
}

export interface CalendarDay {
  date: string;
  totalDuration: number;
  projects: Array<{
    projectId: string;
    projectName: string;
    projectColor: string;
    duration: number;
  }>;
}

export interface HeatmapData {
  date: string;
  level: number; // 0-5，表示颜色深度级别
  duration: number; // 当天总时长（分钟）
}