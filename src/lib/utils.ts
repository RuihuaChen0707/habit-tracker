import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Project, Checkin, ProjectStats, CalendarDay, HeatmapData } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}分钟`;
  } else if (remainingMinutes === 0) {
    return `${hours}小时`;
  } else {
    return `${hours}小时${remainingMinutes}分钟`;
  }
}

export function formatShortDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}m`;
  } else if (remainingMinutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h${remainingMinutes}m`;
  }
}

export function calculateProjectStats(projectId: string, checkins: Checkin[]): ProjectStats {
  const projectCheckins = checkins.filter(checkin => checkin.projectId === projectId);
  const today = new Date().toISOString().split('T')[0];

  const totalDuration = projectCheckins.reduce((sum, checkin) => sum + checkin.duration, 0);
  const totalCheckins = projectCheckins.length;

  const todayCheckins = projectCheckins.filter(checkin => checkin.date === today);
  const todayDuration = todayCheckins.reduce((sum, checkin) => sum + checkin.duration, 0);

  return {
    totalDuration,
    totalCheckins,
    todayDuration,
    todayCheckins: todayCheckins.length,
  };
}

export function getCalendarData(checkins: Checkin[], projects: Project[]): CalendarDay[] {
  const calendarMap = new Map<string, CalendarDay>();

  checkins.forEach(checkin => {
    const project = projects.find(p => p.id === checkin.projectId);
    if (!project) return;

    const existing = calendarMap.get(checkin.date) || {
      date: checkin.date,
      totalDuration: 0,
      projects: [],
    };

    existing.totalDuration += checkin.duration;

    const existingProjectIndex = existing.projects.findIndex(p => p.projectId === checkin.projectId);
    if (existingProjectIndex >= 0) {
      existing.projects[existingProjectIndex].duration += checkin.duration;
    } else {
      existing.projects.push({
        projectId: checkin.projectId,
        projectName: project.name,
        projectColor: project.color,
        duration: checkin.duration,
      });
    }

    calendarMap.set(checkin.date, existing);
  });

  return Array.from(calendarMap.values()).sort((a, b) => a.date.localeCompare(b.date));
}

export function getHeatmapData(checkins: Checkin[]): HeatmapData[] {
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  const dateMap = new Map<string, number>();

  // 初始化过去一年的所有日期
  for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    dateMap.set(dateStr, 0);
  }

  // 填充打卡数据
  checkins.forEach(checkin => {
    const current = dateMap.get(checkin.date) || 0;
    dateMap.set(checkin.date, current + checkin.duration);
  });

  return Array.from(dateMap.entries()).map(([date, duration]) => {
    let level = 0;
    if (duration > 0) {
      if (duration <= 30) level = 1;
      else if (duration <= 90) level = 2;
      else if (duration <= 180) level = 3;
      else level = 4;
    }

    return { date, level, duration };
  });
}

export function getWeekDates(): Date[] {
  const today = new Date();
  const weekDates = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    weekDates.push(date);
  }

  return weekDates;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}