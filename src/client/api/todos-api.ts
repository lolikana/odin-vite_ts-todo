import { Todo } from '../scripts/models/todo-class';
import { isProduction, path } from '.';

export const fetchTodos = async (): Promise<Todo[]> => {
  const res = await fetch(`${!isProduction ? path : ''}/api/todos`);
  if (!res.ok) {
    throw new Error('Failed to retrieve todos from server');
  }
  return res.json() as unknown as Todo[];
};

export const createTodo = async (todo: Todo) => {
  try {
    const res = await fetch(`${!isProduction ? path : ''}/api/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo)
    });

    if (!res.ok) throw new Error('Failed to create todo');
  } catch (err: unknown) {
    console.log(err);
  }
};

export const deleteTodo = async (todoId: string) => {
  try {
    const res = await fetch(`${!isProduction ? path : ''}/api/todos/${todoId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete todo');
  } catch (err: unknown) {
    console.log(err);
  }
};
