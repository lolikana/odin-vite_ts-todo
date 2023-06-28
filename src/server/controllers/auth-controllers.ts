import { NextFunction, Request, Response } from 'express';
import { Document } from 'mongoose';
import path from 'path';

import { UserModel } from '../models/user';

export const renderRegister = (_req: Request, res: Response): void => {
  res.sendFile(path.join(__dirname, '../../../pages/register/index.html'));
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
    // req.login(registeredUser, (err: any) => {
    // if (err) return next(err);
    console.log(registeredUser);
    res.redirect('/');
    // });
  } catch (err: any) {
    console.log(err.message);
    res.redirect('/register');
  }
};
