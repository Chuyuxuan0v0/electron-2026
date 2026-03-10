# 第 1 课：Electron 入门与项目搭建

## 学习目标

- 理解 Electron 是什么、适用场景（桌面端、跨平台）
- 理解**主进程（Main Process）**与**渲染进程（Renderer Process）**的区别与职责
- 使用 **Vite + Vue3** 从零搭建一个 Electron 项目并成功运行

## 学习内容大纲

1. **Electron 简介**
   - Electron 是什么（Chromium + Node.js）
   - 主进程：一个，负责生命周期、窗口、系统 API
   - 渲染进程：每个窗口一个，类似前端页面，可用 Vue/React

2. **项目结构**
   - `package.json` 中 `main` 入口、`scripts`
   - 主进程入口文件（如 `electron/main.js` 或 `src/main/index.ts`）
   - 渲染进程（Vue 入口 + `index.html`）

3. **使用 Vite 搭建**
   - 选型：`electron-vite` 或 手动 Vite + Electron 组合
   - 开发时：先启动 Vite dev server，再启动 Electron 加载本地 URL
   - 生产时：先 build 前端，再由 Electron 加载 `file://` 或打包进 asar

4. **运行与调试**
   - `npm run dev` 能打开一个 Electron 窗口并显示 Vue 页面
   - 会打开 DevTools 或能手动打开进行调试

## 成果量化

| 成果项 | 验收标准 |
|--------|----------|
| 项目可运行 | 执行 `npm run dev` 能弹出 Electron 窗口，页面显示 Vue 内容（如 "Hello Electron"） |
| 理解双进程 | 能口头/笔记说明：主进程做什么、渲染进程做什么、二者如何配合 |
| 目录清晰 | 能区分哪部分代码跑在主进程、哪部分跑在渲染进程 |

## 学习笔记

学完本课后，你的总结笔记将写在同目录下的 `notes.md` 中（由 AI 根据你的学习进度协助整理）。
