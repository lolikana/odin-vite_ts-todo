import './style.scss';
import './scripts/components/footer';
import './scripts/burger';

import { labelsData } from '../libs/data';
import { createDivLabelsElement, createNavElement } from './scripts/components';
import { createLabelFormElement } from './scripts/components/label';
import { querySelector, querySelectorAll } from './scripts/helpers';
import {
  deleteEmptyLabelsList,
  isDisabledEditBtns,
  Label,
  labelFormSubmit,
  removeLabelInput
} from './scripts/models/label-class';
import { Todo } from './scripts/models/todo-class';

const main = document.getElementById('main') as HTMLElement;
const nav = document.getElementById('nav') as HTMLElement;

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

const tbody = querySelector('.section--table-body') as HTMLElement;

/* Navbar START */
/** Selected tab **/
const selectTab = (e: Event, listItems: NodeListOf<Element>): void | string => {
  const target = e.target as HTMLElement;
  let selectedTab;

  if (
    target === tabsList ||
    target === labelsList ||
    target.classList.contains('actions-btn')
  )
    return;

  if (listItems === tabsListItems) {
    selectedTab = target.closest('.tabs--list-item');
  } else {
    selectedTab = target.closest('.labels--list-item');
  }

  if (selectedTab === null) return;

  const selectedTabBtn = selectedTab.firstChild as HTMLButtonElement;

  /* set inbox by default if no tab selected */
  if (
    selectedTab.ariaSelected === 'true' &&
    selectedTabBtn.dataset.tab !== inboxBtn.dataset.tab
  ) {
    selectedTab.ariaSelected = 'false';
    if (!selectedTab.classList.contains('labels--list-item')) {
      inboxTab.ariaSelected = 'true';
    }
    return;
  }

  /* Reset aria-selected tabs and set selected one to true */
  listItems.forEach(item => (item.ariaSelected = 'false'));
  selectedTab.ariaSelected = 'true';
};

tabsList?.addEventListener('click', (e: Event) => {
  selectTab(e, tabsListItems);
});

labelsList.addEventListener('click', (e: Event) => {
  const labelsListItems = querySelectorAll('.labels--list-item');
  selectTab(e, labelsListItems);
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
      const enteredLabel = labelFormSubmit(form, pError);
      if (!enteredLabel) return;

      const isLabelExist = labelsData.some(
        label => label.name.toLocaleLowerCase() === enteredLabel.name.toLocaleLowerCase()
      );

      if (isLabelExist) {
        pError.textContent = 'This label already exist';
        return;
      }

      deleteEmptyLabelsList(labelsList);
      await enteredLabel.create(labelsList);
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
/** Fetch Labels START **/
Label.prototype.getAll(labelsList);
/** Fetch Labels END **/
/* Navbar END */
/* Todo START */
Todo.prototype.getAll(tbody);

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
/* Todo END */
