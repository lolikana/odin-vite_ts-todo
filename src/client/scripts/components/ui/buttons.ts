import { create } from '@/client/scripts/helpers';

export const createAddLabelBtn = () => {
  const div = create('div');
  const button = create('button');

  div.classList.add('label--add', 'orange');

  button.classList.add('label--add-btn');
  button.textContent = 'Add Label';
  button.ariaDisabled = 'false';

  div.append(button);

  return div;
};
