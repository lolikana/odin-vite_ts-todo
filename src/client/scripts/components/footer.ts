const copyrightTime = document.querySelector('.copyright-time') as HTMLTimeElement;

export function setCopyright(element: HTMLTimeElement) {
  const year = new Date().getFullYear();
  const date = new Date().toISOString();
  if (element) {
    element.textContent = year.toString();
    element.setAttribute('datetime', date);
  }
}

setCopyright(copyrightTime);
