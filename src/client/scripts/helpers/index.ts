export const firstCapitalLetter = (text: string) => {
  return text[0].toUpperCase() + text.toLowerCase().slice(1);
};

export const querySelector = (el: string) => document.querySelector(el);
export const querySelectorAll = (el: string) => document.querySelectorAll(el);
export const create = (el: string) => document.createElement(el);
