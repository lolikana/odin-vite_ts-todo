import mongoose, { Types } from 'mongoose';

const TodoSchema = new mongoose.Schema({
  author: {
    type: Types.ObjectId,
    ref: 'User'
  },
  createdAt: Date,
  isDone: Boolean,
  text: { type: String, required: [true, 'Cannot be empty'] },
  tag: {
    label: {
      type: Types.ObjectId,
      ref: 'Label'
    },
    dueDate: { type: String, required: [true, 'Please add a due date'] }
  },
  isFavorite: Boolean
});

export const TodoModel = mongoose.model('Todo', TodoSchema);
