import '@testing-library/jest-dom';

import renderIndexHTML from '@__tests__/renderIndexHTML';
import userEvent from '@testing-library/user-event';
import { Types } from 'mongoose';
import { beforeEach, describe, expect, it } from 'vitest';

import { TLabel } from '@/libs/types';

import {
  createDivLabelsElement,
  createListLabelsElement,
  createNavElement
} from '../components';
import { selectLabel, selectTab } from './todos-pages';

const htmlDocContent = renderIndexHTML();

let main;
let nav;
let tabsListItems: NodeListOf<HTMLLIElement>;
let tabsListBtn: NodeListOf<HTMLButtonElement>;
let labelList: HTMLUListElement;
let tbody: HTMLElement;

const labelData: TLabel[] = [
  {
    _id: new Types.ObjectId(),
    name: 'test1'
  },
  {
    _id: new Types.ObjectId(),
    name: 'test2'
  }
];

let labelItems: NodeListOf<HTMLLIElement>;
let labelItem1: HTMLLIElement;
let labelItem2: HTMLLIElement;
let labelBtnItems: NodeListOf<HTMLButtonElement>;
let labelBtnItem1: HTMLButtonElement;
let labelBtnItem2: HTMLButtonElement;

beforeEach(() => {
  document.body.innerHTML = '';
  document.write(htmlDocContent);
  main = document.getElementById('main') as HTMLElement;
  nav = document.getElementById('nav') as HTMLElement;
  nav.textContent = '';
  main.append(createNavElement(nav));
  nav.append(createDivLabelsElement());
  tabsListBtn = document.querySelectorAll('.tabs--list-btn[data-tab]');
  tabsListItems = document.querySelectorAll('.tabs--list-item');
  tbody = document.querySelector('.section--table-body') as HTMLElement;
});

describe('Tab Selection', () => {
  it('should render main and nav', () => {
    const main = document.getElementById('main') as HTMLElement;
    const nav = document.getElementById('nav') as HTMLElement;
    expect(main).not.toBeNull();
    expect(nav).not.toBeNull();
    expect(tbody).not.toBeNull();
  });

  it('should render 3 items for tabs', () => {
    expect(tabsListItems.length).toBe(3);
  });

  it('should render list of tabs correctly', () => {
    expect(tabsListBtn[0]).toHaveAttribute('data-tab', 'inbox');
    expect(tabsListBtn[1]).toHaveAttribute('data-tab', 'today');
    expect(tabsListBtn[2]).toHaveAttribute('data-tab', 'upcoming');
  });

  it('should set "Inbox" tab selected by default', () => {
    expect(tabsListItems[0].getAttribute('aria-selected')).toBe('true');
    expect(tabsListItems[1].getAttribute('aria-selected')).toBeNull();
    expect(tabsListItems[2].getAttribute('aria-selected')).toBeNull();
  });

  it('should set "Today" tab selected when clicked once, then "Inbox" if clicked again', async () => {
    const user = userEvent.setup();
    // Get references to the elements
    const todayBtn = document.querySelector('[data-tab="today"]') as HTMLButtonElement;

    expect(todayBtn).toHaveAttribute('data-tab', 'today');

    // Check initial state
    expect(tabsListItems[0].getAttribute('aria-selected')).toBe('true');
    expect(tabsListItems[1]).not.toHaveAttribute('aria-selected');
    expect(tabsListItems[2]).not.toHaveAttribute('aria-selected');

    // Simulate a click event on the "Today" tab
    todayBtn.addEventListener('click', () => selectTab(todayBtn, tabsListItems, tbody));
    await user.click(todayBtn);

    // Check the state after the click event
    expect(tabsListItems[0].getAttribute('aria-selected')).toBe('false');
    expect(tabsListItems[1].getAttribute('aria-selected')).toBe('true');
    expect(tabsListItems[2].getAttribute('aria-selected')).toBe('false');

    // Simulate a click event on the "Today" tab again
    await user.click(todayBtn);

    // Check the state after the click event
    expect(tabsListItems[0].getAttribute('aria-selected')).toBe('true');
    expect(tabsListItems[1].getAttribute('aria-selected')).toBe('false');
    expect(tabsListItems[2].getAttribute('aria-selected')).toBe('false');
  });
});

describe('Label Selection', () => {
  beforeEach(() => {
    labelList = document.querySelector('.labels--list') as HTMLUListElement;
    labelList.textContent = '';
    createListLabelsElement(labelList, labelData);
    labelItems = document.querySelectorAll('.labels--list-item');
    labelItem1 = labelItems[0];
    labelItem2 = labelItems[1];
    labelBtnItems = document.querySelectorAll('.labels--list-btn');
    labelBtnItem1 = labelBtnItems[0];
    labelBtnItem2 = labelBtnItems[1];
  });

  it('should render labels', () => {
    expect(labelItem1).not.toBeNull();
    expect(labelItem2).not.toBeNull();
    expect(labelBtnItem1).not.toBeNull();
    expect(labelBtnItem2).not.toBeNull();
    expect(labelItem1.textContent).toMatch('Test1');
    expect(labelItem2.textContent).toMatch('Test2');
  });

  it('should not have any label selected by default', () => {
    expect(labelItem1).toHaveAttribute('aria-selected', 'false');
    expect(labelItem2).toHaveAttribute('aria-selected', 'false');
  });

  it('should set clicked label selected = true, and set to false if clicked again or click another label', async () => {
    const user = userEvent.setup();

    labelBtnItem1.addEventListener('click', () => selectLabel(labelBtnItem1, tbody));
    labelBtnItem2.addEventListener('click', () => selectLabel(labelBtnItem2, tbody));

    // Simulate a click event on the first label button
    await user.click(labelBtnItem1);

    expect(labelItem1).toHaveAttribute('aria-selected', 'true');
    expect(labelItem2).toHaveAttribute('aria-selected', 'false');

    // Simulate a click event on the second label button
    await user.click(labelBtnItem2);

    expect(labelItem1).toHaveAttribute('aria-selected', 'false');
    expect(labelItem2).toHaveAttribute('aria-selected', 'true');

    // Simulate a click event on the second label button again
    await user.click(labelBtnItem2);

    expect(labelItem1).toHaveAttribute('aria-selected', 'false');
    expect(labelItem2).toHaveAttribute('aria-selected', 'false');
  });
});
