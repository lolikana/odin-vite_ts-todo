import { create } from '../../helpers';

export const createLabelInputElement = (method: 'POST' | 'PUT', placeholder?: string) => {
  const form = create('form') as HTMLFormElement;
  const label = create('label') as HTMLLabelElement;
  const input = create('input') as HTMLInputElement;
  const pErrror = create('p') as HTMLParagraphElement;
  const cancelBtn = create('button') as HTMLButtonElement;
  const ValidBtn = create('button') as HTMLButtonElement;

  let placeholderLabel;
  if (placeholder) {
    placeholderLabel = placeholder.toLocaleLowerCase();
  }
  form.classList.add('label--add-form');
  form.method = 'POST';
  form.action =
    method === 'POST'
      ? import.meta.env.VITE_API_LABELS
      : `${import.meta.env.VITE_API_LABELS}/${placeholderLabel as string}?_method=PUT`;

  label.htmlFor = 'inputLabel';
  input.type = 'text';
  input.name = 'inputLabel';
  input.id = 'inputLabel';
  input.classList.add('label--add-input');
  input.placeholder = `${placeholder ? placeholder : 'label'}`;

  pErrror.classList.add('input-label-error');

  cancelBtn.classList.add('input-label-cancel');
  cancelBtn.type = 'button';
  ValidBtn.classList.add('input-label-valid');

  const inputsCsrfToken = document.createElement('input');
  inputsCsrfToken.setAttribute('type', 'hidden');
  inputsCsrfToken.setAttribute('role', 'addLabel');
  inputsCsrfToken.setAttribute('name', 'CSRFToken');

  label.append(input, ValidBtn, cancelBtn);
  form.append(inputsCsrfToken, label, pErrror);

  return form;
};
