import { RequestHandler } from 'express';
import { Types } from 'mongoose';

import { IUser } from '@/libs/types';

import { Todo } from '../../client/scripts/models/todo-class';
import { TodoModel } from '../models/todo';
import ExpressError from '../utils/expressError';

type TodoModelInstance = InstanceType<typeof TodoModel>;

export default {
  getAll: (async (req, res, next): Promise<void> => {
    const authorId = (req.user as IUser)._id;
    const todos = await TodoModel.find({ author: { $in: authorId } });

    if (todos === null) {
      const error = new ExpressError('Fetching todos failed, please try again', 500);
      next(error);
      return;
    }

    res.json(todos.map(todo => todo.toObject({ getters: true })));
  }) as RequestHandler,

  get: (async (req, res, next) => {
    const { todoId } = req.params;
    const authorId = (req.user as IUser)._id;

    const todo = await TodoModel.find({ id: todoId }, { author: authorId });
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

    const newTodo: TodoModelInstance = new TodoModel(todo);
    newTodo.author = (req.user! as IUser)._id as Types.ObjectId;
    await newTodo.save();
    res.status(201).json(todo);
  }) as RequestHandler,

  update: (async (req, res, next): Promise<void> => {
    const { todoId } = req.params;

    if (!todoId) {
      const error = new ExpressError('No params were defined', 404);
      next(error);
    }

    const todo = req.body as Todo;

    const updatedTodo = await TodoModel.findByIdAndUpdate(
      todoId,
      { ...todo },
      { new: true }
    );

    res.status(201).json(updatedTodo);
  }) as RequestHandler<{ todoId: string }>,

  delete: (async (req, res) => {
    const { todoId } = req.params;
    if (!todoId) console.log('No params were defined');

    await TodoModel.findOneAndDelete({ _id: todoId });

    res.status(201).json('Todo successfully deleted');
  }) as RequestHandler
};
