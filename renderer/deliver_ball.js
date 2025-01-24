/* 快传悬浮球 */
// renderer/deliver_ball.js
const ball = document.getElementById('deliver_ball');
let isDragging = false;
// 水平垂直偏移量:定义悬浮球新位置
let offsetX = 0;
let offsetY = 0;

// 鼠标进入事件，进入时不忽略
ball.addEventListener('mouseenter', () => {
    //console.log('鼠标进入');
    window.electron.send('set-ignore-mouse-events', false);
    ball.style.cursor = 'grabbing';// 鼠标样式
})

// 鼠标离开事件，离开时忽略
ball.addEventListener('mouseleave', () => {
    // console.log('鼠标离开悬浮球');
    window.electron.send('set-ignore-mouse-events', true);
    ball.style.cursor = 'grab';
});
// 拖拽悬浮球，拖拽时不忽略
ball.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX;
    offsetY = e.clientY;
    window.electron.send('set-ignore-mouse-events', false);
})
// 鼠标拖拽悬浮球移动
document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        // 获取鼠标在屏幕上的位置
        const { screenX, screenY } = e;
        const newX = screenX - offsetX;
        const newY = screenY - offsetY;
        // 更新悬浮球窗口的位置 send to main process
        window.electron.send('move-ball-window', { x: newX, y: newY });
    }
});
// 鼠标松开事件，松开时忽略
document.addEventListener('mouseup', () => {
    isDragging = false;
});

// 拖放文件事件
ball.addEventListener('filedrap', (e) => {
    e.preventDefault();
    const filePath = e.dataTransfer.files[0].path;
    console.log(filePath);
    window.electron.send('file-drag', filePath);
});
// 允许松手放置文件
ball.addEventListener('dragover', (e) => {
    e.preventDefault();
});