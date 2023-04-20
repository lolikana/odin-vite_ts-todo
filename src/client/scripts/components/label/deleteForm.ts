import { querySelector } from '../../helpers';

export const deleteLabelInputElement = () => {
  const form = querySelector('.label--add-form');
  if (form) form.remove();
  return;
};
