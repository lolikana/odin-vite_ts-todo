export function createTodoForm() {
  // Create container
  const container = document.createElement('div');
  container.classList.add('todo-form-container');

  // Create close button
  const closeButton = document.createElement('button');
  closeButton.classList.add('button--close', 'button--close-modal');
  container.appendChild(closeButton);

  // Create form
  const form = document.createElement('form');
  form.classList.add('todo-form');
  container.appendChild(form);

  // Create top actions
  const topActions = document.createElement('div');
  topActions.classList.add('actions', 'top');
  form.appendChild(topActions);

  // Create label action
  const labelAction = document.createElement('div');
  labelAction.classList.add('action');
  topActions.appendChild(labelAction);

  const labelInputLabel = document.createElement('label');
  labelInputLabel.setAttribute('for', 'todo-label');
  labelInputLabel.textContent = 'label';
  labelAction.appendChild(labelInputLabel);

  const labelSelect = document.createElement('select');
  labelSelect.setAttribute('name', 'todo[label]');
  labelSelect.setAttribute('id', 'todo-label');
  labelAction.appendChild(labelSelect);

  const labelOption1 = document.createElement('option');
  labelOption1.setAttribute('value', 'gym');
  labelOption1.textContent = 'Gym';
  labelSelect.appendChild(labelOption1);

  const labelOption2 = document.createElement('option');
  labelOption2.setAttribute('value', 'study');
  labelOption2.textContent = 'Study';
  labelSelect.appendChild(labelOption2);

  const labelOption3 = document.createElement('option');
  labelOption3.setAttribute('value', 'other');
  labelOption3.textContent = 'Other';
  labelSelect.appendChild(labelOption3);

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
  dueDateInput.setAttribute('name', 'todo[dueDate]');
  dueDateInput.setAttribute('id', 'todo-dueDate');
  dueDateAction.appendChild(dueDateInput);

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
  textTextarea.setAttribute('name', 'todo[text]');
  textTextarea.setAttribute('id', 'todo-text');
  textTextarea.setAttribute('rows', '5');
  textTextarea.setAttribute('maxlength', '100');
  textAction.appendChild(textTextarea);

  const countContainer = document.createElement('div');
  countContainer.classList.add('count-container');
  textAction.appendChild(countContainer);

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
  favInput.setAttribute('name', 'todo[fav]');
  favInput.setAttribute('id', 'todo-fav');
  favLabel.appendChild(favInput);

  const favStar1 = document.createElement('span');
  favStar1.classList.add('fav-star', 'fill');
  favLabel.appendChild(favStar1);

  const favStar2 = document.createElement('span');
  favStar2.classList.add('fav-star', 'empty');
  favLabel.appendChild(favStar2);

  const doneAction = document.createElement('div');
  doneAction.classList.add('action', 'check');
  checksActions.appendChild(doneAction);

  const doneInput = document.createElement('input');
  doneInput.setAttribute('type', 'checkbox');
  doneInput.setAttribute('name', 'todo[done]');
  doneInput.setAttribute('id', 'todo-done');
  doneAction.appendChild(doneInput);

  const doneLabel = document.createElement('label');
  doneLabel.setAttribute('for', 'todo-done');
  doneLabel.classList.add('todo-done');
  doneLabel.textContent = 'done';
  doneAction.appendChild(doneLabel);

  // Create submit button
  const submitButton = document.createElement('button');
  submitButton.setAttribute('type', 'submit');
  submitButton.classList.add('button--border', 'orange');
  submitButton.textContent = 'submit';
  form.appendChild(submitButton);

  return container;
}
