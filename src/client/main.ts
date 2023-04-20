import './style.css';

import { TLabel } from '../libs/types';
import { setupCounter } from './counter';
import typescriptLogo from './typescript.svg';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`;

const fetchLabels = async (): Promise<{ fetchedLabels: TLabel[] }> => {
  const res = await fetch('/api/labels');
  if (!res.ok) {
    throw new Error('Failed to retrieve labels from server');
  }

  return res.json() as unknown as { fetchedLabels: TLabel[] };
};
fetchLabels()
  .then(res => console.log(res.fetchedLabels))
  .catch(err => {
    console.log(err);
  });

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!);
