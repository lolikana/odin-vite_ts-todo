import mongoose from 'mongoose';

import { mongoDBUri } from '../main';

// Set `strictQuery: false` to globally opt into filtering by properties that aren't in the schema
// Included because it removes preparatory warnings for Mongoose 7.

mongoose.set('strictQuery', false);
// Wait for database to connect, logging an error if there is a problem

export async function mongoConnection() {
  await mongoose
    .connect(mongoDBUri)
    .then(() => {
      console.log('MONGO CONNECTION OPEN!!');
    })
    .catch(err => {
      console.log('OH NO MONGO CONNECTION ERROR!!!!');
      console.log(err);
    });
}
