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
  },
  {
    createdAt: new Date(),
    isDone: false,
    text: 'France',
    tag: {
      label: labelsSeed[3]._id,
      dueDate: new Date('09-27-2023').toDateString()
    },
    isFavorite: true
  },
  {
    createdAt: new Date(),
    isDone: false,
    text: 'Another todos',
    tag: {
      label: labelsSeed[4]._id,
      dueDate: new Date('05-30-2023').toDateString()
    },
    isFavorite: false
  },
  {
    createdAt: new Date(),
    isDone: false,
    text: 'New todos',
    tag: {
      label: labelsSeed[1]._id,
      dueDate: new Date('06-30-2023').toDateString()
    },
    isFavorite: true
  },
  {
    createdAt: new Date(),
    isDone: true,
    text: 'last todos?',
    tag: {
      label: labelsSeed[2]._id,
      dueDate: new Date('12-10-2023').toDateString()
    },
    isFavorite: false
  },
  {
    createdAt: new Date(),
    isDone: true,
    text: 'Wakasugi Camp',
    tag: {
      label: labelsSeed[2]._id,
      dueDate: new Date('05-18-2023').toDateString()
    },
    isFavorite: true
  }
];
