import { TodosData } from '../../../libs/data';
import { Todo } from '../models/todo-class';
import { modal } from '../pages/todos-pages';

export const firstCapitalLetter = (text: string) => {
  return text[0].toUpperCase() + text.toLowerCase().slice(1);
};

export const create = (el: string): HTMLElement => document.createElement(el);

export function closeModal(): void {
  const closeModalBtn = document.querySelector(
    '.button--close-modal'
  ) as HTMLButtonElement;
  closeModalBtn.addEventListener('click', () => {
    modal.textContent = '';
    modal.ariaHidden = 'true';
  });
}

export function countTypedCharacters(): void {
  const textarea = document.querySelector('#todo-text') as HTMLTextAreaElement;
  const countCharacters = document.querySelector('.count-characters') as HTMLSpanElement;
  const maxCharacters = document.querySelector('.max-characters') as HTMLSpanElement;

  maxCharacters.textContent = String(textarea.maxLength);

  textarea.addEventListener('keyup', (): boolean | void => {
    const value = textarea.value;

    if (value.length > textarea.maxLength) {
      textarea.value = value.slice(0, textarea.maxLength); // Trim the excess characters
      return false;
    }

    countCharacters.textContent = String(value.length);
  });
}

export function createBtnCloseModal() {
  const closeButton = document.createElement('button');
  closeButton.classList.add('button--close', 'button--close-modal');
  return closeButton;
}

export function pushTabData(tab: 'today' | 'upcoming' | 'inbox') {
  const todayTodosData: Todo[] = [];
  const upcomingTodosData: Todo[] = [];

  if (tab === 'today') {
    TodosData.forEach(todo => {
      if (new Date(todo.tag.dueDate).toDateString() === new Date().toDateString()) {
        todayTodosData.push(todo);
      }
    });
    return todayTodosData;
  }

  if (tab === 'upcoming') {
    TodosData.forEach(todo => {
      if (new Date(todo.tag.dueDate).toDateString() !== new Date().toDateString()) {
        upcomingTodosData.push(todo);
      }
    });
    return upcomingTodosData;
  }

  return TodosData;
}

function areTodosEqual(todo1: Todo, todo2: Todo, compare: 'date' | 'id') {
  if (compare === 'date') return todo1.tag.dueDate === todo2.tag.dueDate;
  if (compare === 'id') return todo1._id === todo2._id;
  return false;
}

export function findMatchingTodos(
  array1: Todo[],
  array2: Todo[],
  compare: 'date' | 'id'
) {
  const matchingTodos = [];

  for (const todo1 of array1) {
    for (const todo2 of array2) {
      if (areTodosEqual(todo1, todo2, compare)) {
        matchingTodos.push(todo1);
        break;
      }
    }
  }
  return matchingTodos;
}

export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
