# 第 6 课：安全与最佳实践

## 学习目标

- 理解 Electron 的**安全清单**（安全建议）：上下文隔离、禁用 nodeIntegration、不加载远程不可信内容等
- 会配置 **CSP（Content Security Policy）** 降低 XSS 等风险
- 理解 **preload 只暴露最小 API**、主进程校验所有来自渲染进程的输入
- 能对一个小 Demo 做安全加固并说明每项措施的作用

## 学习内容大纲

1. **Electron 安全清单（官方文档）**
   - 只加载安全内容：生产环境不加载任意远程 URL，或严格白名单
   - 不要在渲染进程启用 nodeIntegration
   - 启用 contextIsolation，使用 preload + contextBridge 暴露有限 API
   - 主进程不执行来自渲染进程的未校验数据（如 path、shell 命令）

2. **CSP**
   - 通过 HTTP 头或 meta 标签设置 CSP，限制脚本来源、禁止 inline 等
   - 在 Electron 中如何为渲染进程设置 CSP（如 webPreferences 或返回的 HTML）

3. **其他实践**
   - 敏感操作只在主进程做；渲染进程只发「意图」，参数由主进程校验
   - 使用 `protocol` 自定义协议时避免暴露本地文件系统
   - 依赖与版本：及时更新 Electron 与依赖，关注安全公告

## 成果量化

| 成果项 | 验收标准 |
|--------|----------|
| 安全配置落地 | 项目中 BrowserWindow 符合：contextIsolation 开启、nodeIntegration 关闭、使用 preload 暴露 API |
| CSP 已配置 | 为渲染进程配置了至少一条 CSP 规则（如 default-src 'self'）并能说明作用 |
| 能讲安全 | 能简要说明：为什么不用 nodeIntegration、为什么用 preload、主进程为什么要校验参数 |

## 学习笔记

学完本课后，笔记将写在同目录下的 `notes.md` 中。
