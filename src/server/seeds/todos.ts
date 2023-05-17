import { labelsSeed } from './labels';

export const todosSeed = [
  {
    createdAt: new Date('01-04-2023'),
    isDone: true,
    text: 'Do some workout, Do some workout, Do some workout, Do some workout, Do some workout',
    tag: {
      label: labelsSeed[0]._id,
      dueDate: new Date('01-05-2023').toDateString()
    },
    favorite: true
  },
  {
    createdAt: new Date('01-05-2023'),
    isDone: false,
    text: 'Learn Vite and MongoDB',
    tag: {
      label: labelsSeed[1]._id,
      dueDate: new Date('05-30-2023').toDateString()
    },
    favorite: true
  }
];
