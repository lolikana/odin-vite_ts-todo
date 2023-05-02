export function createTodoItem() {
  const tr = document.createElement('tr');

  const td1 = document.createElement('td');
  td1.className = 'table--body-check';

  const input = document.createElement('input');
  input.type = 'checkbox';
  input.name = 'check-todo2';
  input.id = 'check-todo2';

  const label = document.createElement('label');
  label.htmlFor = 'check-todo2';

  td1.appendChild(input);
  td1.appendChild(label);

  const td2 = document.createElement('td');
  td2.className = 'table--body-task';

  const span = document.createElement('span');
  span.className = 'task--text';
  span.textContent =
    'Do some workout, Do some workout, Do some workout, Do some workout, Do some workout';

  const div = document.createElement('div');
  div.className = 'task--tags';

  const spanTag1 = document.createElement('span');
  spanTag1.className = 'task--tags-tag tag-label';
  const small1 = document.createElement('small');
  small1.textContent = 'Gym';
  spanTag1.appendChild(small1);

  const spanTag2 = document.createElement('span');
  spanTag2.className = 'task--tags-tag tag-date';
  const small2 = document.createElement('small');
  small2.textContent = '01-04-2023';
  spanTag2.appendChild(small2);

  div.appendChild(spanTag1);
  div.appendChild(spanTag2);

  td2.appendChild(span);
  td2.appendChild(div);

  const td3 = document.createElement('td');
  td3.className = 'table--body-actions';

  const btnShow = document.createElement('button');
  btnShow.className = 'actions-btn btn-show';

  const span1 = document.createElement('span');
  span1.textContent = ' / ';

  const btnEdit = document.createElement('button');
  btnEdit.className = 'actions-btn btn-edit';

  const span2 = document.createElement('span');
  span2.textContent = ' / ';

  const btnDelete = document.createElement('button');
  btnDelete.className = 'actions-btn btn-delete';

  td3.appendChild(btnShow);
  td3.appendChild(span1);
  td3.appendChild(btnEdit);
  td3.appendChild(span2);
  td3.appendChild(btnDelete);

  const td4 = document.createElement('td');
  td4.className = 'table--body-fav';

  const favLabel = document.createElement('label');
  favLabel.className = 'fav-label';
  favLabel.htmlFor = 'fav-todo1';

  const favInput = document.createElement('input');
  favInput.className = 'fav-input';
  favInput.type = 'checkbox';
  favInput.name = 'fav-todo1';
  favInput.id = 'fav-todo1';

  const favStarFill = document.createElement('span');
  favStarFill.className = 'fav-star fill';

  const favStarEmpty = document.createElement('span');
  favStarEmpty.className = 'fav-star empty';

  favLabel.appendChild(favInput);
  favLabel.appendChild(favStarFill);
  favLabel.appendChild(favStarEmpty);

  td4.appendChild(favLabel);

  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);
  tr.appendChild(td4);

  return tr;
}
