import { NextFunction, Request, RequestHandler, Response } from 'express';
import { Document } from 'mongoose';

import { singupSchema } from '../../libs/validations';
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

    const isExistUsername = await UserModel.findOne({ username });
    if (isExistUsername) {
      req.flash('error', 'User with this username already exist');
      return res.redirect('/auth/register');
    }
    const isExistEmail = await UserModel.findOne({ email });
    if (isExistEmail) {
      req.flash('error', 'User with this email already exist');
      return res.redirect('/auth/register');
    }

    const resultValidation = singupSchema.safeParse(req.body);
    if (!resultValidation.success) {
      req.flash('error', resultValidation.error.issues[0].message[0]);
      return res.status(422).redirect('/auth/register');
    }

    const user = (await new UserModel({ email, username })) as Document;
    const registeredUser = (await UserModel.register(user, password)) as {
      email: string;
      username: string;
      password: string;
    };

    req.login(registeredUser, async (err: unknown) => {
      if (err) return next(err);
      await user.save();
      req.flash('success', 'Register Successfully, please login');
      res.redirect('/auth/login');
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      req.flash('error', err.message);
    }
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
    req.flash('error', 'Error when trying to login: ', err);
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
