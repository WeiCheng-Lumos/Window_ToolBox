# 🧑‍💻简介
这是一款基于Electron开发的桌面软件。
| Electron      | Node | npm |electron-forge|
| ----------- | ----------- | ----------- |----------- |
| 33.3.1    | 22.13.0       |10.9.2|7.6.0|

# ✨设计初衷
我们一直以来都想开发一款属于自己的软件，无论是对“学以致用”的追求，还是实践自己“积微成著”的想法，亦或是想通过软件实现自己的“小目标”。2024.12.13，我们第一次构想了这款软件，帮助用户便捷的完成工作学习需要，包括翻译小工具，快捷传输悬浮球，待办事项表等等。希望它能够帮助节省时间，提高工作效率。

# 📝功能
- 快传悬浮球：P-P端的不安全的文件传输，快速传输文件
- 待办清单：记录待办，提醒事项，提醒时间
- 翻译小工具：翻译小工具，翻译论文

__下面请开始我们的工作吧！__
# 一.基础配置
本环节需按照[electron官网](https://www.electronjs.org/)中的Getting Started内容进行配置
## 1. 环境配置
安装node.js与npm：[Node.js官网](https://nodejs.org/)  
```
#检查是否安装成功
node -v
npm -v
```
## 2.项目创建
```
#创建项目文件夹
mkdir windowFloat
#进入项目文件夹
cd windowFloat
#初始化项目
npm init -y
#安装electron(安装缓慢，可使用国内镜像下载)
#npm config set registry https://registry.npmmirror.com
npm install electron --save-dev
```
安装成功后应有node_modules文件夹(内包含存储依赖包,配置项,版本管理,独立性包),package-lock.json文件更新
国内镜像可能版本略老,本项目使用"electron:33.3.1"可在package-lock.json中查看
由于node_modules文件过大,不会提交到git仓库
```
#在.gitignore文件中添加
node_modules/
#上传git
git add .gitignore
git commit -m "Add .gitignore to ignore node_modules"
```

# 二.项目实现
## 1.项目结构
```
windowFloat
├─.gitignore
├── main.js                // 主进程代码
├── preload.js             // 预加载脚本
├── package.json           // 项目配置
├── package-lock.json      // 项目依赖
├── renderer/              // 渲染进程代码
│   ├── mainWindow.html    // 首页窗口界面
│   ├── mainWindow.css     // 首页窗口样式
│   ├── mainWindow.js      // 首页窗口逻辑
│   ├── deliver_ball.html  // 快传悬浮球界面
│   ├── deliver_ball.js    // 快传悬浮球逻辑
│   ├── deliver_ball.css   // 快传悬浮球样式
│   ├── list.html          // 待办事项界面
│   ├── list.js            // 待办事项逻辑
│   └── list.css           // 待办事项样式
├── assets/                // 静态资源(图标)
├── demo/                  // 项目情况(快照,日志)  
```
## 2.代码实现
...

在命令行使用命令启动程序
```
npm start
```

# 三.版本管理
v1.0  主页,快传悬浮球



