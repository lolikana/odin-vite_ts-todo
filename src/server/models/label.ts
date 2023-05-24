import mongoose from 'mongoose';

import { Label } from '../../client/scripts/models/label-class';

const LabelSchema = new mongoose.Schema<Label>({
  name: {
    type: String,
    required: [true, 'Add a Label name']
  },
  labelId: {
    type: String,
    required: [true, 'An id is required']
  }
});

export const LabelModel = mongoose.model<Label>('Label', LabelSchema);
