import { Types } from 'mongoose';

import { TodosData } from '../../../libs/data';
import { todoSchema } from '../../../libs/validations';
import { createTodo, fetchTodos } from '../../api';
import { createTodoItemElement } from '../components/todo/tableRow';
import { querySelector, querySelectorAll } from '../helpers';

export class Todo {
  createdAt: Date;
  text: string;
  tag: {
    label: string;
    dueDate: string;
  };
  done: boolean;
  favorite: boolean;
  readonly id?: string;
  readonly _id?: Types.ObjectId;

  constructor(
    createdAt: Date,
    text: string,
    tag: {
      label: string;
      dueDate: string;
    },
    done: boolean,
    favorite: boolean,
    id?: string,
    _id?: Types.ObjectId
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
        tbody.replaceChildren();
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

  async create() {
    await createTodo(this).catch(err => console.log(err));
  }

  createElement(todo: Todo) {
    return createTodoItemElement(todo);
  }
}

export const todoFormSubmit = () => {
  const todoForm = querySelector('.todo-form') as HTMLFormElement;

  const formData = new FormData(todoForm);
  const inputData = Object.fromEntries(formData.entries());
  const validatationData = todoSchema.safeParse({ ...inputData, createdAt: new Date() });

  const pError = querySelectorAll('p.error-message') as NodeListOf<HTMLParagraphElement>;
  pError.forEach(p => (p.textContent = ''));

  if (!validatationData.success) {
    validatationData.error.issues.map(issue => {
      const errorMessage = querySelector(
        `[for="todo-${issue.path[0]}"] ~ p.error-message`
      ) as HTMLParagraphElement;
      errorMessage.textContent = '';
      errorMessage.textContent = issue.message;
    });
    return;
  }

  const data = {
    createdAt: validatationData.data.createdAt,
    text: validatationData.data.text,
    tag: {
      dueDate: validatationData.data.dueDate,
      label: validatationData.data.label
    },
    favorite: validatationData.data.favorite === 'on',
    done: validatationData.data.done === 'on'
  } as Todo;

  todoForm.reset();

  return new Todo(data.createdAt, data.text, data.tag, data.done, data.favorite);
};
