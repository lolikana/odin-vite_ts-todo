import { Types } from 'mongoose';

import { labelsData, TodosData } from '../../../libs/data';
import { todoSchema } from '../../../libs/validations';
import { createTodo, deleteTodo, fetchTodo, fetchTodos, updateTodo } from '../../api';
import { modal, tbody } from '../../main';
import { createTodoCard } from '../components/todo/card';
import { createTodoForm } from '../components/todo/formTodo';
import { createTodoItemElement } from '../components/todo/tableRow';
import {
  closeModal,
  countTypedCharacters,
  querySelector,
  querySelectorAll
} from '../helpers';

export class Todo {
  createdAt: Date;
  text: string;
  tag: {
    label: string;
    dueDate: string;
  };
  isDone: boolean;
  isFavorite: boolean;
  readonly _id?: Types.ObjectId;
  readonly id?: string;

  constructor(
    createdAt: Date,
    text: string,
    tag: {
      label: string;
      dueDate: string;
    },
    isDone: boolean,
    isFavorite: boolean,
    _id?: Types.ObjectId,
    id?: string
  ) {
    this.createdAt = createdAt;
    this.isDone = isDone;
    this.text = text;
    this.tag = tag;
    this.isFavorite = isFavorite;
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

  async get(tbody: HTMLElement, id?: Types.ObjectId) {
    await fetchTodo(!id ? this._id!.toString() : id.toString())
      .then((res: Todo) => {
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
    TodosData.push(this);
    await createTodo(this).catch(err => console.log(err));
  }

  delete(todoId: string) {
    deleteTodo(todoId).catch(err => console.log(err));
  }

  async update(todo: Todo) {
    await updateTodo(todo, { ...this, _id: todo._id }).catch(err =>
      console.log('update: ', err)
    );
  }

  createElement(todo: Todo) {
    return createTodoItemElement(todo);
  }

  showCard() {
    modal.textContent = '';
    modal.ariaHidden = 'false';
    const labelFilter = labelsData.filter(
      label => label._id!.toString() === this.tag.label
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

export const todoFormSubmit = (method?: 'POST') => {
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

  if (method !== 'POST') {
    const data = {
      createdAt: validatationData.data.createdAt,
      text: validatationData.data.text,
      tag: {
        dueDate: validatationData.data.dueDate,
        label: validatationData.data.label
      },
      isFavorite: validatationData.data.isFavorite === 'on',
      isDone: validatationData.data.isDone === 'on'
    } as Todo;

    todoForm.reset();

    return new Todo(data.createdAt, data.text, data.tag, data.isDone, data.isFavorite);
  }
  const data = {
    createdAt: validatationData.data.createdAt,
    text: validatationData.data.text,
    tag: {
      dueDate: validatationData.data.dueDate,
      label: validatationData.data.label
    },
    isFavorite: validatationData.data.isFavorite === 'on',
    isDone: validatationData.data.isDone === 'on',
    _id: new Types.ObjectId()
  } as Todo;

  todoForm.reset();

  return new Todo(
    data.createdAt,
    data.text,
    data.tag,
    data.isDone,
    data.isFavorite,
    data._id
  );
};

const editDeleteTodo = (e: Event) => {
  const target = e.target as HTMLButtonElement | HTMLInputElement;
  const getId = (target.closest('tr') as HTMLElement).getAttribute('id') as string;

  const isDeleteBtn = target.id === 'delete-todo' && target.dataset.todoId === getId;
  const isShowbtn = target.id === 'show-todo' && target.dataset.todoId === getId;
  const isEditBtn = target.id === 'edit-todo' && target.dataset.todoId === getId;
  const isDoneInput =
    target.id.includes('isDone-todo') && target.dataset.todoId === getId;
  const isFavInput =
    target.id.includes('isFavorite-todo') && target.dataset.todoId === getId;

  if (!isDeleteBtn && !isShowbtn && !isEditBtn && !isDoneInput && !isFavInput) return;

  const getExistingTodo = TodosData.filter(todo => todo._id!.toString() === getId)[0];

  if (getExistingTodo) {
    if (isDeleteBtn) {
      (document.getElementById(getId) as HTMLTableRowElement).remove();
      Todo.prototype.delete(getId);
      TodosData.splice(TodosData.indexOf(getExistingTodo), 1);
    }

    if (isShowbtn) {
      const { createdAt, text, tag, isFavorite, isDone, _id } = getExistingTodo;
      const shownTodo = new Todo(createdAt, text, tag, isFavorite, isDone, _id);
      shownTodo.showCard();
    }

    if (isEditBtn) {
      const { container, form } = createTodoForm('PUT', getExistingTodo._id!.toString());
      modal.ariaHidden = 'false';
      modal.textContent = '';
      modal.append(container);
      countTypedCharacters();
      closeModal();

      form.addEventListener('submit', async (e: SubmitEvent) => {
        e.preventDefault();
        const enteredTodo = todoFormSubmit() as Todo;

        if (!enteredTodo) return;

        await enteredTodo
          .update(getExistingTodo)
          .then(() => {
            const todoIndex = TodosData.findIndex(
              item => item._id === getExistingTodo._id
            );
            TodosData[todoIndex].text = enteredTodo.text;
            TodosData[todoIndex].tag.label = enteredTodo.tag.label;
            TodosData[todoIndex].tag.dueDate = enteredTodo.tag.dueDate;
            TodosData[todoIndex].isDone = enteredTodo.isDone;
            TodosData[todoIndex].isFavorite = enteredTodo.isFavorite;
          })
          .catch(err => console.log(err));
        (document.getElementById(getId) as HTMLTableRowElement).remove();
        await enteredTodo.get(tbody, getExistingTodo._id);

        modal.ariaHidden = 'true';
      });
    }

    if (isDoneInput) {
      const data = {
        createdAt: getExistingTodo.createdAt,
        text: getExistingTodo.text,
        tag: {
          dueDate: getExistingTodo.tag.dueDate,
          label: getExistingTodo.tag.label
        },
        isFavorite: getExistingTodo.isFavorite,
        isDone: (target as HTMLInputElement).checked,
        _id: getExistingTodo._id
      } as Todo;

      updateTodo(getExistingTodo, data)
        .then(() => {
          const todoIndex = TodosData.findIndex(item => item._id === getExistingTodo._id);
          TodosData[todoIndex].isDone = data.isDone;
        })
        .catch(err => console.log(err));
    }

    if (isFavInput) {
      const data = {
        createdAt: getExistingTodo.createdAt,
        text: getExistingTodo.text,
        tag: {
          dueDate: getExistingTodo.tag.dueDate,
          label: getExistingTodo.tag.label
        },
        isFavorite: (target as HTMLInputElement).checked,
        isDone: getExistingTodo.isDone,
        _id: getExistingTodo._id
      } as Todo;

      updateTodo(getExistingTodo, data)
        .then(() => {
          const todoIndex = TodosData.findIndex(item => item._id === getExistingTodo._id);
          TodosData[todoIndex].isFavorite = data.isFavorite;
        })
        .catch(err => console.log(err));
    }
  }
};
