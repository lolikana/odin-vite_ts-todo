import * as dotenv from 'dotenv';

import { TLabel } from '~/libs/types';

dotenv.config();

const isProduction = process.env.MODE === 'production';
const path = `${process.env.VITE_PATH as string}${process.env.VITE_PORT as string}`;
console.log(isProduction);

export const fetchLabels = async (): Promise<TLabel[]> => {
  const res = await fetch(`${!isProduction ? path : ''}/api/labels`);
  if (!res.ok) {
    throw new Error('Failed to retrieve labels from server');
  }

  return res.json() as unknown as TLabel[];
};

export const createLabel = async (label: { name: string }) => {
  const res = await fetch(`${!isProduction ? path : ''}/api/labels`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(label)
  });

  if (!res.ok) throw new Error('Failed to create label');
};

export const updateLabel = async (existingLabel: string, enteredLabel: string) => {
  const res = await fetch(`${!isProduction ? path : ''}/api/labels/${existingLabel}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: enteredLabel })
  });
  if (!res.ok) throw new Error('No response, failed to update label');
};

export const deleteLabel = async (existingLabel: string) => {
  const res = await fetch(`${!isProduction ? path : ''}/api/labels/${existingLabel}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete label');
};
