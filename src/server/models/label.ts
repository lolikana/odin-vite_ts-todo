import mongoose from 'mongoose';

import { TLabel } from '../../libs/types';

const LabelSchema = new mongoose.Schema<TLabel>({
  name: {
    type: String,
    required: [true, 'Add a Label name']
  }
});

export const LabelModel = mongoose.model<TLabel>('Label', LabelSchema);
