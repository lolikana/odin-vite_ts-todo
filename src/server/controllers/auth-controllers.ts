import { NextFunction, Request, RequestHandler, Response } from 'express';
import { Document } from 'mongoose';

import { UserModel } from '../models/user';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, username, password } = req.body as {
      email: string;
      username: string;
      password: string;
    };
    const user = (await new UserModel({ email, username })) as Document;
    const registeredUser = (await UserModel.register(user, password)) as {
      email: string;
      username: string;
      password: string;
    };
    req.login(registeredUser, (err: unknown) => {
      if (err) return next(err);
      res.redirect('/auth/login');
    });
  } catch (err: unknown) {
    console.log('register: ', err);
    res.redirect('/auth/register');
  }
};

export const login: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const { username } = req.body;
    const user = await UserModel.findOne({ username });

    req.session.isAuthenticated = true;
    req.session.user = user;
    req.session.save(err => {
      if (err) {
        console.log('session not save: ', err);
        next(err);
      }
      req.flash('success', 'Login Successfully');
      res.redirect('/todos');
    });
  } catch (err) {
    console.log('Error when trying to login: ', err);
  }
};

export const logout = (req: Request, res: Response, next: NextFunction): void => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy(err => {
      if (err) return console.log('session destroy', err);
      res.redirect('/');
    });
  });
};
