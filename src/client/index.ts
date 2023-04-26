import './style.scss';
import './scripts/components/footer';
import './scripts/burger';

import { createDivLabelsElement, createNavElement } from '@/client/scripts/components';
import {
  createLabelFormElement,
  deleteLabelInputElement
} from '@/client/scripts/components/label';
import {
  firstCapitalLetter,
  querySelector,
  querySelectorAll
} from '@/client/scripts/helpers';
import { Label } from '@/client/scripts/models';
import { labelsData } from '~/libs/data';
import { labelSchema } from '~/libs/validations';

const main = querySelector('#main') as HTMLElement;
const nav = querySelector('#nav') as HTMLElement;

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

/* ------ Navbar START ------ */
/** ------ Selected tab START ------ **/
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
/** ------ Selected tab END ------ **/
/** ------ Label START ------ **/
const isDisabledEditBtns = (boolean: boolean) => {
  const editBtns = querySelectorAll('.btn-edit');
  if (boolean === true) editBtns.forEach(btn => (btn.ariaDisabled = 'true'));
  if (boolean === false) editBtns.forEach(btn => (btn.ariaDisabled = 'false'));
};

const removeLabelInputElement = () => {
  deleteLabelInputElement();
  addLabelBtn.ariaDisabled = 'false';
  return;
};

const removeInput = (el?: HTMLElement) => {
  removeLabelInputElement();
  if (el) el.style.display = 'inline-flex';
  isDisabledEditBtns(false);
};

export const deleteEmptyLabelsList = (content?: string) => {
  if (labelsData.length === 0) {
    labelsList.textContent = content ? content : '';
  }
};

const labelFormSubmit = (form: HTMLFormElement, pError: HTMLParagraphElement) => {
  const formData = new FormData(form);
  const inputData = Object.fromEntries(formData.entries());
  const validatationData = labelSchema.safeParse(inputData);

  if (!validatationData.success) {
    pError.textContent = validatationData.error.issues[0].message;
    return;
  }

  const enteredLabel = validatationData.data.inputLabel;

  return { name: enteredLabel };
};
/*** ------ Add Label START ------ ***/
addLabelBtn?.addEventListener('click', () => {
  deleteEmptyLabelsList();

  if (addLabelBtn.ariaDisabled === ' true') return;

  if (addLabelBtn?.ariaDisabled === 'false') {
    isDisabledEditBtns(true);

    const { form, pError, cancelLabelBtn } = createLabelFormElement('POST', labelsList);

    form.addEventListener('submit', (e: SubmitEvent) => {
      e.preventDefault();
      const enteredLabel: { name: string } | undefined = labelFormSubmit(form, pError);
      if (!enteredLabel) return;

      const isLabelExist = labelsData.some(label => label.name === enteredLabel.name);

      if (isLabelExist) {
        pError.textContent = 'This label already exist';
        return;
      }

      Label.save(labelsList, enteredLabel).catch(err => console.log(err));
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
/*** ------ Add Label END ------ ***/
/*** ------ Delete / Edit label START ------ ***/
export const editDeleteLabel = async (e: Event) => {
  const target = e.target as HTMLButtonElement;
  const targetedLabel = target.dataset.label as string;

  if (target.ariaDisabled === 'true' || !targetedLabel) return;
  const label = targetedLabel.toLocaleLowerCase();
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

    const deletedLabel = await Label.delete(label).catch(err => console.log(err));

    if (!deletedLabel) return;
    item.remove();

    deleteEmptyLabelsList('No Label');
    return;
  }

  if (isEditBtn) {
    removeInput(listItemContainer);

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
          const input: { name: string } | undefined = labelFormSubmit(form, pError);

          const enteredLabel = input?.name.toLocaleLowerCase();

          if (!enteredLabel || enteredLabel === label) {
            removeInput();
            return;
          }

          const isLabelExist = labelsData.some(label => label.name === enteredLabel);

          if (isLabelExist) {
            pError.textContent = 'This label already exist';
            return;
          }

          const updateLabel = await Label.update(existingLabel.name, enteredLabel);

          if (!updateLabel) return;

          labelsData[i] = { name: enteredLabel };
          listItemBtn.textContent = firstCapitalLetter(enteredLabel);
          listItemBtn.dataset.label = enteredLabel;
          deleteBtn.dataset.label = enteredLabel;
          editBtn.dataset.label = enteredLabel;
          removeInput(listItemContainer);
        });

        addEventListener('keydown', (e: KeyboardEvent) => {
          if (e.key !== 'Escape') return;
          removeInput(listItemContainer);
        });

        cancelLabelBtn.addEventListener('click', () => {
          removeInput(listItemContainer);
        });
      }
    });
  }
};
/*** ------ Delete / Edit label END ------ ***/
Label.findAllLabels(labelsList).catch(err => console.log(err));
/** ------ Label START ------ **/
/* ------ Navbar END ------ */
