# 托盘图标说明

由于无法直接创建 PNG 图标文件，请按以下步骤准备托盘图标：

## 方法 1：使用在线工具
1. 访问 https://www.favicon-generator.org/
2. 上传一个简单的图标（16x16 或 32x32 像素）
3. 下载并重命名为 `tray-icon.png`
4. 放到项目根目录（与 main.js 同级）

## 方法 2：使用系统图标
macOS 可以使用系统自带图标：
```bash
cp /System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/com.apple.traffic-lights.png tray-icon.png
```

## 方法 3：使用 ImageMagick 创建简单图标
```bash
convert -size 32x32 xc:blue -fill white -pointsize 20 -gravity center -annotate +0+0 "E" tray-icon.png
```

## 临时方案
如果暂时没有图标，可以注释掉 main.js 中的 `createTray()` 调用。
