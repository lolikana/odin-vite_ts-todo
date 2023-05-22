import { tabs } from '../../../libs/data';
import { create, firstCapitalLetter } from '../helpers';
import { Label } from '../models/label-class';
import { createAddLabelBtn } from './ui/buttons';

export const createListElement = (
  list: 'tabs' | 'labels',
  text: string,
  labelId?: string
) => {
  const li = create('li');
  const div = create('div');
  const button = create('button');

  const divActions = create('div');
  const ActionEdit = create('button');
  const ActionDelete = create('button');

  button.textContent = firstCapitalLetter(text);

  if (list === 'tabs') {
    li.classList.add('tabs--list-item');

    if (text === 'inbox') {
      li.setAttribute('aria-selected', 'true');
      li.classList.add('inbox-tab');
      button.classList.add('inbox-btn');
    }

    button.classList.add('tabs--list-btn');
    button.setAttribute('data-tab', text);

    li.append(button);
  } else {
    li.classList.add('labels--list-item');
    div.classList.add('labels--list-container');
    li.setAttribute('aria-selected', 'false');

    button.setAttribute('data-label', text);
    button.classList.add('labels--list-btn');
    button.dataset.labelId = labelId;

    divActions.classList.add('label--actions');

    ActionEdit.classList.add('actions-btn', 'btn-edit');
    ActionEdit.setAttribute('data-label', text);
    ActionEdit.ariaDisabled = 'false';

    ActionDelete.classList.add('actions-btn', 'btn-delete');
    ActionDelete.setAttribute('data-label', text);

    divActions.append(ActionEdit, ActionDelete);

    div.append(button, divActions);

    li.appendChild(div);
  }

  return li;
};

export const createNavElement = (nav: HTMLElement) => {
  const divTab = create('div');
  const ulTabs = create('ul');

  divTab.classList.add('nav--tabs');

  ulTabs.classList.add('tabs--list');
  tabs.map(tab => {
    ulTabs.append(createListElement('tabs', tab));
  });

  divTab.append(ulTabs);

  nav.append(divTab);

  return nav;
};

export const createDivLabelsElement = () => {
  const divLabel = create('div');
  const titleLabel = create('h2');
  const ulLabels = create('ul');
  ulLabels.classList.add('tabs--list', 'labels--list');

  divLabel.classList.add('nav--labels');

  titleLabel.classList.add('label--title');
  titleLabel.textContent = 'Label';

  divLabel.append(titleLabel, ulLabels, createAddLabelBtn());

  return divLabel;
};

export const createListLabelsElement = (ul: HTMLUListElement, labels: Label[] | null) => {
  labels?.map(label => {
    ul.append(createListElement('labels', label.name, label._id!.toString()));
  });
};
