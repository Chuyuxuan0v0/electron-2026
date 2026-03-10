# Electron 8 节课学习计划

面向「有 Vue/前端经验、需补充 Electron 以应对面试」的 8 节课自学框架。每节课有明确目标、内容大纲和成果量化，学完后可在对应目录的 `notes.md` 中整理学习笔记（可由 AI 协助总结）。

## 你的背景（面试用）

- 前端工作 5 年（2021–2026），中厂 Vue2 ERP 开发，担任小组长。
- 目标：补充 Electron 与工程化/架构经验，匹配目标岗位要求。

## 课程结构

| 课次 | 目录 | 主题 | 核心成果 |
|------|------|------|----------|
| 1 | [lesson-01-electron-intro](./lesson-01-electron-intro) | Electron 入门与项目搭建 | Vite + Vue3 的 Electron 项目能运行，理解主/渲染进程 |
| 2 | [lesson-02-ipc-communication](./lesson-02-ipc-communication) | 主进程与渲染进程通信（IPC） | 双向 IPC + preload + contextBridge 安全暴露 API |
| 3 | [lesson-03-window-lifecycle](./lesson-03-window-lifecycle) | 窗口与生命周期 | 多窗口 Demo，应用生命周期与窗口事件 |
| 4 | [lesson-04-native-system](./lesson-04-native-system) | 原生能力与系统集成 | 菜单、托盘、对话框、通知 |
| 5 | [lesson-05-packaging](./lesson-05-packaging) | 打包与分发 | electron-builder 打出可安装包，了解自动更新 |
| 6 | [lesson-06-security](./lesson-06-security) | 安全与最佳实践 | 安全清单、CSP、preload 最小暴露 |
| 7 | [lesson-07-vue-pinia](./lesson-07-vue-pinia) | Electron + Vue3 + Pinia 集成 | 状态架构、持久化、小型完整应用 |
| 8 | [lesson-08-mini-project](./lesson-08-mini-project) | 实战小项目与面试 Demo | 可演示、可写简历的完整应用 + 面试可讲稿 |

## 使用方式

1. **按课学习**：进入对应 `lesson-xx-xxx` 目录，阅读 `README.md`（目标、内容、成果量化），按大纲自学或配合官方文档/教程。
2. **代码何时写**：当前仓库只搭好「文件夹 + 每课说明 + 笔记模板」。当你学到某一课并需要动手写代码时，对 AI 说「帮我学习第 x 课」或「开始第 x 课代码」，再在对应课目录下创建/补充代码。
3. **笔记**：学完某一课后，在当课的 `notes.md` 里写总结；也可让 AI 根据你的学习进度协助整理笔记。
4. **上下文**：每次对话后可更新根目录的 `prompt.md`，下次重启项目时可直接让 AI 读取该文件以恢复上下文。

## 目录说明

- 每课目录下：
  - `README.md`：本课学习目标、内容大纲、成果量化。
  - `notes.md`：学习笔记（学完后填写，可由 AI 协助）。
  - 代码：仅当你说「开始第 x 课」或「帮我写第 x 课代码」时，在该课目录下创建，便于按课迭代。
- 根目录：
  - `README.md`：本说明。
  - `prompt.md`：项目与学习进度上下文，供下次对话使用。
