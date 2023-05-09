import { Types } from 'mongoose';

import { TTodo } from '../../../libs/types';
import { createTodoItemElement } from '../components/todo/tableRow';

export class Todo {
  createdAt: Date;
  done: boolean;
  text: string;
  tag: {
    label: string;
    dueDate: Date;
  };
  favorite: boolean;
  _id?: Types.ObjectId;

  constructor(
    createdAt: Date,
    done: boolean,
    text: string,
    tag: {
      label: string;
      dueDate: Date;
    },
    favorite: boolean,
    _id?: Types.ObjectId
  ) {
    this.createdAt = createdAt;
    this.done = done;
    this.text = text;
    this.tag = tag;
    this.favorite = favorite;
    this._id = _id;
  }

  createElement(todo: TTodo) {
    return createTodoItemElement(todo);
  }
}