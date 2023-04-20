import mongoose from 'mongoose';

import { LabelModel } from '../models';
import { labelsSeed } from './labels';

const mongoDBUri = process.env.VITE_MONGODB_URI as string;

mongoose
  .connect(mongoDBUri)
  .then(res => res)
  .catch(err => console.log(err));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const seedDB = async (): Promise<void> => {
  await LabelModel.deleteMany({});
  for (let i = 0; i < labelsSeed.length; i++) {
    const label = new LabelModel(labelsSeed[i]);
    await label
      .save()
      .then(res => {
        console.log('Successfully saved label');
        console.log(res);
      })
      .catch((err: Error) => {
        console.log(`Oops, couldn't save the label`);
        console.log(err.message);
      });
  }
};

seedDB()
  .then(() => {
    mongoose.connection
      .close()
      .then(res => {
        res;
        console.log('Database closed');
      })
      .catch(err => console.log(err));
  })
  .catch(err => console.log(err));
