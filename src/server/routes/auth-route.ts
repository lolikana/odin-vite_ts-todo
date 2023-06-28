import { RequestHandler, Router } from 'express';

import * as auth from '../controllers/auth-controllers';
import catchAsync from '../utils/catchAsync';

export const router = Router();

router
  .route('/register')
  .get(auth.renderRegister)
  .post(catchAsync(auth.register) as RequestHandler);
