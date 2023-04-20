import './style.scss';
import './scripts/components/footer';
import './scripts/burger';

import { labelsData } from '../libs/data';
import { TLabel } from '../libs/types';
import {
  createDivLabelsElement,
  createListLabelsElement,
  createNavElement
} from './scripts/components';
import { querySelector, querySelectorAll } from './scripts/helpers';

const main = document.getElementById('main') as HTMLElement;
const nav = document.getElementById('nav') as HTMLElement;

main.append(createNavElement(nav));
nav.append(createDivLabelsElement());

const labelsList = querySelector('.labels--list') as HTMLUListElement;

const isProduction = import.meta.env.MODE === 'production';
const path = import.meta.env.VITE_PATH + import.meta.env.VITE_PORT;

const fetchLabels = async (): Promise<{ fetchedLabels: TLabel[] }> => {
  const res = await fetch(`${!isProduction ? path : ''}/api/labels`);
  if (!res.ok) {
    throw new Error('Failed to retrieve labels from server');
  }

  return res.json() as unknown as { fetchedLabels: TLabel[] };
};

fetchLabels()
  .then(res => {
    console.log(res.fetchedLabels);
    res.fetchedLabels.map(label => labelsData.push(label));
    createListLabelsElement(labelsList, labelsData);
  })
  .catch(err => {
    console.log(err);
  });
