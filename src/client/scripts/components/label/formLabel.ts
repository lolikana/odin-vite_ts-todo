import { querySelector } from '../../helpers';
import { createLabelInputElement } from './inputLabel';

export const createLabelFormElement = (
  method: 'POST' | 'PUT',
  target: HTMLElement,
  label?: string
) => {
  const addLabelBtn = querySelector('.label--add-btn') as HTMLButtonElement;

  target.append(createLabelInputElement(method, label));

  addLabelBtn.ariaDisabled = 'true';

  const form = querySelector('.label--add-form') as HTMLFormElement;
  const input = querySelector('#inputLabel') as HTMLInputElement;
  const pError = querySelector('.input-label-error') as HTMLParagraphElement;
  const cancelLabelBtn = querySelector('.input-label-cancel') as HTMLButtonElement;

  if (input) input.focus();

  return { form, pError, cancelLabelBtn };
};
