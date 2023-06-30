import { NextFunction, Request, Response } from 'express';

export const storeReturnTo = (req: Request, res: Response, next: NextFunction): void => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

export const isLoggedIn = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    return res.redirect('/auth/login');
  }
  next();
};
