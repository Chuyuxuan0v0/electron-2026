<script setup>
const note =
  '本窗口由主进程创建：parent + modal，属于「子窗口」演示。关闭本窗口不会影响主窗口。'

function closeSettingsWindow() {
  // Electron 子窗口内调用 window.close() 会关闭当前 BrowserWindow
  window.close()
}
</script>

<template>
  <div class="wrap">
    <header class="head">
      <h1>设置</h1>
      <button type="button" class="btn-close" @click="closeSettingsWindow">关闭</button>
    </header>
    <p class="muted">lesson-03-window-lifecycle</p>
    <p class="body">{{ note }}</p>
  </div>
</template>

<style scoped>
.wrap {
  padding: 1.25rem 1.5rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #e2e8f0;
  background: #0f172a;
  min-height: 100vh;
}
.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.35rem;
}
.btn-close {
  flex-shrink: 0;
  appearance: none;
  border: 1px solid #475569;
  background: #334155;
  color: #e2e8f0;
  padding: 0.35rem 0.85rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}
.btn-close:hover {
  background: #475569;
  border-color: #64748b;
}
h1 {
  font-size: 1.25rem;
  margin: 0;
  color: #38bdf8;
}
.muted {
  margin: 0 0 1rem;
  font-size: 0.85rem;
  color: #64748b;
}
.body {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.6;
  color: #94a3b8;
}
</style>
