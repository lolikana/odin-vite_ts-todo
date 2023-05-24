import Router from 'express';

import labels from '../controllers/labels-controllers';

export const router = Router();

router.route('/').get(labels.getAll).post(labels.create);

router.route('/:labelId').get(labels.get).put(labels.update).delete(labels.delete);
