import { Types } from 'mongoose';
import { Service } from 'typedi';

import sanitizeUser from '../utils/sanitizeUser';

import User, { IUser } from '../models/user.model';
import { UserRoles } from '../utils/constants';

interface UserInput {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRoles;
  password: string;
  organizationId: Types.ObjectId;
}

@Service()
export class UserService {
  public async create(userInput: UserInput): Promise<IUser | null> {
    const user = await User.create(userInput);
    return user;
  }
}
