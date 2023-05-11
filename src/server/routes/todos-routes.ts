import { Router } from 'express';

import todos from '../controllers/todos-controllers';

export const router = Router();

router.route('/').get(todos.getAll).post(todos.create);
