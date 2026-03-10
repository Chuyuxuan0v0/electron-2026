# 第 7 课：Electron + Vue3 + Pinia 集成

## 学习目标

- 在现有 Electron 项目中完整接入 **Vue3**（Composition API、Script Setup）和 **Pinia**
- 设计一个简单的**状态架构**：哪些状态放 Pinia、哪些通过 IPC 与主进程同步
- 实现**状态持久化**：如设置项写入本地文件，由主进程读写，渲染进程通过 IPC 获取
- 能做出一个「Vue3 + Pinia + Electron」的小型完整应用（如带设置的记事本/待办）

## 学习内容大纲

1. **Vue3 + Vite 在 Electron 中的位置**
   - 渲染进程 = 普通 Vue 应用；主进程 = Node/Electron 环境
   - 路由（如 vue-router）：在渲染进程内做页面切换；多窗口可对应不同 route 或不同 HTML

2. **Pinia 在渲染进程中的使用**
   - 安装 Pinia，在 main.ts（渲染进程入口）挂载
   - 定义 store：如 settingsStore、documentStore
   - 与主进程的配合：需要持久化或调用原生能力时，通过 preload 调用主进程，主进程读写文件或系统 API

3. **状态持久化**
   - 方案一：主进程用 fs 写配置文件（如 JSON），preload 暴露 `readSettings`/`writeSettings`，Pinia 的 action 里调用
   - 方案二：渲染进程用 localStorage（仅限渲染进程内），适合不涉及主进程的数据
   - 敏感或需要跨窗口的数据建议走主进程

4. **小应用示例**
   - 例如：简单记事本或待办列表；主题/字体大小存 Pinia + 主进程持久化；新建/打开/保存文件通过 dialog + IPC

## 成果量化

| 成果项 | 验收标准 |
|--------|----------|
| Vue3 + Pinia 跑通 | 渲染进程使用 Vue3（Composition API/Script Setup）+ Pinia，有至少一个 store 和至少一个使用该 store 的组件 |
| 持久化 | 有一类数据（如设置）通过主进程读写文件实现持久化，重启应用后能恢复 |
| 小应用可用 | 完成一个可演示的小功能（如设置页改主题并持久化、或打开/保存一个文本文件） |

## 学习笔记

学完本课后，笔记将写在同目录下的 `notes.md` 中。
