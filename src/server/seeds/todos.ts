export const todosSeed = [
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
    createdAt: new Date('01-05-2023'),
    done: false,
    text: 'Learn Vite and MongoDB',
    tag: {
      label: 'Study',
      dueDate: new Date('05-30-2023')
    },
    favorite: true
  }
];
