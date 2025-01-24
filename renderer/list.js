// renderer/list.js  待办事项
const myList = document.getElementById('open_list');
const todoList = document.getElementById('todo-list');
const todoInput = document.getElementById('todo-input');
const addTodoButton = document.getElementById('add-todo');
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

myList.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - myList.getBoundingClientRect().left;
    offsetY = e.clientY - myList.getBoundingClientRect().top;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;

        const maxX = window.innerWidth - myList.offsetWidth;
        const maxY = window.innerHeight - myList.offsetHeight;

        myList.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
        myList.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

// 待办事项功能
addTodoButton.addEventListener('click', () => {
    const task = todoInput.value.trim();
    if (task) {
        const li = document.createElement('li');
        li.textContent = task;
        todoList.appendChild(li);
        todoInput.value = '';
    }
});