import { RequestHandler, Router } from 'express';
import passport from 'passport';

import * as auth from '../controllers/auth-controllers';
import catchAsync from '../utils/catchAsync';
import { storeReturnTo } from '../utils/middleware';

export const router = Router();

router
  .route('/auth/register')
  .get(auth.renderRegister)
  .post(catchAsync(auth.register) as RequestHandler);

router
  .route('/auth/login')
  .get(auth.renderLogin)
  .post(
    // use the storeReturnTo middleware to save the returnTo value from session to res.locals
    storeReturnTo,
    // passport.authenticate logs the user in and clears req.session
    passport.authenticate('local', {
      failureRedirect: '/auth/login',
      keepSessionInfo: true
    }) as RequestHandler,
    auth.login
  );
