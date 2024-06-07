document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const priorityInput = document.getElementById('priority-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');

    // Load tasks from localStorage
    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            addTaskToDOM(task);
        });
    };

    // Save tasks to localStorage
    const saveTasks = (tasks) => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Add task to DOM
    const addTaskToDOM = (task) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.status === 'completed' ? 'complete' : ''}`;
        li.dataset.id = task.id;
        li.innerHTML = `
            <span>${task.text} (${task.priority})</span>
            <div class="task-buttons">
                <button class="complete-btn">${task.status === 'completed' ? 'Undo' : 'Complete'}</button>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
        taskList.appendChild(li);
    };

    // Add task
    addTaskBtn.addEventListener('click', () => {
        const text = taskInput.value.trim();
        const priority = priorityInput.value;

        if (text === '') return;

        const task = {
            id: Date.now().toString(),
            text,
            priority,
            status: 'pending'
        };

        addTaskToDOM(task);

        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        saveTasks(tasks);

        taskInput.value = '';
    });

    // Handle task buttons (complete, edit, delete)
    taskList.addEventListener('click', (e) => {
        const id = e.target.closest('li').dataset.id;
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

        if (e.target.classList.contains('complete-btn')) {
            const task = tasks.find(t => t.id === id);
            task.status = task.status === 'completed' ? 'pending' : 'completed';
            saveTasks(tasks);
            e.target.closest('li').classList.toggle('complete');
            e.target.textContent = task.status === 'completed' ? 'Undo' : 'Complete';
        }

        if (e.target.classList.contains('edit-btn')) {
            const task = tasks.find(t => t.id === id);
            taskInput.value = task.text;
            priorityInput.value = task.priority;
            taskList.removeChild(e.target.closest('li'));
            saveTasks(tasks.filter(t => t.id !== id));
        }

        if (e.target.classList.contains('delete-btn')) {
            taskList.removeChild(e.target.closest('li'));
            saveTasks(tasks.filter(t => t.id !== id));
        }
    });

    loadTasks();
});
