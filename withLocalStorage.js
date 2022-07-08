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

  function createTodoItem(localStorageKey, name, id, done = false) {
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
      toggleDoneInLocalStorage(localStorageKey, id);
      item.classList.toggle('list-group-item-success');
    });
    deleteButton.addEventListener('click', function() {
      if (confirm('Вы уверены?')) {
        removeFromLocalStorage(localStorageKey, id);
        item.remove();
      }
    });

    return {
      item,
      doneButton,
      deleteButton,
    };
  }

  function getListFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
  }

  function addToLocalStorage(key, value) {
    let list = getListFromLocalStorage(key) ?? [];
    const uid = Date.now().toString(36) + Math.random().toString(36).substr(2);
    list.push({ id: uid, name: value.name, done: value.done });
    localStorage.setItem(key, JSON.stringify(list));
    return uid;
  }

  function removeFromLocalStorage(key, id) {
    let list = getListFromLocalStorage(key) ?? [];
    let filteredList = list.filter(element => element.id !== id);
    localStorage.setItem(key, JSON.stringify(filteredList));
  }

  function toggleDoneInLocalStorage(key, id) {
    let list = getListFromLocalStorage(key) ?? [];
    list.forEach(element => {
      if (element.id === id) {
        element.done = !element.done;
      }
    });
    localStorage.setItem(key, JSON.stringify(list));
  }

  function createTodoApp(container, title = 'Список дел', localStorageKey, startTodoList) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();
    
    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    let previousList = getListFromLocalStorage(localStorageKey);
    if (previousList) {
      previousList.forEach(item => {
        let newTodo = createTodoItem(localStorageKey, item.name, item.id, item.done);
        todoList.append(newTodo.item);
      });
    }

    if (startTodoList) {
      startTodoList.forEach(item => {
        let newTodo = createTodoItem(localStorageKey, item.name, item.id, item.done);
        todoList.append(newTodo.item);
      });
    }
    
    todoItemForm.form.addEventListener('submit', function(e) {
      // для игнорирования стандартного поведения (перезагрузка страницы после отправки)
      e.preventDefault();
      
      if (!todoItemForm.input.value) {
        return;
      }
      
      let id = addToLocalStorage(localStorageKey, {
        name: todoItemForm.input.value,
        done: false,
      });
      let todoItem = createTodoItem(localStorageKey, todoItemForm.input.value, id);

      todoList.append(todoItem.item);
      todoItemForm.input.value = '';
      todoItemForm.button.disabled = true;
    });
  }

  window.createTodoApp = createTodoApp;
})();
