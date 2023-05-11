import { modal } from '../../main';

export const firstCapitalLetter = (text: string) => {
  return text[0].toUpperCase() + text.toLowerCase().slice(1);
};

export const querySelector = (el: string) => document.querySelector(el);
export const querySelectorAll = (el: string) => document.querySelectorAll(el);
export const create = (el: string) => document.createElement(el);

export function closeModal() {
  const closeModalBtn = querySelector('.button--close-modal') as HTMLButtonElement;
  closeModalBtn.addEventListener('click', () => {
    modal.ariaHidden = 'true';
  });
}

export function countTypedCharacters() {
  const textarea = querySelector('#todo-text') as HTMLTextAreaElement;
  const countCharacters = querySelector('.count-characters') as HTMLSpanElement;
  const maxCharacters = querySelector('.max-characters') as HTMLSpanElement;

  maxCharacters.textContent = String(textarea.maxLength);

  textarea.addEventListener('keyup', (): boolean | void => {
    const value = textarea.value;

    if (value.length > textarea.maxLength) {
      textarea.value = value.slice(0, textarea.maxLength); // Trim the excess characters
      return false;
    }

    countCharacters.textContent = String(value.length);
  });
}
