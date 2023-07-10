import { RequestHandler } from 'express';

export const storeReturnTo: RequestHandler = (req, res, next): void => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

export const isLoggedIn: RequestHandler = (req, res, next): void => {
  if (!req.session.isAuthenticated) return res.redirect('/auth/login');

  next();
};

export const nocache: RequestHandler = (_req, res, next): void => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
};
