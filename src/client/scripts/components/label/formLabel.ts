import { createLabelInputElement } from './inputLabel';

export const createLabelFormElement = (
  method: 'POST' | 'PUT',
  target: HTMLElement,
  label?: string
) => {
  const addLabelBtn = document.querySelector('.label--add-btn') as HTMLButtonElement;

  target.append(createLabelInputElement(method, label));

  addLabelBtn.ariaDisabled = 'true';

  const form = document.querySelector('.label--add-form') as HTMLFormElement;
  const input = document.querySelector('#inputLabel') as HTMLInputElement;
  const pError = document.querySelector('.input-label-error') as HTMLParagraphElement;
  const cancelLabelBtn = document.querySelector(
    '.input-label-cancel'
  ) as HTMLButtonElement;

  if (input) input.focus();

  return { form, pError, cancelLabelBtn };
};
