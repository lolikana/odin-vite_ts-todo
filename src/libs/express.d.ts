export {};

declare module 'express-session' {
  interface Session {
    views: number;
    cookie: Cookie;
    username: string;
    returnTo?: string;
  }
}
