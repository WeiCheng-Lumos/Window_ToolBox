const mainBall = document.getElementById('mainBall');   //主球
const subBalls = document.querySelectorAll('.sub-ball');//子球
const listSelectBtn = document.getElementById('list-select-btn');  //列表状态
const translateSelectBtn = document.getElementById('translate-select-btn'); //翻译状态
const collapseBtn = document.getElementById('collapseBtn');//收回按钮
const listOpenBtn = document.getElementById('open-list-btn'); //列表展开按钮
const transOpenBtn = document.getElementById('open-trans-btn'); //翻译展开按钮
const transContainer = document.getElementById('translate-container');//翻译容器
const radius = 90; // 环绕半径
const angleStep = 30; // 角度间隔
/* 子功能1：翻译 */
const translateBtn = document.getElementById('translateBtn'); //翻译按钮
const sourceText = document.getElementById('sourceText');    //需翻译的文本
const outputDiv = document.getElementById('translationOutput'); //翻译结果
//const translateApiKey = document.getElementById('settings-iframe').contentWindow.document.getElementById('translateApiKey');//翻译API的key
//const translateModelSelect = document.getElementById('settings-iframe').contentWindow.document.getElementById('translateModelSelect');//翻译大模型选择
const targetLanguageSelect = document.getElementById('targetLanguageSelect');//目标语言选择
const copyTranslationBtn = document.getElementById('copyTranslationBtn');//复制翻译结果

// 清单状态
function switchToListMode() {
    var mainRect = document.querySelector('.main-rect');
    mainRect.classList.add('list');
    mainRect.classList.remove('translate');

}
// 翻译状态
function switchToTranslateMode() {
    var mainRect = document.querySelector('.main-rect');
    mainRect.classList.remove('list'); // 确保移除其他模式的类
    mainRect.classList.add('translate');
}


// 球模式，右键点击--展开子菜单
mainBall.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    if (mainBall.classList.contains('main-rect')) {
        return;
    }
    mainBall.classList.add('active');
    // 计算子球位置
    subBalls.forEach((ball, index) => {
        const angle = (angleStep * (index - 2)) * (Math.PI / 180);
        const x = radius * Math.cos(angle) + 8;
        const y = radius * Math.sin(angle) + 8;

        // 设置动画延迟和最终位置
        ball.style.transitionDelay = `${index * 0.1}s`;
        ball.style.transform = `translate(${x}px, ${y}px)`;
        ball.style.opacity = '1';
    });
});

// 球模式，点击外部区域收回
document.addEventListener('click', (e) => {
    if (!mainBall.contains(e.target)) {
        mainBall.classList.remove('active');
        subBalls.forEach((ball, index) => {
            ball.style.transitionDelay = `${index * (-0.1) + 0.5}s`;
            ball.style.transform = 'translate(8px, 8px)';
            ball.style.opacity = '0';
        });
    }
});

/* 清单状态 */
// 球模式->表模式，清单状态
listSelectBtn.addEventListener('click', function () {
    // 收回子菜单
    mainBall.classList.remove('active');
    mainBall.classList.remove('translate');
    mainBall.classList.add('list');
    subBalls.forEach(ball => {
        ball.style.opacity = '0';
        ball.style.transform = 'translate(210px, 150px)';
        ball.style.transitionDelay = '0.1s';
    });
    //变形
    mainBall.classList.add('main-rect');
    mainBall.style.cursor = 'default';
    // 表球快捷切换
    listOpenBtn.style.opacity = '0';
    listOpenBtn.style.pointerEvents = 'none';
    transOpenBtn.style.opacity = '0';
    transOpenBtn.style.pointerEvents = 'none';
});

// 球模式，清单状态，快捷展开表单
listOpenBtn.addEventListener('click', function () {
    mainBall.classList.add('main-rect');
    mainBall.classList.remove('active');
    listOpenBtn.style.opacity = '0';
    listOpenBtn.style.pointerEvents = 'none';
    subBalls.forEach(ball => {
        ball.style.opacity = '0';
        ball.style.transform = 'translate(210px, 150px)';
        ball.style.transitionDelay = '0.1s';
    });
})

/* 翻译状态 */
// 球模式->表模式，翻译状态
translateSelectBtn.addEventListener('click', function () {
    // 收回子菜单
    mainBall.classList.remove('active');
    mainBall.classList.remove('list');
    mainBall.classList.add('translate');
    subBalls.forEach(ball => {
        ball.style.opacity = '0';
        ball.style.transform = 'translate(210px, 150px)';
        ball.style.transitionDelay = '0.1s';
    });
    //变形
    mainBall.classList.add('main-rect');
    mainBall.style.cursor = 'default';
    // 表球快捷切换
    transOpenBtn.style.opacity = '0';
    transOpenBtn.style.pointerEvents = 'none';
});
// 球模式，翻译状态，快捷展开表单
transOpenBtn.addEventListener('click', function () {
    mainBall.classList.add('main-rect');
    mainBall.classList.remove('active');
    transOpenBtn.style.opacity = '0';
    transOpenBtn.style.pointerEvents = 'none';
    subBalls.forEach(ball => {
        ball.style.opacity = '0';
        ball.style.transform = 'translate(210px, 150px)';
        ball.style.transitionDelay = '0.1s';
    });
})

// 表模式->球模式
collapseBtn.addEventListener('click', () => {
    mainBall.classList.remove('main-rect');
    //子球初始化
    subBalls.forEach((ball) => {
        ball.style.transform = 'translate(8px, 8px)';
        ball.style.opacity = '0';
    })
    //清单状态，初始化快捷按钮
    if (mainBall.classList.contains('list')) {
        listOpenBtn.style.opacity = '1';
        listOpenBtn.style.pointerEvents = 'auto';
    }
    //翻译状态，初始化快捷按钮
    if (mainBall.classList.contains('translate')) {
        transOpenBtn.style.opacity = '1';
        transOpenBtn.style.pointerEvents = 'auto';
    }
});

//子功能1：翻译
translateBtn.addEventListener('click', async () => {
    const text = sourceText.value.trim();
    if (!text) {
        outputDiv.textContent = '请输入要翻译的文本';
        return;
    }

    if (!translateApiKey.value) {
        outputDiv.textContent = '请先设置您的翻译模型及API Key';
        return;
    }

    outputDiv.textContent = '正在翻译...';

    try {
        const result = await window.electron.translate({
            text,
            model: translateModelSelect.value,
            apiKey: translateApiKey.value,
            targetLanguage: targetLanguageSelect.value
        });
        outputDiv.textContent = result;
    } catch (error) {
        outputDiv.textContent = `翻译错误: ${error.message}`;
    }
});
// // 复制按钮点击事件
// copyBtn.addEventListener('click', () => {
//     const output = document.getElementById('translationOutput');
//     navigator.clipboard.writeText(output.textContent)
//         .then(() => alert('已复制到剪贴板'))
//         .catch(err => console.error('复制失败:', err));
// });