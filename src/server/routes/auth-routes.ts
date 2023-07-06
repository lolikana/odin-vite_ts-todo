import { RequestHandler, Router } from 'express';
import passport from 'passport';

import * as auth from '../controllers/auth-controllers';
import catchAsync from '../utils/catchAsync';
import { storeReturnTo } from '../utils/middleware';

export const router = Router();

router.route('/');

router.route('/auth/register').post(catchAsync(auth.register) as RequestHandler);

router.route('/auth/login').post(
  storeReturnTo,
  passport.authenticate('local', {
    failureRedirect: '/auth/login',
    keepSessionInfo: true
  }) as RequestHandler,
  auth.login
);

router.get('/logout', auth.logout);
