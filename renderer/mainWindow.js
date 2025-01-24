// APP运行逻辑
const mainWindowHeader = document.getElementById('mainWindowHeader'); // 首页窗口头(只能拖拽头部)
const mainWindow = document.getElementById('mainWindow'); // 首页窗口(用于忽略鼠标事件)
const sidebarItems = document.querySelectorAll(".sidebar ul li"); //  获取所有侧边栏项
const tabContents = document.querySelectorAll(".tab-content"); //  获取所有选项卡内容
const openDeliverBallButton = document.getElementById('openDeliverBall');      // 快传悬浮球按钮监听
const openListButton = document.getElementById('openTodoList');        // 待办表按钮监听
const closeAppButton = document.getElementById('close');         //关闭
const minimizeAppButton = document.getElementById('minimize');   //最小化
let isDragging = false; // 拖拽状态
let windowOffSetX = 0;        // 水平偏移量
let windowOffSetY = 0;        // 垂直偏移量


// 鼠标进入，进入时不忽略
mainWindow.addEventListener('mouseenter', () => {
    window.electron.send('set-ignore-mouse-events', false);
})
// 鼠标离开，离开时忽略
mainWindow.addEventListener('mouseleave', () => {
    window.electron.send('set-ignore-mouse-events', true);
});
// 鼠标按下，拖拽不忽略，拖拽操作只能作用于header
mainWindowHeader.addEventListener('mousedown', (e) => {
    mainWindowHeader.style.cursor = 'grab';
    isDragging = true;
    windowOffSetX = e.clientX;
    windowOffSetY = e.clientY;
    window.electron.send('set-ignore-mouse-events', false);
})
// 鼠标拖拽
document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        // 获取鼠标在屏幕上的位置
        const { screenX, screenY } = e;
        const newX = screenX - windowOffSetX;
        const newY = screenY - windowOffSetY;
        window.electron.send('move-main-window', { x: newX, y: newY });
    }
});
// 鼠标松开
document.addEventListener('mouseup', () => {
    isDragging = false;
});


window.onload = () => {
    // console.log('window onload');
    // 默认显示第一个选项卡的内容
    tabContents[0].classList.add("active");
    //  为每个侧边栏项添加点击事件监听器
    sidebarItems.forEach((item) => {
        item.addEventListener("click", function () {
            // 移除所有选项卡的 active 类
            tabContents.forEach((content) => {
                content.classList.remove("active");
            });

            // 移除所有侧边栏项的 active 类
            sidebarItems.forEach((sidebarItem) => {
                sidebarItem.classList.remove("active");
            });

            // 添加 active 类到当前点击的侧边栏项
            this.classList.add("active");

            // 显示对应的内容
            const tabId = this.getAttribute("data-tab");
            document.getElementById(tabId).classList.add("active");
        });
    });

    // 打开快传悬浮球
    openDeliverBallButton.addEventListener('click', () => {
        // console.log('openDeliverBallButton clicked');
        window.electron.send('open_deliver_ball');
    });

    // 打开代办表
    openListButton.addEventListener('click', () => {
        window.electron.send('open_list');
    });
    // 关闭
    closeAppButton.addEventListener('click', () => {
        window.electron.send('close_app');
    });
    // 最小化
    minimizeAppButton.addEventListener('click', () => {
        window.electron.send('minimize_app');
    });
}