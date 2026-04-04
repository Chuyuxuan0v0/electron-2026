import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'

const isDev = !app.isPackaged

/** @type {BrowserWindow | null} */
let mainWindow = null
/** @type {BrowserWindow | null} */
let settingsWindow = null

/** 主窗口「未保存」标记：用于 close 事件里演示拦截关闭 */
let mainHasUnsavedChanges = false

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 720,
    title: '第 3 课：窗口与生命周期',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  // 窗口事件示例
  mainWindow.on('focus', () => {
    console.log('[主窗口] focus')
  })
  mainWindow.on('blur', () => {
    console.log('[主窗口] blur')
  })

  // 关闭前确认：仅在「有未保存更改」时拦截
  mainWindow.on('close', async (event) => {
    if (!mainHasUnsavedChanges) return
    event.preventDefault()
    const { response } = await dialog.showMessageBox(mainWindow, {
      type: 'question',
      buttons: ['仍要关闭', '取消'],
      defaultId: 1,
      cancelId: 1,
      title: '未保存的更改',
      message: '当前标记为「有未保存更改」。确定要关闭主窗口吗？'
    })
    if (response === 0) {
      mainHasUnsavedChanges = false
      mainWindow.destroy()
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  if (isDev) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function createSettingsWindow() {
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.focus()
    return
  }

  if (!mainWindow) return

  settingsWindow = new BrowserWindow({
    width: 440,
    height: 340,
    title: '设置',
    parent: mainWindow,
    modal: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  settingsWindow.on('closed', () => {
    settingsWindow = null
  })

  if (isDev) {
    const base = process.env['ELECTRON_RENDERER_URL']
    settingsWindow.loadURL(`${base}/settings.html`)
  } else {
    settingsWindow.loadFile(join(__dirname, '../renderer/settings.html'))
  }
}

app.whenReady().then(() => {
  ipcMain.handle('open-settings-window', () => {
    createSettingsWindow()
    return true
  })

  ipcMain.handle('set-main-unsaved', (_, flag) => {
    mainHasUnsavedChanges = Boolean(flag)
    return mainHasUnsavedChanges
  })

  createMainWindow()

  // macOS：点击 Dock 图标且当前无窗口时，重新创建主窗口
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
})

// Windows / Linux：所有窗口关闭后退出进程（macOS 通常保持应用驻留 Dock）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
