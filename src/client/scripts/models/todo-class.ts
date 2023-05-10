import { Types } from 'mongoose';

import { TodosData } from '../../../libs/data';
import { fetchTodos } from '../../api';
import { createTodoItemElement } from '../components/todo/tableRow';

export class Todo {
  createdAt: Date;
  done: boolean;
  text: string;
  tag: {
    label: string;
    dueDate: string;
  };
  favorite: boolean;
  id: string;
  _id: Types.ObjectId;

  constructor(
    createdAt: Date,
    done: boolean,
    text: string,
    tag: {
      label: string;
      dueDate: string;
    },
    favorite: boolean,
    id: string,
    _id: Types.ObjectId
  ) {
    this.createdAt = createdAt;
    this.done = done;
    this.text = text;
    this.tag = tag;
    this.favorite = favorite;
    this.id = id;
    this._id = _id;
  }

  getAll(tbody: HTMLElement) {
    fetchTodos()
      .then(res => {
        // if (res.length === 0) {
        //   list.textContent = 'No Label';
        //   return;
        // }

        res.map(todo => {
          TodosData.push(todo);
        });
        console.log(TodosData);
        TodosData.map(todo => tbody.append(this.createElement(todo)));
        // Allow to click on edit btn right after create new label
        // list.addEventListener('click', (e: Event) => {
        //   editDeleteLabel(e);
        // });
      })
      .catch(err => {
        console.log(err);
      });
  }

  createElement(todo: Todo) {
    return createTodoItemElement(todo);
  }
}
