import { NextFunction, Request, Response } from 'express';
import CustomError from '../utils/customError';

const errorResponse = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  if (err.name === 'CastError') {
    const message = 'Invalid ID';
    error = new CustomError(message, 404);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error!',
  });
};

export default errorResponse;
