import { RequestHandler, Router } from 'express';
import passport from 'passport';

import * as auth from '../controllers/auth-controllers';
import catchAsync from '../utils/catchAsync';

export const router = Router();

router.route('/');

router.route('/auth/register').post(catchAsync(auth.register) as RequestHandler);

router.route('/auth/login').post(
  passport.authenticate('local', {
    failureRedirect: '/auth/login',
    failureMessage: true,
    failureFlash: true,
    keepSessionInfo: true
  }) as RequestHandler,
  auth.login
);

router.post('/logout', auth.logout);
