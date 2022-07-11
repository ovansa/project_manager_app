import { Types } from 'mongoose';
import { Service } from 'typedi';

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
export default class UserService {
  public async create(userInput: UserInput): Promise<IUser | null> {
    const user = await User.create(userInput);
    return user;
  }

  public async getAllUsers(): Promise<IUser[]> {
    return User.find();
  }

  public async findUserById(
    userId: Types.ObjectId | string
  ): Promise<IUser | null> {
    return User.findOne({ _id: userId });
  }

  public async findUserByEmail(userEmail: string): Promise<IUser | null> {
    const user = await User.findOne({ email: userEmail }).select('password');
    return User.findOne({ email: userEmail }).select('+password');
  }

  public async findUsersByOrganization(
    organizationId: Types.ObjectId | string
  ): Promise<IUser[]> {
    return User.find({ organizationId });
  }
}
