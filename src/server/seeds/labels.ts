import { Types } from 'mongoose';

export const labelsSeed = [
  {
    _id: new Types.ObjectId(),
    name: 'gym',
    labelId: 'gym'
  },
  {
    _id: new Types.ObjectId(),
    name: 'study',
    labelId: 'study'
  },
  {
    _id: new Types.ObjectId(),
    name: 'other',
    labelId: 'other'
  }
];
