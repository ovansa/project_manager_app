import { Request } from 'express';

export interface IAuthInfoRequest extends Request {
  user: any;
}
