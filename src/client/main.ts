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

const tabsList = querySelector('.tabs--list');
const tabsListItems = querySelectorAll(
  '.tabs--list-item'
) as NodeListOf<HTMLUListElement>;
const inboxBtn = querySelector('.inbox-btn') as HTMLButtonElement;
const inboxTab = querySelector('.inbox-tab') as HTMLLIElement;
const labelsList = querySelector('.labels--list') as HTMLUListElement;
const addLabelBtn = querySelector('.label--add-btn') as HTMLButtonElement;

export const tbody = querySelector('.section--table-body') as HTMLElement;

const selectedLabelTodos: Todo[] = [];
let selectedTabTodos: Todo[] = [];
const selectedTodos: Todo[] = [];

/* Navbar START */
/** Selected tab **/
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
    selectedTab.ariaSelected = 'false';
    inboxTab.ariaSelected = 'true';
    tbody.textContent = '';
    selectedTabTodos = TodosData;
    selectedTabTodos.map(todo => tbody.append(Todo.prototype.createElement(todo)));
    return;
  }

  tabsListItems.forEach(list => {
    list.ariaSelected = 'false';
    selectedTab.ariaSelected = 'true';
    tbody.textContent = '';

    if (selectedTabBtn.dataset.tab === 'today') {
      selectedTabTodos = TodosData.filter(
        todo => new Date(todo.tag.dueDate).toDateString() === new Date().toDateString()
      );
      selectedTabTodos.map(todo => tbody.append(Todo.prototype.createElement(todo)));
      return;
    }

    if (selectedTabBtn.dataset.tab === 'upcoming') {
      selectedTabTodos = TodosData.filter(
        todo => new Date(todo.tag.dueDate).toDateString() > new Date().toDateString()
      );
      selectedTabTodos.map(todo => tbody.append(Todo.prototype.createElement(todo)));
      return;
    }

    selectedTabTodos = TodosData;
    selectedTabTodos.map(todo => tbody.append(Todo.prototype.createElement(todo)));
  });
};

tabsList?.addEventListener('click', (e: Event) => {
  selectTab(e);
});

// labelsList.addEventListener('click', (e: Event) => {
//   const labelsListItems = querySelectorAll('.labels--list-item');
//   selectTab(e, labelsListItems);
// });

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
