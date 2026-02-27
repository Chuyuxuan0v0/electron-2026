// 导入 Electron 模块
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// 创建浏览器窗口的函数
function createWindow() {
  // 创建一个新的浏览器窗口
  const mainWindow = new BrowserWindow({
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
  mainWindow.webContents.openDevTools();

  return mainWindow;
}

// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.whenReady().then(() => {
  const mainWindow = createWindow();

  // 设置 IPC 通信处理器
  setupIPC(mainWindow);

  // 在 macOS 上，当点击 dock 图标并且没有其他窗口打开时，重新创建一个窗口
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      const newWindow = createWindow();
      setupIPC(newWindow);
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