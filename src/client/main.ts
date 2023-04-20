import './style.scss';
import './scripts/components/footer';
import './scripts/burger';

import { TLabel } from '../libs/types';

const isProduction = import.meta.env.MODE === 'production';
const path = import.meta.env.VITE_PATH + import.meta.env.VITE_PORT;

const fetchLabels = async (): Promise<{ fetchedLabels: TLabel[] }> => {
  const res = await fetch(`${!isProduction ? path : ''}/api/labels`);
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
