import { Types } from 'mongoose';

export type TLabel = {
  _id: Types.ObjectId;
  name: string;
};

export type TTodo = {
  _id?: Types.ObjectId;
  createdAt: Date;
  done: boolean;
  text: string;
  tag: {
    label: string;
    dueDate: string;
  };
  favorite: boolean;
};
