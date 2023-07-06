import Router from 'express';

import labels from '../controllers/labels-controllers';
import { isLoggedIn } from '../utils/middleware';

export const router = Router();

router.use(isLoggedIn);

router.route('/api/labels').get(labels.getAll).post(labels.create);

router
  .route('/api/labels/:labelId')
  .get(labels.get)
  .put(labels.update)
  .delete(labels.delete);
