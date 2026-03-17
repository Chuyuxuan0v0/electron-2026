import { app, BrowserWindow } from 'electron'
import { join } from 'path'

// is(dev) 来自 electron-vite 注入的环境变量
const isDev = !app.isPackaged

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 650,
    title: 'Electron 入门 Demo - Vite + Vue3',
    webPreferences: {
      // 预加载脚本路径：electron-vite 构建后输出到 out/preload/index.js
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,   // 隔离渲染进程与主进程上下文（安全最佳实践）
      nodeIntegration: false    // 渲染进程不直接使用 Node.js（安全最佳实践）
    }
  })

  if (isDev) {
    // 开发环境：加载 Vite Dev Server 的本地 URL
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
    win.webContents.openDevTools()
  } else {
    // 生产环境：加载打包后的 HTML 文件
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// Electron 生命周期：app ready 后才能创建窗口
app.whenReady().then(() => {
  createWindow()

  // macOS 特有行为：点击 Dock 图标时如果没有窗口则重新创建
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// 所有窗口关闭后退出应用（macOS 除外，macOS 习惯上保留在 Dock）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
