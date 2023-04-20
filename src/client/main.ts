import './style.scss';
import './scripts/components/footer';
import './scripts/burger';

import { labelsData } from '../libs/data';
import { TLabel } from '../libs/types';
import { labelSchema } from '../libs/validations';
import { createLabel, deleteLabel, fetchLabels, updateLabel } from './api';
import {
  createDivLabelsElement,
  createListElement,
  createListLabelsElement,
  createNavElement
} from './scripts/components';
import {
  createLabelFormElement,
  deleteLabelInputElement
} from './scripts/components/label';
import { firstCapitalLetter, querySelector, querySelectorAll } from './scripts/helpers';

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
    if (!selectedTab.classList.contains('labels--list-container')) {
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

const labelFormSubmit = (form: HTMLFormElement, pError: HTMLParagraphElement) => {
  const formData = new FormData(form);
  const inputData = Object.fromEntries(formData.entries());
  const validatationData = labelSchema.safeParse(inputData);

  if (!validatationData.success) {
    pError.textContent = validatationData.error.issues[0].message;
    return;
  }

  const enteredLabel = firstCapitalLetter(validatationData.data.inputLabel);

  return { name: enteredLabel };
};

const deleteEmptyLabelsList = (content?: string) => {
  if (labelsData.length === 0) {
    labelsList.textContent = content ? content : '';
  }
};

const removeLabelInputElement = () => {
  deleteLabelInputElement();
  addLabelBtn.ariaDisabled = 'false';
  return;
};

const addLabelElement = (label: TLabel) => {
  deleteEmptyLabelsList();
  labelsData.push(label);
  labelsList.appendChild(createListElement('labels', label.name));
};

const isDisabledEditBtns = (boolean: boolean) => {
  const editBtns = querySelectorAll('.btn-edit');
  if (boolean === true) editBtns.forEach(btn => (btn.ariaDisabled = 'true'));
  if (boolean === false) editBtns.forEach(btn => (btn.ariaDisabled = 'false'));
};

addLabelBtn?.addEventListener('click', () => {
  deleteEmptyLabelsList();

  if (addLabelBtn.ariaDisabled === ' true') return;

  if (addLabelBtn?.ariaDisabled === 'false') {
    isDisabledEditBtns(true);

    const removeInput = () => {
      removeLabelInputElement();
      isDisabledEditBtns(false);
    };

    const { form, pError, cancelLabelBtn } = createLabelFormElement('POST', labelsList);

    form.addEventListener('submit', async (e: SubmitEvent) => {
      e.preventDefault();
      const enteredLabel = labelFormSubmit(form, pError) as TLabel;
      if (!enteredLabel) return;

      const isLabelExist = labelsData.some(
        label => label.name.toLocaleLowerCase() === enteredLabel.name.toLocaleLowerCase()
      );

      if (isLabelExist) {
        pError.textContent = 'This label already exist';
        return;
      }

      await createLabel(enteredLabel).catch((err: unknown) => console.log('test:', err));
      addLabelElement(enteredLabel);
      removeInput();
    });

    addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      removeInput();
    });

    cancelLabelBtn.addEventListener('click', () => {
      deleteEmptyLabelsList('No Label');
      removeInput();
    });
  }
});
/** Add label END **/
/** Delete / Edit label START **/
const editDeleteLabel = async (e: Event) => {
  const target = e.target as HTMLButtonElement;
  const label = target.dataset.label as string;

  if (target.ariaDisabled === 'true' || !label) return;

  const item = target.closest('.labels--list-item') as HTMLLIElement;
  const listItem = target.closest('.labels--list-item') as HTMLLIElement;
  const listItemContainer = listItem.firstChild as HTMLDivElement;
  const listItemBtn = listItemContainer.firstChild as HTMLButtonElement;
  const editBtn = querySelector(`.btn-edit[data-label='${label}']`) as HTMLButtonElement;
  const deleteBtn = querySelector(
    `.btn-delete[data-label='${label}']`
  ) as HTMLButtonElement;

  const isDeleteBtn =
    target.classList.contains('btn-delete') && target.dataset.label === label;
  const isEditBtn =
    target.classList.contains('btn-edit') && target.dataset.label === label;

  if (!isDeleteBtn && !isEditBtn) return;

  if (isDeleteBtn) {
    labelsData.forEach((labelData, i) => {
      if (labelData.name === label) labelsData.splice(i, 1);
    });
    item.remove();
    await deleteLabel(label);

    deleteEmptyLabelsList('No Label');
    return;
  }

  if (isEditBtn) {
    const removeInput = () => {
      removeLabelInputElement();
      listItemContainer.style.display = 'inline-flex';
      isDisabledEditBtns(false);
    };

    labelsData.forEach((existingLabel, i) => {
      isDisabledEditBtns(true);
      if (existingLabel.name === label) {
        listItemContainer.style.display = 'none';

        const { form, pError, cancelLabelBtn } = createLabelFormElement(
          'PUT',
          listItem,
          label
        );

        form.addEventListener('submit', async (e: SubmitEvent) => {
          e.preventDefault();
          const enteredLabel = labelFormSubmit(form, pError) as TLabel;

          if (!enteredLabel || enteredLabel.name === label) {
            removeInput();
            return;
          }

          const isLabelExist = labelsData.some(
            label =>
              label.name.toLocaleLowerCase() === enteredLabel.name.toLocaleLowerCase()
          );

          if (isLabelExist) {
            pError.textContent = 'This label already exist';
            return;
          }

          labelsData[i] = enteredLabel;
          listItemBtn.textContent = enteredLabel.name;
          listItemBtn.dataset.label = enteredLabel.name;
          deleteBtn.dataset.label = enteredLabel.name;
          editBtn.dataset.label = enteredLabel.name;
          await updateLabel(existingLabel, enteredLabel);
          removeInput();
        });

        addEventListener('keydown', (e: KeyboardEvent) => {
          if (e.key !== 'Escape') return;
          removeInput();
        });

        cancelLabelBtn.addEventListener('click', () => {
          removeInput();
        });
      }
    });
  }
};
/** Delete / Edit label END **/
/* Navbar END */

fetchLabels()
  .then(res => {
    console.log(res.fetchedLabels);
    if (res.fetchedLabels.length === 0) {
      labelsList.textContent = 'No Label';
      return;
    }

    res.fetchedLabels.map(label => labelsData.push(label));
    createListLabelsElement(labelsList, labelsData);

    labelsList.addEventListener('click', async (e: Event) => {
      await editDeleteLabel(e);
    });
  })
  .catch(err => {
    console.log(err);
  });
