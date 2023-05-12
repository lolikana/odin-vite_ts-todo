import { createBtnCloseModal } from '../../helpers';
import { Todo } from '../../models/todo-class';

export function createTodoCard(data: Todo) {
  const cardDiv = document.createElement('div');
  cardDiv.classList.add('modal--todo-card');

  const textParagraph = document.createElement('p');
  textParagraph.classList.add('todo--card-text');
  textParagraph.textContent = data.text;

  const tagsDiv = document.createElement('div');
  tagsDiv.classList.add('todo--card-tags');

  const labelParagraph = document.createElement('p');
  const labelSpan = document.createElement('span');
  labelSpan.textContent = 'Label';
  const labelColon = document.createTextNode(': ');
  const labelTagSpan = document.createElement('span');
  labelTagSpan.classList.add('todo--card-tag');
  labelTagSpan.textContent = data.tag.label;
  labelParagraph.appendChild(labelSpan);
  labelParagraph.appendChild(labelColon);
  labelParagraph.appendChild(labelTagSpan);

  const dueDateParagraph = document.createElement('p');
  const dueDateSpan = document.createElement('span');
  dueDateSpan.textContent = 'Due date';
  const dueDateColon = document.createTextNode(': ');
  const dueDateTagSpan = document.createElement('span');
  dueDateTagSpan.classList.add('todo--card-tag');
  dueDateTagSpan.textContent = data.tag.dueDate;
  dueDateParagraph.appendChild(dueDateSpan);
  dueDateParagraph.appendChild(dueDateColon);
  dueDateParagraph.appendChild(dueDateTagSpan);

  tagsDiv.appendChild(labelParagraph);
  tagsDiv.appendChild(dueDateParagraph);

  cardDiv.appendChild(createBtnCloseModal());
  cardDiv.appendChild(textParagraph);
  cardDiv.appendChild(tagsDiv);

  return cardDiv;
}
