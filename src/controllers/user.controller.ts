import { NextFunction, Request, Response } from 'express';

// @desc    Register User
// @route   POST /api/user
// @access  Public
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body);
  } catch (err: any) {
    next(err);
  }
};
