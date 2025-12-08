import { NextRequest, NextResponse } from 'next/server';
import { useAppStore } from '@/lib/store';

// 模拟获取 store 数据的函数
function getStoreData() {
  // 在实际应用中，这里应该从数据库或其他持久化存储获取数据
  // 由于我们使用的是客户端 Zustand store，这里返回一个空数组
  // 真实数据将由客户端组件直接从 store 获取
  return {
    logs: [],
    projects: [],
    checkins: []
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // 从 URL 参数获取查询条件
    const filters = {
      projectId: projectId || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined
    };

    // 获取 store 数据
    const storeData = getStoreData();

    // 构建响应数据
    const response = {
      success: true,
      data: {
        logs: storeData.logs.filter((log: any) => {
          let matches = true;

          if (filters.projectId && log.projectId !== filters.projectId) {
            matches = false;
          }

          if (filters.startDate && log.date < filters.startDate) {
            matches = false;
          }

          if (filters.endDate && log.date > filters.endDate) {
            matches = false;
          }

          return matches;
        }),
        projects: storeData.projects,
        checkins: storeData.checkins
      },
      filters
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch logs',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}