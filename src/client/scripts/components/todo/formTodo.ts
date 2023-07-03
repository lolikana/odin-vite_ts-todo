import { labelsData, TodosData } from '../../../../libs/data';
import { createBtnCloseModal, firstCapitalLetter } from '../../helpers';

export function createTodoForm(method: 'POST' | 'PUT', todoId?: string) {
  const todo =
    method === 'PUT' && todoId && TodosData.filter(todo => todo.id === todoId)[0];
  // Create container
  const container = document.createElement('div');
  container.classList.add('todo-form-container');

  // Create close button
  container.appendChild(createBtnCloseModal());

  // Create form
  const form = document.createElement('form');
  form.classList.add('todo-form');
  form.method = 'POST';
  form.action =
    method === 'POST'
      ? (import.meta.env.VITE_API_TODOS as string)
      : `${import.meta.env.VITE_API_TODOS as string}/${todoId!}?_method=PUT`;

  container.appendChild(form);

  // Create top actions
  const topActions = document.createElement('div');
  topActions.classList.add('actions', 'top');
  form.appendChild(topActions);

  //create paragraph error
  const pErrorDueDate = document.createElement('p');
  pErrorDueDate.classList.add('error-message');
  const pErrorText = document.createElement('p');
  pErrorText.classList.add('error-message');

  // Create label action
  const labelAction = document.createElement('div');
  labelAction.classList.add('action');
  topActions.appendChild(labelAction);

  const labelInputLabel = document.createElement('label');
  labelInputLabel.setAttribute('for', 'todo-label');
  labelInputLabel.textContent = 'label';
  labelAction.appendChild(labelInputLabel);

  const labelSelect = document.createElement('select');
  labelSelect.setAttribute('name', 'label');
  labelSelect.setAttribute('id', 'todo-label');
  labelAction.appendChild(labelSelect);

  labelsData.map(label => {
    const labelOption = document.createElement('option');
    labelOption.setAttribute('value', label._id!.toString());
    labelOption.textContent = firstCapitalLetter(label.name);
    if (method === 'PUT' && todo && label._id!.toString() === todo.tag.label) {
      labelOption.defaultSelected = true;
    }

    labelSelect.appendChild(labelOption);
  });

  // Create dueDate action
  const dueDateAction = document.createElement('div');
  dueDateAction.classList.add('action');
  topActions.appendChild(dueDateAction);

  const dueDateInputLabel = document.createElement('label');
  dueDateInputLabel.setAttribute('for', 'todo-dueDate');
  dueDateInputLabel.textContent = 'due Date';
  dueDateAction.appendChild(dueDateInputLabel);

  const dueDateInput = document.createElement('input');
  dueDateInput.setAttribute('type', 'date');
  dueDateInput.setAttribute('name', 'dueDate');
  dueDateInput.setAttribute('id', 'todo-dueDate');
  method === 'PUT' && todo && dueDateInput.setAttribute('value', todo.tag.dueDate);
  dueDateAction.append(dueDateInput, pErrorDueDate);

  // Create text actions
  const textActions = document.createElement('div');
  textActions.classList.add('actions', 'text');
  form.appendChild(textActions);

  const textAction = document.createElement('div');
  textAction.classList.add('action');
  textActions.appendChild(textAction);

  const textInputLabel = document.createElement('label');
  textInputLabel.setAttribute('for', 'todo-text');
  textInputLabel.textContent = 'Todo';
  textAction.appendChild(textInputLabel);

  const textTextarea = document.createElement('textarea');
  textTextarea.setAttribute('name', 'text');
  textTextarea.setAttribute('id', 'todo-text');
  textTextarea.setAttribute('rows', '5');
  textTextarea.setAttribute('maxlength', '100');

  method === 'PUT' && todo && (textTextarea.textContent = todo.text);

  textAction.appendChild(textTextarea);

  const countContainer = document.createElement('div');
  countContainer.classList.add('count-container');
  textAction.append(countContainer, pErrorText);

  const countCharacters = document.createElement('span');
  countCharacters.classList.add('count-characters');
  countCharacters.textContent = '0';
  countContainer.appendChild(countCharacters);

  const countSeparator = document.createElement('span');
  countSeparator.textContent = '/';
  countContainer.appendChild(countSeparator);

  const maxCharacters = document.createElement('span');
  maxCharacters.classList.add('max-characters');
  maxCharacters.textContent = '100';
  countContainer.appendChild(maxCharacters);

  // Create checks actions
  const checksActions = document.createElement('div');
  checksActions.classList.add('actions', 'checks');
  form.appendChild(checksActions);

  const favAction = document.createElement('div');
  favAction.classList.add('action');
  checksActions.appendChild(favAction);

  const favLabel = document.createElement('label');
  favLabel.setAttribute('for', 'todo-fav');
  favLabel.classList.add('fav-label');
  favLabel.textContent = 'favorite';
  favAction.appendChild(favLabel);

  const favInput = document.createElement('input');
  favInput.setAttribute('type', 'checkbox');
  favInput.setAttribute('class', 'fav-input');
  favInput.setAttribute('name', 'isFavorite');
  favInput.setAttribute('id', 'todo-fav');
  method === 'PUT' &&
    todo &&
    (todo.isFavorite === true ? (favInput.checked = true) : (favInput.checked = false));

  favLabel.appendChild(favInput);

  const favStar1 = document.createElement('span');
  favStar1.classList.add('fav-star', 'fill');
  favLabel.appendChild(favStar1);

  const favStar2 = document.createElement('span');
  favStar2.classList.add('fav-star', 'empty');
  favLabel.appendChild(favStar2);

  const doneAction = document.createElement('div');
  doneAction.classList.add('action', 'check-right');
  checksActions.appendChild(doneAction);

  const doneInput = document.createElement('input');
  doneInput.setAttribute('type', 'checkbox');
  doneInput.setAttribute('name', 'isDone');
  doneInput.setAttribute('id', 'todo-isDone');
  method === 'PUT' &&
    todo &&
    (todo.isDone === true ? (doneInput.checked = true) : (doneInput.checked = false));
  doneAction.appendChild(doneInput);

  const doneLabel = document.createElement('label');
  doneLabel.setAttribute('for', 'todo-isDone');
  doneLabel.classList.add('todo-isDone');
  doneLabel.textContent = 'isDone';
  doneAction.appendChild(doneLabel);

  // Create submit button
  const submitButton = document.createElement('button');
  submitButton.setAttribute('type', 'submit');
  submitButton.classList.add('button--border', 'orange');
  submitButton.textContent = 'submit';
  form.appendChild(submitButton);

  return { container, form };
}
