import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 配置静态导出，适用于Tauri桌面应用
  output: 'export',
  // 禁用图片优化（静态导出不支持）
  images: {
    unoptimized: true
  },
  // 确保所有路由都预渲染
  trailingSlash: true,
  // 启用严格模式
  reactStrictMode: true,
  // 禁用服务器端功能，纯静态导出
  distDir: 'out'
};

export default nextConfig;
