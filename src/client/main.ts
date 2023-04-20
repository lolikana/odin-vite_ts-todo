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

const tabsList = querySelector('.tabs--list');
const tabsListItems = querySelectorAll(
  '.tabs--list-item'
) as NodeListOf<HTMLUListElement>;
const inboxBtn = querySelector('.inbox-btn') as HTMLButtonElement;
const inboxTab = querySelector('.inbox-tab') as HTMLLIElement;
const labelsList = querySelector('.labels--list') as HTMLUListElement;
const isProduction = import.meta.env.MODE === 'production';
const path = import.meta.env.VITE_PATH + import.meta.env.VITE_PORT;

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

/* Navbar END */

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
