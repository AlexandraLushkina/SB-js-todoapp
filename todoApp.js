(function() {
  // Создаем и возвращаем заголовок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  // Создаем и возвращаем форму для создания дела
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название новой задачи';
    buttonWrapper.classList.add('input-group-append');
    button.disabled = true;
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить задачу';

    input.addEventListener('input', function() {
      button.disabled = !(input.value.length > 0);
    });

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button
    };
  }

  // Создаем и возвращаем список элементов
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  function createTodoItem(name, done = false) {
    let item = document.createElement('li');
    // размещение кнопок в одной группе
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = name;

    if (done) {
      item.classList.toggle('list-group-item-success');
    }

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    doneButton.addEventListener('click', function() {
      item.classList.toggle('list-group-item-success');
    });
    deleteButton.addEventListener('click', function() {
      if (confirm('Вы уверены?')) {
        item.remove();
      }
    });

    return {
      item,
      doneButton,
      deleteButton,
    };
  }

  function createTodoApp(container, title = 'Список дел', startTodoList) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();
    
    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    if (startTodoList) {
      startTodoList.forEach(item => {
        let newTodo = createTodoItem(item.name, item.done);
        todoList.append(newTodo.item);
      });
    }
  
    todoItemForm.form.addEventListener('submit', function(e) {
      // для игнорирования стандартного поведения (перезагрузка страницы после отправки)
      e.preventDefault();
  
      if (!todoItemForm.input.value) {
        return;
      }
  
      let todoItem = createTodoItem(todoItemForm.input.value);

      todoList.append(todoItem.item);
      todoItemForm.input.value = '';
      todoItemForm.button.disabled = true;
    });
  }

  window.createTodoApp = createTodoApp;
})();
