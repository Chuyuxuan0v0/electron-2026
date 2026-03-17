<script setup>
// window.electronAPI 由 preload/index.js 通过 contextBridge 注入
// 这是渲染进程与主进程"安全桥梁"的体现
const versions = window.electronAPI?.versions ?? {}
</script>

<template>
  <div class="container">
    <h1>Hello Electron 👋</h1>
    <p class="subtitle">Vite + Vue3 + Electron 项目已成功运行！</p>

    <div class="card">
      <h2>运行环境版本</h2>
      <ul>
        <li><span class="label">Electron</span> <span class="value">{{ versions.electron ?? '—' }}</span></li>
        <li><span class="label">Chromium</span> <span class="value">{{ versions.chrome ?? '—' }}</span></li>
        <li><span class="label">Node.js</span>  <span class="value">{{ versions.node ?? '—' }}</span></li>
      </ul>
    </div>

    <div class="card info">
      <h2>双进程说明</h2>
      <p>
        <strong>主进程</strong>：<code>src/main/index.js</code><br/>
        负责创建窗口、管理应用生命周期，拥有完整 Node.js 能力。
      </p>
      <p>
        <strong>渲染进程</strong>：<code>src/renderer/src/App.vue</code>（你现在看到的页面）<br/>
        本质是 Chromium 浏览器页面，运行 Vue3 代码。
      </p>
      <p>
        <strong>预加载脚本</strong>：<code>src/preload/index.js</code><br/>
        通过 <code>contextBridge</code> 安全地将主进程数据桥接给渲染进程。
      </p>
    </div>
  </div>
</template>
