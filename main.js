/* 主进程 */
const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron');
const fs = require('fs');   // 文件系统
const destinationPath = 'E:/DevelopFiles/get_files'; // 目标文件路径
const { console } = require('inspector');
const path = require('path');   // 系统路径

let tray = null;  //系统托盘
let mainWindow = null;      // 首页窗口
let deliverBallWindow = null;      // 传输悬浮球窗口
let listWindow = null;      // 待办表窗口

// 创建首页窗口
function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 725,
        height: 550,
        resizable: false,
        frame: false,
        transparent: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true, // 确保启用了contextIsolation
            enableRemoteModule: false, // 禁用remote模块，出于安全考虑
            nodeIntegration: false // 禁用Node集成，出于安全考虑
        },
    });
    mainWindow.loadFile(path.join(__dirname, 'renderer/mainWindow.html'));
    // 忽略鼠标事件
    mainWindow.setIgnoreMouseEvents(false);
    //debug
    //mainWindow.webContents.openDevTools() 
}

// 快传悬浮球
function createDeliverBallWindow() {
    // only
    if (deliverBallWindow) return;
    deliverBallWindow = new BrowserWindow({
        width: 80,
        height: 80,
        resizable: true,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,  //使用Node.js
        },
    });
    // 加载
    deliverBallWindow.loadFile(path.join(__dirname, 'renderer/deliver_ball.html'));
    // 调试
    //deliverBallWindow.webContents.openDevTools();
    // 默认忽略鼠标事件
    deliverBallWindow.setIgnoreMouseEvents(false);
    // 关闭
    deliverBallWindow.on('closed', () => {
        deliverBallWindow = null;
    });
}

// 待办表
function createlistWindow() {
    // only
    if (listWindow) return;

    listWindow = new BrowserWindow({
        width: 200,
        height: 300,
        resizable: true,
        frame: true,
        transparent: false,
        alwaysOnTop: true,
        // contextIsolation: true, // 启用上下文隔离
        // nodeIntegration: false, // 禁用Node.js集成
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
        },
    });

    listWindow.loadFile(path.join(__dirname, 'renderer/list.html'));

    listWindow.on('closed', () => {
        listWindow = null;
    });
}


//  运行
app.on('ready', () => {
    //console.log('App is ready to start');
    createMainWindow();
    //console.log('destinationPath');
    // 创建系统托盘图标
    tray = new Tray(path.join(__dirname, 'assets/icon.png'));
    const contextMenu = Menu.buildFromTemplate([
        { label: '退出', click: () => app.quit() },
    ]);
    tray.setToolTip('悬浮球');
    tray.setContextMenu(contextMenu);

    //异步接听，窗口创建
    ipcMain.on('open_deliver_ball', () => {
        createDeliverBallWindow();
    });
    ipcMain.on('open_list', () => {
        createlistWindow();
    });

    // 主屏幕移动
    ipcMain.on('move-main-window', (event, { x, y }) => {
        if (mainWindow) {
            mainWindow.setPosition(x, y);
        }

    })
    // 监听悬浮球移动
    ipcMain.on('move-ball-window', (event, { x, y }) => {
        if (deliverBallWindow) {
            deliverBallWindow.setPosition(x, y);
        }
    });

    // 监听鼠标事件，窗口是否忽略鼠标（平时不忽略，拖拽时不忽略，松开时忽略）
    ipcMain.on('set-ignore-mouse-events', (event, ignore) => {
        if (deliverBallWindow) {
            deliverBallWindow.setIgnoreMouseEvents(ignore, { forward: true });
            deliverBallWindow.setSize(80, 80);//每次拖动后修正窗口大小，否侧窗口无限增大
        }
        if (mainWindow) {
            mainWindow.setIgnoreMouseEvents(ignore, { forward: true });
        }
    });

    // 监听文件传输信号
    ipcMain.on('file-drag', (event, filePath) => {
        console.info(destinationPath);
        fs.copyFile(filePath, destinationPath, (err) => {
            if (err) {
                console.error('Failed to copy file:', err);
            } else {
                console.log('File copied to: ', destinationPath);
            }
        });
    });
    // 关闭应用
    ipcMain.on('close_app', () => {
        mainWindow.close();
    });
    // 最小化
    ipcMain.on('minimize_app', () => {
        mainWindow.minimize();
    });
});

// 退出
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});


