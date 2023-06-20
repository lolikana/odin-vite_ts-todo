import './style.scss';
import './scripts/components/footer';
import './scripts/burger';

import { labelsData, noTodo, TodosData } from '../libs/data';
import { createDivLabelsElement, createNavElement } from './scripts/components';
import { createLabelFormElement } from './scripts/components/label';
import { createTodoForm } from './scripts/components/todo/formTodo';
import {
  closeModal,
  countTypedCharacters,
  findMatchingTodos,
  pushTabData,
  querySelector,
  querySelectorAll
} from './scripts/helpers';
import {
  deleteEmptyLabelsList,
  isDisabledEditBtns,
  Label,
  labelFormSubmit,
  removeLabelInput
} from './scripts/models/label-class';
import { Todo, todoFormSubmit } from './scripts/models/todo-class';

const main = document.getElementById('main') as HTMLElement;
const nav = document.getElementById('nav') as HTMLElement;
export const modal = querySelector('#modal') as HTMLDivElement;

main.append(createNavElement(nav));
nav.append(createDivLabelsElement());

const tabsList = querySelector('.tabs--list') as HTMLUListElement;
const tabsListItems = querySelectorAll(
  '.tabs--list-item'
) as NodeListOf<HTMLUListElement>;
const inboxTab = querySelector('.inbox-tab') as HTMLLIElement;
const labelsList = querySelector('.labels--list') as HTMLUListElement;
const addLabelBtn = querySelector('.label--add-btn') as HTMLButtonElement;

export const tbody = querySelector('.section--table-body') as HTMLElement;

let selectedLabelTodos: Todo[] = [];
let selectedTabTodos: Todo[] = TodosData;
let selectedTodos: Todo[] = TodosData;

/* Navbar START */
/** Selected tab **/
const selectDefaultInboxTab = (selectedTab: HTMLLIElement): void => {
  selectedTab.ariaSelected = 'false';
  inboxTab.ariaSelected = 'true';
  tbody.textContent = '';

  selectedTabTodos = TodosData;
  selectedTodos = findMatchingTodos(selectedLabelTodos, selectedTabTodos, 'id');
  selectedTodos.forEach(todo => tbody.append(Todo.prototype.createElement(todo)));
};

const selectDateTab = (date: 'today' | 'upcoming' | 'inbox'): void => {
  if (date === 'inbox') selectedTabTodos = TodosData;

  if (date === 'today')
    selectedTabTodos = TodosData.filter(
      todo => new Date(todo.tag.dueDate).toDateString() === new Date().toDateString()
    );

  if (date === 'upcoming')
    selectedTabTodos = TodosData.filter(
      todo => new Date(todo.tag.dueDate).toDateString() > new Date().toDateString()
    );

  selectedTodos =
    selectedLabelTodos.length !== 0
      ? findMatchingTodos(selectedLabelTodos, selectedTabTodos, 'id')
      : selectedTabTodos;

  tbody.textContent = '';
  selectedTodos.forEach(todo => tbody.append(Todo.prototype.createElement(todo)));
};

const selectTab = (e: Event): void | string => {
  const selectedTabBtn = e.target as HTMLButtonElement;
  const selectedTab = selectedTabBtn.closest('.tabs--list-item') as HTMLLIElement;

  if (
    !selectedTabBtn.classList.contains('tabs--list-btn') ||
    (selectedTabBtn.dataset.tab === 'inbox' && selectedTab.ariaSelected === 'true')
  )
    return;

  /* set inbox by default if no tab selected */
  if (selectedTab.ariaSelected === 'true' && selectedTabBtn.dataset.tab !== 'inbox') {
    selectDefaultInboxTab(selectedTab);
    return;
  }

  // Handle other tab selections
  tabsListItems.forEach(list => {
    list.ariaSelected = 'false';
    selectedTab.ariaSelected = 'true';
    tbody.textContent = '';
    selectedTabTodos = [];
    selectedTodos = [];

    selectDateTab(selectedTabBtn.dataset.tab as 'inbox' | 'today' | 'upcoming');
    return;
  });
};

