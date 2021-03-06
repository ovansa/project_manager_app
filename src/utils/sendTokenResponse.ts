import { Response } from 'express';
import User from '../models/user.model';
import sanitizeUser from './sanitizeUser';

export const sendTokenResponse = (
  user: InstanceType<typeof User>,
  statusCode: number,
  res: Response,
  message?: string
) => {
  const token = user.getSignedJwtToken();
  const cookie_expire =
    (process.env.JWT_COOKIE_EXPIRE as unknown as number) || 30;
  const sanitizedUser = sanitizeUser(user);

  const options = {
    expires: new Date(Date.now() + cookie_expire * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: false,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  const partialResponse = { success: true, token, user: sanitizedUser };
  const responseBody = Object.assign(
    {},
    partialResponse,
    message && { message }
  );
  return res
    .status(statusCode)
    .cookie('token', token, options)
    .json(responseBody);
};
