import '@testing-library/jest-dom';

import renderIndexHTML from '@__tests__/renderIndexHTML';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import { selectTab } from './main';
import { createDivLabelsElement, createNavElement } from './scripts/components';

const htmlDocContent = renderIndexHTML();

let main;
let nav;
let tabsListItems: NodeListOf<HTMLLIElement>;
let tabsListBtn: NodeListOf<HTMLButtonElement>;
let tbody: HTMLElement;

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

describe('selectDefaultInboxTab', () => {
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

  it('should render list of tab correctly', () => {
    expect(tabsListBtn[0].getAttribute('data-tab')).toMatch(/inbox/i);
    expect(tabsListBtn[1].getAttribute('data-tab')).toMatch(/today/i);
    expect(tabsListBtn[2].getAttribute('data-tab')).toMatch(/upcoming/i);
    expect(tabsListBtn[0]).toHaveAttribute('data-tab', 'inbox');
    expect(tabsListBtn[1]).toHaveAttribute('data-tab', 'today');
    expect(tabsListBtn[2]).toHaveAttribute('data-tab', 'upcoming');
  });

  it('should set Inbox selected by default', () => {
    expect(tabsListItems[0].getAttribute('aria-selected')).toBe('true');
    expect(tabsListItems[1].getAttribute('aria-selected')).toBeNull();
    expect(tabsListItems[2].getAttribute('aria-selected')).toBeNull();
  });

  it('should set today tab selected when clicked once, then inbox if clicked again', async () => {
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

    await user.click(todayBtn);

    // Check the state after the click event
    expect(tabsListItems[0].getAttribute('aria-selected')).toBe('true');
    expect(tabsListItems[1].getAttribute('aria-selected')).toBe('false');
    expect(tabsListItems[2].getAttribute('aria-selected')).toBe('false');
  });
});
