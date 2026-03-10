# 第 2 课：主进程与渲染进程通信（IPC）

## 学习目标

- 掌握 **IPC（Inter-Process Communication）**：主进程与渲染进程如何安全通信
- 理解 **preload** 脚本的作用：在隔离上下文中暴露有限 API 给渲染进程
- 会用 **contextBridge** 安全地暴露方法，避免直接暴露 Node/Electron 能力
- 完成一次「渲染进程 → 主进程 → 渲染进程」的双向通信示例

## 学习内容大纲

1. **为什么需要 IPC**
   - 渲染进程默认不直接访问 Node.js/Electron 主进程 API（安全）
   - 通过 IPC 由主进程代为执行敏感或系统级操作

2. **ipcMain 与 ipcRenderer**
   - 主进程：`ipcMain.on('channel', handler)`、`event.reply`
   - 渲染进程：通过 preload 暴露的封装方法调用，不直接使用 `ipcRenderer`

3. **preload 脚本**
   - 在「预加载」阶段运行，可访问 Node + 部分 Electron API
   - 使用 `contextBridge.exposeInMainWorld` 暴露给 `window.xxx` 的接口
   - 只暴露业务需要的、白名单式的方法，不暴露整个 `require('electron')`

4. **安全要点**
   - 关闭 `nodeIntegration`，开启 `contextIsolation`
   - 所有与主进程的通信都经过 preload 封装

## 成果量化

| 成果项 | 验收标准 |
|--------|----------|
| 双向通信 | 渲染进程点击按钮 → 主进程收到并处理（如读一个本地文件或返回时间）→ 结果回传到渲染进程并显示 |
| preload 使用 | 项目中存在 preload 文件，且通过 contextBridge 暴露了至少一个 API（如 `window.electron.xxx()`） |
| 安全配置 | 创建 BrowserWindow 时未开启 nodeIntegration，且开启了 contextIsolation |

## 学习笔记

学完本课后，笔记将写在同目录下的 `notes.md` 中。
