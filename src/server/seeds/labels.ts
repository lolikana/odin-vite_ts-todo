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
  },
  {
    _id: new Types.ObjectId(),
    name: 'travel',
    labelId: 'travel'
  },
  {
    _id: new Types.ObjectId(),
    name: 'grocery',
    labelId: 'grocery'
  },
  {
    _id: new Types.ObjectId(),
    name: 'friend',
    labelId: 'friend'
  },
  {
    _id: new Types.ObjectId(),
    name: 'camp',
    labelId: 'camp'
  }
];
