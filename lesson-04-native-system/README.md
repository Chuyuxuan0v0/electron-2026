# 第 4 课：原生能力与系统集成

## 学习目标

- 会使用**应用菜单**（Menu）：自定义菜单项、快捷键、与 IPC 联动
- 会使用**系统托盘**（Tray）：托盘图标、右键菜单、点击行为（显示/隐藏窗口）
- 会使用**原生对话框**：打开文件、保存文件、消息提示（dialog）
- 会使用**通知**（Notification）：系统级通知
- 能搭出一个「带菜单 + 托盘 + 对话框/通知」的完整应用骨架

## 学习内容大纲

1. **应用菜单 Menu**
   - `Menu.buildFromTemplate(template)`：菜单项、子菜单、role、accelerator
   - `Menu.setApplicationMenu(menu)`：应用级菜单
   - 菜单项 `click` 里调用主进程逻辑或通过 IPC 通知渲染进程

2. **系统托盘 Tray**
   - `new Tray(iconPath)`，配合 `setContextMenu`
   - 点击托盘图标：显示/隐藏主窗口
   - 关闭窗口时可选「最小化到托盘」而非退出

3. **对话框 dialog**
   - `dialog.showOpenDialog`、`dialog.showSaveDialog`、`dialog.showMessageBox`
   - 在主进程调用，结果通过 IPC 回传渲染进程

4. **通知 Notification**
   - `new Notification({ title, body })`，`notification.show()`
   - 注意系统权限（用户可能关闭通知）

## 成果量化

| 成果项 | 验收标准 |
|--------|----------|
| 自定义菜单 | 至少有一个自定义菜单（如「文件」或「帮助」），其中一项能触发与渲染进程的联动或弹窗 |
| 托盘 | 有托盘图标；点击可显示/隐藏主窗口；有关闭时最小化到托盘的选项（可选） |
| 对话框/通知 | 至少用过一次 dialog（如选择文件）或 Notification（如「操作完成」提示） |

## 学习笔记

学完本课后，笔记将写在同目录下的 `notes.md` 中。
