# 项目上下文（供 AI 恢复用）

## 项目目的

- 用户准备面试，目标岗位要求：Vue 全家桶、Pinia、TypeScript、工程化、**Electron 应用开发经验**、微前端等。
- 用户：前端 5 年（2021–2026），Vue2 ERP、小组长；**未接触过 Electron**，计划用 8 节课自学。

## 你的角色与约定

1. **规划与框架**：已为用户规划 8 节 Electron 课，每课有独立文件夹、README（目标+内容+成果量化）和 `notes.md` 笔记模板。
2. **代码节奏**：先只搭好框架（文件夹+说明），**不预先写每课代码**。当用户说「学习第 x 课」「开始第 x 课」「帮我写第 x 课代码」时，再在该课目录下创建/补充对应代码。
3. **笔记**：用户学完某一课后，可让 AI 根据学习内容或用户提供的要点，协助总结并写入该课的 `notes.md`。
4. **每次对话后**：更新本 `prompt.md`（例如当前学到第几课、下次从哪课开始、有无特别约定），方便用户下次打开项目时让 AI 读取此文件恢复上下文。

## 课程列表与目录

| 课次 | 目录 | 主题 |
|------|------|------|
| 1 | lesson-01-electron-intro | Electron 入门与项目搭建（Vite + Vue3） |
| 2 | lesson-02-ipc-communication | 主进程与渲染进程通信（IPC、preload、contextBridge） |
| 3 | lesson-03-window-lifecycle | 窗口与生命周期（多窗口、应用/窗口事件） |
| 4 | lesson-04-native-system | 原生能力与系统集成（菜单、托盘、对话框、通知） |
| 5 | lesson-05-packaging | 打包与分发（electron-builder、自动更新了解） |
| 6 | lesson-06-security | 安全与最佳实践（安全清单、CSP、preload） |
| 7 | lesson-07-vue-pinia | Electron + Vue3 + Pinia 集成（状态、持久化、小应用） |
| 8 | lesson-08-mini-project | 实战小项目与面试可讲 Demo |

## 当前进度（请每次对话后更新）

- **当前学到第几课**：尚未开始（框架已搭好）
- **下次可从哪课开始**：第 1 课
- **其他备注**：无
