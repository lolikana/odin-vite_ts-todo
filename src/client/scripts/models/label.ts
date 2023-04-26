import { deleteEmptyLabelsList, editDeleteLabel } from '@/client/index';
import { createLabel, deleteLabel, fetchLabels, updateLabel } from '@/client/scripts/api';
import { createListElement, createListLabelsElement } from '@/client/scripts/components';
import { LabelModel } from '@/server/models';
import { labelsData } from '~/libs/data';
import { TLabel } from '~/libs/types';
import { labelSchema } from '~/libs/validations';

export class Label {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  async save() {
    const label = new LabelModel({
      name: this.name
    });
    await label.save();
  }

  static async findAllLabels(list: HTMLUListElement) {
    list.textContent = 'Loading Label';
    try {
      const labels = await fetchLabels();
      list.textContent = '';

      if (labelSchema === null) throw new Error('Something went wrong with the labels');

      if (labels.length === 0) {
        list.textContent = 'No Label';
        return;
      }

      labels.map(label => labelsData.push(label));
      createListLabelsElement(list, labelsData);

      list.addEventListener('click', async (e: Event) => {
        await editDeleteLabel(e);
      });
    } catch (err) {
      console.log(err);
      list.textContent = err as string;
    }
  }

  static async save(list: HTMLUListElement, label: { name: string }) {
    try {
      addLabelElement(list, label);
      await createLabel(label).catch(err => {
        throw new Error(err as string);
      });
    } catch (err: unknown) {
      alert('Oops, could not create the label');
      console.log("Couldn't not create a new label:", (err as Error).message);
    }
  }

  static async update(existingLabel: string, enteredLabel: string) {
    try {
      await updateLabel(existingLabel, enteredLabel).catch(err => {
        throw new Error((err as Error).message);
      });
      return true;
    } catch (err) {
      alert('Oops, could not update the label: ' + (err as Error).message);
      return false;
    }
  }

  static async delete(existingLabel: string) {
    try {
      await deleteLabel(existingLabel).catch(err => {
        throw new Error((err as Error).message);
      });
      return true;
    } catch (err) {
      alert('Oops, could not delete the label: ' + (err as Error).message);
      return false;
    }
  }
}

const addLabelElement = (list: HTMLUListElement, label: { name: string } | TLabel) => {
  deleteEmptyLabelsList();
  labelsData.push(label);
  list.appendChild(createListElement('labels', label.name));
};
