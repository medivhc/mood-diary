# Z-Fold AI - Z 轴折叠空间交互系统

## 项目概述

这是一个为移动端 AI 智能体设计的"Z 轴折叠"交互系统原型实现。该项目放弃了传统的 2D 线性滚动布局，引入 Z 轴景深与状态折叠，构建高秩序感、零视觉干扰的"空间画布"。

## 核心特性

### 1. 三态状态机
- **Min-State (待机状态)**: 输入框折叠为顶部极简标记，画布中心显示当前任务结果
- **Active-Focus (指令输入状态)**: 输入框完全展开并获焦，背景高斯模糊强调输入层
- **Z-Stack-History (历史检索状态)**: 当前任务退至 Z 轴后方，历史任务卡片呈立体轮播图铺开

### 2. 手势交互
- **双手上滑 (Swipe Up)**: 从屏幕底部双指向上滑动唤醒输入框
- **双指捏合 (Pinch In)**: 在画布中央捏合进入历史深度视图
- **双指展开 (Pinch Out)**: 从历史视图捏合返回主舞台
- **边缘长按拖动 (Edge Scrubber)**: 在屏幕右侧边缘长按后上下滑动快速浏览历史

### 3. 视觉设计
- 毛玻璃效果 (Backdrop Filter)
- 弹簧物理动画 (Spring Animation)
- CSS 3D 变换实现 Z 轴景深
- 渐变背景与半透明图层

## 技术栈

- **React 19** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Framer Motion** - 动画库
- **CSS Modules** - 样式管理

## 项目结构

```
z-fold-ai/
├── src/
│   ├── App.tsx           # 主应用组件，状态机管理
│   ├── InputHub.tsx      # 顶部输入枢纽组件
│   ├── SpatialCanvas.tsx # Z 轴景深画布组件
│   ├── TaskCard.tsx      # 任务卡片组件
│   ├── EdgeScrubber.tsx  # 边缘隐形游标组件
│   ├── types.ts          # TypeScript 类型定义
│   ├── index.css         # 全局样式
│   └── main.tsx          # 入口文件
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 `http://localhost:5173` 查看应用。

### 运行测试

```bash
npm run test
```

### 生产构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 交互说明

### 桌面端测试快捷键
- `Alt + ArrowUp`: 上一个历史记录
- `Alt + ArrowDown`: 下一个历史记录
- `Alt + Enter`: 选中当前历史记录

### 移动端手势
1. **唤醒输入**: 双指从屏幕底部向上滑动
2. **查看历史**: 双指在屏幕中央捏合
3. **退出历史**: 双指在屏幕上展开
4. **快速浏览**: 长按屏幕右边缘后上下拖动

## E2E 测试用例

参见 PRD 文档中的测试场景：

1. **输入框无感唤醒与物理锚定**
   - 验证键盘弹起时中央卡片 Y 坐标位移为 0

2. **沉浸式历史节点下潜**
   - 验证 Z 轴渲染和卡片层叠效果

3. **隐形边缘游标的时间线穿梭**
   - 验证触觉反馈和历史轮播模式

## 设计规范

### 动画参数
- Spring damping: 25
- Spring stiffness: 500
- Transition duration: 200ms

### Z 轴变换
- 当前卡片：`translateZ(0) scale(1)`
- 历史卡片：`translateZ(-200px * index) scale(0.8 - 0.1 * index)`

### 颜色方案
- 背景渐变：`#1a1a2e → #16213e → #0f3460`
- 主色调：`#4f46e5` (Indigo)
- 文字：白色系透明度变化

## 浏览器兼容性

- iOS Safari 15+
- Android Chrome 90+
- Desktop Chrome/Firefox/Safari (用于开发调试)

## License

ISC
