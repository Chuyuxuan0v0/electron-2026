// 导入 Electron 模块
const { app, BrowserWindow, ipcMain, Tray, Menu, MenuItem } = require('electron');
const path = require('path');

let mainWindow = null;
let tray = null;

// 创建浏览器窗口的函数
function createWindow() {
  // 创建一个新的浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true, // 允许在渲染进程中使用 Node.js
      contextIsolation: false // 为了简化学习，暂时关闭上下文隔离
    }
  });

  // 加载应用的 index.html 文件
  mainWindow.loadFile('index.html');

  // 打开开发者工具（开发阶段使用）
  // mainWindow.webContents.openDevTools();

  // 窗口关闭时隐藏而不是退出（配合系统托盘使用）
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault(); // 阻止默认关闭行为
      mainWindow.hide();
    }
  });

  return mainWindow;
}

// 创建应用菜单
function createAppMenu() {
  const template = [
    {
      label: '文件',
      submenu: [
        {
          label: '新建窗口',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            if (mainWindow) {
              mainWindow.show();
            } else {
              mainWindow = createWindow();
              setupIPC(mainWindow);
            }
          }
        },
        { type: 'separator' },
        {
          label: '重新加载',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            if (mainWindow) mainWindow.reload();
          }
        },
        {
          label: '开发者工具',
          accelerator: 'CmdOrCtrl+Shift+I',
          click: () => {
            if (mainWindow) mainWindow.webContents.toggleDevTools();
          }
        },
        { type: 'separator' },
        {
          label: '退出',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: '编辑',
      submenu: [
        { label: '撤销', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: '重做', accelerator: 'CmdOrCtrl+Y', role: 'redo' },
        { type: 'separator' },
        { label: '剪切', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: '复制', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: '粘贴', accelerator: 'CmdOrCtrl+V', role: 'paste' },
        { label: '全选', accelerator: 'CmdOrCtrl+A', role: 'selectall' }
      ]
    },
    {
      label: '视图',
      submenu: [
        { label: '实际大小', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
        { label: '放大', accelerator: 'CmdOrCtrl+Plus', role: 'zoomIn' },
        { label: '缩小', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' },
        { type: 'separator' },
        { label: '全屏', accelerator: 'F11', role: 'togglefullscreen' }
      ]
    },
    {
      label: '窗口',
      submenu: [
        { label: '最小化', accelerator: 'CmdOrCtrl+M', role: 'minimize' },
        { label: '关闭', accelerator: 'CmdOrCtrl+W', role: 'close' }
      ]
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '关于',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send('show-about');
            }
          }
        },
        {
          label: 'IPC 通信文档',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send('show-ipc-docs');
            }
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  console.log('✅ 应用菜单已创建');
}

// 创建系统托盘
function createTray() {
  const iconPath = path.join(__dirname, 'tray-icon.png');
  
  try {
    tray = new Tray(iconPath);
  } catch (error) {
    console.warn('⚠️ 无法加载托盘图标，系统托盘功能将被禁用:', error.message);
    return;
  }
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示窗口',
      click: () => {
        if (mainWindow) {
          if (mainWindow.isMinimized()) {
            mainWindow.restore();
          }
          mainWindow.show();
          mainWindow.focus();
        } else {
          mainWindow = createWindow();
          setupIPC(mainWindow);
        }
      }
    },
    {
      label: '隐藏窗口',
      click: () => {
        if (mainWindow) {
          mainWindow.hide();
        }
      }
    },
    { type: 'separator' },
    {
      label: '重新加载',
      click: () => {
        if (mainWindow) mainWindow.reload();
      }
    },
    {
      label: '开发者工具',
      click: () => {
        if (mainWindow) mainWindow.webContents.toggleDevTools();
      }
    },
    { type: 'separator' },
    {
      label: '退出应用',
      click: () => {
        app.quit();
      }
    }
  ]);
  
  tray.setToolTip('Electron IPC 通信演示');
  tray.setContextMenu(contextMenu);
  
  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    }
  });
  
  console.log('✅ 系统托盘已创建');
}

// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.whenReady().then(() => {
  mainWindow = createWindow();

  // 创建应用菜单
  createAppMenu();

  // 创建系统托盘
  createTray();

  // 设置 IPC 通信处理器
  setupIPC(mainWindow);

  // 在 macOS 上，当点击 dock 图标并且没有其他窗口打开时，重新创建一个窗口
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createWindow();
      setupIPC(mainWindow);
    }
  });
});

// 设置 IPC 通信
function setupIPC(window) {
  // 1. 处理从渲染进程发送的消息（异步）
  ipcMain.handle('get-system-info', async () => {
    return {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.versions.node,
      electronVersion: process.versions.electron,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
      cwd: process.cwd(),
      pid: process.pid
    };
  });

  // 2. 处理文件读取请求
  ipcMain.handle('read-file', async (event, filePath) => {
    const fs = require('fs').promises;
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return { success: true, content, filePath };
    } catch (error) {
      return { success: false, error: error.message, filePath };
    }
  });

  // 3. 处理目录列表请求
  ipcMain.handle('list-directory', async (event, dirPath) => {
    const fs = require('fs').promises;
    try {
      const items = await fs.readdir(dirPath, { withFileTypes: true });
      const result = items.map(item => ({
        name: item.name,
        isDirectory: item.isDirectory(),
        isFile: item.isFile(),
        path: path.join(dirPath, item.name)
      }));
      return { success: true, items: result, dirPath };
    } catch (error) {
      return { success: false, error: error.message, dirPath };
    }
  });

  // 4. 处理应用操作
  ipcMain.on('app-action', (event, action) => {
    switch (action) {
      case 'minimize':
        window.minimize();
        break;
      case 'maximize':
        if (window.isMaximized()) {
          window.unmaximize();
        } else {
          window.maximize();
        }
        break;
      case 'close':
        window.close();
        break;
      case 'reload':
        window.reload();
        break;
    }
  });

  // 5. 双向通信示例：主进程主动发送消息到渲染进程
  setInterval(() => {
    window.webContents.send('time-update', {
      timestamp: Date.now(),
      formatted: new Date().toLocaleTimeString('zh-CN')
    });
  }, 1000);

  console.log('✅ IPC 通信已设置完成');
}

// 在所有窗口关闭时退出应用（macOS 除外）
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});