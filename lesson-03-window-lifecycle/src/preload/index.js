import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron
  },
  openSettingsWindow: () => ipcRenderer.invoke('open-settings-window'),
  setMainUnsaved: (flag) => ipcRenderer.invoke('set-main-unsaved', flag)
})
