import User from '../models/user.model';
import { omit } from 'lodash';

const sanitizeUser = (user: InstanceType<typeof User>) => {
  return omit(user.toJSON(), 'password', 'inviteToken', 'inviteTokenExpired');
};

export default sanitizeUser;
