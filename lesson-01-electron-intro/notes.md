# 第 1 课学习笔记：Electron 入门与项目搭建

## 1. Electron 是什么

- **本质**：Chromium（渲染引擎）+ Node.js（系统能力）的组合，用 Web 技术开发跨平台桌面应用。
- **适用场景**：VS Code、Slack、Figma 等桌面工具；需要 Web 技术栈 + 系统 API 访问的应用。

---

## 2. 双进程模型（核心概念）


|                 | 主进程                        | 渲染进程                       |
| --------------- | -------------------------- | -------------------------- |
| **数量**          | 整个应用只有一个                   | 每个窗口一个                     |
| **运行环境**        | Node.js                    | Chromium（浏览器）              |
| **职责**          | 窗口管理、生命周期、系统 API（菜单/文件/托盘） | 前端 UI（Vue/React/HTML）      |
| **代码位置**        | `src/main/index.js`        | `src/renderer/src/App.vue` |
| **能否用 Node.js** | ✅ 完整 Node.js 能力            | ❌ 默认不行（安全隔离）               |


### 两进程如何配合

渲染进程不能直接调用系统 API，需要通过 **预加载脚本（preload）+ contextBridge** 搭桥：

```
渲染进程 → contextBridge.exposeInMainWorld → preload → IPC → 主进程
```

本课只暴露了版本信息，IPC 双向通信在**第 2 课**深入。

---

## 3. 项目结构

```
lesson-01-electron-intro/
├── electron.vite.config.mjs  # electron-vite 配置：主进程、preload、renderer 三段配置
├── package.json              # main 字段指向 out/main/index.js（构建产物）
└── src/
    ├── main/
    │   └── index.js          # 主进程入口：创建窗口、管理生命周期
    ├── preload/
    │   └── index.js          # 预加载：contextBridge 安全桥接
    └── renderer/
        ├── index.html        # 渲染进程 HTML 入口
        └── src/
            ├── main.js       # Vue 应用挂载
            ├── App.vue       # 页面组件（展示版本信息 + 双进程说明）
            └── style.css     # 样式
```

---

## 4. 关键代码要点

### 主进程创建窗口

```js
const win = new BrowserWindow({
  webPreferences: {
    preload: join(__dirname, '../preload/index.js'),
    contextIsolation: true,  // 隔离上下文（安全必须开启）
    nodeIntegration: false   // 渲染进程不开放 Node.js（安全）
  }
})
```

### contextBridge 安全暴露 API

```js
// preload/index.js
contextBridge.exposeInMainWorld('electronAPI', {
  versions: process.versions
})

// 渲染进程中访问
window.electronAPI.versions.electron
```

### 开发 vs 生产加载方式

```js
if (isDev) {
  win.loadURL(process.env['ELECTRON_RENDERER_URL'])  // Vite Dev Server
} else {
  win.loadFile(join(__dirname, '../renderer/index.html'))  // 静态文件
}
```

---

## 5. 工具链选型：electron-vite

- `electron-vite` 把主进程、preload、渲染进程三段构建整合进一个配置
- `pnpm dev`（或 `npm run dev`）：启动 Vite Dev Server + Electron，支持热更新
- `npm run build`：三段分别构建到 `out/` 目录

---

## 6. 本课实操记录（pnpm + workspace 省空间）

### 为什么要换 pnpm

- **目标**：避免每一课都重复下载 `electron` 这类大依赖，节省磁盘。
- **原理**：pnpm 使用全局内容寻址存储（store），不同课程（不同 package）会**复用同一份下载**，再通过硬链接/符号链接装到各自的 `node_modules`。

### 本仓库的约定（workspace）

根目录已添加：

- `pnpm-workspace.yaml`：把 `lesson-`* 识别为 workspace packages
- 根目录 `package.json`：标记 `private: true`

### 运行第 1 课（推荐方式）

如果你之前用 npm 安装过，需要先清理一次：

```bash
cd /Users/crxuan/DevelopCode/electron-2026/lesson-01-electron-intro
rm -rf node_modules package-lock.json
```

然后在根目录统一安装（以后每课都复用）：

```bash
cd /Users/crxuan/DevelopCode/electron-2026
pnpm install
```

最后启动第 1 课：

```bash
cd lesson-01-electron-intro
pnpm dev
```

> 现象：弹出 Electron 窗口，页面显示 “Hello Electron”，并展示 Electron/Chromium/Node.js 版本号。

---

## 7. 面试要点

- **为什么 contextIsolation: true / nodeIntegration: false？**
防止渲染进程中的恶意脚本佳实践。直接访问 Node.js 能力（如读取文件系统），是安全最
- **主进程和渲染进程如何通信？**
通过 IPC（`ipcMain` / `ipcRenderer`）+ preload 中的 `contextBridge`，详见第 2 课。
- **Electron 和 NW.js 的区别？**
Electron 严格的双进程隔离 + 单一主进程模型更利于架构清晰；NW.js 允许渲染进程直接用 Node.js，安全性较弱。

