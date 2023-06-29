import { RequestHandler, Router } from 'express';
import passport from 'passport';

import * as auth from '../controllers/auth-controllers';
import catchAsync from '../utils/catchAsync';

export const router = Router();

router
  .route('/register')
  .get(auth.renderRegister)
  .post(catchAsync(auth.register) as RequestHandler);

router
  .route('/login')
  .get(auth.renderLogin)
  .post(
    passport.authenticate('local', {
      failureRedirect: '/login',
      keepSessionInfo: true
    }) as RequestHandler,
    auth.login
  );
