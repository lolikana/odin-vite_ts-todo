import { TLabel } from '../../libs/types';

const isProduction = import.meta.env.MODE === 'production';
const path = import.meta.env.VITE_PATH + import.meta.env.VITE_PORT;

export const fetchLabels = async (): Promise<{ fetchedLabels: TLabel[] }> => {
  const res = await fetch(`${!isProduction ? path : ''}/api/labels`);
  if (!res.ok) {
    throw new Error('Failed to retrieve labels from server');
  }

  return res.json() as unknown as { fetchedLabels: TLabel[] };
};

export const createLabel = async (label: TLabel) => {
  try {
    const res = await fetch(`${!isProduction ? path : ''}/api/labels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(label)
    });

    if (!res.ok) throw new Error('Failed to create label');

    await fetchLabels();
  } catch (err: unknown) {
    console.log(err);
  }
};

export const updateLabel = async (existingLabel: TLabel, enteredLabel: TLabel) => {
  try {
    const res = await fetch(
      `${!isProduction ? path : ''}/api/labels/${existingLabel.name.toLocaleLowerCase()}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enteredLabel)
      }
    );
    if (!res.ok) throw new Error('Failed to update label');
  } catch (err: unknown) {
    console.log(err);
  }
};

export const deleteLabel = async (existingLabel: string) => {
  try {
    const res = await fetch(
      `${!isProduction ? path : ''}/api/labels/${existingLabel.toLocaleLowerCase()}`,
      {
        method: 'DELETE'
      }
    );
    if (!res.ok) throw new Error('Failed to delete label');
  } catch (err: unknown) {
    console.log(err);
  }
};
