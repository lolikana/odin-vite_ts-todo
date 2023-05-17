import mongoose, { Types } from 'mongoose';

import { Todo } from '../../client/scripts/models/todo-class';

const TodoSchema = new mongoose.Schema<Todo>({
  createdAt: Date,
  isDone: Boolean,
  text: { type: String, required: [true, 'Cannot be empty'] },
  tag: {
    label: [
      {
        type: Types.ObjectId,
        ref: 'Label'
      }
    ],
    dueDate: { type: String, required: [true, 'Please add a due date'] }
  },
  favorite: Boolean
});

export const TodoModel = mongoose.model<Todo>('Todo', TodoSchema);
