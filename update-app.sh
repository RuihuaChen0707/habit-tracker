#!/bin/bash

# 习惯追踪器桌面应用更新脚本
# 使用方法: ./update-app.sh

echo "🔄 开始更新习惯追踪器桌面应用..."

# 设置颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查是否在正确的目录
if [ ! -f "package.json" ] || [ ! -d "src-tauri" ]; then
    echo -e "${RED}❌ 错误: 请在习惯追踪器项目根目录下运行此脚本${NC}"
    exit 1
fi

# 检查Rust环境
if ! command -v cargo &> /dev/null; then
    echo -e "${RED}❌ 错误: 未找到Rust环境，请先安装Rust${NC}"
    echo "安装方法: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
    exit 1
fi

# 检查Node.js环境
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ 错误: 未找到Node.js环境，请先安装Node.js${NC}"
    exit 1
fi

echo -e "${BLUE}📦 安装依赖...${NC}"
npm install

echo -e "${BLUE}🔨 构建前端应用...${NC}"
npm run build

echo -e "${BLUE}🦀 构建桌面应用...${NC}"
source "$HOME/.cargo/env"
npm run tauri:build

# 检查构建结果
if [ -f "src-tauri/target/release/bundle/macos/习惯追踪器.app" ]; then
    echo -e "${GREEN}✅ 桌面应用构建成功！${NC}"
    echo -e "${GREEN}📱 应用位置: src-tauri/target/release/bundle/macos/习惯追踪器.app${NC}"

    if [ -f "src-tauri/target/release/bundle/dmg/习惯追踪器_1.0.0_aarch64.dmg" ]; then
        echo -e "${GREEN}💿 安装包位置: src-tauri/target/release/bundle/dmg/习惯追踪器_1.0.0_aarch64.dmg${NC}"
    fi

    echo -e "${YELLOW}🎉 更新完成！你可以运行桌面应用了${NC}"
else
    echo -e "${RED}❌ 构建失败，请检查错误信息${NC}"
    exit 1
fi

echo -e "${BLUE}🔍 显示应用信息...${NC}"
if [ -d "src-tauri/target/release/bundle/macos/习惯追踪器.app" ]; then
    echo "应用大小: $(du -sh "src-tauri/target/release/bundle/macos/习惯追踪器.app" | cut -f1)"
fi

if [ -f "src-tauri/target/release/bundle/dmg/习惯追踪器_1.0.0_aarch64.dmg" ]; then
    echo "安装包大小: $(du -sh "src-tauri/target/release/bundle/dmg/习惯追踪器_1.0.0_aarch64.dmg" | cut -f1)"
fi

echo -e "${GREEN}✨ 更新脚本执行完成！${NC}"