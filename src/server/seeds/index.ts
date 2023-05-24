import mongoose from 'mongoose';

import { mongoDBUri } from '../main';
import { LabelModel } from '../models';
import { TodoModel } from '../models/todo';
import { labelsSeed } from './labels';
import { todosSeed } from './todos';

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
  await TodoModel.deleteMany({});
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
  for (let i = 0; i < todosSeed.length; i++) {
    const todo = new TodoModel(todosSeed[i]);
    await todo
      .save()
      .then(res => {
        console.log('Successfully saved todos');
        console.log(res);
      })
      .catch((err: Error) => {
        console.log(`Oops, couldn't save the todos`);
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
