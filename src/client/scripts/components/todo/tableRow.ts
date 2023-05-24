import { labelsData } from '../../../../libs/data';
import { firstCapitalLetter } from '../../helpers';
import { Todo } from '../../models/todo-class';

export function createTodoItemElement(todo: Todo) {
  const { _id, text } = todo;
  const id = _id.toString();
  const isNoTodo = text === 'No todo found';

  const tr = document.createElement('tr');
  tr.id = id;

  // create check input
  const td1 = document.createElement('td');
  td1.className = 'table--body-check';

  const input = document.createElement('input');
  input.type = 'checkbox';
  input.name = `isDone-todo-${id}`;
  input.id = `isDone-todo-${id}`;
  input.checked = todo.isDone;
  input.dataset.todoId = id;

  const label = document.createElement('label');
  label.htmlFor = `isDone-todo-${id}`;
  label.dataset.todoId = id;

  !isNoTodo && td1.append(input, label);

  // create Todo Text
  const td2 = document.createElement('td');
  td2.className = 'table--body-task';

  const span = document.createElement('span');
  span.className = !isNoTodo ? 'task--text' : 'task--text-notodo';
  span.textContent = todo.text;

  // create tags Label and dueDate
  const div = document.createElement('div');
  div.className = 'task--tags';

  const spanTag1 = document.createElement('span');
  labelsData.forEach(label => {
    if (label._id?.toString() === todo.tag.label) {
      spanTag1.className = 'task--tags-tag tag-label';
      const small1 = document.createElement('small');
      small1.textContent = firstCapitalLetter(label.name);
      spanTag1.appendChild(small1);
    }
  });

  const spanTag2 = document.createElement('span');
  spanTag2.className = 'task--tags-tag tag-date';
  const small2 = document.createElement('small');
  small2.textContent = new Date(todo.tag.dueDate).toDateString();
  spanTag2.appendChild(small2);

  !isNoTodo && div.append(spanTag1, spanTag2);

  td2.append(span, div);

  // create Buttons actions
  const td3 = document.createElement('td');
  td3.className = 'table--body-actions';

  const btnShow = document.createElement('button');
  btnShow.className = 'actions-btn btn-show';
  btnShow.id = `show-todo`;
  btnShow.dataset.todoId = id;

  const span1 = document.createElement('span');
  span1.textContent = ' / ';

  const btnEdit = document.createElement('button');
  btnEdit.className = 'actions-btn btn-edit';
  btnEdit.id = `edit-todo`;
  btnEdit.dataset.todoId = id;

  const span2 = document.createElement('span');
  span2.textContent = ' / ';

  const btnDelete = document.createElement('button');
  btnDelete.className = 'actions-btn btn-delete';
  btnDelete.id = `delete-todo`;
  btnDelete.dataset.todoId = id;

  !isNoTodo && td3.append(btnShow, span1, btnEdit, span2, btnDelete);

  // create Favorites input
  const td4 = document.createElement('td');
  td4.className = 'table--body-fav';

  const favLabel = document.createElement('label');
  favLabel.className = 'fav-label';
  favLabel.htmlFor = `isFavorite-todo-${id}`;

  const favInput = document.createElement('input');
  favInput.className = 'fav-input';
  favInput.type = 'checkbox';
  favInput.name = `isFavorite-todo-${id}`;
  favInput.id = `isFavorite-todo-${id}`;
  favInput.checked = todo.isFavorite;
  favInput.dataset.todoId = id;

  const favStarFill = document.createElement('span');
  favStarFill.className = 'fav-star fill';

  const favStarEmpty = document.createElement('span');
  favStarEmpty.className = 'fav-star empty';

  favLabel.append(favInput, favStarFill, favStarEmpty);

  !isNoTodo && td4.appendChild(favLabel);

  tr.append(td1, td2, td3, td4);

  return tr;
}
