(function () {
  // Создаем и возвращаем заголовок приложения
  function createAppTitle(title) {
    const appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  // Создаем и возвращаем форму для создания дела
  function createTodoItemForm() {
    const form = document.createElement('form');
    const input = document.createElement('input');
    const buttonWrapper = document.createElement('div');
    const button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название новой задачи';
    buttonWrapper.classList.add('input-group-append');
    button.disabled = true;
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить задачу';

    input.addEventListener('input', function () {
      button.disabled = !(input.value.length > 0);
    });

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };
  }

  // Создаем и возвращаем список элементов
  function createTodoList() {
    const list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  function createTodoItemElement(todoItem, { onDone, onDelete }) {
    const doneClass = 'list-group-item-success';

    const item = document.createElement('li');
    // размещение кнопок в одной группе
    const buttonGroup = document.createElement('div');
    const doneButton = document.createElement('button');
    const deleteButton = document.createElement('button');

    item.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-center'
    );
    item.textContent = todoItem.name;

    if (todoItem.done) {
      item.classList.add(doneClass);
    }

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    doneButton.addEventListener('click', function () {
      onDone({ todoItem, element: item });
      item.classList.toggle(doneClass, todoItem.done);
    });
    deleteButton.addEventListener('click', function () {
      onDelete({ todoItem, element: item });
    });

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return item;
  }

  async function createTodoApp(container, title, owner) {
    const todoAppTitle = createAppTitle(title);
    const todoItemForm = createTodoItemForm();
    const todoList = createTodoList();
    const handlers = {
      onDone({ todoItem }) {
        todoItem.done = !todoItem.done;
        fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ done: todoItem.done }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
      },
      onDelete({ todoItem, element }) {
        if (confirm('Вы уверены?')) {
          element.remove();
          fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {
            method: 'DELETE',
          });
        }
      },
    };

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    const response = await fetch(
      `http://localhost:3000/api/todos?owner=${owner}`
    );
    const todoItemList = await response.json();

    todoItemList.forEach((todoItem) => {
      const todoItemElement = createTodoItemElement(todoItem, handlers);
      todoList.append(todoItemElement);
    });

    todoItemForm.form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!todoItemForm.input.value) {
        return;
      }
      const response = await fetch('http://localhost:3000/api/todos', {
        method: 'POST',
        body: JSON.stringify({
          name: todoItemForm.input.value.trim(),
          owner,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const todoItem = await response.json();

      const todoItemElement = createTodoItemElement(todoItem, handlers);

      todoList.append(todoItemElement);
      todoItemForm.input.value = '';
      todoItemForm.button.disabled = true;
    });
  }

  window.createTodoApp = createTodoApp;
})();
