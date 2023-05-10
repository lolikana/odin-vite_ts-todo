import { Todo } from '../scripts/models/todo-class';
import { isProduction, path } from '.';

export const fetchTodos = async (): Promise<Todo[]> => {
  const res = await fetch(`${!isProduction ? path : ''}/api/todos`);
  if (!res.ok) {
    throw new Error('Failed to retrieve todos from server');
  }
  return res.json() as unknown as Todo[];
};
