const copyrightTime = document.querySelector('.copyright-time') as HTMLTimeElement;

const year = new Date().getFullYear();
const date = new Date().toISOString();

copyrightTime.textContent = year.toString();
copyrightTime.setAttribute('datetime', date);
