import { RequestHandler } from 'express';

import { Label } from '../../client/scripts/models/label-class';
import { LabelModel } from '../models';
import ExpressError from '../utils/expressError';

export default {
  getAll: (async (_req, res, next) => {
    const labels = await LabelModel.find({});

    if (labels === null) {
      const error = new ExpressError('Fetching labels failed, please try again.', 500);
      next(error);
      return;
    }

    res.json(labels.map(label => label.toObject({ getters: true })));
  }) as RequestHandler,

  get: (async (req, res, next): Promise<void> => {
    const { labelId } = req.params;
    const label: Label | null = await LabelModel.findOne({
      labelId: labelId
    });

    if (!label || label === null) {
      const error = new ExpressError('Label do not exist in the database', 404);
      next(error);
    }

    res.json(label);
  }) as RequestHandler,

  create: (async (req, res, next): Promise<void> => {
    const label = (await req.body) as Label;

    if (!label) {
      const error = new ExpressError('Invalid / Empty label, please try again', 422);
      next(error);
    }
    const labelAlreadyExist = await LabelModel.find({
      labelId: label.labelId
    });

    if (labelAlreadyExist.length !== 0) {
      const error = new ExpressError('Label already exist in the database', 422);
      next(error);
    }

    const newLabel = new LabelModel(label);

    await newLabel.save();
    res.status(201).json(label);
  }) as RequestHandler,

  update: (async (req, res, next): Promise<void> => {
    const { labelId } = req.params;
    if (!labelId) console.log('No params were defined');

    const label = req.body as Label;

    if (!label) {
      const error = new ExpressError('Invalid / Empty label, please try again', 422);
      next(error);
    }

    const updatedLabel = await LabelModel.findOneAndUpdate(
      { labelId: labelId },
      { ...label, name: label.name, labelId: label.labelId },
      { new: true }
    );

    res.status(201).json(updatedLabel);
  }) as RequestHandler<{ labelId: string }>,

  delete: (async (req, res): Promise<void> => {
    const { labelId } = req.params;

    if (!labelId) console.log('No params were defined');

    await LabelModel.findOneAndDelete({
      labelId: labelId
    });

    res.status(201).json('Label successfully deleted');
  }) as RequestHandler<{ labelId: string }>
};
