import { NextFunction, Request, Response } from 'express';
import { Document } from 'mongoose';

// import path from 'path';
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
    req.login(registeredUser, (err: any) => {
      if (err) return next(err);
      res.redirect('/todos');
    });
  } catch (err: any) {
    console.log(err.message);
    res.redirect('/auth/register');
  }
};

export const login = (_req: Request, res: Response): void => {
  const redirectUrl = '/todos'; // update this line to use res.locals.returnTo now
  res.redirect(redirectUrl);
};

export const logout = (req: Request, res: Response): void => {
  req.logout((err: unknown) => err !== undefined && console.log(err));
  res.redirect('/');
};
