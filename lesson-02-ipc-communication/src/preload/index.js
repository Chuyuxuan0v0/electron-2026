import { contextBridge, ipcRenderer } from 'electron'

// 安全地暴露需要的方法给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron
  },
  
  // 向主进程发请求并等待返回结果（双向通信）
  getCurrentTime: () => ipcRenderer.invoke('get-current-time'),
  
  // 向主进程发请求读取文件
  readPackageJson: () => ipcRenderer.invoke('read-package-json')
})
