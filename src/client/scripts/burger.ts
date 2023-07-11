/* Burger Menu */
let menuOpen = false;

const htmlSelect = document.querySelector('html') as HTMLHtmlElement;
const nav = document.querySelector('nav') as HTMLElement;
const menuBtn = document.querySelector('.menu--toggler') as HTMLDivElement;

function setPrimaryNav(set: string) {
  nav.setAttribute('data-visible', set);
  menuBtn.setAttribute('aria-expanded', set);
}

htmlSelect.addEventListener('click', (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  const visibility = nav.getAttribute('data-visible');

  //* In this case, false is not bolean value but a string
  if (menuBtn.contains(target) && visibility === 'false' && !menuOpen) {
    nav.setAttribute('data-visible', 'true'); //* will turn the value attribut as a string
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.classList.add('open');
    menuOpen = true;
    setPrimaryNav('true');
  } else if (!nav.contains(target) && visibility === 'true') {
    nav.setAttribute('data-visible', 'false');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.classList.remove('open');
    menuOpen = false;
    setPrimaryNav('false');
  }
});

//* Stop animations Nav Bar during window resizing/Loading
let resizeTimer: ReturnType<typeof setTimeout>;
window.addEventListener('resize', () => {
  document.body.classList.add('resize-animation-stopper');
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    document.body.classList.remove('resize-animation-stopper');
  }, 400);
});
/* Nav menu END */
