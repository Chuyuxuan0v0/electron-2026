# 第 3 课：窗口与生命周期

## 学习目标

- 掌握 **BrowserWindow** 的常用配置（尺寸、标题、预加载、安全选项）
- 理解**多窗口**的创建、引用与通信（主窗口 + 子窗口/设置窗口）
- 理解 Electron 应用的**生命周期**：ready、window-all-closed、activate（macOS  dock）
- 能处理窗口事件：关闭、最小化、聚焦等

## 学习内容大纲

1. **BrowserWindow 基础**
   - `new BrowserWindow(options)`：width、height、title、icon
   - `webPreferences`：preload、contextIsolation、nodeIntegration、sandbox
   - `loadURL` / `loadFile`：加载本地或远程页面

2. **多窗口**
   - 主窗口与子窗口（如设置页、关于页）
   - 窗口引用管理（存到变量或 Map），避免被 GC 回收
   - 父子关系：`parent`、`modal`，或独立窗口

3. **应用生命周期**
   - `app.whenReady()` 后再创建窗口
   - `app.on('window-all-closed')`：所有窗口关闭时（Windows/Linux 可退出 app）
   - `app.on('activate')`：macOS 点击 dock 图标时重新打开窗口

4. **窗口事件**
   - `close`、`closed`、`focus`、`blur`
   - 关闭前确认（如未保存提示）：`close` 事件里 `event.preventDefault()` + 对话框

## 成果量化

| 成果项 | 验收标准 |
|--------|----------|
| 多窗口 Demo | 主窗口有一个按钮，点击后打开第二个窗口（如设置页）；第二个窗口可独立关闭 |
| 生命周期正确 | 关闭所有窗口后，应用行为符合预期（如 macOS 不退出、Windows 退出）；从 dock 再次打开时能恢复窗口 |
| 配置会说明 | 能解释当前项目里 BrowserWindow 的几项关键配置（preload、contextIsolation 等） |

## 学习笔记

学完本课后，笔记将写在同目录下的 `notes.md` 中。
