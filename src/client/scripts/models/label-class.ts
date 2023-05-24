import { Types } from 'mongoose';

import { labelsData } from '../../../libs/data';
import { labelSchema } from '../../../libs/validations';
import {
  createLabel,
  deleteLabel,
  fetchLabel,
  fetchLabels,
  updateLabel
} from '../../api';
import { createListElement, createListLabelsElement } from '../components';
import { createLabelFormElement, deleteLabelInputElement } from '../components/label';
import { firstCapitalLetter, querySelector, querySelectorAll } from '../helpers';

export class Label {
  name: string;
  labelId: string;
  readonly _id?: Types.ObjectId;
  constructor(name: string, _id?: Types.ObjectId) {
    this.name = name;
    this.labelId = name;
    this._id = _id;
  }

  get label() {
    return this.name;
  }

  async getAll(list: HTMLUListElement) {
    await fetchLabels().then(res => {
      if (res.length === 0) {
        list.textContent = 'No Label';
        return;
      }

      res.map(label => {
        labelsData.push(label);
      });
      createListLabelsElement(list, labelsData);

      // Allow to click on edit btn right after create new label
      list.addEventListener('click', (e: Event) => {
        editDeleteLabel(e);
      });
    });
  }

  async get(list: HTMLUListElement) {
    await fetchLabel(this.labelId)
      .then(() => {
        labelsData.push(this);
        list.appendChild(createListElement('labels', this.name, this._id!.toString()));
        // Allow to click on edit btn right after create new label
        list.addEventListener('click', (e: Event) => {
          editDeleteLabel(e);
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  async create() {
    await createLabel(this).catch(err => console.log('create: ', err));
  }

  async update(label: Label) {
    await updateLabel(label, { ...this, _id: label._id }).catch(err =>
      console.log('update: ', err)
    );
  }
}

export const labelFormSubmit = (
  form: HTMLFormElement,
  pError: HTMLParagraphElement,
  method?: 'POST'
) => {
  const formData = new FormData(form);
  const inputData = Object.fromEntries(formData.entries());
  const validatationData = labelSchema.safeParse(inputData);

  if (!validatationData.success) {
    pError.textContent = validatationData.error.issues[0].message;
    return;
  }

  if (method !== 'POST') {
    const data = {
      name: validatationData.data.inputLabel
    };

    return new Label(data.name);
  }

  const data = {
    name: validatationData.data.inputLabel,
    _id: new Types.ObjectId()
  };

  return new Label(data.name, data._id);
};

export const deleteEmptyLabelsList = (list: HTMLUListElement, content?: string) => {
  if (labelsData.length === 0) {
    list.textContent = content ? content : '';
  }
};

export const removeLabelInput = (btn: HTMLButtonElement) => {
  deleteLabelInputElement();
  btn.ariaDisabled = 'false';
  return;
};

export const isDisabledEditBtns = (boolean: boolean) => {
  const editBtns = querySelectorAll('.btn-edit');
  if (boolean === true) editBtns.forEach(btn => (btn.ariaDisabled = 'true'));
  if (boolean === false) editBtns.forEach(btn => (btn.ariaDisabled = 'false'));
};

/** Delete / Edit label START **/
const editDeleteLabel = (e: Event) => {
  const target = e.target as HTMLButtonElement;
  const label = target.dataset.label as string;

  if (target.ariaDisabled === 'true' || !label) return;

  const labelsList = querySelector('.labels--list') as HTMLUListElement;
  const addLabelBtn = querySelector('.label--add-btn') as HTMLButtonElement;
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
    labelsData.forEach(async (labelData, i) => {
      if (labelData.name === label) {
        labelsData.splice(i, 1);
        listItem.remove();
        await deleteLabel(label);
        deleteEmptyLabelsList(labelsList, 'No Label');
      }
      return;
    });
  }

  if (isEditBtn) {
    const removeInput = () => {
      removeLabelInput(addLabelBtn);
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
          const enteredLabel = labelFormSubmit(form, pError) as Label;

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
          listItemBtn.textContent = firstCapitalLetter(enteredLabel.name);
          listItemBtn.dataset.label = enteredLabel.name;
          deleteBtn.dataset.label = enteredLabel.name;
          editBtn.dataset.label = enteredLabel.name;
          await enteredLabel.update(existingLabel);
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
