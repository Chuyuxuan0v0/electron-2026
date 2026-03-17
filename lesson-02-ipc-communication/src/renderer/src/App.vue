<script setup>
import { ref } from 'vue'

const versions = window.electronAPI?.versions ?? {}

// 响应式状态存储 IPC 返回结果
const serverTime = ref('')
const packageData = ref(null)
const isLoading = ref(false)

// 触发 IPC 调用获取时间
const fetchTime = async () => {
  try {
    const time = await window.electronAPI.getCurrentTime()
    serverTime.value = time
  } catch (error) {
    console.error('获取时间失败:', error)
  }
}

// 触发 IPC 调用读取本地文件 (通过主进程的 Node 能力)
const readPackage = async () => {
  isLoading.value = true
  try {
    const data = await window.electronAPI.readPackageJson()
    packageData.value = data
  } catch (error) {
    console.error('读取文件失败:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="container">
    <h1>IPC 通信实战 📡</h1>
    <p class="subtitle">主进程与渲染进程的双向数据交互</p>

    <div class="card">
      <h2>1. 简单的双向通信</h2>
      <p class="desc">渲染进程向主进程发送请求，主进程返回当前系统时间。</p>
      <div class="action-row">
        <button @click="fetchTime">获取主进程时间</button>
        <span v-if="serverTime" class="result result-time">{{ serverTime }}</span>
      </div>
    </div>

    <div class="card">
      <h2>2. 调用 Node.js 底层能力</h2>
      <p class="desc">渲染进程请求主进程使用 <code>fs</code> 模块读取 <code>package.json</code>。</p>
      <div class="action-row">
        <button @click="readPackage" :disabled="isLoading">
          {{ isLoading ? '读取中...' : '读取本地 package.json' }}
        </button>
      </div>
      
      <div v-if="packageData" class="code-preview">
        <pre><code>{{ JSON.stringify(packageData, null, 2) }}</code></pre>
      </div>
    </div>
  </div>
</template>

<style>
/* 复用并增加一些组件样式 */
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, sans-serif; background: #0f172a; color: #e2e8f0; min-height: 100vh; padding: 2rem; display: flex; justify-content: center; }
.container { max-width: 700px; width: 100%; }
h1 { font-size: 2.2rem; background: linear-gradient(135deg, #34d399, #10b981); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.5rem; text-align: center; }
.subtitle { text-align: center; color: #94a3b8; margin-bottom: 2rem; }
.card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; }
.card h2 { font-size: 1.1rem; color: #38bdf8; margin-bottom: 0.5rem; }
.desc { font-size: 0.9rem; color: #94a3b8; margin-bottom: 1rem; }
.action-row { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
button { background: #3b82f6; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 6px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
button:hover { background: #2563eb; }
button:disabled { background: #475569; cursor: not-allowed; }
.result { font-weight: 600; padding: 0.4rem 0.8rem; background: #0f172a; border-radius: 6px; }
.result-time { color: #f472b6; }
.code-preview { background: #0f172a; border-radius: 8px; padding: 1rem; overflow-x: auto; font-size: 0.85rem; max-height: 250px; overflow-y: auto;}
.code-preview pre { margin: 0; }
code { color: #a78bfa; font-family: 'SF Mono', Consolas, monospace; }
</style>
