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

  create: (async (req, res, next): Promise<void> => {
    const todo = (await req.body) as Todo;

    if (!todo) {
      const error = new ExpressError('Invalid / Empty Todo, please try again', 422);
      next(error);
    }

    const newTodo = new TodoModel(todo);
    await newTodo.save();
    res.status(201).json(todo);
  }) as RequestHandler
};
