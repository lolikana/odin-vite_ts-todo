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

main?.append(createNavElement(nav));
nav?.append(createDivLabelsElement());

const tabsListItems = querySelectorAll('.tabs--list-item') as NodeListOf<HTMLLIElement>;
const tabsListBtn = querySelectorAll(
  '.tabs--list-btn[data-tab]'
) as NodeListOf<HTMLButtonElement>;
const labelsList = querySelector('.labels--list') as HTMLUListElement;
const addLabelBtn = querySelector('.label--add-btn') as HTMLButtonElement;

export const tbody = querySelector('.section--table-body') as HTMLElement;

export let selectedLabelTodos: Todo[] = [];
export let selectedTabTodos: Todo[] = TodosData;
export let selectedTodos: Todo[] = TodosData;

/* Navbar START */
const isNoTodo = (tbody: HTMLElement) => {
  tbody.append(Todo.prototype.createElement(noTodo));
};

/** Selected tab **/
export const selectDefaultInboxTab = (
  selectedTab: HTMLLIElement,
  inboxTab: HTMLLIElement,
  tbody: HTMLElement
): void => {
  selectedTab.setAttribute('aria-selected', 'false');
  inboxTab.setAttribute('aria-selected', 'true');
  tbody.textContent = '';

  selectedTabTodos = TodosData;
  if (selectedLabelTodos.length !== 0) {
    selectedTodos = findMatchingTodos(selectedLabelTodos, selectedTabTodos, 'id');
    selectedTodos.forEach(todo => tbody.append(Todo.prototype.createElement(todo)));
  } else {
    selectedTabTodos.forEach(todo => tbody.append(Todo.prototype.createElement(todo)));
  }
};

export const selectDateTab = (
  date: 'today' | 'upcoming' | 'inbox',
  tbody: HTMLElement
): void => {
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

  selectedTodos.length === 0
    ? isNoTodo(tbody)
    : selectedTodos.forEach(todo => tbody.append(Todo.prototype.createElement(todo)));
};

export const selectTab = (
  btn: HTMLButtonElement,
  tabItems: NodeListOf<HTMLLIElement>,
  tbody: HTMLElement
): void | string => {
  const selectedTabBtn = btn;
  const selectedTab = selectedTabBtn.closest('.tabs--list-item') as HTMLLIElement;
  if (
    selectedTab.ariaSelected !== null &&
    selectedTabBtn.getAttribute('data-tab') === 'inbox' &&
    selectedTab.getAttribute('aria-selected') === 'true'
  )
    return;

  /* set inbox by default if no tab selected */
  if (
    selectedTab.ariaSelected !== null &&
    selectedTab.getAttribute('aria-selected') === 'true' &&
    selectedTabBtn.getAttribute('data-tab') !== 'inbox'
  ) {
    selectDefaultInboxTab(selectedTab, tabItems[0], tbody);
    return;
  }

  // Handle other tab selections
  tabItems.forEach(list => {
    list.setAttribute('aria-selected', 'false');
    selectedTab.setAttribute('aria-selected', 'true');
    tbody.textContent = '';
    selectedTabTodos = [];
    selectedTodos = [];

    selectDateTab(selectedTabBtn.dataset.tab as 'inbox' | 'today' | 'upcoming', tbody);
    return;
  });
};

export const selectLabel = (
  clickedLabelBtn: HTMLButtonElement,
  tbody: HTMLElement
): void | string => {
  const selectedLabel = clickedLabelBtn.closest('.labels--list-item') as HTMLLIElement;
  const labelsListItems = querySelectorAll(
    '.labels--list-item'
  ) as NodeListOf<HTMLUListElement>;

  if (!clickedLabelBtn.classList.contains('labels--list-btn')) return;

  if (selectedLabel.getAttribute('aria-selected') === 'true') {
    selectedLabel.setAttribute('aria-selected', 'false');
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
    label.setAttribute('aria-selected', 'false');
    selectedLabel.setAttribute('aria-selected', 'true');
    tbody.textContent = '';
    selectedLabelTodos = [];
    selectedTodos = [];
    selectedLabelTodos = TodosData.filter(
      todo => todo.tag.label === clickedLabelBtn.dataset.labelId
    );
    selectedTodos = findMatchingTodos(selectedLabelTodos, selectedTabTodos, 'id');
  });

  selectedTodos.length === 0
    ? isNoTodo(tbody)
    : selectedTodos.map(todo => tbody.append(Todo.prototype.createElement(todo)));
  return;
};

/** Click event selecting tab or label **/
tabsListBtn.forEach(btn =>
  btn.addEventListener('click', () => {
    selectTab(btn, tabsListItems, tbody);
  })
);

labelsList?.addEventListener('click', (e: Event) => {
  const selectedLabelBtn = e.target as HTMLButtonElement;
  selectLabel(selectedLabelBtn, tbody);
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

addTodoBtn?.addEventListener('click', (): void => {
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
