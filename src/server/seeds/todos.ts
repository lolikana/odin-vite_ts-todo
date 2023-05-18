import { labelsSeed } from './labels';

export const todosSeed = [
  {
    createdAt: new Date(),
    isDone: true,
    text: 'Do some workout, Do some workout, Do some workout, Do some workout, Do some workout',
    tag: {
      label: labelsSeed[0]._id,
      dueDate: new Date('01-05-2023').toDateString()
    },
    isFavorite: true
  },
  {
    createdAt: new Date(),
    isDone: false,
    text: 'Learn Vite and MongoDB',
    tag: {
      label: labelsSeed[1]._id,
      dueDate: new Date('05-30-2023').toDateString()
    },
    isFavorite: true
  }
];
