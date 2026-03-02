// Get DOM elements
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const themeToggle = document.getElementById('themeToggle');

// Load todos from localStorage
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// Load theme preference
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggle.querySelector('.icon').textContent = '☀️';
}

// Render todos on page load
renderTodos();

// Add event listeners
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});
themeToggle.addEventListener('click', toggleTheme);

// Add a new todo
function addTodo() {
    const text = todoInput.value.trim();

    if (text === '') {
        alert('Please enter a todo!');
        return;
    }

    const todo = {
        id: Date.now(),
        text: text,
        completed: false
    };

    todos.push(todo);
    saveTodos();
    renderTodos();
    todoInput.value = '';
    todoInput.focus();
}

// Delete a todo
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

// Edit a todo
function editTodo(id) {
    const todo = todos.find(todo => todo.id === id);
    if (!todo) return;

    const li = document.querySelector(`[data-id="${id}"]`);
    const textSpan = li.querySelector('.todo-text');
    const actionsDiv = li.querySelector('.todo-actions');

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'edit-input';
    input.value = todo.text;

    const saveBtn = document.createElement('button');
    saveBtn.className = 'save-btn';
    saveBtn.textContent = 'Save';

    textSpan.replaceWith(input);
    actionsDiv.innerHTML = '';
    actionsDiv.appendChild(saveBtn);

    input.focus();

    function save() {
        const newText = input.value.trim();
        if (newText === '') {
            alert('Todo text cannot be empty!');
            return;
        }
        todo.text = newText;
        saveTodos();
        renderTodos();
    }

    saveBtn.addEventListener('click', save);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') save();
    });
}

// Toggle todo completion status
function toggleTodo(id) {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

// Save todos to localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Toggle theme
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.querySelector('.icon').textContent = isDark ? '☀️' : '🌙';
}

// Render all todos
function renderTodos() {
    todoList.innerHTML = '';

    if (todos.length === 0) {
        todoList.innerHTML = '<div class="empty-message">No todos yet. Add one to get started!</div>';
        return;
    }

    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.dataset.id = todo.id;

        li.innerHTML = `
            <span class="todo-text" onclick="toggleTodo(${todo.id})">
                ${todo.text}
            </span>
            <div class="todo-actions">
                <span class="todo-number">${index + 1}</span>
                <button class="edit-btn" onclick="editTodo(${todo.id})">Edit</button>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
            </div>
        `;

        todoList.appendChild(li);
    });
}
