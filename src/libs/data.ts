import { Label } from '../client/scripts/models/label-class';
import { TTodo } from './types';

export const tabs = ['inbox', 'today', 'upcoming'];
export const labelsData: Label[] = [];
export const TodosData: TTodo[] = [
  {
    createdAt: new Date('01-04-2023'),
    done: true,
    text: 'Do some workout, Do some workout, Do some workout, Do some workout, Do some workout',
    tag: {
      label: 'Gym',
      dueDate: new Date('01-05-2023')
    },
    favorite: true
  },
  {
    createdAt: new Date('01-04-2023'),
    done: true,
    text: 'Do some workout, Do some workout, Do some workout, Do some workout, Do some workout',
    tag: {
      label: 'Gym',
      dueDate: new Date('01-05-2023')
    },
    favorite: true
  }
];
