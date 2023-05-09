import mongoose from 'mongoose';

import { Todo } from '../../client/scripts/models/todo-class';

const TodoSchema = new mongoose.Schema<Todo>({
  createdAt: Date,
  done: Boolean,
  text: { type: String, required: [true, 'Cannot be empty'] },
  tag: {
    label: String,
    dueDate: { type: Date, required: [true, 'Please add a due date'] }
  },
  favorite: Boolean
});

export const TodoModel = mongoose.model<Todo>('Todo', TodoSchema);
