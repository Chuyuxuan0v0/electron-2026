import { contextBridge } from 'electron'

// contextBridge.exposeInMainWorld 是安全地向渲染进程暴露 API 的唯一正确方式
// 本课暂时只暴露一个版本号，IPC 通信在第 2 课展开
contextBridge.exposeInMainWorld('electronAPI', {
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron
  }
})
