import { RequestHandler } from 'express';

import { TLabel } from '../../libs/types';
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

    res.json({ fetchedLabels: labels.map(label => label.toObject({ getters: true })) });
  }) as RequestHandler,

  get: (async (req, res, next): Promise<void> => {
    const { name } = req.params;
    const label: TLabel | null = await LabelModel.findOne({
      name: name.toLocaleLowerCase()
    });

    if (!label || label === null) {
      const error = new ExpressError('Label do not exist in the database', 404);
      next(error);
    }

    res.json(label);
  }) as RequestHandler,

  create: (async (req, res, next): Promise<void> => {
    const label = (await req.body) as TLabel;

    if (!label) {
      const error = new ExpressError('Invalid / Empty label, please try again', 422);
      next(error);
    }
    const labelAlreadyExist = await LabelModel.find({
      name: label.name.toLocaleLowerCase()
    });

    if (labelAlreadyExist.length !== 0) {
      const error = new ExpressError('Label already exist in the database', 422);
      next(error);
    }

    const { name } = label;

    const newLabel = new LabelModel({ name: name.toLocaleLowerCase() });

    await newLabel.save();
    res.status(201).json(label);
  }) as RequestHandler,

  update: (async (req, res, next): Promise<void> => {
    const { name } = req.params;

    if (!name) console.log('No params were defined');

    const label = req.body as TLabel;

    if (!label) {
      const error = new ExpressError('Invalid / Empty label, please try again', 422);
      next(error);
    }

    const updatedLabel = await LabelModel.findOneAndUpdate(
      { name: name.toLocaleLowerCase() },
      { ...label, name: label.name.toLocaleLowerCase() },
      { new: true }
    );

    res.status(201).json(updatedLabel);
  }) as RequestHandler<{ name: string }>,

  delete: (async (req, res): Promise<void> => {
    const { name } = req.params;

    if (!name) console.log('No params were defined');

    await LabelModel.findOneAndDelete({
      name: name.toLocaleLowerCase()
    });

    res.status(201).json('Label successfully deleted');
  }) as RequestHandler<{ name: string }>
};