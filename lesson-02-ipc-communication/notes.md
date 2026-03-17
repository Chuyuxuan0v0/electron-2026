# 第 2 课学习笔记：主进程与渲染进程通信（IPC）

## 1. 核心概念与工作流（双向通信）

在安全的 Electron 架构中，渲染进程（Vue）不能直接调用 Node.js API（如 `fs` 模块）。必须通过 **IPC（Inter-Process Communication）** 让主进程代为执行。

**标准数据流向（RPC 模式）：**
1. **渲染进程**（Vue）：调用 `window.electronAPI.xxx()` 并等待结果 (`await`)。
2. **Preload 脚本**：调用 `ipcRenderer.invoke('channel-name')` 将请求跨进程发给主进程。
3. **主进程**：通过 `ipcMain.handle('channel-name', callback)` 监听请求，执行 Node.js 原生操作，最后 `return` 结果。
4. **回传**：Electron 自动将主进程的 `return` 值包装成 Promise 返回给渲染进程。

---

## 2. 深度问答精华（个人理解与解惑）

**Q1：这些操作是不是异步的，异步会触发卡顿或等待吗？**
- **是的，全部是异步的**，并且返回的都是 Promise。
- 跨进程通信（序列化 -> 传输 -> 反序列化）本身有开销，为了**不阻塞 Vue 渲染线程（避免 UI 卡死）**，Electron 设计为异步请求。

**Q2：解决异步操作，`async / await` 应该加在哪里？**
- **渲染进程（Vue 层）**：必须加 `await`（如 `await window.electronAPI.getTime()`）来等待结果。
- **Preload 层**：不需要加，直接 `return ipcRenderer.invoke(...)` 把 Promise 交出去即可。
- **主进程层**：看业务需求。如果是同步的业务逻辑（如返回当前时间）不需要 `async`；如果是异步的 Node.js 逻辑（如 `fs.readFile`），则需要 `async / await`。

**Q3：`invoke` 是固定写法吗？为什么不用 `send`？**
- **`invoke` / `handle`** 是现在的**官方强烈推荐写法**，专门用于“前端发起请求，主进程返回结果”的双向通信。
- 以前的老版本需要前端用 `send` 发送，再写一个 `.on` 监听主进程的回复，极其容易造成事件内存泄漏（回调地狱）。`invoke` 完美解决了这个问题。

**Q4：这个架构感觉跟前后端接口请求很像？**
- **完全正确。可以把它类比为前后端分离架构的 RPC 调用。**
  - **Vue** = 前端发 axios 请求
  - **Preload** = 封装好的 api 请求文件（如 `api.js`）
  - **主进程** = Node.js 后端服务器，提供路由服务

---

## 3. 补充知识点：主进程主动发送消息到渲染进程（单向推送）

前面的 `invoke/handle` 是**“渲染进程主动问，主进程答”**。
但在很多场景下，需要**“主进程主动推送消息给渲染进程”**（比如：文件下载进度更新、底层硬件设备拔插通知、菜单点击事件）。

**实现方式（Pub/Sub 模式）：**

**1. 主进程主动发（Publisher）**
```javascript
// main.js
// 必须指定往哪个窗口（webContents）发
mainWindow.webContents.send('download-progress', { percent: 50 })
```

**2. Preload 提供监听的桥梁**
```javascript
// preload.js
contextBridge.exposeInMainWorld('electronAPI', {
  // 接收一个 callback，当主进程发消息时触发
  onDownloadProgress: (callback) => {
    // 监听主进程发来的事件
    ipcRenderer.on('download-progress', (event, data) => callback(data))
  }
})
```

**3. 渲染进程监听（Subscriber）**
```javascript
// App.vue (渲染进程)
window.electronAPI.onDownloadProgress((data) => {
  console.log('当前下载进度：', data.percent) // 50
})
```

**⚠️ 面试防坑点：事件清理**
如果是通过 `ipcRenderer.on` 监听的主进程事件，在 Vue 组件销毁时（`onUnmounted`）**最好进行事件解绑（`ipcRenderer.removeListener`）**，否则如果组件被多次销毁创建，会导致事件被重复触发，造成内存泄漏。

---

## 4. 面试/实战总结
- 永远不要在渲染进程开启 `nodeIntegration`。
- 所有跨进程通信，**必须且只能**通过 `contextBridge` + `preload.js` 暴露白名单。
- 请求/响应模型用 `invoke` + `handle`。
- 服务端推送模型用 `webContents.send` + `ipcRenderer.on`。