document.addEventListener('DOMContentLoaded', function () {
    var todoInput = document.getElementById('todo-input');
    var todoForm = document.getElementById('todo-form');
    var todoList = document.getElementById('todo_list');
    var doneList = document.getElementById('done_list');
    var todos = [];
    var renderTasks = function () {
        todoList.innerHTML = '';
        doneList.innerHTML = '';
        todos.forEach(function (todo) {
            var li = document.createElement('li');
            li.className = 'list_item';
            var textSpan = document.createElement('span');
            textSpan.textContent = todo.text;
            li.appendChild(textSpan);
            if (!todo.completed) {
                var completeButton = document.createElement('button');
                completeButton.textContent = '완료';
                completeButton.className = 'list_item_button';
                completeButton.onclick = function () {
                    completeTask(todo.id);
                };
                li.appendChild(completeButton);
                todoList.appendChild(li);
            }
            else {
                var deleteButton = document.createElement('button');
                deleteButton.textContent = '삭제';
                deleteButton.className = 'list_item_button';
                deleteButton.onclick = function () {
                    deleteTask(todo.id);
                };
                li.appendChild(deleteButton);
                doneList.appendChild(li);
            }
        });
    };
    var addTodo = function (text) {
        if (text) {
            var newTodo = { id: Date.now(), text: text, completed: false };
            todos.push(newTodo);
            renderTasks();
        }
    };
    var completeTask = function (id) {
        var todo = todos.find(function (todo) { return todo.id === id; });
        if (todo) {
            todo.completed = true;
            renderTasks();
        }
    };
    var deleteTask = function (id) {
        todos = todos.filter(function (todo) { return todo.id !== id; });
        renderTasks();
    };
    todoForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var text = todoInput.value.trim();
        if (text) {
            addTodo(text);
            todoInput.value = '';
        }
    });
    renderTasks();
});
