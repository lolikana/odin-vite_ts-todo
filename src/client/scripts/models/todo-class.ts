import { Types } from 'mongoose';

import { labelsData, TodosData } from '../../../libs/data';
import { todoSchema } from '../../../libs/validations';
import { createTodo, deleteTodo, fetchTodo, fetchTodos } from '../../api';
import { modal } from '../../main';
import { createTodoCard } from '../components/todo/card';
import { createTodoItemElement } from '../components/todo/tableRow';
import { closeModal, querySelector, querySelectorAll } from '../helpers';

export class Todo {
  createdAt: Date;
  text: string;
  tag: {
    label: string;
    dueDate: string;
  };
  done: boolean;
  favorite: boolean;
  readonly _id: Types.ObjectId;
  readonly id?: string;

  constructor(
    createdAt: Date,
    text: string,
    tag: {
      label: string;
      dueDate: string;
    },
    done: boolean,
    favorite: boolean,
    _id: Types.ObjectId,
    id?: string
  ) {
    this.createdAt = createdAt;
    this.done = done;
    this.text = text;
    this.tag = tag;
    this.favorite = favorite;
    this._id = _id;
    this.id = id;
  }

  async getAll(tbody: HTMLElement) {
    await fetchTodos()
      .then(res => {
        res.map(todo => {
          TodosData.push(todo);
        });
        TodosData.map(todo => tbody.append(this.createElement(todo)));
        // Allow to click on edit btn right after create new label
        tbody.addEventListener('click', (e: Event) => {
          editDeleteTodo(e);
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  async get(tbody: HTMLElement) {
    await fetchTodo(this._id.toString())
      .then((res: Todo) => {
        TodosData.push(res);
        tbody.append(this.createElement(res));
        // Allow to click on edit btn right after create new label
        tbody.addEventListener('click', (e: Event) => {
          editDeleteTodo(e);
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  async create() {
    await createTodo(this).catch(err => console.log(err));
  }

  delete(todoId: string) {
    deleteTodo(todoId).catch(err => console.log(err));
  }

  createElement(todo: Todo) {
    return createTodoItemElement(todo);
  }

  showCard() {
    modal.textContent = '';
    modal.ariaHidden = 'false';
    const labelFilter = labelsData.filter(
      label => label._id.toString() === this.tag.label[0]
    );
    modal.append(
      createTodoCard({
        ...this,
        tag: { label: labelFilter[0].name, dueDate: this.tag.dueDate }
      })
    );
    closeModal();
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
    done: validatationData.data.done === 'on',
    _id: new Types.ObjectId()
  } as Todo;

  todoForm.reset();

  return new Todo(
    data.createdAt,
    data.text,
    data.tag,
    data.done,
    data.favorite,
    data._id
  );
};

const editDeleteTodo = (e: Event) => {
  const target = e.target as HTMLButtonElement;
  const getId = (target.closest('tr') as HTMLElement).getAttribute('id') as string;
  // const deleteBtn = querySelector(
  //   `#delete-todo[data-todo-id='${getId}']`
  // ) as HTMLButtonElement;
  // const showBtn = querySelector(
  //   `#show-todo[data-todo-id='${getId}']`
  // ) as HTMLButtonElement;

  const isDeleteBtn = target.id === 'delete-todo' && target.dataset.todoId === getId;
  const isShowbtn = target.id === 'show-todo' && target.dataset.todoId === getId;

  if (!isDeleteBtn && !isShowbtn) return;

  if (isDeleteBtn) {
    const isTodoExist = TodosData.filter(todo => todo._id.toString() === getId);
    if (isTodoExist) {
      (document.getElementById(getId) as HTMLTableRowElement).remove();
      Todo.prototype.delete(getId);
      TodosData.splice(TodosData.indexOf(isTodoExist[0]), 1);
    }
  }

  if (isShowbtn) {
    const isTodoExist = TodosData.filter(todo => todo._id.toString() === getId);
    if (isTodoExist) {
      const { createdAt, text, tag, favorite, done, _id } = isTodoExist[0];
      const shownTodo = new Todo(createdAt, text, tag, favorite, done, _id);
      shownTodo.showCard();
    }
  }
};
