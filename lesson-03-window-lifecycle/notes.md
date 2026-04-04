# 第 3 课学习笔记：窗口与生命周期

## 1. 本课代码在做什么

- **主窗口**：`createMainWindow()`，`BrowserWindow` 加载 `index.html`（主入口）。
- **子窗口**：`createSettingsWindow()`，加载独立页面 `settings.html`（electron-vite **多页 / 多 rollup input**）。
- **子窗口关系**：`parent: mainWindow` + `modal: true`（模态子窗，焦点与层级行为更符合「设置弹窗」预期）。
- **引用变量保存窗口实例**：避免只 `new` 不持有引用导致窗口被 GC、行为异常；重复打开时可 `focus()` 已有窗口。
- **`close` 前拦截**：主窗口在「模拟未保存」为真时，`close` 里 `event.preventDefault()` + `dialog.showMessageBox`，用户确认后再 `destroy()`。
- **应用生命周期**：
  - `app.whenReady()` 后再创建窗口；
  - `window-all-closed`：非 darwin 时 `app.quit()`；
  - `activate`（macOS）：无窗口时重新 `createMainWindow()`。

## 2. 运行方式（pnpm workspace）

在仓库根目录安装依赖后：

```bash
cd /Users/crxuan/DevelopCode/electron-2026/lesson-03-window-lifecycle
pnpm dev
```

验收：主窗口可打开设置子窗口；勾选「模拟未保存」后关闭主窗口会出现确认框；在 macOS 与 Windows 上对比「关完所有窗口后是否退出」的差异。

## 3. 补充知识点（面试常问）

- **`loadURL` vs `loadFile`**：开发环境走 Dev Server URL；生产通常 `loadFile` 或 asar 内路径。
- **多页应用**：每个 `BrowserWindow` 可对应不同 HTML 入口；需在 Vite / electron-vite 的 `rollupOptions.input` 中注册各 HTML。
- **窗口事件**：`close`（可 `preventDefault`）、`closed`（窗口已关闭，适合做清理）、`focus` / `blur`。
- **主进程向渲染进程推送**：若子窗需要进度条等，可用 `webContents.send` + `ipcRenderer.on`（第 2 课笔记已写模式）。
