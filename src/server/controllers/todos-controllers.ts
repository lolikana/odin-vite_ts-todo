import { RequestHandler } from 'express';

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
  }) as RequestHandler
};
