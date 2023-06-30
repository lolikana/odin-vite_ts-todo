import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import express, { Router } from 'express';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import path from 'path';
import ViteExpress from 'vite-express';

import { UserModel } from './models/user';
import { router as authRoutes } from './routes/auth-routes';
import { router as labelsRoutes } from './routes/labels-routes';
import { router as todosRoutes } from './routes/todos-routes';
import ExpressError from './utils/expressError';
import { isLoggedIn } from './utils/middleware';
import { mongoConnection } from './utils/mongodb';

declare module 'express-session' {
  interface Session {
    views: number;
    cookie: Cookie;
    username: string;
    returnTo?: string;
  }
}

dotenv.config();

export const isProduction = process.env.NODE_ENV === 'production';
export const port = process.env.VITE_PORT || '3009';
const sessionSecret = process.env.VITE_SESSION_SECRET || 'findABetterSecretPlease';

export const mongoDBUri: string = isProduction
  ? (process.env.VITE_MONGODB_URI as string)
  : `mongodb://localhost:27017/${process.env.VITE_MONGODB_DB as string}`;

const app = express();

mongoConnection().catch(err => console.log(err));

app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../dist')));
app.use(express.static(path.join(__dirname, '../../auth')));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const sessionConfig = {
  name: '_todo',
  secret: `${sessionSecret}`,
  resave: false,
  saveUninitialized: true
  // cookie: {
  //   HttpOnly: true,
  //   secure: true,
  //   expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  //   maxAge: 1000 * 60 * 60 * 24 * 7
  // }
};

// app.set('trust proxy', 1); // trust first proxy
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy.Strategy(UserModel.authenticate()));

passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

  next();
});

app.use('/', authRoutes as Router);

app.use(isLoggedIn);

app.use('/current-user', (_req, res) => {
  res.json(res.locals.currentUser);
});
app.use('/api/labels', labelsRoutes as Router);
app.use('/api/todos', todosRoutes as Router);

app.all('*', (_req, _res, next) => {
  next(new ExpressError('Page Not Found!!', 404));
});

ViteExpress.listen(app, +port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
