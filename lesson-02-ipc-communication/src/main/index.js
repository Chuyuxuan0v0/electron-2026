import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import fs from 'fs/promises'

const isDev = !app.isPackaged

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 650,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  if (isDev) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
    win.webContents.openDevTools()
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  // --- IPC 主进程处理注册 ---
  // 1. 简单的返回数据
  ipcMain.handle('get-current-time', () => {
    console.log('主进程：收到 get-current-time 请求')
    return new Date().toLocaleString()
  })

  // 2. 调用 Node.js 底层 API（读取文件）
  ipcMain.handle('read-package-json', async () => {
    try {
      console.log('主进程：收到 read-package-json 请求')
      // 读取项目根目录下的 package.json
      const pkgPath = join(app.getAppPath(), 'package.json')
      const data = await fs.readFile(pkgPath, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      console.error('读取文件失败:', error)
      return { error: '文件读取失败' }
    }
  })

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
