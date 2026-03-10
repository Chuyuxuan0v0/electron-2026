# 第 5 课：打包与分发

## 学习目标

- 使用 **electron-builder** 将应用打包成可安装包（dmg/exe/AppImage 等）
- 理解打包配置：入口、资源、asar、图标、安装器选项
- 了解**自动更新**（electron-updater）的基本思路与配置要点
- 能在本机打出可在当前系统安装并运行的安装包

## 学习内容大纲

1. **electron-builder 入门**
   - 安装与 `package.json` 中的 `build` 配置
   - `appId`、`productName`、`directories`、`files`
   - 各平台 target：dmg、exe、AppImage、zip 等

2. **打包流程**
   - 先 build 前端（Vite 产出）
   - 再执行 electron-builder（会打包 Electron 运行时 + 你的代码）
   - 输出目录（如 `dist/`）中的安装包与未打包资源

3. **asar 与资源**
   - 应用代码默认打进 asar 包；`extraResources` 放不进 asar 的二进制等
   - 图标：macOS icns、Windows ico、Linux 多尺寸 png

4. **自动更新（了解）**
   - electron-updater 与 publish 配置（如 GitHub Releases、自建服务器）
   - 主进程里检查更新、下载、安装/重启的流程概念

## 成果量化

| 成果项 | 验收标准 |
|--------|----------|
| 成功打包 | 能执行打包命令（如 `npm run build` 或 `npm run dist`），在 dist 目录得到当前系统的安装包（如 .dmg 或 .exe） |
| 安装运行 | 安装包可安装，安装后能正常启动应用 |
| 配置能讲清 | 能说明 package.json 里 build 中至少 3 项配置的含义（如 appId、files、target） |

## 学习笔记

学完本课后，笔记将写在同目录下的 `notes.md` 中。
