<script setup>
import { ref, watch } from 'vue'

const versions = window.electronAPI?.versions ?? {}
const simulateUnsaved = ref(false)

watch(simulateUnsaved, async (v) => {
  await window.electronAPI?.setMainUnsaved?.(v)
})

const openSettings = async () => {
  await window.electronAPI?.openSettingsWindow?.()
}
</script>

<template>
  <div class="page">
    <header>
      <h1>窗口与生命周期</h1>
      <p class="sub">多窗口 · app 生命周期 · 关闭前确认</p>
    </header>

    <section class="card">
      <h2>环境版本</h2>
      <ul class="kv">
        <li><span>Electron</span><code>{{ versions.electron ?? '—' }}</code></li>
        <li><span>Chromium</span><code>{{ versions.chrome ?? '—' }}</code></li>
        <li><span>Node</span><code>{{ versions.node ?? '—' }}</code></li>
      </ul>
    </section>

    <section class="card">
      <h2>多窗口</h2>
      <p class="hint">
        点击下方按钮会在主进程中 <code>new BrowserWindow</code>，加载独立入口
        <code>settings.html</code>（electron-vite 多页入口）。子窗口使用
        <code>parent</code> + <code>modal</code>。
      </p>
      <button type="button" class="primary" @click="openSettings">打开「设置」子窗口</button>
    </section>

    <section class="card">
      <h2>关闭主窗口前确认</h2>
      <p class="hint">
        勾选「模拟未保存」后，主进程在 <code>close</code> 事件里
        <code>event.preventDefault()</code>，并弹出系统对话框；这是常见「未保存提示」写法。
      </p>
      <label class="check">
        <input v-model="simulateUnsaved" type="checkbox" />
        模拟未保存更改（关主窗口时会拦截）
      </label>
    </section>

    <section class="card muted-card">
      <h2>生命周期自测</h2>
      <ul class="list">
        <li><strong>macOS</strong>：关掉所有窗口后应用通常仍留在 Dock；点 Dock 图标应能再打开主窗口（<code>activate</code>）。</li>
        <li><strong>Windows / Linux</strong>：最后一个窗口关闭后进程会退出（<code>window-all-closed</code> → <code>app.quit()</code>）。</li>
      </ul>
    </section>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #0f172a;
  color: #e2e8f0;
  min-height: 100vh;
}
.page {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
}
header {
  text-align: center;
  margin-bottom: 1.75rem;
}
h1 {
  font-size: 1.85rem;
  font-weight: 700;
  background: linear-gradient(135deg, #f472b6, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.sub {
  margin-top: 0.35rem;
  color: #94a3b8;
  font-size: 0.95rem;
}
.card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 1.25rem 1.35rem;
  margin-bottom: 1rem;
}
.card h2 {
  font-size: 1rem;
  font-weight: 600;
  color: #38bdf8;
  margin-bottom: 0.65rem;
}
.hint {
  font-size: 0.88rem;
  line-height: 1.65;
  color: #94a3b8;
  margin-bottom: 0.9rem;
}
.kv {
  list-style: none;
  display: grid;
  gap: 0.45rem;
}
.kv li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.35rem 0;
  border-bottom: 1px solid #334155;
  font-size: 0.9rem;
}
.kv li:last-child {
  border-bottom: none;
}
.kv span {
  color: #94a3b8;
}
code {
  font-family: ui-monospace, 'SF Mono', Consolas, monospace;
  font-size: 0.82rem;
  color: #34d399;
  background: #0f172a;
  padding: 0.15rem 0.45rem;
  border-radius: 6px;
}
.primary {
  appearance: none;
  border: none;
  border-radius: 8px;
  padding: 0.55rem 1.1rem;
  font-weight: 600;
  font-size: 0.9rem;
  color: #fff;
  background: #6366f1;
  cursor: pointer;
}
.primary:hover {
  background: #4f46e5;
}
.check {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #cbd5e1;
  cursor: pointer;
}
.check input {
  width: 1rem;
  height: 1rem;
}
.muted-card {
  border-style: dashed;
}
.list {
  margin: 0;
  padding-left: 1.15rem;
  color: #94a3b8;
  font-size: 0.88rem;
  line-height: 1.7;
}
.list li {
  margin-bottom: 0.45rem;
}
.list strong {
  color: #cbd5e1;
}
</style>
