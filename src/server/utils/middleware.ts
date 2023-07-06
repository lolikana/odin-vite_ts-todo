import { Handler } from 'express';

export const storeReturnTo: Handler = (req, res, next): void => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

export const isLoggedIn: Handler = (req, res, next): void => {
  if (!req.session.user || !req.isAuthenticated()) {
    req.session.isAuthenticated = false;
    req.session.returnTo = req.originalUrl;
    return res.redirect('/auth/login');
  }
  req.session.isAuthenticated = true;
  return next();
};

export const nocache: Handler = (_req, res, next): void => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
};
