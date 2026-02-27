# Tray 和 Menu 功能实现说明

## 已实现的功能

### 1. 应用菜单 (Application Menu)

在 `createAppMenu()` 函数中实现了完整的应用菜单，包含以下菜单项：

#### 文件菜单
- 新建窗口 (`CmdOrCtrl+N`)
- 重新加载 (`CmdOrCtrl+R`)
- 开发者工具 (`CmdOrCtrl+Shift+I`)
- 退出 (`CmdOrCtrl+Q`)

#### 编辑菜单
- 撤销 (`CmdOrCtrl+Z`)
- 重做 (`CmdOrCtrl+Y`)
- 剪切/复制/粘贴/全选

#### 视图菜单
- 实际大小 (`CmdOrCtrl+0`)
- 放大 (`CmdOrCtrl+Plus`)
- 缩小 (`CmdOrCtrl+-`)
- 全屏 (`F11`)

#### 窗口菜单
- 最小化 (`CmdOrCtrl+M`)
- 关闭 (`CmdOrCtrl+W`)

#### 帮助菜单
- 关于 (通过 IPC 发送消息到渲染进程)
- IPC 通信文档 (通过 IPC 发送消息到渲染进程)

### 2. 系统托盘 (System Tray)

在 `createTray()` 函数中实现了系统托盘功能：

#### 托盘右键菜单
- 显示窗口
- 隐藏窗口
- 重新加载
- 开发者工具
- 退出应用

#### 托盘点击事件
- 单击托盘图标切换窗口显示/隐藏状态

#### 窗口关闭行为
- 点击窗口关闭按钮时，窗口会隐藏而不是退出应用
- 只有通过托盘菜单的"退出应用"或 `CmdOrCtrl+Q` 才会真正退出

### 3. 窗口管理优化

- 全局 `mainWindow` 变量，方便在多个函数中访问
- 窗口关闭时隐藏而不是退出（配合系统托盘使用）
- `app.isQuitting` 标志区分正常退出和隐藏窗口

## 代码结构

```javascript
// 导入模块
const { app, BrowserWindow, ipcMain, Tray, Menu, MenuItem } = require('electron');

// 全局变量
let mainWindow = null;
let tray = null;

// 创建应用菜单
function createAppMenu() { ... }

// 创建系统托盘
function createTray() { ... }

// 创建窗口
function createWindow() { ... }

// 应用初始化
app.whenReady().then(() => {
  mainWindow = createWindow();
  createAppMenu();
  createTray();
  setupIPC(mainWindow);
});
```

## 使用说明

### 准备托盘图标

1. 创建一个 32x32 像素的 PNG 图标
2. 命名为 `tray-icon.png`
3. 放到项目根目录（与 main.js 同级）

### 如果没有图标

代码已添加错误处理，如果没有图标文件，系统托盘功能会被禁用，但应用仍可正常运行。

### 测试功能

1. 运行 `npm start` 启动应用
2. 查看顶部菜单栏，会显示完整的应用菜单
3. 如果有托盘图标，点击托盘图标测试显示/隐藏功能
4. 右键托盘图标查看上下文菜单
5. 点击窗口关闭按钮，窗口会隐藏而不是退出

## 关键 API 说明

### Menu API
- `Menu.buildFromTemplate(template)` - 从模板创建菜单
- `Menu.setApplicationMenu(menu)` - 设置应用菜单

### Tray API
- `new Tray(image)` - 创建托盘图标
- `tray.setToolTip(text)` - 设置托盘提示文本
- `tray.setContextMenu(menu)` - 设置右键菜单
- `tray.on('click', callback)` - 监听点击事件

### MenuItem 属性
- `label` - 菜单项文本
- `accelerator` - 快捷键
- `click` - 点击回调
- `type` - 类型（'separator' 分隔线）
- `role` - 预定义角色（'undo', 'cut', 'copy' 等）
