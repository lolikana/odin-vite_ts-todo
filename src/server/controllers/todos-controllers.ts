import { RequestHandler } from 'express';

import { Todo } from '../../client/scripts/models/todo-class';
import { TodoModel } from '../models/todo';
import ExpressError from '../utils/expressError';

export default {
  getAll: (async (_req, res, next) => {
    const todos = await TodoModel.find();

    if (todos === null) {
      const error = new ExpressError('Fetching todos failed, please try again', 500);
      next(error);
      return;
    }

    res.json(todos.map(todo => todo.toObject({ getters: true })));
  }) as RequestHandler,

  get: (async (req, res, next) => {
    const { todoId } = req.params;
    const todo = await TodoModel.findById(todoId);

    if (todo === null) {
      const error = new ExpressError('Fetching todos failed, please try again', 500);
      next(error);
      return;
    }

    res.json(todo);
  }) as RequestHandler,

  create: (async (req, res, next): Promise<void> => {
    const todo = (await req.body) as Todo;

    if (!todo) {
      const error = new ExpressError('Invalid / Empty Todo, please try again', 422);
      next(error);
    }

    const newTodo = new TodoModel(todo);
    await newTodo.save();
    res.status(201).json(todo);
  }) as RequestHandler,

  delete: (async (req, res) => {
    const { todoId } = req.params;
    if (!todoId) console.log('No params were defined');

    await TodoModel.findOneAndDelete({ _id: todoId });

    res.status(201).json('Todo successfully deleted');
  }) as RequestHandler
};
