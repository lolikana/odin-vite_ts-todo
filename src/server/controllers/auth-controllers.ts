import { NextFunction, Request, Response } from 'express';
import { Document } from 'mongoose';
import path from 'path';

import { UserModel } from '../models/user';

console.log(path.join(__dirname));

export const renderRegister = (_req: Request, res: Response): void => {
  res.sendFile(path.join(__dirname, '../../../register/index.html'));
};

export const register = async (
  req: Request,
  res: Response,
  _next: NextFunction
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
    console.log(registeredUser);
    // req.login(registeredUser, (err: any) => {
    // if (err) return next(err);
    res.redirect('/');
    // });
  } catch (err: any) {
    console.log(err.message);
    res.redirect('/register');
  }
};

export const renderLogin = (_req: Request, res: Response): void => {
  res.sendFile(path.join(__dirname, '../../../login/index.html'));
};
