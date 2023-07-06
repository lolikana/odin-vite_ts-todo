import { Router } from 'express';

import todos from '../controllers/todos-controllers';
import { isLoggedIn } from '../utils/middleware';

export const router = Router();

router.use(isLoggedIn);

router.route('/api/todos').get(todos.getAll).post(todos.create);

router.route('/api/todos/:todoId').get(todos.get).put(todos.update).delete(todos.delete);