const selectLabel = (e: Event): void | string => {
  const selectedLabelBtn = e.target as HTMLButtonElement;
  const selectedLabel = selectedLabelBtn.closest('.labels--list-item') as HTMLLIElement;
  const labelsListItems = querySelectorAll(
    '.labels--list-item'
  ) as NodeListOf<HTMLUListElement>;
  if (
    !selectedLabelBtn.classList.contains('labels--list-btn') ||
    (selectedLabelBtn.dataset.tab === 'inbox' && selectedLabel.ariaSelected === 'true')
  )
    return;

  if (selectedLabel.ariaSelected === 'true') {
    selectedLabel.ariaSelected = 'false';
    selectedLabelTodos = [];
    tbody.textContent = '';

    if (selectedTabTodos.length !== 0) {
      selectedTabTodos.map(todo => tbody.append(Todo.prototype.createElement(todo)));
      return;
    }

    TodosData.map(todo => tbody.append(Todo.prototype.createElement(todo)));
    return;
  }

  labelsListItems.forEach(label => {
    label.ariaSelected = 'false';
    selectedLabel.ariaSelected = 'true';
    tbody.textContent = '';
    selectedLabelTodos = [];
    selectedTodos = [];
    selectedLabelTodos = TodosData.filter(
      todo => todo.tag.label === selectedLabelBtn.dataset.labelId
    );
    selectedTodos = findMatchingTodos(selectedLabelTodos, selectedTabTodos, 'id');
  });
  selectedTodos.map(todo => tbody.append(Todo.prototype.createElement(todo)));
  return;
};

tabsList.addEventListener('click', (e: Event) => {
  selectTab(e);
});

labelsList.addEventListener('click', (e: Event) => {
  selectLabel(e);
});

/** Add label START **/
addLabelBtn?.addEventListener('click', () => {
  deleteEmptyLabelsList(labelsList);

  if (addLabelBtn.ariaDisabled === ' true') return;

  if (addLabelBtn?.ariaDisabled === 'false') {
    isDisabledEditBtns(true);

    const removeInput = () => {
      removeLabelInput(addLabelBtn);
      isDisabledEditBtns(false);
    };

    const { form, pError, cancelLabelBtn } = createLabelFormElement('POST', labelsList);

    form.addEventListener('submit', async (e: SubmitEvent) => {
      e.preventDefault();
      const enteredLabel = labelFormSubmit(form, pError, 'POST');
      if (!enteredLabel) return;

      const isLabelExist = labelsData.some(
        label => label.name.toLocaleLowerCase() === enteredLabel.name.toLocaleLowerCase()
      );

      if (isLabelExist) {
        pError.textContent = 'This label already exist';
        return;
      }

      deleteEmptyLabelsList(labelsList);
      await enteredLabel.create().then(() => enteredLabel.get(labelsList));
      removeInput();
    });

    addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      removeInput();
    });

    cancelLabelBtn.addEventListener('click', () => {
      deleteEmptyLabelsList(labelsList, 'No Label');
      removeInput();
    });
  }
});
/** Add label END **/
/** Fetch Labels and Todos START **/
Label.prototype
  .getAll(labelsList)
  .then(() => Todo.prototype.getAll(tbody))
  .catch(err => {
    console.log(err);
  });
/** Fetch Labels and Todos END **/
/* Navbar END */

/* Todo START */
const addTodoBtn = querySelector('.task--add-btn') as HTMLButtonElement;

addTodoBtn.addEventListener('click', (): void => {
  const { container, form } = createTodoForm('POST');
  modal.ariaHidden = 'false';
  modal.textContent = '';
  modal.append(container);
  countTypedCharacters();
  closeModal();

  form.addEventListener('submit', async (e: SubmitEvent) => {
    e.preventDefault();
    const enteredTodo = todoFormSubmit('POST');
    if (!enteredTodo) return;

    await enteredTodo.create().then(() => enteredTodo.get(tbody));
    modal.ariaHidden = 'true';
  });
});
/* Todo END */
