'use client';

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Target, RotateCcw } from 'lucide-react';
import { Project } from '@/types';
import { useAppStore } from '@/lib/store';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps: {
    projectId: string;
    projectName: string;
    duration: number;
    emoji: string;
  };
}

export default function CalendarPage() {
  const { projects, logs } = useAppStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // 将日志记录转换为日历事件
  useEffect(() => {
    const calendarEvents: CalendarEvent[] = logs.map((log) => {
      const project = projects.find(p => p.id === log.projectId);
      if (!project) return null;

      return {
        id: log.id,
        title: `${project.emoji || '📚'} ${project.name}`,
        start: log.date,
        backgroundColor: project.color + '20',
        borderColor: project.color,
        textColor: project.color,
        extendedProps: {
          projectId: project.id,
          projectName: project.name,
          duration: log.duration,
          emoji: project.emoji || '📚'
        }
      };
    }).filter(Boolean) as CalendarEvent[];

      setEvents(calendarEvents);
  }, [logs, projects]);

  const handleDateChange = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleTodayClick = () => {
    setCurrentDate(new Date());
  };

  const isCurrentMonth = () => {
    const today = new Date();
    return currentDate.getFullYear() === today.getFullYear() &&
           currentDate.getMonth() === today.getMonth();
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long'
    });
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
              <a
                href="/"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
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
              </a>
              <span style={{ color: '#9ca3af' }}>→</span>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CalendarIcon style={{ height: '18px', width: '18px', color: '#6b7280' }} />
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '500',
                  color: '#6b7280'
                }}>
                  日历视图
                </h2>
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <button
                onClick={() => handleDateChange('prev')}
                style={{
                  padding: '8px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ChevronLeft style={{ height: '16px', width: '16px', color: '#6b7280' }} />
              </button>

              <div style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#111827',
                minWidth: '160px',
                textAlign: 'center'
              }}>
                {formatMonthYear(currentDate)}
              </div>

              <button
                onClick={() => handleDateChange('next')}
                style={{
                  padding: '8px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ChevronRight style={{ height: '16px', width: '16px', color: '#6b7280' }} />
              </button>

              {!isCurrentMonth() && (
                <button
                  onClick={handleTodayClick}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    backgroundColor: '#f0f9ff',
                    color: '#0284c7',
                    border: '1px solid #bae6fd',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0284c7';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0f9ff';
                    e.currentTarget.style.color = '#0284c7';
                  }}
                >
                  <RotateCcw style={{ height: '14px', width: '14px' }} />
                  今天
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 日历主体 */}
      <main style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '32px 24px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e5e7eb',
          overflow: 'hidden'
        }}>
          <FullCalendar
            key={currentDate.toISOString()}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            initialDate={currentDate}
            events={events}
            headerToolbar={false}
            height="auto"
            aspectRatio={1.8}
            displayEventTime={false}
            eventMaxStack={2}
            dayMaxEventRows={3}
            moreLinkContent={(arg) => `+${arg.num} 更多`}
            eventDidMount={(info) => {
              // 自定义事件样式
              const eventEl = info.el as HTMLElement;
              eventEl.style.borderRadius = '6px';
              eventEl.style.borderLeftWidth = '3px';
              eventEl.style.fontSize = '12px';
              eventEl.style.padding = '2px 6px';
              eventEl.style.margin = '1px';
              eventEl.style.whiteSpace = 'nowrap';
              eventEl.style.overflow = 'hidden';
              eventEl.style.textOverflow = 'ellipsis';

              // 添加项目emoji
              const emoji = info.event.extendedProps.emoji;
              if (emoji && !info.el.querySelector('.emoji-prefix')) {
                const emojiSpan = document.createElement('span');
                emojiSpan.className = 'emoji-prefix';
                emojiSpan.textContent = emoji + ' ';
                emojiSpan.style.marginRight = '2px';
                eventEl.insertBefore(emojiSpan, eventEl.firstChild);
              }
            }}
            dayCellClassNames={(date) => {
              const today = new Date();
              const cellDate = date.date;

              if (cellDate.toDateString() === today.toDateString()) {
                return 'today-cell';
              }
              return '';
            }}
            dayCellDidMount={(info) => {
              // 今天的日期样式
              if (info.el.classList.contains('today-cell')) {
                info.el.style.backgroundColor = '#dbeafe';
                info.el.style.position = 'relative';
              }

              // 周末样式
              const dayOfWeek = info.date.getDay();
              if (dayOfWeek === 0 || dayOfWeek === 6) {
                info.el.style.backgroundColor = '#f9fafb';
              }
            }}
            moreLinkClick={(arg) => {
              // 点击"更多"链接时的处理
              return 'popover';
            }}
          />
        </div>

        {/* 图例说明 */}
        <div style={{
          marginTop: '24px',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '16px'
          }}>
            项目图例
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '12px'
          }}>
            {projects.map((project) => (
              <div
                key={project.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '2px',
                    backgroundColor: project.color + '20',
                    borderLeft: `3px solid ${project.color}`
                  }}
                />
                <span style={{
                  fontSize: '14px',
                  color: '#374151'
                }}>
                  {project.emoji || '📚'} {project.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}