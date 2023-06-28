import { NextFunction, Request, Response } from 'express';

const catchAsync = (
  func: (req: Request, res: Response, next: NextFunction) => Promise<any>
): any => {
  return function (req: Request, res: Response, next: NextFunction) {
    func(req, res, next).catch((err: unknown) => next(err));
  };
};

export default catchAsync;
