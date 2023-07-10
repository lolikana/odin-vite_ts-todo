import { Label } from '../client/scripts/models/label-class';
import { Todo } from '../client/scripts/models/todo-class';

export const tabs = ['inbox', 'today', 'upcoming'];
export const labelsData: Label[] = [];
export const TodosData: Todo[] = [];
export const noTodo: Todo = new Todo(
  new Date(),
  'No todo found',
  {
    label: '',
    dueDate: ''
  },
  false,
  false
);
