import bodyParser from 'body-parser';
import { default as connectMongoDBSession } from 'connect-mongodb-session';
import { csrfSync } from 'csrf-sync';
import * as dotenv from 'dotenv';
import express from 'express';
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
import { isLoggedIn, nocache } from './utils/middleware';
import { mongoConnection } from './utils/mongodb';

const MongoDBStore = connectMongoDBSession(session);

const { generateToken, csrfSynchronisedProtection } = csrfSync({
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS', 'DELETE'],
  getTokenFromRequest: req => {
    return req.body['CSRFToken'];
  } // Used to retrieve the token submitted by the user in a form,
});

dotenv.config();

export const isProduction = process.env.NODE_ENV === 'production';
export const port = !isProduction
  ? process.env.VITE_PORT || 3101
  : process.env.VITE_PROD_PORT || 3100;
const sessionSecret = process.env.VITE_SESSION_SECRET || 'findABetterSecretPlease';

export const mongoDBUri: string = isProduction
  ? (process.env.VITE_MONGODB_URI as string)
  : `mongodb://localhost:27017/${process.env.VITE_MONGODB_DB as string}`;

const app = express();

mongoConnection().catch(err => console.log(err));
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../dist')));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const store = new MongoDBStore({
  uri: mongoDBUri,
  collection: 'sessions',
  expires: 1000 * 60 * 60 * 24 * 30 // 30 days in milliseconds
});

store.on('error', (err: unknown) => {
  console.log('store error: ', err);
});

const sessionConfig = {
  store,
  name: '_todo',
  secret: `${sessionSecret}`,
  resave: false,
  saveUninitialized: false,
  cookie: {
    HttpOnly: true,
    // secure: isProduction ? true : false,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};

// app.set('trust proxy', 1);
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy.Strategy(UserModel.authenticate()));

passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

app.use((req, res, next) => {
  res.locals.csrfToken = generateToken(req);

  if (!req.session.user) return next();

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

app.use(csrfSynchronisedProtection);

app.use(nocache);
app.use('/api/crsf-token', (_req, res) => {
  res.json({ CSRFToken: res.locals.csrfToken });
});

app.use(authRoutes);
app.use('/api/user', isLoggedIn, (req, res) => {
  res.json({ user: req.session.user });
});

app.use(labelsRoutes);
app.use(todosRoutes);

app.all('*', (_req, _res, next) => {
  next(new ExpressError('Page Not Found!!', 404));
});

ViteExpress.listen(app, +port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
