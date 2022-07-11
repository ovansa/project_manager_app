import Container from 'typedi';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/customError';
import UserService from '../services/user.services';
import { IAuthInfoRequest } from '../utils/definitions';

const userService = Container.get(UserService);

const requireAuth = async (
  req: IAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new UnauthorizedError());
  }

  try {
    const secret = (process.env.JWT_SECRET as string) || 'alghashiyah';
    const decoded = jwt.verify(token, secret) as any;

    const user = await userService.findUserById(decoded.id);

    req.user = user;
    next();
  } catch (error) {
    return next(new UnauthorizedError());
  }
};

export default requireAuth;
