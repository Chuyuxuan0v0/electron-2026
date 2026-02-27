// 导入 Electron 模块
const { app, BrowserWindow } = require('electron');
const path = require('path');

// 创建浏览器窗口的函数
function createWindow() {
  // 创建一个新的浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // 允许在渲染进程中使用 Node.js
      contextIsolation: false // 为了简化学习，暂时关闭上下文隔离
    }
  });

  // 加载应用的 index.html 文件
  mainWindow.loadFile('index.html');

  // 打开开发者工具（开发阶段使用）
  mainWindow.webContents.openDevTools();
}

// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.whenReady().then(() => {
  createWindow();

  // 在 macOS 上，当点击 dock 图标并且没有其他窗口打开时，重新创建一个窗口
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 在所有窗口关闭时退出应用（macOS 除外）
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});