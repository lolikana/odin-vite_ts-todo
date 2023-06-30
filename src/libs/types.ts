import { Types } from 'mongoose';

export type TLabel = {
  _id: Types.ObjectId;
  name: string;
};

export type TTodo = {
  _id?: Types.ObjectId;
  createdAt: Date;
  isDone: boolean;
  text: string;
  tag: {
    label: Types.ObjectId;
    dueDate: string;
  };
  isFavorite: boolean;
};

export interface IUser {
  _id?: Types.ObjectId;
  email: string;
  username: string;
}
