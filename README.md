# NodeHub - 简洁的代理服务器导航

NodeHub 是一个优雅的单页面应用，采用现代化设计风格，提供实时更新的免费代理服务器列表。项目使用 Cloudflare Workers 部署，无需服务器，一键部署即可使用。

## 特性

- 🎨 PornHub 风格的现代设计
- 📱 完美适配各种设备
- 🚀 轻量级单页面应用
- ⚡️ Cloudflare Workers 部署
- 🔄 实时代理服务器列表
- 🕒 自动定时更新数据
- 🌍 全球节点覆盖

## 代理服务器信息

- IP 地址和端口
- 协议类型（HTTP/HTTPS/SOCKS）
- 所在国家/地区
- 匿名度级别
- 响应速度
- 在线时间
- 最后检测时间

## 快速部署

1. 登录到 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 `Workers & Pages`
3. 点击 `Create Worker` 创建新的 Worker
4. 将 `worker.js` 中的代码复制到编辑器中
5. 点击 `Save and Deploy` 保存并部署
6. 访问分配的 `.workers.dev` 域名即可使用

## 项目依赖

本项目是完全独立的单文件应用，不依赖任何外部库和框架，仅需要：

- Cloudflare Workers 环境
- 支持现代 CSS 特性的浏览器

## 致谢

- 代理数据来源：[free-proxy.cz](http://free-proxy.cz/)

## 免责声明

本项目仅供学习交流使用，请勿用于非法用途。使用本项目导航到的任何资源时，请遵守当地法律法规。

## 许可证

MIT License