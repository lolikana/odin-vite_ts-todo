import renderIndexHTML from '@__tests__/renderIndexHTML';
import { beforeEach, describe, expect, it } from 'vitest';

import { setCopyright } from './footer';

const htmlDocContent = renderIndexHTML();
let copyrightTime: HTMLTimeElement;

beforeEach(() => {
  document.body.innerHTML = '';
  document.write(htmlDocContent);
  copyrightTime = document.querySelector('.copyright-time') as HTMLTimeElement;
});

describe('footer', () => {
  it('should copyright time tag be in the document', () => {
    expect(copyrightTime).not.toBeNull();
  });

  it('should set the correct copyright year', () => {
    const currentYear = new Date().getFullYear();

    // Call the function with the mock element
    // instead of accessing the DOM directly
    setCopyright(copyrightTime);

    expect(copyrightTime.textContent).toMatch(currentYear.toString());
    expect(copyrightTime.textContent).toMatch(/2023/i);
  });
});
