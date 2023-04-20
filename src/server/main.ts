import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import ViteExpress from 'vite-express';

import ExpressError from './utils/expressError';
import { mongoConnection } from './utils/mongodb';

dotenv.config();

export const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3001;

export const mongoDBUri: string = isProduction
  ? (process.env.VITE_MONGODB_URI as string)
  : `mongodb://localhost:27017/${process.env.VITE_MONGODB_DB as string}`;

console.log(mongoDBUri);
console.log(isProduction);

const app = express();

mongoConnection().catch(err => console.log(err));

app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../dist')));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_, res) => res.send('Hello from express!'));

app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

  next();
});

app.all('*', (_req, _res, next) => {
  next(new ExpressError('Page Not Found!!', 404));
});

// Start http server
ViteExpress.listen(app, +port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
