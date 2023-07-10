import { IUser } from '@/libs/types';

export {};

declare module 'express-session' {
  interface SessionData {
    views: number;
    cookie: Cookie;
    returnTo?: string;
    user: IUser;
    isAuthenticated: boolean;
  }
}
